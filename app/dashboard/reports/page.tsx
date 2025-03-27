import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import { ReportFilters } from "@/components/report-filters"
import { ReportExport } from "@/components/report-export"
import { ReportCharts } from "@/components/report-charts"
import { ReportTable } from "@/components/report-table"
import { ReportSummary } from "@/components/report-summary"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "דוחות",
  description: "צפייה בדוחות מכירות, מוצרים, מלאי ולקוחות",
}

async function getData(searchParams: { [key: string]: string | string[] | undefined }) {
  const type = searchParams.type || "sales"
  const period = searchParams.period || "month"

  // מכירות
  const sales = await prisma.order.findMany({
    where: {
      status: "completed",
      created_at: {
        gte: period === "month" 
          ? new Date(new Date().setMonth(new Date().getMonth() - 1))
          : period === "quarter"
          ? new Date(new Date().setMonth(new Date().getMonth() - 3))
          : new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      }
    },
    select: {
      total_amount: true
    }
  })

  const previousSales = await prisma.order.findMany({
    where: {
      status: "completed",
      created_at: {
        gte: period === "month"
          ? new Date(new Date().setMonth(new Date().getMonth() - 2))
          : period === "quarter"
          ? new Date(new Date().setMonth(new Date().getMonth() - 6))
          : new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
        lt: period === "month"
          ? new Date(new Date().setMonth(new Date().getMonth() - 1))
          : period === "quarter"
          ? new Date(new Date().setMonth(new Date().getMonth() - 3))
          : new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      }
    },
    select: {
      total_amount: true
    }
  })

  const salesData = {
    total: sales.reduce((acc, order) => acc + order.total_amount, 0),
    average: sales.length > 0 
      ? sales.reduce((acc, order) => acc + order.total_amount, 0) / sales.length 
      : 0,
    max: Math.max(...sales.map(order => order.total_amount)),
    min: Math.min(...sales.map(order => order.total_amount)),
    previousPeriod: {
      total: previousSales.reduce((acc, order) => acc + order.total_amount, 0),
      average: previousSales.length > 0
        ? previousSales.reduce((acc, order) => acc + order.total_amount, 0) / previousSales.length
        : 0,
      max: Math.max(...previousSales.map(order => order.total_amount)),
      min: Math.min(...previousSales.map(order => order.total_amount))
    }
  }

  // מוצרים
  const products = await prisma.product.findMany({
    select: {
      status: true,
      category: {
        select: {
          name: true
        }
      }
    }
  })

  const productsData = {
    total: products.length,
    active: products.filter(product => product.status === "active").length,
    categories: products.reduce((acc, product) => {
      const category = acc.find(c => c.name === product.category.name)
      if (category) {
        category.count++
      } else {
        acc.push({ name: product.category.name, count: 1 })
      }
      return acc
    }, [] as { name: string, count: number }[])
  }

  // מלאי
  const inventory = await prisma.product.findMany({
    where: {
      status: "active"
    },
    select: {
      units_per_pack: true
    }
  })

  const inventoryData = {
    total: inventory.length,
    lowStock: inventory.filter(product => product.units_per_pack <= 10).length,
    outOfStock: inventory.filter(product => product.units_per_pack === 0).length
  }

  // לקוחות
  const users = await prisma.profile.findMany({
    where: {
      role: "user"
    }
  })
  const activeUsers = await prisma.profile.findMany({
    where: {
      role: "user",
      orders: {
        some: {
          created_at: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 3))
          }
        }
      }
    }
  })
  const newUsers = await prisma.profile.findMany({
    where: {
      role: "user",
      created_at: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
      }
    }
  })

  const customersData = {
    total: users.length,
    active: activeUsers.length,
    new: newUsers.length
  }

  return {
    sales: salesData,
    products: productsData,
    inventory: inventoryData,
    customers: customersData
  }
}

function ReportsPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-[150px]" />
        <Skeleton className="h-10 w-[120px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Skeleton className="h-[200px] md:col-span-3" />
        <Skeleton className="h-[200px]" />
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  )
}

export default async function ReportsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const resolvedSearchParams = await searchParams;
  const data = await getData(resolvedSearchParams);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">דוחות</h1>
        <div className="flex gap-4">
          <ReportFilters />
          <ReportExport />
        </div>
      </div>
      <ReportSummary data={data} />
      <ReportCharts data={data} />
      <ReportTable data={data} />
    </div>
  )
}

