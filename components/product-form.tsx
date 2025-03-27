"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Category, Supplier } from "@prisma/client"

export function ProductForm({ 
  onSubmit, 
  initialData = null,
  userId,
  categories,
  suppliers,
  uploadImage,
  deleteImage
}: { 
  onSubmit: (data: FormData) => Promise<void>,
  initialData?: any,
  userId: string,
  categories: Category[],
  suppliers: Supplier[],
  uploadImage: (formData: FormData) => Promise<{ success: boolean, imageUrl?: string, error?: string }>,
  deleteImage: (sku: string) => Promise<{ success: boolean, error?: string }>
}) {
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null)
  const [isUploading, setIsUploading] = useState(false)

  // מיון הקטגוריות - קטגוריות ראשיות קודם
  const sortedCategories = [...categories].sort((a, b) => {
    if (!a.parent && b.parent) return -1
    if (a.parent && !b.parent) return 1
    return 0
  })

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const skuInput = document.getElementById('sku') as HTMLInputElement
      const sku = initialData?.sku || skuInput?.value
      if (!sku) {
        alert('נא להזין מק"ט לפני העלאת תמונה')
        return
      }

      // יצירת FormData לשליחה לשרת
      const formData = new FormData()
      formData.append('file', file)
      formData.append('sku', sku)

      // שימוש בפעולת השרת
      const result = await uploadImage(formData)

      if (!result.success) {
        throw new Error(result.error || 'שגיאה בהעלאת התמונה')
      }

      setImagePreview(result.imageUrl || null)
      
      // עדכון שדה נסתר עם ה-URL של התמונה
      const imageUrlInput = document.getElementById('image_url') as HTMLInputElement
      if (imageUrlInput && result.imageUrl) {
        imageUrlInput.value = result.imageUrl
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('שגיאה בהעלאת התמונה')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = async () => {
    if (!initialData?.sku) return
    
    try {
      // שימוש בפעולת השרת
      const result = await deleteImage(initialData.sku)

      if (!result.success) {
        throw new Error(result.error || 'שגיאה במחיקת התמונה')
      }

      setImagePreview(null)
      
      // ניקוי שדה ה-URL
      const imageUrlInput = document.getElementById('image_url') as HTMLInputElement
      if (imageUrlInput) {
        imageUrlInput.value = ''
      }
    } catch (error) {
      console.error('Error removing image:', error)
      alert('שגיאה במחיקת התמונה')
    }
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const formData = new FormData(e.currentTarget)
      onSubmit(formData)
    }}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="sku">מק"ט</Label>
          <Input
            id="sku"
            name="sku"
            defaultValue={initialData?.sku}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="name">שם מוצר</Label>
          <Input
            id="name"
            name="name"
            defaultValue={initialData?.name}
            required
          />
        </div>

        <div>
          <Label htmlFor="category_id">קטגוריה</Label>
          <Select name="category_id" defaultValue={initialData?.categoryId} required>
            <SelectTrigger>
              <SelectValue placeholder="בחר קטגוריה" />
            </SelectTrigger>
            <SelectContent>
              {sortedCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.parent ? `└─ ${category.name}` : category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="supplier_id">ספק</Label>
          <Select name="supplier_id" defaultValue={initialData?.supplierId} required>
            <SelectTrigger>
              <SelectValue placeholder="בחר ספק" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="image">תמונת מוצר</Label>
          <div className="mt-2 space-y-2">
            {imagePreview && (
              <div className="relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="תמונת מוצר"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                >
                  ✕
                </button>
              </div>
            )}
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
            />
            <Input
              id="image_url"
              name="image_url"
              type="hidden"
              defaultValue={initialData?.image_url}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="units_per_pack">יחידות באריזה</Label>
          <Input
            id="units_per_pack"
            name="units_per_pack"
            type="number"
            min="1"
            defaultValue={initialData?.units_per_pack || 1}
            required
          />
        </div>

        <div>
          <Label htmlFor="units_per_carton">יחידות בקרטון</Label>
          <Input
            id="units_per_carton"
            name="units_per_carton"
            type="number"
            min="1"
            defaultValue={initialData?.units_per_carton || 1}
            required
          />
        </div>

        <div>
          <Label htmlFor="price_per_unit">מחיר ליחידה</Label>
          <Input
            id="price_per_unit"
            name="price_per_unit"
            type="number"
            min="0"
            step="0.01"
            defaultValue={initialData?.price_per_unit || 0}
            required
          />
        </div>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'מעלה תמונה...' : (initialData ? 'עדכן מוצר' : 'צור מוצר')}
        </Button>
      </div>
    </form>
  )
} 