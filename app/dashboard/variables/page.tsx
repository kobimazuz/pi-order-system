import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Plus } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Category, Color, Material, Size } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { VariableForm } from "@/components/variable-form"
import { redirect } from "next/navigation"
import { CategoriesTable } from "@/components/categories-table"
import { ColorsTable } from "@/components/colors-table"
import { SizesTable } from "@/components/sizes-table"
import { MaterialsTable } from "@/components/materials-table"
import { deleteVariable } from "@/app/dashboard/variables/actions"

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

// פונקציה ליצירת מק"ט אוטומטי
async function generateNextCode(
  type: 'category' | 'color' | 'size' | 'material',
  userId: string,
  isSubCategory: boolean = false,
  parentCategoryCode?: string
) {
  const prefixMap = {
    category: isSubCategory ? (parentCategoryCode || 'SCAT') : 'CAT',
    color: 'COL',
    size: 'SIZ',
    material: 'MAT'
  }

  const prefix = prefixMap[type]

  // מצא את הקוד האחרון בסוג הנתון
  let lastItem = null
  switch (type) {
    case 'category':
      if (isSubCategory && parentCategoryCode) {
        // חפש את תת הקטגוריה האחרונה תחת הקטגוריה הראשית
        const parentCategory = await prisma.category.findFirst({
          where: { 
            userId,
            code: parentCategoryCode
          }
        })

        if (parentCategory) {
          lastItem = await prisma.category.findFirst({
            where: { 
              userId,
              parent: parentCategory.id,
              code: { startsWith: `${parentCategoryCode}-` }
            },
            orderBy: { code: 'desc' }
          })
        }
      } else {
        lastItem = await prisma.category.findFirst({
          where: { 
            userId,
            code: { startsWith: prefix },
            parent: null // רק קטגוריות ראשיות
          },
          orderBy: { code: 'desc' }
        })
      }
      break
    case 'color':
      lastItem = await prisma.color.findFirst({
        where: { userId },
        orderBy: { code: 'desc' }
      })
      break
    case 'size':
      lastItem = await prisma.size.findFirst({
        where: { userId },
        orderBy: { code: 'desc' }
      })
      break
    case 'material':
      lastItem = await prisma.material.findFirst({
        where: { userId },
        orderBy: { code: 'desc' }
      })
      break
  }

  if (!lastItem) {
    return isSubCategory && parentCategoryCode 
      ? `${parentCategoryCode}-001`
      : `${prefix}001`
  }

  // חלץ את המספר מהקוד האחרון
  const lastCode = lastItem.code
  const lastNumber = parseInt(lastCode.split('-').pop()?.slice(-3) || lastCode.slice(-3))
  
  // הגדל את המספר ב-1 והוסף אפסים מובילים
  const nextNumber = (lastNumber + 1).toString().padStart(3, '0')
  
  return isSubCategory && parentCategoryCode
    ? `${parentCategoryCode}-${nextNumber}`
    : `${prefix}${nextNumber}`
}

// פונקציה ליצירת משתנה חדש
async function createVariable(formData: any, type: 'category' | 'color' | 'size' | 'material') {
  "use server"

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "לא מחובר" }
  }

  const userId = session.user.id

  try {
    let parentCategory = null
    if (type === 'category' && formData.parent) {
      parentCategory = await prisma.category.findFirst({
        where: { id: formData.parent, userId }
      })
    }

    const code = await generateNextCode(
      type,
      userId,
      type === 'category' && formData.parent !== null,
      parentCategory?.code
    )
    
    switch (type) {
      case 'category':
        await prisma.category.create({
          data: {
            userId,
            code,
            name: formData.name,
            description: formData.description,
            parent: formData.parent,
            status: formData.status ? 'active' : 'inactive'
          }
        })
        break
      case 'color':
        await prisma.color.create({
          data: {
            userId,
            code,
            name: formData.name,
            hex_code: formData.hex_code,
            status: formData.status ? 'active' : 'inactive'
          }
        })
        break
      case 'size':
        await prisma.size.create({
          data: {
            userId,
            code,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            status: formData.status ? 'active' : 'inactive'
          }
        })
        break
      case 'material':
        await prisma.material.create({
          data: {
            userId,
            code,
            name: formData.name,
            description: formData.description,
            status: formData.status ? 'active' : 'inactive'
          }
        })
        break
    }

    revalidatePath("/dashboard/variables")
    return { success: true }
  } catch (error) {
    console.error("[CREATE_VARIABLE]", error)
    return { success: false, error: "שגיאה ביצירת המשתנה" }
  }
}

