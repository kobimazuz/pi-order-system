'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function deleteVariable(formData: FormData) {
  const type = formData.get('type') as 'Category' | 'Color' | 'Size' | 'Material'
  const id = formData.get('id') as string

  if (!type || !id) {
    return { success: false, error: "נתונים חסרים" }
  }

  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "לא מחובר" }
  }

  try {
    switch (type) {
      case 'Category':
        // בדוק אם יש תתי קטגוריות
        const hasSubCategories = await prisma.category.findFirst({
          where: {
            parent: id,
            userId: session.user.id
          }
        })

        if (hasSubCategories) {
          return { 
            success: false, 
            error: "לא ניתן למחוק קטגוריה ראשית שיש לה תתי-קטגוריות" 
          }
        }

        // בדוק אם יש מוצרים מקושרים
        const categoryWithProducts = await prisma.category.findFirst({
          where: { 
            id,
            userId: session.user.id
          },
          include: {
            products: true
          }
        })

        if (categoryWithProducts?.products.length) {
          return { 
            success: false, 
            error: "לא ניתן למחוק קטגוריה שיש לה מוצרים מקושרים" 
          }
        }

        await prisma.category.delete({
          where: { id, userId: session.user.id }
        })
        break

      case 'Color':
        const colorWithProducts = await prisma.color.findFirst({
          where: { 
            id,
            userId: session.user.id
          },
          include: {
            products: true
          }
        })

        if (colorWithProducts?.products.length) {
          return { 
            success: false, 
            error: "לא ניתן למחוק צבע שיש לו מוצרים מקושרים" 
          }
        }

        await prisma.color.delete({
          where: { id, userId: session.user.id }
        })
        break

      case 'Size':
        const sizeWithProducts = await prisma.size.findFirst({
          where: { 
            id,
            userId: session.user.id
          },
          include: {
            products: true
          }
        })

        if (sizeWithProducts?.products.length) {
          return { 
            success: false, 
            error: "לא ניתן למחוק מידה שיש לה מוצרים מקושרים" 
          }
        }

        await prisma.size.delete({
          where: { id, userId: session.user.id }
        })
        break

      case 'Material':
        const materialWithProducts = await prisma.material.findFirst({
          where: { 
            id,
            userId: session.user.id
          },
          include: {
            products: true
          }
        })

        if (materialWithProducts?.products.length) {
          return { 
            success: false, 
            error: "לא ניתן למחוק חומר שיש לו מוצרים מקושרים" 
          }
        }

        await prisma.material.delete({
          where: { id, userId: session.user.id }
        })
        break
    }

    revalidatePath("/dashboard/variables")
    return { success: true, message: "נמחק בהצלחה" }
  } catch (error) {
    console.error("[DELETE_VARIABLE]", error)
    return { success: false, error: "שגיאה במחיקת המשתנה" }
  }
} 