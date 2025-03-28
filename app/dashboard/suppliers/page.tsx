import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, MoreHorizontal, Plus, Trash2, FileSpreadsheet, Upload, Search, X } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Supplier } from "@prisma/client"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/loading"
import { unstable_cache } from 'next/cache'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Prisma } from "@prisma/client"

// טיפוסים
type SupplierWithProducts = Supplier & {
  products: {
    id: string
    name: string
    sku: string
    created_at: Date
  }[]
}

interface SearchParams {
  search?: string
  status?: string
}

// פונקציית שליפת נתונים עם קשינג
const getPageData = unstable_cache(
  async ({ search, status }: SearchParams = {}) => {
    try {
      const where: Prisma.SupplierWhereInput = {
        AND: [
          // חיפוש בשדות טקסט
          search ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { code: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { contact_name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { phone: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          } : {},
          // סינון לפי סטטוס
          status && status !== 'all' ? { status } : {},
        ].filter(Boolean),
      };

      const suppliers = await prisma.supplier.findMany({
        where,
        include: {
          products: {
            select: {
              id: true,
              name: true,
              sku: true,
              created_at: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return {
        suppliers,
        total: await prisma.supplier.count({ where })
      };
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },
  ['suppliers-page'],
  {
    revalidate: 60, // מרענן כל דקה
    tags: ['suppliers'] // תג לביטול קשינג בעת עדכון
  }
);

// קומפוננטת טבלה
function SuppliersTable({ suppliers }: { suppliers: SupplierWithProducts[] }) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>קוד</TableHead>
            <TableHead>שם ספק</TableHead>
            <TableHead>איש קשר</TableHead>
            <TableHead>אימייל</TableHead>
            <TableHead>טלפון</TableHead>
            <TableHead>כתובת</TableHead>
            <TableHead>מוצרים</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                לא נמצאו ספקים
              </TableCell>
            </TableRow>
          ) : (
            suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.code}</TableCell>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.contact_name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell className="max-w-[200px] truncate">{supplier.address}</TableCell>
                <TableCell>{supplier.products.length}</TableCell>
                <TableCell>
                  <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                    {supplier.status === "active" ? "פעיל" : "לא פעיל"}
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
                        <Link href={`/dashboard/suppliers/${supplier.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>ערוך</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        <span>ייצא פרטים</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>מחק</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

// דף ראשי
export default async function SuppliersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>
}) {
  const resolvedParams = await searchParams;
  const { suppliers, total } = await getPageData({
    search: resolvedParams.search,
    status: resolvedParams.status
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ניהול ספקים</h1>
          <p className="text-muted-foreground mt-2">סה"כ {total} ספקים במערכת</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/bulk-import">
            <Button variant="outline" className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              ייבוא ספקים
            </Button>
          </Link>
          <Link href="/dashboard/suppliers/add">
            <Button className="flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              הוסף ספק
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="חיפוש לפי שם, קוד, איש קשר..."
            className="pl-9"
            name="search"
            defaultValue={resolvedParams.search}
          />
          {resolvedParams.search && (
            <Link href="/dashboard/suppliers" className="absolute right-3 top-3">
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Link>
          )}
        </div>
        <Select name="status" defaultValue={resolvedParams.status || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="סנן לפי סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">הכל</SelectItem>
            <SelectItem value="active">פעיל</SelectItem>
            <SelectItem value="inactive">לא פעיל</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SuppliersTable suppliers={suppliers} />
      </Suspense>
    </div>
  );
}

