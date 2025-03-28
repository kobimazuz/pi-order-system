import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { X, Pencil } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { notFound } from "next/navigation"
import { Product, Category, Color, Size, Supplier } from "@prisma/client"
import { ProductCard } from "@/components/product-card"
import { ProductForm } from "@/components/product-form"
import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

export const metadata: Metadata = {
  title: "פרטי מוצר",
  description: "צפייה ועריכת פרטי מוצר",
}

// טיפוס מורחב למוצר
type ProductWithRelations = Product & {
  category: Category;
  supplier: Supplier;
  colors: Color[];
  sizes: Size[];
};

// סכמת ולידציה
const productSchema = z.object({
  name: z.string().min(2, "שם המוצר חייב להכיל לפחות 2 תווים"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "יש לבחור קטגוריה"),
  supplierId: z.string().min(1, "יש לבחור ספק"),
  price_per_unit: z.number().min(0, "מחיר חייב להיות חיובי"),
  units_per_pack: z.number().min(1, "כמות באריזה חייבת להיות לפחות 1"),
  units_per_carton: z.number().min(1, "כמות בקרטון חייבת להיות לפחות 1"),
  packing_info: z.string().optional(),
  status: z.enum(["active", "inactive", "out_of_stock"]),
  image_url: z.string().optional(),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
});

// Server Action לעדכון מוצר
async function updateProduct(formData: FormData) {
  "use server"
  
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const id = formData.get("id") as string
  if (!id) {
    throw new Error("Product ID is required")
  }

  try {
    await prisma.product.update({
      where: {
        id,
        userId: session.user.id
      },
      data: {
        sku: formData.get("sku") as string,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
        image_url: formData.get("image_url") as string || null,
        units_per_pack: parseInt(formData.get("units_per_pack") as string),
        units_per_carton: parseInt(formData.get("units_per_carton") as string),
        price_per_unit: parseFloat(formData.get("price_per_unit") as string),
        categoryId: formData.get("category_id") as string,
        supplierId: formData.get("supplier_id") as string,
        status: formData.get("status") as string || "active"
      }
    })

    revalidatePath("/dashboard/products")
    redirect("/dashboard/products")
  } catch (error) {
    console.error("[UPDATE_PRODUCT]", error)
    throw new Error("Failed to update product")
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

async function getData(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  // וידוא שה-ID הוא UUID תקין
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound()
  }

  const product = await prisma.product.findUnique({
    where: {
      id,
      userId: session.user.id
    }
  })

  if (!product) {
    notFound()
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

  return { product, categories, suppliers }
}

// דף ראשי
export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getData(id);
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">עריכת מוצר</h1>
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <ProductForm 
        onSubmit={updateProduct} 
        initialData={data.product} 
        userId={session.user.id}
        categories={data.categories}
        suppliers={data.suppliers}
        uploadImage={uploadProductImage}
        deleteImage={deleteProductImage}
      />
    </div>
  )
}

