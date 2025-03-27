import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, MoreHorizontal, Trash2, Upload, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Category, Color, Material, Size } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { VariableForm } from "@/components/variable-form"
import { redirect } from "next/navigation"

interface CategoryWithRelations extends Category {
  products: { id: string }[]
  children: Category[]
}

interface ColorWithRelations extends Color {
  products: { id: string }[]
}

interface SizeWithRelations extends Size {
  products: { id: string }[]
}

interface MaterialWithRelations extends Material {
  products: { id: string }[]
}

async function getData() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/sign-in")
  }

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    include: {
      products: {
        select: { id: true }
      },
      children: true
    },
    orderBy: [
      { parent: 'asc' },
      { name: 'asc' }
    ]
  })

  const colors = await prisma.color.findMany({
    where: { userId: session.user.id },
    include: {
      products: {
        select: { id: true }
      }
    }
  })

  const sizes = await prisma.size.findMany({
    where: { userId: session.user.id },
    include: {
      products: {
        select: { id: true }
      }
    }
  })

  const materials = await prisma.material.findMany({
    where: { userId: session.user.id },
    include: {
      products: {
        select: { id: true }
      }
    }
  })

  return { categories, colors, sizes, materials }
}

async function deleteVariable(type: 'Category' | 'Color' | 'Size' | 'Material', id: string) {
  "use server"

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "לא מחובר" }
  }

  try {
    switch (type) {
      case 'Category':
        await prisma.category.delete({
          where: { id, userId: session.user.id }
        });
        break;
      case 'Color':
        await prisma.color.delete({
          where: { id, userId: session.user.id }
        });
        break;
      case 'Size':
        await prisma.size.delete({
          where: { id, userId: session.user.id }
        });
        break;
      case 'Material':
        await prisma.material.delete({
          where: { id, userId: session.user.id }
        });
        break;
      default:
        throw new Error("סוג משתנה לא חוקי");
    }

    revalidatePath("/dashboard/categories")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_VARIABLE]", error)
    return { success: false, error: "שגיאה במחיקת המשתנה" }
  }
}

