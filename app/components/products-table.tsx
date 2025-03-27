"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Product } from "@prisma/client"

interface ProductsTableProps {
  products: (Product & {
    _count: {
      orders: number
    }
  })[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>מק"ט</TableHead>
          <TableHead>שם</TableHead>
          <TableHead>מחיר</TableHead>
          <TableHead>הזמנות</TableHead>
          <TableHead>סטטוס</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>{product.sku}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>₪{product.price_per_unit.toLocaleString()}</TableCell>
            <TableCell>{product._count.orders}</TableCell>
            <TableCell>
              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                {product.status === "active" ? "פעיל" : "לא פעיל"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 