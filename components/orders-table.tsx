"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, FileSpreadsheet, MoreHorizontal, Printer } from "lucide-react"
import Link from "next/link"
import { Order } from "@prisma/client"

interface OrderWithTotals extends Order {
  total_items: number
  total_units: number
}

interface OrdersTableProps {
  orders: OrderWithTotals[]
  limit?: number
}

export function OrdersTable({ orders, limit }: OrdersTableProps) {
  const displayOrders = limit ? orders.slice(0, limit) : orders

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>מספר PI</TableHead>
            <TableHead>תאריך</TableHead>
            <TableHead>לקוח</TableHead>
            <TableHead>פריטים</TableHead>
            <TableHead>יחידות</TableHead>
            <TableHead>סכום</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.pi_number}</TableCell>
              <TableCell>{new Date(order.created_at).toLocaleDateString('he-IL')}</TableCell>
              <TableCell>{order.customer}</TableCell>
              <TableCell>{order.total_items}</TableCell>
              <TableCell>{order.total_units}</TableCell>
              <TableCell>₪{order.total_amount.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant={order.status === "completed" ? "default" : order.status === "processing" ? "outline" : "secondary"}
                >
                  {order.status === "completed" ? "הושלם" : order.status === "processing" ? "בתהליך" : "טיוטה"}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>צפה</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/api/orders/${order.id}/export`}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>ייצא לאקסל</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/api/orders/${order.id}/print`}>
                        <Printer className="mr-2 h-4 w-4" />
                        <span>הדפס</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

