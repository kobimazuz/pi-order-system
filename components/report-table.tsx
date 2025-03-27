"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useSearchParams } from "next/navigation"

interface ReportTableProps {
  data: {
    sales: {
      total: number
      average: number
      max: number
      min: number
      previousPeriod: {
        total: number
        average: number
        max: number
        min: number
      }
    }
    products: {
      total: number
      active: number
      categories: {
        name: string
        count: number
      }[]
    }
    inventory: {
      total: number
      lowStock: number
      outOfStock: number
    }
    customers: {
      total: number
      active: number
      new: number
    }
  }
}

export function ReportTable({ data }: ReportTableProps) {
  const searchParams = useSearchParams()
  const reportType = searchParams?.get("type") || "sales"

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {reportType === "sales" && "דוח מכירות - טבלה"}
          {reportType === "products" && "דוח מוצרים - טבלה"}
          {reportType === "inventory" && "דוח מלאי - טבלה"}
          {reportType === "customers" && "דוח לקוחות - טבלה"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reportType === "sales" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מדד</TableHead>
                <TableHead>ערך נוכחי</TableHead>
                <TableHead>ערך קודם</TableHead>
                <TableHead>שינוי</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>סה"כ</TableCell>
                <TableCell>₪{data.sales.total.toLocaleString()}</TableCell>
                <TableCell>₪{data.sales.previousPeriod.total.toLocaleString()}</TableCell>
                <TableCell>
                  {((data.sales.total - data.sales.previousPeriod.total) / data.sales.previousPeriod.total * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ממוצע</TableCell>
                <TableCell>₪{data.sales.average.toLocaleString()}</TableCell>
                <TableCell>₪{data.sales.previousPeriod.average.toLocaleString()}</TableCell>
                <TableCell>
                  {((data.sales.average - data.sales.previousPeriod.average) / data.sales.previousPeriod.average * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {reportType === "products" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>קטגוריה</TableHead>
                <TableHead>כמות מוצרים</TableHead>
                <TableHead>אחוז מסך הכל</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.products.categories.map((category) => (
                <TableRow key={category.name}>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.count}</TableCell>
                  <TableCell>
                    {((category.count / data.products.total) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {reportType === "inventory" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>סטטוס</TableHead>
                <TableHead>כמות</TableHead>
                <TableHead>אחוז מסך הכל</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>מלאי תקין</TableCell>
                <TableCell>
                  {data.inventory.total - data.inventory.lowStock - data.inventory.outOfStock}
                </TableCell>
                <TableCell>
                  {(((data.inventory.total - data.inventory.lowStock - data.inventory.outOfStock) / data.inventory.total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>מלאי נמוך</TableCell>
                <TableCell>{data.inventory.lowStock}</TableCell>
                <TableCell>
                  {((data.inventory.lowStock / data.inventory.total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>אזל מהמלאי</TableCell>
                <TableCell>{data.inventory.outOfStock}</TableCell>
                <TableCell>
                  {((data.inventory.outOfStock / data.inventory.total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {reportType === "customers" && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מדד</TableHead>
                <TableHead>ערך</TableHead>
                <TableHead>אחוז מסך הכל</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>לקוחות פעילים</TableCell>
                <TableCell>{data.customers.active}</TableCell>
                <TableCell>
                  {((data.customers.active / data.customers.total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>לקוחות חדשים</TableCell>
                <TableCell>{data.customers.new}</TableCell>
                <TableCell>
                  {((data.customers.new / data.customers.total) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
} 