async function getData() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const userId = session.user.id

  const [categories, colors, sizes, materials] = await Promise.all([
    prisma.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.color.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.size.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.material.findMany({
      where: {
        userId,
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  ])

  // מצא את הקטגוריה הראשית האחרונה
  const lastMainCategory = await prisma.category.findFirst({
    where: {
      userId,
      parent: null
    },
    orderBy: {
      code: 'desc'
    }
  })

  const [nextCategoryCode, nextColorCode, nextSizeCode, nextMaterialCode] = await Promise.all([
    generateNextCode('category', userId, false),
    generateNextCode('color', userId),
    generateNextCode('size', userId),
    generateNextCode('material', userId)
  ])

  return {
    categories,
    colors,
    sizes,
    materials,
    nextCategoryCode,
    nextSubCategoryCode: lastMainCategory ? `${lastMainCategory.code}-001` : 'CAT001-001',
    nextColorCode,
    nextSizeCode,
    nextMaterialCode
  }
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
  const data = await getData()

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">משתנים</h2>
          <p className="text-muted-foreground">
            נהל את המשתנים במערכת
          </p>
        </div>
      </div>
      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">קטגוריות</TabsTrigger>
          <TabsTrigger value="colors">צבעים</TabsTrigger>
          <TabsTrigger value="sizes">מידות</TabsTrigger>
          <TabsTrigger value="materials">חומרים</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex gap-4">
              <VariableForm
                type="category"
                items={data.categories}
                defaultCode={data.nextCategoryCode}
                isMainCategory={true}
                onSubmit={async (formData) => {
                  'use server'
                  return createVariable(formData, 'category')
                }}
              >
                <Button>הוסף קטגוריה ראשית</Button>
              </VariableForm>
              <VariableForm
                type="category"
                items={data.categories}
                defaultCode={data.nextSubCategoryCode}
                onSubmit={async (formData) => {
                  'use server'
                  return createVariable(formData, 'category')
                }}
              >
                <Button variant="outline">הוסף תת קטגוריה</Button>
              </VariableForm>
            </div>
          </div>
          <CategoriesTable items={data.categories} />
        </TabsContent>
        <TabsContent value="colors" className="space-y-4">
          <div className="flex justify-between">
            <VariableForm
              type="color"
              defaultCode={data.nextColorCode}
              onSubmit={async (formData) => {
                'use server'
                return createVariable(formData, 'color')
              }}
            >
              <Button>הוסף צבע</Button>
            </VariableForm>
          </div>
          <ColorsTable items={data.colors} />
        </TabsContent>
        <TabsContent value="sizes" className="space-y-4">
          <div className="flex justify-between">
            <VariableForm
              type="size"
              defaultCode={data.nextSizeCode}
              onSubmit={async (formData) => {
                'use server'
                return createVariable(formData, 'size')
              }}
            >
              <Button>הוסף מידה</Button>
            </VariableForm>
          </div>
          <SizesTable items={data.sizes} />
        </TabsContent>
        <TabsContent value="materials" className="space-y-4">
          <div className="flex justify-between">
            <VariableForm
              type="material"
              defaultCode={data.nextMaterialCode}
              onSubmit={async (formData) => {
                'use server'
                return createVariable(formData, 'material')
              }}
            >
              <Button>הוסף חומר</Button>
            </VariableForm>
          </div>
          <MaterialsTable items={data.materials} />
        </TabsContent>
      </Tabs>
    </div>
  )
}


