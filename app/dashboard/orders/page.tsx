import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Order } from "@prisma/client"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { OrdersTable } from "@/components/orders-table"
import { OrdersFilters } from "@/components/orders-filters"

interface OrderWithTotals extends Order {
  total_items: number
  total_units: number
}

async function getData(searchParams?: {
  query?: string
  status?: string
  date?: string
}): Promise<OrderWithTotals[]> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("לא נמצא משתמש מחובר")
    }

    const where = {
      userId: session.user.id,
      ...(searchParams?.status && searchParams.status !== "all" ? { status: searchParams.status } : {}),
      ...(searchParams?.query ? {
        OR: [
          { pi_number: { contains: searchParams.query } },
          { customer: { contains: searchParams.query } },
        ],
      } : {}),
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return orders.map(order => ({
      ...order,
      total_items: order.orderItems.length,
      total_units: order.orderItems.reduce((sum, item) => sum + item.quantity * item.product.units_per_pack, 0),
    }))
  } catch (error) {
    console.error("שגיאה בטעינת הזמנות:", error)
    throw new Error("שגיאה בטעינת הזמנות")
  }
}

function OrdersTableSkeleton() {
  return (
    <div className="border rounded-lg">
      <div className="p-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="p-4 border-t">
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  )
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string
    status?: string
    date?: string
  } | undefined>
}) {
  const resolvedSearchParams = await searchParams;
  const orders = await getData(resolvedSearchParams);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ניהול הזמנות</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/reports">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              דוחות
            </Link>
          </Button>
          <Link href="/dashboard/create-pi">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הזמנה חדשה
            </Button>
          </Link>
        </div>
      </div>

      <OrdersFilters />

      <Suspense fallback={<OrdersTableSkeleton />}>
        <OrdersTable orders={orders} />
      </Suspense>
    </div>
  )
}

