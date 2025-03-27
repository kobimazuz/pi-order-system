import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ProductForm } from "@/components/product-form"
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

export const metadata: Metadata = {
  title: "הוספת מוצר",
  description: "הוספת מוצר חדש למערכת",
}

async function createProduct(formData: FormData) {
  "use server"
  
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  try {
    const product = await prisma.product.create({
      data: {
        userId: session.user.id,
        sku: formData.get("sku") as string,
        name: formData.get("name") as string,
        image_url: formData.get("image_url") as string || null,
        units_per_pack: parseInt(formData.get("units_per_pack") as string),
        units_per_carton: parseInt(formData.get("units_per_carton") as string),
        price_per_unit: parseFloat(formData.get("price_per_unit") as string),
        status: "active",
        description: null,
        categoryId: formData.get("category_id") as string,
        supplierId: formData.get("supplier_id") as string
      }
    })

    revalidatePath("/dashboard/products")
    redirect("/dashboard/products")
  } catch (error) {
    console.error("[CREATE_PRODUCT]", error)
    throw new Error("Failed to create product")
  }
}

// הוספה: פעולת שרת להעלאת תמונה
async function uploadProductImage(formData: FormData) {
  "use server"

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "לא מחובר" }
  }

  try {
    // קבלת הפרמטרים מה-formData
    const file = formData.get('file') as File
    const userId = session.user.id
    const sku = formData.get('sku') as string

    if (!file || !sku) {
      return { success: false, error: "נתונים חסרים" }
    }

    // המרת הקובץ לבאפר
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // עיבוד התמונה
    const MAX_SIZE = 500
    const processedImage = await sharp(buffer)
      .resize(MAX_SIZE, MAX_SIZE, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toBuffer()

    // יצירת שם קובץ
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/${sku}/image.${fileExt}`

    // יצירת קליינט סופרבייס
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // העלאה לסופרבייס
    const { data, error } = await supabase.storage
      .from('products')
      .upload(filePath, processedImage, {
        upsert: true,
        contentType: file.type
      })

    if (error) {
      console.error('Error uploading image:', error)
      return { success: false, error: "שגיאה בהעלאת התמונה" }
    }

    // קבלת URL ציבורי
    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return { success: true, imageUrl: publicUrl }
  } catch (error) {
    console.error('Error in uploadProductImage:', error)
    return { success: false, error: "שגיאה בעיבוד והעלאת התמונה" }
  }
}

// הוספה: פעולת שרת למחיקת תמונה
async function deleteProductImage(sku: string) {
  "use server"

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "לא מחובר" }
  }

  try {
    const userId = session.user.id
    
    // יצירת קליינט סופרבייס
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // מחיקה מסופרבייס
    const { error } = await supabase.storage
      .from('products')
      .remove([`${userId}/${sku}/image.*`])

    if (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: "שגיאה במחיקת התמונה" }
    }

    return { success: true }
  } catch (error) {
    console.error('Error in deleteProductImage:', error)
    return { success: false, error: "שגיאה במחיקת התמונה" }
  }
}

async function getData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const categories = await prisma.category.findMany({
    where: { 
      userId: session.user.id,
      status: "active" 
    },
    orderBy: { name: "asc" }
  })

  const suppliers = await prisma.supplier.findMany({
    where: { 
      userId: session.user.id,
      status: "active" 
    },
    orderBy: { name: "asc" }
  })

  return { categories, suppliers }
}

export default async function AddProductPage() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const { categories, suppliers } = await getData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הוספת מוצר</h1>
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <ProductForm 
        onSubmit={createProduct} 
        userId={session.user.id} 
        categories={categories}
        suppliers={suppliers}
        uploadImage={uploadProductImage}
        deleteImage={deleteProductImage}
      />
    </div>
  )
}

