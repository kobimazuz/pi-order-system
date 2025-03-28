import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { PIForm } from "@/components/pi-form"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Workbook } from 'exceljs'

export const metadata: Metadata = {
  title: "יצירת הזמנת PI",
  description: "יצירת הזמנת PI חדשה",
}

interface CategoryWithProducts {
  id: string
  name: string
  parent: string | null
  status: string
  products: {
    id: string
    sku: string
    name: string
    image_url: string | null
    units_per_pack: number
    units_per_carton: number
    price_per_unit: number
  }[]
}

type CustomerType = {
  id: string
  name: string
}

type PIWithRelations = {
  id: string
  language: string
  customer: {
    name: string
  }
  items: {
    quantity: number
    price_per_unit: number
    product: {
      sku: string
      name: string
      units_per_pack: number
      image_url: string | null
    }
  }[]
}

async function getData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const [categories, customers] = await Promise.all([
    prisma.category.findMany({
      where: {
        status: "active",
        userId: session.user.id
      },
      select: {
        id: true,
        name: true,
        parent: true,
        status: true,
        products: {
          where: {
            status: "active"
          },
          select: {
            id: true,
            sku: true,
            name: true,
            image_url: true,
            units_per_pack: true,
            units_per_carton: true,
            price_per_unit: true
          }
        }
      }
    }),
    prisma.customer.findMany({
      where: {
        status: "active",
        userId: session.user.id
      },
      select: {
        id: true,
        name: true
      }
    })
  ])

  return {
    categories: categories.map((category: CategoryWithProducts) => ({
      id: category.id,
      name: category.name,
      parent: category.parent,
      status: category.status,
      products: category.products
    })),
    customers: customers.map((customer: CustomerType) => ({
      id: customer.id,
      name: customer.name
    }))
  }
}

async function createPI(formData: FormData) {
  "use server"
  
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    const orderItems = JSON.parse(formData.get("orderItems") as string)
    const customerId = formData.get("customerId") as string
    const notes = formData.get("notes") as string
    const language = formData.get("language") as string

    const pi = await prisma.pI.create({
      data: {
        userId: session.user.id,
        customerId,
        notes,
        status: "draft",
        language,
        items: {
          create: orderItems.map((item: { id: string; quantity: number; price_per_unit: number }) => ({
            product: {
              connect: { id: item.id }
            },
            quantity: item.quantity,
            price_per_unit: item.price_per_unit
          }))
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true
      }
    })

    revalidatePath("/dashboard/orders")
    return { data: pi }
  } catch (error) {
    console.error("[CREATE_PI]", error)
    return { error: "Failed to create PI" }
  }
}

async function generateExcel(formData: FormData) {
  "use server"
  
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  try {
    const piId = formData.get("piId") as string
    const pi = await prisma.pI.findUnique({
      where: { 
        id: piId,
        userId: session.user.id 
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true
      }
    }) as PIWithRelations | null

    if (!pi) {
      return { error: "PI not found" }
    }

    const workbook = new Workbook()
    const worksheet = workbook.addWorksheet("PI")

    // עיצוב הגיליון
    worksheet.properties.defaultRowHeight = 25
    worksheet.properties.defaultColWidth = 15

    // כותרת
    worksheet.mergeCells("A1:G1")
    const titleCell = worksheet.getCell("A1")
    titleCell.value = `PI-${new Date().getFullYear()}-${pi.id.slice(0, 4)}`
    titleCell.font = { size: 16, bold: true }
    titleCell.alignment = { horizontal: "center" }

    // פרטי לקוח
    worksheet.mergeCells("A3:B3")
    worksheet.getCell("A3").value = pi.language === "he" ? "לקוח:" : "Customer:"
    worksheet.mergeCells("C3:D3")
    worksheet.getCell("C3").value = pi.customer.name

    // כותרות טבלה
    const tableHeaders = pi.language === "he" ? 
      ["תמונה", "מק״ט", "שם מוצר", "יח׳ באריזה", "כמות אריזות", "סה״כ יחידות", "מחיר ליחידה", "סה״כ"] :
      ["Image", "SKU", "Product Name", "Units/Pack", "Packages", "Total Units", "Price/Unit", "Total"]
    
    worksheet.getRow(5).values = tableHeaders
    worksheet.getRow(5).font = { bold: true }

    // התאמת רוחב עמודת התמונה
    worksheet.getColumn('A').width = 20
    worksheet.getRow(5).height = 50

    // נתוני מוצרים
    let row = 6
    let totalAmount = 0

    for (const item of pi.items) {
      const totalUnits = item.quantity * item.product.units_per_pack
      const total = totalUnits * item.price_per_unit
      totalAmount += total

      // הוספת התמונה אם קיימת
      if (item.product.image_url) {
        try {
          const response = await fetch(item.product.image_url)
          const imageBuffer = await response.arrayBuffer()
          
          const imageId = workbook.addImage({
            base64: Buffer.from(imageBuffer).toString('base64'),
            extension: 'png'
          })

          worksheet.addImage(imageId, {
            tl: { col: 0, row: row - 1 },
            ext: { width: 100, height: 80 }
          })
        } catch (error) {
          console.error(`Failed to add image for product ${item.product.sku}:`, error)
        }
      }

      worksheet.getRow(row).values = [
        null, // תא ריק עבור התמונה
        item.product.sku,
        item.product.name,
        item.product.units_per_pack,
        item.quantity,
        totalUnits,
        item.price_per_unit,
        total
      ]
      worksheet.getRow(row).height = 80 // גובה שורה מותאם לתמונה
      row++
    }

    // סיכום
    row += 1
    worksheet.mergeCells(`B${row}:G${row}`)
    worksheet.getCell(`B${row}`).value = pi.language === "he" ? "סה״כ לתשלום:" : "Total Amount:"
    worksheet.getCell(`H${row}`).value = totalAmount
    worksheet.getCell(`H${row}`).font = { bold: true }

    // שמירת הקובץ
    const buffer = await workbook.xlsx.writeBuffer()
    
    const responseHeaders = new Headers()
    responseHeaders.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    responseHeaders.set("Content-Disposition", `attachment; filename=PI-${new Date().getFullYear()}-${pi.id.slice(0, 4)}.xlsx`)

    return new Response(buffer, {
      headers: responseHeaders
    })
  } catch (error) {
    console.error("[GENERATE_EXCEL]", error)
    return { error: "Failed to generate Excel file" }
  }
}

export default async function CreatePIPage() {
  const data = await getData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">יצירת הזמנת PI</h1>
      </div>
      <PIForm 
        categories={data.categories} 
        customers={data.customers}
        createPI={createPI}
        generateExcel={generateExcel}
      />
    </div>
  )
}

