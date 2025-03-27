"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSearchParams } from "next/navigation"

interface ReportSummaryProps {
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

export function ReportSummary({ data }: ReportSummaryProps) {
  const searchParams = useSearchParams()
  const reportType = searchParams?.get("type") || "sales"

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {reportType === "sales" && "סיכום דוח מכירות"}
          {reportType === "products" && "סיכום דוח מוצרים"}
          {reportType === "inventory" && "סיכום דוח מלאי"}
          {reportType === "customers" && "סיכום דוח לקוחות"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportType === "sales" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">סה״כ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₪{data.sales.total.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.sales.total - data.sales.previousPeriod.total) / data.sales.previousPeriod.total * 100).toFixed(1)}% מהתקופה הקודמת
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">ממוצע</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₪{data.sales.average.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.sales.average - data.sales.previousPeriod.average) / data.sales.previousPeriod.average * 100).toFixed(1)}% מהתקופה הקודמת
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">מקסימום</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₪{data.sales.max.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.sales.max - data.sales.previousPeriod.max) / data.sales.previousPeriod.max * 100).toFixed(1)}% מהתקופה הקודמת
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">מינימום</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₪{data.sales.min.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.sales.min - data.sales.previousPeriod.min) / data.sales.previousPeriod.min * 100).toFixed(1)}% מהתקופה הקודמת
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "products" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">סה״כ מוצרים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.products.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">מוצרים פעילים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.products.active}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.products.active / data.products.total) * 100).toFixed(1)}% מסך הכל
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">קטגוריות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.products.categories.length}</div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "inventory" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">סה״כ מוצרים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.inventory.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">מלאי תקין</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {data.inventory.total - data.inventory.lowStock - data.inventory.outOfStock}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(((data.inventory.total - data.inventory.lowStock - data.inventory.outOfStock) / data.inventory.total) * 100).toFixed(1)}% מסך הכל
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">מלאי נמוך</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.inventory.lowStock}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.inventory.lowStock / data.inventory.total) * 100).toFixed(1)}% מסך הכל
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">אזל מהמלאי</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.inventory.outOfStock}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.inventory.outOfStock / data.inventory.total) * 100).toFixed(1)}% מסך הכל
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === "customers" && (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">סה״כ לקוחות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.customers.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">לקוחות פעילים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.customers.active}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.customers.active / data.customers.total) * 100).toFixed(1)}% מסך הכל
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">לקוחות חדשים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.customers.new}</div>
                  <p className="text-xs text-muted-foreground">
                    {((data.customers.new / data.customers.total) * 100).toFixed(1)}% מסך הכל
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 