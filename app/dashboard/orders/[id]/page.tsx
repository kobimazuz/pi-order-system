import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, FileSpreadsheet, Printer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

interface OrderWithDetails {
  id: string
  pi_number: string
  created_at: Date
  customer: string
  total_items: number
  total_units: number
  total_packages: number
  total_cartons: number
  total_amount: number
  status: string
  notes: string | null
  orderItems: {
    id: string
    quantity: number
    product: {
      id: string
      sku: string
      name: string
      image_url: string | null
      units_per_pack: number
      units_per_carton: number
      price_per_unit: number
    }
  }[]
}

async function getData(orderId: string): Promise<OrderWithDetails> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      throw new Error("לא נמצא משתמש מחובר")
    }

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
        userId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      notFound()
    }

    const total_items = order.orderItems.length
    const total_units = order.orderItems.reduce((sum, item) => sum + item.quantity * item.product.units_per_pack, 0)
    const total_packages = order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
    const total_cartons = order.orderItems.reduce((sum, item) => {
      const unitsTotal = item.quantity * item.product.units_per_pack
      return sum + Math.ceil(unitsTotal / item.product.units_per_carton)
    }, 0)

    return {
      ...order,
      total_items,
      total_units,
      total_packages,
      total_cartons,
    }
  } catch (error) {
    console.error("שגיאה בטעינת פרטי הזמנה:", error)
    throw new Error("שגיאה בטעינת פרטי הזמנה")
  }
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <Skeleton className="h-8 w-[200px]" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[100px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default async function OrderDetailsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const order = await getData(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">פרטי הזמנה</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/api/orders/${order.id}/print`}>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              הדפס
            </Button>
          </Link>
          <Link href={`/api/orders/${order.id}/export`}>
            <Button>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              ייצא לאקסל
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>פרטי הזמנה {order.pi_number}</CardTitle>
                <CardDescription>נוצר בתאריך {new Date(order.created_at).toLocaleDateString('he-IL')}</CardDescription>
              </div>
              <Badge variant={order.status === "completed" ? "default" : order.status === "processing" ? "outline" : "secondary"}>
                {order.status === "completed" ? "הושלם" : order.status === "processing" ? "בתהליך" : "טיוטה"}
              </Badge>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-14"></TableHead>
                    <TableHead>מק״ט</TableHead>
                    <TableHead>שם מוצר</TableHead>
                    <TableHead>יח׳ באריזה</TableHead>
                    <TableHead>כמות (אריזות)</TableHead>
                    <TableHead>סה״כ יחידות</TableHead>
                    <TableHead>מחיר ליחידה</TableHead>
                    <TableHead>סה״כ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.orderItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-10 h-10 relative rounded overflow-hidden">
                          <Image
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{item.product.sku}</TableCell>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell>{item.product.units_per_pack}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.quantity * item.product.units_per_pack}</TableCell>
                      <TableCell>₪{item.product.price_per_unit.toFixed(2)}</TableCell>
                      <TableCell>₪{(item.quantity * item.product.units_per_pack * item.product.price_per_unit).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הערות להזמנה</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{order.notes || "אין הערות להזמנה זו"}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>פרטי לקוח</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium">{order.customer}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>סיכום הזמנה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">מספר פריטים:</span>
                  <span>{order.total_items}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">סה״כ יחידות:</span>
                  <span>{order.total_units}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">סה״כ אריזות:</span>
                  <span>{order.total_packages}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">סה״כ קרטונים:</span>
                  <span>{order.total_cartons}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center font-bold">
                  <span>סה״כ לתשלום:</span>
                  <span>₪{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={`/api/orders/${order.id}/export`}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  ייצא PI לאקסל
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

