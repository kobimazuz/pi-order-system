import { Separator } from "@/components/ui/separator"
import { prisma } from "@/lib/prisma"
import { BulkImportClient } from "./bulk-import-client"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import * as XLSX from "xlsx"
import JSZip from "jszip"
import { ProductImageService } from "@/lib/services/product-image.service"
import { revalidatePath } from "next/cache"

// מטמון את הדאטה ל-30 שניות
export const dynamic = 'force-dynamic'
export const revalidate = 30

type ImportLog = {
  id: string
  type: string
  filename: string
  total_rows: number
  success: number
  errors: number
  status: string
  created_at: Date
  updated_at: Date
}

type CategoryWithParentName = {
  id: string
  userId: string
  code: string
  name: string
  description: string | null
  parent: string | null
  status: string
  created_at: Date
  updated_at: Date
  parent_name: string | null
}

type SizeWithCategoryName = {
  id: string
  userId: string
  code: string
  name: string
  description: string | null
  category: string | null
  status: string
  created_at: Date
  updated_at: Date
  category_name: string | null
}

async function uploadProducts(formData: FormData) {
  "use server"
  
  const session = await auth()
  if (!session?.user) {
    throw new Error("Unauthorized")
  }

  const userId = session.user.id
  const file = formData.get("file") as File
  const type = formData.get("type") as string
  const imagesFile = formData.get("images") as File | null

  if (!file || !type) {
    throw new Error("Missing file or type")
  }

  // קריאת קובץ האקסל
  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const data = XLSX.utils.sheet_to_json(worksheet)

  // אם זה ייבוא מוצרים וקיים קובץ תמונות, מעבד אותו
  let images: { [key: string]: File } = {}
  if (type === "products" && imagesFile) {
    const zip = new JSZip()
    const zipContents = await zip.loadAsync(await imagesFile.arrayBuffer())
    
    // חילוץ התמונות מה-ZIP
    for (const [filename, file] of Object.entries(zipContents.files)) {
      if (!file.dir) {
        const sku = filename.split('.')[0] // מניחים ששם הקובץ הוא המק"ט
        const content = await file.async("blob")
        images[sku] = new File([content], filename, { type: content.type })
      }
    }
  }

  // יצירת רשומת לוג
  const importLog = await prisma.importLog.create({
    data: {
      userId,
      type,
      filename: file.name,
      total_rows: data.length,
      success: 0,
      errors: 0,
      status: "processing",
      created_at: new Date(),
      updated_at: new Date()
    }
  })

  let successCount = 0
  let errorCount = 0
  let updatedCount = 0
  let deletedCount = 0

  // עיבוד הנתונים לפי סוג הייבוא
  for (const item of data as any[]) {
    try {
      const action = item["פעולה נדרשת"] || "הוספה" // ברירת מחדל היא הוספה
      
      switch (type) {
        case "products":
          switch (action) {
            case "הוספה":
              await handleProductAdd(item, userId, images)
              successCount++
              break
            case "עדכון":
              await handleProductUpdate(item, userId, images)
              updatedCount++
              break
            case "מחיקה":
              await handleProductDelete(item, userId)
              deletedCount++
              break
            case "ללא שינוי":
              // לא עושים כלום
              break
            default:
              // אם לא מזוהה, מוסיפים כברירת מחדל
              await handleProductAdd(item, userId, images)
              successCount++
          }
          break
          
        case "categories":
          switch (action) {
            case "הוספה":
              await handleCategoryAdd(item, userId)
              successCount++
              break
            case "עדכון":
              await handleCategoryUpdate(item, userId)
              updatedCount++
              break
            case "מחיקה":
              await handleCategoryDelete(item, userId)
              deletedCount++
              break
            case "ללא שינוי":
              // לא עושים כלום
              break
            default:
              // אם לא מזוהה, מוסיפים כברירת מחדל
              await handleCategoryAdd(item, userId)
              successCount++
          }
          break
          
        case "colors":
          switch (action) {
            case "הוספה":
              await handleColorAdd(item, userId)
              successCount++
              break
            case "עדכון":
              await handleColorUpdate(item, userId)
              updatedCount++
              break
            case "מחיקה":
              await handleColorDelete(item, userId)
              deletedCount++
              break
            case "ללא שינוי":
              // לא עושים כלום
              break
            default:
              await handleColorAdd(item, userId)
              successCount++
          }
          break
          
        case "sizes":
          switch (action) {
            case "הוספה":
              await handleSizeAdd(item, userId)
              successCount++
              break
            case "עדכון":
              await handleSizeUpdate(item, userId)
              updatedCount++
              break
            case "מחיקה":
              await handleSizeDelete(item, userId)
              deletedCount++
              break
            case "ללא שינוי":
              // לא עושים כלום
              break
            default:
              await handleSizeAdd(item, userId)
              successCount++
          }
          break
          
        case "suppliers":
          switch (action) {
            case "הוספה":
              await handleSupplierAdd(item, userId)
              successCount++
              break
            case "עדכון":
              await handleSupplierUpdate(item, userId)
              updatedCount++
              break
            case "מחיקה":
              await handleSupplierDelete(item, userId)
              deletedCount++
              break
            case "ללא שינוי":
              // לא עושים כלום
              break
            default:
              await handleSupplierAdd(item, userId)
              successCount++
          }
          break
          
        case "materials":
          switch (action) {
            case "הוספה":
              await handleMaterialAdd(item, userId)
              successCount++
              break
            case "עדכון":
              await handleMaterialUpdate(item, userId)
              updatedCount++
              break
            case "מחיקה":
              await handleMaterialDelete(item, userId)
              deletedCount++
              break
            case "ללא שינוי":
              // לא עושים כלום
              break
            default:
              await handleMaterialAdd(item, userId)
              successCount++
          }
          break
      }
    } catch (error) {
      console.error(`Error processing ${type} item:`, error)
      errorCount++
    }
  }

  // עדכון רשומת הלוג
  await prisma.importLog.update({
    where: { id: importLog.id },
    data: {
      success: successCount + updatedCount,
      errors: errorCount,
      status: errorCount === 0 ? "completed" : "completed_with_errors",
      updated_at: new Date(),
      metadata: JSON.stringify({
        added: successCount,
        updated: updatedCount,
        deleted: deletedCount
      })
    }
  })

  revalidatePath("/dashboard/bulk-import")

  return { 
    success: true,
    importLog: {
      ...importLog,
      success: successCount + updatedCount,
      errors: errorCount,
      status: errorCount === 0 ? "completed" : "completed_with_errors",
      metadata: JSON.stringify({
        added: successCount,
        updated: updatedCount,
        deleted: deletedCount
      })
    }
  }
}

