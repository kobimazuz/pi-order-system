import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { ProductCard } from "@/components/product-card"

export const metadata: Metadata = {
  title: "מוצרים",
  description: "ניהול מוצרים",
}

async function getProducts() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const products = await prisma.product.findMany({
    where: {
      userId,
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
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">מוצרים</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

