import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProductCard } from "@/components/product-card"
import { createClient } from '@supabase/supabase-js'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Upload } from "lucide-react"

export const metadata: Metadata = {
  title: "מוצרים",
  description: "ניהול מוצרים",
}

// טיפוס מותאם למוצר
interface Product {
  id: string
  sku: string
  name: string
  image_url: string | null
  units_per_pack: number
  units_per_carton: number
  price_per_unit: number
}

async function getProducts(): Promise<Product[]> {
  const session = await auth()
  
  if (!session?.user?.id) {
    console.error("No user session found")
    redirect("/auth/login")
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        userId: session.user.id,
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
    })

    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    throw new Error("Failed to fetch products")
  }
}

export default async function ProductsPage() {
  let products: Product[] = []
  let error = null

  try {
    products = await getProducts()
  } catch (e) {
    error = e
    console.error("Error in ProductsPage:", e)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">שגיאה בטעינת המוצרים</h2>
          <p className="text-gray-600 mt-2">אנא נסה שוב מאוחר יותר</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">מוצרים</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/products/add">
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              הוסף מוצר
            </Button>
          </Link>
          <Link href="/dashboard/products/bulk-add">
            <Button variant="outline">
              <Upload className="h-4 w-4 ml-2" />
              העלאה מאקסל
            </Button>
          </Link>
        </div>
      </div>
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">לא נמצאו מוצרים</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