// פונקציות עזר לטיפול במוצרים
async function handleProductAdd(item: any, userId: string, images: { [key: string]: File }) {
  // בדיקה אם המוצר כבר קיים
  const existingProduct = await prisma.product.findFirst({
    where: { 
      userId,
      sku: item["מק\"ט"] || item.sku
    }
  })

  if (existingProduct) {
    throw new Error(`מוצר עם מק"ט ${item["מק\"ט"] || item.sku} כבר קיים`)
  }

  // יצירת מוצר חדש
  const product = await prisma.product.create({
    data: {
      userId,
      sku: item["מק\"ט"] || item.sku,
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      units_per_pack: parseInt(item["כמות באריזה"] || item.units_per_pack),
      units_per_carton: parseInt(item["כמות בקרטון"] || item.units_per_carton),
      price_per_unit: parseFloat(item["מחיר ליחידה"] || item.price_per_unit),
      status: "active",
      categoryId: item.category_id || item.categoryId,
      supplierId: item.supplier_id || item.supplierId
    }
  })

  // אם יש תמונה למוצר, מעלה אותה
  const sku = item["מק\"ט"] || item.sku
  if (images[sku]) {
    try {
      const imageUrl = await ProductImageService.uploadImage(
        userId,
        sku,
        images[sku]
      )
      
      await prisma.product.update({
        where: { id: product.id },
        data: { image_url: imageUrl }
      })
    } catch (error) {
      console.error(`Failed to upload image for product ${sku}:`, error)
    }
  }
  
  return product
}

