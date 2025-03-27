import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: {
    sku: string
    name: string
    image_url: string | null
    units_per_pack: number
    units_per_carton: number
    price_per_unit: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {product.image_url && (
            <div className="relative w-full h-48">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-contain"
              />
            </div>
          )}
          <div className="space-y-2 text-sm">
            <p>מק"ט: {product.sku}</p>
            <p>יחידות באריזה: {product.units_per_pack}</p>
            <p>יחידות בקרטון: {product.units_per_carton}</p>
            <p>מחיר ליחידה: {formatCurrency(product.price_per_unit)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 