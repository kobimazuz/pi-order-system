'use client'

import { Size } from "@prisma/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "./ui/button"
import { Pencil, Trash2, FileSpreadsheet } from "lucide-react"
import { VariableForm } from "./variable-form"
import { deleteVariable } from "@/app/dashboard/variables/actions"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import Link from "next/link"

interface SizesTableProps {
  items: Size[]
}

export function SizesTable({ items }: SizesTableProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true)
    try {
      const result = await deleteVariable(formData)
      if (result.success) {
        toast({
          title: "נמחק בהצלחה",
          description: "המידה נמחקה בהצלחה",
        })
      } else {
        toast({
          variant: "destructive",
          title: "שגיאה במחיקה",
          description: result.error,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה במחיקה",
        description: "אירעה שגיאה בעת מחיקת המידה",
      })
    }
    setIsDeleting(false)
  }

  return (
    <div className="rounded-md border">
      <div className="flex justify-end gap-2 mb-4">
        <VariableForm type="size">
          <Button className="flex items-center gap-2">
            הוסף מידה
          </Button>
        </VariableForm>
        <Link href="/dashboard/bulk-import?tab=sizes">
          <Button variant="outline" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            ייבוא מאקסל
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>קוד</TableHead>
            <TableHead>שם</TableHead>
            <TableHead>תיאור</TableHead>
            <TableHead>קטגוריה</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.code}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.category || "ללא קטגוריה"}</TableCell>
              <TableCell>
                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                  {item.status === 'active' ? 'פעיל' : 'לא פעיל'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <VariableForm
                    type="size"
                    defaultValues={item}
                    isEdit={true}
                  >
                    <Button size="icon" variant="ghost">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </VariableForm>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>האם אתה בטוח/ה?</AlertDialogTitle>
                        <AlertDialogDescription>
                          פעולה זו תמחק את המידה לצמיתות ולא ניתן יהיה לשחזר אותה.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                        <form action={handleDelete}>
                          <input type="hidden" name="type" value="Size" />
                          <input type="hidden" name="id" value={item.id} />
                          <AlertDialogAction type="submit" disabled={isDeleting}>
                            {isDeleting ? "מוחק..." : "מחק"}
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}