async function handleProductUpdate(item: any, userId: string, images: { [key: string]: File }) {
  // מציאת המוצר הקיים
  const existingProduct = await prisma.product.findFirst({
    where: { 
      userId,
      sku: item["מק\"ט"] || item.sku 
    }
  })

  if (!existingProduct) {
    throw new Error(`מוצר עם מק"ט ${item["מק\"ט"] || item.sku} לא נמצא`)
  }

  // עדכון המוצר הקיים
  const updatedProduct = await prisma.product.update({
    where: { id: existingProduct.id },
    data: {
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      units_per_pack: parseInt(item["כמות באריזה"] || item.units_per_pack),
      units_per_carton: parseInt(item["כמות בקרטון"] || item.units_per_carton),
      price_per_unit: parseFloat(item["מחיר ליחידה"] || item.price_per_unit),
      status: item["סטטוס"] || item.status || "active",
    }
  })

  // אם יש תמונה למוצר, מעלה אותה
  const sku = item["מק\"ט"] || item.sku
  if (images[sku]) {
    try {
      const imageUrl = await ProductImageService.uploadImage(
        userId,
        sku,
        images[sku]
      )
      
      await prisma.product.update({
        where: { id: updatedProduct.id },
        data: { image_url: imageUrl }
      })
    } catch (error) {
      console.error(`Failed to upload image for product ${sku}:`, error)
    }
  }
  
  return updatedProduct
}

async function handleProductDelete(item: any, userId: string) {
  // מציאת המוצר הקיים
  const existingProduct = await prisma.product.findFirst({
    where: { 
      userId, 
      sku: item["מק\"ט"] || item.sku 
    }
  })

  if (!existingProduct) {
    throw new Error(`מוצר עם מק"ט ${item["מק\"ט"] || item.sku} לא נמצא`)
  }

  // מחיקת המוצר
  return await prisma.product.delete({
    where: { id: existingProduct.id }
  })
}