function CategoriesTable({ categories }: { categories: CategoryWithRelations[] }) {
  const sortedCategories = [...categories].sort((a, b) => {
    if (!a.parent && b.parent) return -1
    if (a.parent && !b.parent) return 1
    return 0
  })

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <VariableForm type="category" items={categories}>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            הוסף קטגוריה ראשית
          </Button>
        </VariableForm>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>קוד</TableHead>
              <TableHead>שם</TableHead>
              <TableHead>תיאור</TableHead>
              <TableHead>סוג</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>מוצרים</TableHead>
              <TableHead className="w-[150px]">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.code}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {category.parent && (
                      <div className="text-muted-foreground text-sm">└─</div>
                    )}
                    {category.name}
                  </div>
                </TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
                  {category.parent ? (
                    <Badge variant="outline">
                      קטגוריית משנה של {categories.find((c) => c.id === category.parent)?.name}
                    </Badge>
                  ) : (
                    <Badge>קטגוריה ראשית</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={category.status === "active" ? "default" : "secondary"}>
                    {category.status === "active" ? "פעיל" : "לא פעיל"}
                  </Badge>
                </TableCell>
                <TableCell>{category.products.length}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {!category.parent && (
                      <VariableForm 
                        type="category" 
                        items={categories.filter(c => c.id !== category.id)}
                      >
                        <Button variant="outline" size="sm">
                          <Plus className="mr-2 h-3 w-3" />
                          הוסף תת-קטגוריה
                        </Button>
                      </VariableForm>
                    )}
                    <VariableForm 
                      type="category" 
                      item={category} 
                      items={categories.filter(c => c.id !== category.id)}
                    >
                      <Button variant="ghost" size="sm">
                        ערוך
                      </Button>
                    </VariableForm>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (category.products.length > 0) {
                          alert("לא ניתן למחוק קטגוריה שיש לה מוצרים")
                          return
                        }
                        if (category.children.length > 0) {
                          alert("לא ניתן למחוק קטגוריה שיש לה קטגוריות משנה")
                          return
                        }
                        if (confirm("האם אתה בטוח שברצונך למחוק את הקטגוריה?")) {
                          const result = await deleteVariable('Category', category.id)
                          if (!result.success) {
                            alert(result.error)
                          }
                        }
                      }}
                    >
                      מחק
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ColorsTable({ colors }: { colors: ColorWithRelations[] }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>קוד</TableHead>
            <TableHead>שם</TableHead>
            <TableHead>קוד צבע</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>מוצרים</TableHead>
            <TableHead className="w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {colors.map((color) => (
            <TableRow key={color.id}>
              <TableCell>{color.code}</TableCell>
              <TableCell className="font-medium">{color.name}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color.hex_code }}
                  />
                  {color.hex_code}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={color.status === "active" ? "default" : "secondary"}>
                  {color.status === "active" ? "פעיל" : "לא פעיל"}
                </Badge>
              </TableCell>
              <TableCell>{color.products.length}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <VariableForm type="color" item={color} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (color.products.length > 0) {
                        alert("לא ניתן למחוק צבע שיש לו מוצרים")
                        return
                      }
                      if (confirm("האם אתה בטוח שברצונך למחוק את הצבע?")) {
                        const result = await deleteVariable('Color', color.id)
                        if (!result.success) {
                          alert(result.error)
                        }
                      }
                    }}
                  >
                    מחק
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function SizesTable({ sizes }: { sizes: SizeWithRelations[] }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>קוד</TableHead>
            <TableHead>שם</TableHead>
            <TableHead>תיאור</TableHead>
            <TableHead>קטגוריה</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>מוצרים</TableHead>
            <TableHead className="w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sizes.map((size) => (
            <TableRow key={size.id}>
              <TableCell>{size.code}</TableCell>
              <TableCell className="font-medium">{size.name}</TableCell>
              <TableCell>{size.description}</TableCell>
              <TableCell>{size.category || "-"}</TableCell>
              <TableCell>
                <Badge variant={size.status === "active" ? "default" : "secondary"}>
                  {size.status === "active" ? "פעיל" : "לא פעיל"}
                </Badge>
              </TableCell>
              <TableCell>{size.products.length}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <VariableForm type="size" item={size} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (size.products.length > 0) {
                        alert("לא ניתן למחוק מידה שיש לה מוצרים")
                        return
                      }
                      if (confirm("האם אתה בטוח שברצונך למחוק את המידה?")) {
                        const result = await deleteVariable('Size', size.id)
                        if (!result.success) {
                          alert(result.error)
                        }
                      }
                    }}
                  >
                    מחק
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function MaterialsTable({ materials }: { materials: MaterialWithRelations[] }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>קוד</TableHead>
            <TableHead>שם</TableHead>
            <TableHead>תיאור</TableHead>
            <TableHead>סטטוס</TableHead>
            <TableHead>מוצרים</TableHead>
            <TableHead className="w-[100px]">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.code}</TableCell>
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell>{material.description}</TableCell>
              <TableCell>
                <Badge variant={material.status === "active" ? "default" : "secondary"}>
                  {material.status === "active" ? "פעיל" : "לא פעיל"}
                </Badge>
              </TableCell>
              <TableCell>{material.products.length}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <VariableForm type="material" item={material} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={async () => {
                      if (material.products.length > 0) {
                        alert("לא ניתן למחוק חומר שיש לו מוצרים")
                        return
                      }
                      if (confirm("האם אתה בטוח שברצונך למחוק את החומר?")) {
                        const result = await deleteVariable('Material', material.id)
                        if (!result.success) {
                          alert(result.error)
                        }
                      }
                    }}
                  >
                    מחק
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function VariablesTableSkeleton() {
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

export default async function VariablesPage() {
  const { categories, colors, sizes, materials } = await getData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ניהול משתני מערכת</h1>
        <div className="flex gap-2">
          <Link href="/dashboard/bulk-import">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              ייבוא נתונים
            </Button>
          </Link>
          <VariableForm />
        </div>
      </div>

      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="category">קטגוריות</TabsTrigger>
          <TabsTrigger value="color">צבעים</TabsTrigger>
          <TabsTrigger value="size">מידות</TabsTrigger>
          <TabsTrigger value="material">חומרים</TabsTrigger>
        </TabsList>

        <TabsContent value="category">
          <Suspense fallback={<VariablesTableSkeleton />}>
            <CategoriesTable categories={categories} />
          </Suspense>
        </TabsContent>

        <TabsContent value="color">
          <Suspense fallback={<VariablesTableSkeleton />}>
            <ColorsTable colors={colors} />
          </Suspense>
        </TabsContent>

        <TabsContent value="size">
          <Suspense fallback={<VariablesTableSkeleton />}>
            <SizesTable sizes={sizes} />
          </Suspense>
        </TabsContent>

        <TabsContent value="material">
          <Suspense fallback={<VariablesTableSkeleton />}>
            <MaterialsTable materials={materials} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}


