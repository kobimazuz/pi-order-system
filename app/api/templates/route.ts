import { NextResponse } from "next/server"
import * as ExcelJS from "exceljs"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

const templateDefinitions = {
  categories: {
    headers: ["קוד", "שם", "תיאור", "קטגוריית אב", "סטטוס"],
    example: ["CAT001", "חולצות", "כל סוגי החולצות", "", "פעיל"],
  },
  colors: {
    headers: ["קוד", "שם", "קוד צבע", "סטטוס"],
    example: ["COL001", "שחור", "#000000", "פעיל"],
  },
  sizes: {
    headers: ["קוד", "שם", "תיאור", "קטגוריה", "סטטוס"],
    example: ["SIZ001", "S", "קטן", "חולצות", "פעיל"],
  },
  suppliers: {
    headers: ["קוד", "שם", "איש קשר", "אימייל", "טלפון", "כתובת", "סטטוס"],
    example: ["SUP001", "ספק א", "ישראל ישראלי", "supplier@example.com", "050-1234567", "רחוב הספקים 1, תל אביב", "פעיל"],
  },
  products: {
    headers: [
      "מק\"ט",
      "שם",
      "תיאור",
      "קטגוריה",
      "ספק",
      "צבעים",
      "מידות",
      "כמות באריזה",
      "הוראות אריזה",
      "כמות בקרטון",
      "מחיר ליחידה",
      "סטטוס",
    ],
    example: [
      "HY1001",
      "חולצת טי בייסיק",
      "חולצת טי כותנה בסיסית",
      "חולצות",
      "ספק א",
      "שחור,לבן",
      "S,M,L",
      "5",
      "לארוז בשקית ניילון",
      "100",
      "15.99",
      "פעיל",
    ],
  },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const includeData = searchParams.get("includeData") === "true"
    
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!type || !templateDefinitions[type as keyof typeof templateDefinitions]) {
      return NextResponse.json({ error: "Invalid template type" }, { status: 400 })
    }

    const template = templateDefinitions[type as keyof typeof templateDefinitions]
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Template")

    // הגדרת הכותרות
    const headers = [...template.headers, "פעולה נדרשת"]
    worksheet.addRow(headers)

    // עיצוב הכותרות
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }

    // אם נדרש לכלול נתונים קיימים
    if (includeData) {
      const data = await getExistingData(type, userId)
      for (const item of data) {
        const rowData = template.headers.map(header => {
          const key = mapHeaderToKey(header, type)
          return (item as any)[key] || ""
        })
        worksheet.addRow([...rowData, "ללא שינוי"]) // ברירת מחדל
      }
    } else {
      // הוספת שורת דוגמה
      worksheet.addRow([...template.example, "הוספה"])
      
      // הוספת הערה לשורת הדוגמה
      worksheet.getRow(2).font = { italic: true }
      worksheet.getRow(2).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFF0E0" },
      }
    }

    // התאמת רוחב העמודות
    worksheet.columns.forEach((column) => {
      column.width = 20
    })

    // הגדרת ערכים אפשריים לעמודת הפעולה הנדרשת
    const actionColumn = worksheet.getColumn(worksheet.columnCount)
    actionColumn.values = ["פעולה נדרשת", "הוספה", "עדכון", "מחיקה", "ללא שינוי"]

    // יצירת הקובץ
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${type}_${includeData ? 'data' : 'template'}.xlsx`,
      },
    })
  } catch (error) {
    console.error("Error generating template:", error)
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
  }
}

// פונקצית עזר למיפוי כותרות לשדות במסד הנתונים
function mapHeaderToKey(header: string, type: string) {
  const mappings: Record<string, Record<string, string>> = {
    categories: {
      "קוד": "code",
      "שם": "name",
      "תיאור": "description",
      "קטגוריית אב": "parent_name",
      "סטטוס": "status"
    },
    colors: {
      "קוד": "code",
      "שם": "name",
      "קוד צבע": "hex_code",
      "סטטוס": "status"
    },
    sizes: {
      "קוד": "code",
      "שם": "name",
      "תיאור": "description",
      "קטגוריה": "category",
      "סטטוס": "status"
    },
    suppliers: {
      "קוד": "code",
      "שם": "name",
      "איש קשר": "contact_name",
      "אימייל": "email",
      "טלפון": "phone",
      "כתובת": "address",
      "סטטוס": "status"
    },
    products: {
      "מק\"ט": "sku",
      "שם": "name",
      "תיאור": "description",
      "קטגוריה": "category_name",
      "ספק": "supplier_name",
      "צבעים": "colors",
      "מידות": "sizes",
      "כמות באריזה": "units_per_pack",
      "הוראות אריזה": "packing_info",
      "כמות בקרטון": "units_per_carton",
      "מחיר ליחידה": "price_per_unit",
      "סטטוס": "status"
    }
  }
  
  return mappings[type]?.[header] || header
}

// פונקציה לשליפת נתונים קיימים
async function getExistingData(type: string, userId: string) {
  switch (type) {
    case "products":
      const products = await prisma.product.findMany({
        where: { userId },
        include: {
          category: true,
          supplier: true,
          colors: true,
          sizes: true,
          materials: true
        }
      })
      
      return products.map(product => ({
        ...product,
        category_name: product.category?.name || "",
        supplier_name: product.supplier?.name || "",
        colors: product.colors.map(c => c.name).join(','),
        sizes: product.sizes.map(s => s.name).join(','),
        materials: product.materials.map(m => m.name).join(',')
      }))
      
    case "categories": 
      const categories = await prisma.category.findMany({
        where: { userId },
        include: {
          parent_category: true
        }
      })
      
      return categories.map(category => ({
        ...category,
        parent_name: category.parent_category?.name || ""
      }))
      
    case "colors":
      return await prisma.color.findMany({
        where: { userId }
      })
      
    case "sizes":
      return await prisma.size.findMany({
        where: { userId }
      })
      
    case "suppliers":
      return await prisma.supplier.findMany({
        where: { userId }
      })
      
    default:
      return []
  }
} 