// פונקציות עזר לטיפול בקטגוריות
async function handleCategoryAdd(item: any, userId: string) {
  // בדיקה אם הקטגוריה כבר קיימת
  const existingCategory = await prisma.category.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (existingCategory) {
    throw new Error(`קטגוריה עם קוד ${item["קוד"] || item.code} כבר קיימת`)
  }

  // בדיקת קטגוריית אב אם קיימת
  let parentId = null
  if (item["קטגוריית אב"] || item.parent) {
    const parentCode = item["קטגוריית אב"] || item.parent
    const parentCategory = await prisma.category.findFirst({
      where: { 
        userId,
        code: parentCode
      }
    })
    if (!parentCategory) {
      throw new Error(`קטגוריית האב ${parentCode} לא נמצאה`)
    }
    parentId = parentCategory.id
  }

  // יצירת קטגוריה חדשה
  return await prisma.category.create({
    data: {
      userId,
      code: item["קוד"] || item.code,
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      parent: parentId,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleCategoryUpdate(item: any, userId: string) {
  // מציאת הקטגוריה הקיימת
  const existingCategory = await prisma.category.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingCategory) {
    throw new Error(`קטגוריה עם קוד ${item["קוד"] || item.code} לא נמצאה`)
  }

  // בדיקת קטגוריית אב אם קיימת
  let parentId = null
  if (item["קטגוריית אב"] || item.parent) {
    const parentCode = item["קטגוריית אב"] || item.parent
    const parentCategory = await prisma.category.findFirst({
      where: { 
        userId,
        code: parentCode
      }
    })
    if (!parentCategory) {
      throw new Error(`קטגוריית האב ${parentCode} לא נמצאה`)
    }
    // בדיקה שלא מנסים להגדיר קטגוריה כתת-קטגוריה של עצמה
    if (parentCategory.id === existingCategory.id) {
      throw new Error(`לא ניתן להגדיר קטגוריה כתת-קטגוריה של עצמה`)
    }
    // בדיקה שלא מנסים להגדיר קטגוריה כתת-קטגוריה של אחת מתת-הקטגוריות שלה
    const childCategories = await prisma.category.findMany({
      where: { 
        userId,
        parent: existingCategory.id
      }
    })
    if (childCategories.some((child: any) => child.id === parentCategory.id)) {
      throw new Error(`לא ניתן להגדיר קטגוריה כתת-קטגוריה של אחת מתת-הקטגוריות שלה`)
    }
    parentId = parentCategory.id
  }

  // עדכון הקטגוריה
  return await prisma.category.update({
    where: { id: existingCategory.id },
    data: {
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      parent: parentId,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleCategoryDelete(item: any, userId: string) {
  // מציאת הקטגוריה הקיימת
  const existingCategory = await prisma.category.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    },
    include: {
      products: true,
      children: true
    }
  })

  if (!existingCategory) {
    throw new Error(`קטגוריה עם קוד ${item["קוד"] || item.code} לא נמצאה`)
  }

  // בדיקה שאין מוצרים בקטגוריה
  if (existingCategory.products.length > 0) {
    throw new Error(`לא ניתן למחוק קטגוריה שיש לה מוצרים`)
  }

  // בדיקה שאין תת-קטגוריות
  if (existingCategory.children.length > 0) {
    throw new Error(`לא ניתן למחוק קטגוריה שיש לה תת-קטגוריות`)
  }

  // מחיקת הקטגוריה
  return await prisma.category.delete({
    where: { id: existingCategory.id }
  })
}

// פונקציות עזר לטיפול בצבעים
async function handleColorAdd(item: any, userId: string) {
  // בדיקה אם הצבע כבר קיים
  const existingColor = await prisma.color.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (existingColor) {
    throw new Error(`צבע עם קוד ${item["קוד"] || item.code} כבר קיים`)
  }

  // יצירת צבע חדש
  return await prisma.color.create({
    data: {
      userId,
      code: item["קוד"] || item.code,
      name: item["שם"] || item.name,
      hex_code: item["קוד צבע"] || item.hex_code,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleColorUpdate(item: any, userId: string) {
  // מציאת הצבע הקיים
  const existingColor = await prisma.color.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingColor) {
    throw new Error(`צבע עם קוד ${item["קוד"] || item.code} לא נמצא`)
  }

  // עדכון הצבע
  return await prisma.color.update({
    where: { id: existingColor.id },
    data: {
      name: item["שם"] || item.name,
      hex_code: item["קוד צבע"] || item.hex_code,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleColorDelete(item: any, userId: string) {
  // מציאת הצבע הקיים
  const existingColor = await prisma.color.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingColor) {
    throw new Error(`צבע עם קוד ${item["קוד"] || item.code} לא נמצא`)
  }

  // מחיקת הצבע
  return await prisma.color.delete({
    where: { id: existingColor.id }
  })
}

// פונקציות עזר לטיפול במידות
async function handleSizeAdd(item: any, userId: string) {
  // בדיקה אם המידה כבר קיימת
  const existingSize = await prisma.size.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (existingSize) {
    throw new Error(`מידה עם קוד ${item["קוד"] || item.code} כבר קיימת`)
  }

  // יצירת מידה חדשה
  return await prisma.size.create({
    data: {
      userId,
      code: item["קוד"] || item.code,
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      category: item["קטגוריה"] || item.category || null,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleSizeUpdate(item: any, userId: string) {
  // מציאת המידה הקיימת
  const existingSize = await prisma.size.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingSize) {
    throw new Error(`מידה עם קוד ${item["קוד"] || item.code} לא נמצאה`)
  }

  // עדכון המידה
  return await prisma.size.update({
    where: { id: existingSize.id },
    data: {
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      category: item["קטגוריה"] || item.category || null,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleSizeDelete(item: any, userId: string) {
  // מציאת המידה הקיימת
  const existingSize = await prisma.size.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingSize) {
    throw new Error(`מידה עם קוד ${item["קוד"] || item.code} לא נמצאה`)
  }

  // מחיקת המידה
  return await prisma.size.delete({
    where: { id: existingSize.id }
  })
}

// פונקציות עזר לטיפול בספקים
async function handleSupplierAdd(item: any, userId: string) {
  // בדיקה אם הספק כבר קיים
  const existingSupplier = await prisma.supplier.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (existingSupplier) {
    throw new Error(`ספק עם קוד ${item["קוד"] || item.code} כבר קיים`)
  }

  // יצירת ספק חדש
  return await prisma.supplier.create({
    data: {
      userId,
      code: item["קוד"] || item.code,
      name: item["שם"] || item.name,
      contact_name: item["איש קשר"] || item.contact_name || null,
      email: item["אימייל"] || item.email || null,
      phone: item["טלפון"] || item.phone || null,
      address: item["כתובת"] || item.address || null,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleSupplierUpdate(item: any, userId: string) {
  // מציאת הספק הקיים
  const existingSupplier = await prisma.supplier.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingSupplier) {
    throw new Error(`ספק עם קוד ${item["קוד"] || item.code} לא נמצא`)
  }

  // עדכון הספק
  return await prisma.supplier.update({
    where: { id: existingSupplier.id },
    data: {
      name: item["שם"] || item.name,
      contact_name: item["איש קשר"] || item.contact_name || null,
      email: item["אימייל"] || item.email || null,
      phone: item["טלפון"] || item.phone || null,
      address: item["כתובת"] || item.address || null,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleSupplierDelete(item: any, userId: string) {
  // מציאת הספק הקיים
  const existingSupplier = await prisma.supplier.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingSupplier) {
    throw new Error(`ספק עם קוד ${item["קוד"] || item.code} לא נמצא`)
  }

  // מחיקת הספק
  return await prisma.supplier.delete({
    where: { id: existingSupplier.id }
  })
}

// פונקציות עזר לטיפול בחומרים
async function handleMaterialAdd(item: any, userId: string) {
  // בדיקה אם החומר כבר קיים
  const existingMaterial = await prisma.material.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (existingMaterial) {
    throw new Error(`חומר עם קוד ${item["קוד"] || item.code} כבר קיים`)
  }

  // יצירת חומר חדש
  return await prisma.material.create({
    data: {
      userId,
      code: item["קוד"] || item.code,
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleMaterialUpdate(item: any, userId: string) {
  // מציאת החומר הקיים
  const existingMaterial = await prisma.material.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingMaterial) {
    throw new Error(`חומר עם קוד ${item["קוד"] || item.code} לא נמצא`)
  }

  // עדכון החומר
  return await prisma.material.update({
    where: { id: existingMaterial.id },
    data: {
      name: item["שם"] || item.name,
      description: item["תיאור"] || item.description || null,
      status: item["סטטוס"] || item.status || "active"
    }
  })
}

async function handleMaterialDelete(item: any, userId: string) {
  // מציאת החומר הקיים
  const existingMaterial = await prisma.material.findFirst({
    where: { 
      userId,
      code: item["קוד"] || item.code
    }
  })

  if (!existingMaterial) {
    throw new Error(`חומר עם קוד ${item["קוד"] || item.code} לא נמצא`)
  }

  // מחיקת החומר
  return await prisma.material.delete({
    where: { id: existingMaterial.id }
  })
}

async function getPageData() {
  try {
    const session = await auth()
    if (!session?.user) {
      redirect("/auth/login")
    }

    // שימוש בפניות נפרדות במקום Promise.all שהיה מוגדר באופן שגוי
    const importLogs = await prisma.importLog.findMany({
      where: { userId: session.user.id },
      orderBy: { created_at: "desc" },
      take: 10
    });

    // מעבד את ה-metadata במידה וקיים
    const processedImportLogs = importLogs.map((log: any) => ({
      ...log,
      metadata: log.metadata ? JSON.parse(log.metadata) : null
    }));

    const categoriesRaw = await prisma.category.findMany({
      where: { 
        userId: session.user.id,
        status: "active" 
      },
      orderBy: { name: "asc" },
      include: {
        parent_category: true
      }
    });
    
    const categories = categoriesRaw.map((category: any) => ({
      id: category.id,
      userId: category.userId,
      code: category.code,
      name: category.name,
      description: category.description,
      parent: category.parent,
      status: category.status,
      created_at: category.created_at,
      updated_at: category.updated_at,
      parent_name: category.parent_category?.name || null
    }));

    const colors = await prisma.color.findMany({
      where: { 
        userId: session.user.id,
        status: "active" 
      },
      orderBy: { name: "asc" }
    });

    const sizesRaw = await prisma.size.findMany({
      where: { 
        userId: session.user.id,
        status: "active" 
      },
      orderBy: { name: "asc" }
    });
    
    const sizes = sizesRaw.map((size: any) => ({
      id: size.id,
      userId: size.userId,
      code: size.code,
      name: size.name,
      description: size.description,
      category: size.category,
      status: size.status,
      created_at: size.created_at,
      updated_at: size.updated_at,
      category_name: size.category || null
    }));

    const suppliers = await prisma.supplier.findMany({
      where: { 
        userId: session.user.id,
        status: "active" 
      },
      orderBy: { name: "asc" }
    });

    const materials = await prisma.material.findMany({
      where: { 
        userId: session.user.id,
        status: "active" 
      },
      orderBy: { name: "asc" }
    });
    
    return {
      importLogs: processedImportLogs,
      previewData: {
        categories,
        colors,
        sizes,
        materials,
        suppliers
      }
    };
  } catch (error) {
    console.error('Error fetching page data:', error);
    throw error;
  }
}

export default async function BulkImportPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const data = await getPageData()
  
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ייבוא נתונים בבולק</h2>
          <p className="text-muted-foreground">
            ייבוא נתונים מקובץ אקסל עבור קטגוריות, צבעים, מידות וספקים
          </p>
        </div>
      </div>
      <Separator />
      <Suspense fallback={<LoadingSpinner />}>
        <BulkImportClient 
          importLogs={data.importLogs}
          previewData={data.previewData}
          onUpload={uploadProducts}
        />
      </Suspense>
    </div>
  );
}

