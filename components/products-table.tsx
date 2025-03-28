"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Eye } from "lucide-react"
import Link from "next/link"

// הגדרת ממשקים מקומיים במקום ייבוא מ-@prisma/client
interface Product {
  id: string;
  userId: string;
  sku: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  units_per_pack: number;
  packing_info?: string | null;
  units_per_carton: number;
  price_per_unit: number;
  status: string;
  categoryId: string;
  supplierId: string;
  created_at: Date;
  updated_at: Date;
}

interface Category {
  id: string;
  userId: string;
  code: string;
  name: string;
  description?: string | null;
  parent?: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface Supplier {
  id: string;
  userId: string;
  code: string;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface ProductWithRelations extends Product {
  category: Category;
  supplier: Supplier;
}

interface ProductsTableProps {
  products: ProductWithRelations[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>מק״ט</TableHead>
            <TableHead>שם מוצר</TableHead>
            <TableHead>קטגוריה</TableHead>
            <TableHead>מחיר</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category.name}</TableCell>
              <TableCell>₪{product.price_per_unit}</TableCell>
              <TableCell>
                <Badge variant={product.status === "available" ? "default" : "secondary"}>
                  {product.status === "available" ? "זמין" : "לא זמין"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Link href={`/dashboard/products/${product.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/products/${product.id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

