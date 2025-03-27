"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Order, OrderItem } from "@prisma/client"

interface OrdersTableProps {
  orders: (Order & {
    orderItems: OrderItem[]
  })[]
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>מספר PI</TableHead>
          <TableHead>לקוח</TableHead>
          <TableHead>סה"כ פריטים</TableHead>
          <TableHead>סה"כ</TableHead>
          <TableHead>סטטוס</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>{order.pi_number}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>{order.total_items}</TableCell>
            <TableCell>₪{order.total_amount.toLocaleString()}</TableCell>
            <TableCell>
              <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                {order.status === "completed" ? "הושלם" : "בתהליך"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 