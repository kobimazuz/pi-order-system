'use client'

import { Material } from "@prisma/client"
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

interface MaterialsTableProps {
  items: Material[]
}

export function MaterialsTable({ items }: MaterialsTableProps) {
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (formData: FormData) => {
    setIsDeleting(true)
    try {
      const result = await deleteVariable(formData)
      if (result.success) {
        toast({
          title: "נמחק בהצלחה",
          description: "החומר נמחק בהצלחה",
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
        description: "אירעה שגיאה בעת מחיקת החומר",
      })
    }
    setIsDeleting(false)
  }

  return (
    <div className="rounded-md border">
      <div className="flex justify-end gap-2 mb-4">
        <VariableForm type="material">
          <Button className="flex items-center gap-2">
            הוסף חומר
          </Button>
        </VariableForm>
        <Link href="/dashboard/bulk-import?tab=materials">
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
              <TableCell>
                <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                  {item.status === 'active' ? 'פעיל' : 'לא פעיל'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <VariableForm
                    type="material"
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
                          פעולה זו תמחק את החומר לצמיתות ולא ניתן יהיה לשחזר אותו.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>ביטול</AlertDialogCancel>
                        <form action={handleDelete}>
                          <input type="hidden" name="type" value="Material" />
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