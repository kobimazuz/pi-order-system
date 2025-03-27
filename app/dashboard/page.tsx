import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, DollarSign, Users, TrendingUp } from "lucide-react"
import { ProductsTable } from "@/components/products-table"
import { OrdersTable } from "@/components/orders-table"
import { SalesStatisticsChart } from "@/app/components/statistics-chart"
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading"
import { Prisma, Product, Category, Supplier } from "@prisma/client"

// מגדיר את הדף כדינמי
export const dynamic = 'force-dynamic'

interface ProductWithRelations extends Product {
  category: Category
  supplier: Supplier
  _count: {
    orders: number
  }
}

// פונקציית שליפת נתונים
async function getDashboardData(userId: string) {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [
      todayOrders,
      todayVisits,
      topProducts,
      recentOrders,
      salesStats
    ] = await Promise.all([
      // הזמנות היום
      prisma.order.aggregate({
        where: {
          userId,
          created_at: {
            gte: today
          }
        },
        _count: true,
        _sum: {
          total_amount: true
        }
      }),
      // ביקורים היום - נשתמש בטבלת משתמשים כרגע
      prisma.profile.count({
        where: {
          created_at: {
            gte: today
          }
        }
      }),
      // מוצרים מובילים
      prisma.product.findMany({
        where: {
          userId,
          status: "active"
        },
        orderBy: [
          {
            orderItems: {
              _count: "desc"
            }
          }
        ],
        take: 5,
        include: {
          category: true,
          supplier: true,
          _count: {
            select: {
              orderItems: true
            }
          }
        }
      }),
      // הזמנות אחרונות
      prisma.order.findMany({
        where: {
          userId
        },
        orderBy: {
          created_at: "desc"
        },
        take: 5,
        include: {
          orderItems: true
        }
      }),
      // סטטיסטיקות מכירות
      prisma.order.groupBy({
        by: ["created_at"],
        where: {
          userId,
          created_at: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        _sum: {
          total_amount: true
        }
      })
    ])

    return {
      todayStats: {
        orders: todayOrders._count,
        revenue: todayOrders._sum.total_amount || 0,
        visits: todayVisits
      },
      topProducts: topProducts.map(product => ({
        ...product,
        _count: {
          orders: product._count.orderItems
        }
      })) as ProductWithRelations[],
      recentOrders,
      salesStats: salesStats.map((stat: { created_at: Date, _sum: { total_amount: number | null } }) => ({
        date: stat.created_at,
        amount: stat._sum.total_amount || 0
      }))
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}

export default async function Dashboard() {
  const session = await auth()
  if (!session?.userId) {
    redirect("/sign-in")
  }
  
  const data = await getDashboardData(session.userId)
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">דשבורד</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">שלום, מנהל</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">סה"כ מכירות היום</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{data.todayStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">סה"כ הזמנות היום</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.todayStats.orders}</div>
            <p className="text-xs text-muted-foreground">+8% מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">הכנסות היום</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₪{data.todayStats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+18% מאתמול</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">מבקרים היום</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.todayStats.visits}</div>
            <p className="text-xs text-muted-foreground">+5% מאתמול</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="statistics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statistics">סטטיסטיקות</TabsTrigger>
          <TabsTrigger value="products">מוצרים מובילים</TabsTrigger>
          <TabsTrigger value="orders">הזמנות אחרונות</TabsTrigger>
        </TabsList>
        <TabsContent value="statistics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>סטטיסטיקת הזמנות</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>טוען...</div>}>
                  <SalesStatisticsChart
                    data={data.salesStats}
                    type="line"
                  />
                </Suspense>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>סקירת מכירות</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>טוען...</div>}>
                  <SalesStatisticsChart
                    data={data.salesStats}
                    type="line"
                  />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>מוצרים מובילים</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <ProductsTable products={data.topProducts} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>הזמנות אחרונות</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<LoadingSpinner />}>
                <OrdersTable orders={data.recentOrders} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

