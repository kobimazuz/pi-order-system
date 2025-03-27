"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, LineChart, PieChart } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { SalesChart } from "@/components/sales-chart"
import { ProductsChart } from "@/components/products-chart"
import { StatisticsChart } from "@/components/statistics-chart"
import { useState } from "react"

interface ChartData {
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

interface ChartProps {
  data: ChartData[keyof ChartData]
  type: "bar" | "line" | "pie"
}

interface ReportChartsProps {
  data: ChartData
}

export function ReportCharts({ data }: ReportChartsProps) {
  const searchParams = useSearchParams()
  const reportType = searchParams?.get("type") || "sales"
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          {reportType === "sales" && "דוח מכירות"}
          {reportType === "products" && "דוח מוצרים"}
          {reportType === "inventory" && "דוח מלאי"}
          {reportType === "customers" && "דוח לקוחות"}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="icon"
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="icon"
            onClick={() => setChartType("line")}
          >
            <LineChart className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "pie" ? "default" : "outline"}
            size="icon"
            onClick={() => setChartType("pie")}
          >
            <PieChart className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-96">
        {reportType === "sales" && <SalesChart data={data.sales} type={chartType} />}
        {reportType === "products" && <ProductsChart data={data.products} type={chartType} />}
        {reportType === "inventory" && <StatisticsChart data={data.inventory} type={chartType} />}
        {reportType === "customers" && <SalesChart data={data.sales} type={chartType} />}
      </CardContent>
    </Card>
  )
} 