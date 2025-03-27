import { createClient } from '@supabase/supabase-js'
import sharp from 'sharp'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class ProductImageService {
  private static readonly BUCKET_NAME = 'products'
  private static readonly MAX_SIZE = 500

  /**
   * מעלה תמונת מוצר לסופרבייס
   * @param userId - מזהה המשתמש
   * @param sku - מק"ט המוצר
   * @param file - קובץ התמונה
   * @returns URL של התמונה
   */
  static async uploadImage(userId: string, sku: string, file: File): Promise<string> {
    try {
      // המרת התמונה לבאפר
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // עיבוד התמונה
      const processedImage = await sharp(buffer)
        .resize(this.MAX_SIZE, this.MAX_SIZE, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer()

      // יצירת שם קובץ
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/${sku}/image.${fileExt}`

      // העלאה לסופרבייס
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(filePath, processedImage, {
          upsert: true,
          contentType: file.type
        })

      if (error) throw error

      // קבלת URL ציבורי
      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading product image:', error)
      throw new Error('Failed to upload product image')
    }
  }

  /**
   * מוחק תמונת מוצר מסופרבייס
   * @param userId - מזהה המשתמש
   * @param sku - מק"ט המוצר
   */
  static async deleteImage(userId: string, sku: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([`${userId}/${sku}/image.*`])

      if (error) throw error
    } catch (error) {
      console.error('Error deleting product image:', error)
      throw new Error('Failed to delete product image')
    }
  }

  /**
   * מחליף תמונת מוצר קיימת
   * @param userId - מזהה המשתמש
   * @param sku - מק"ט המוצר
   * @param file - קובץ התמונה החדש
   * @returns URL של התמונה החדשה
   */
  static async replaceImage(userId: string, sku: string, file: File): Promise<string> {
    await this.deleteImage(userId, sku)
    return await this.uploadImage(userId, sku, file)
  }

  /**
   * מקבל את ה-URL של תמונת מוצר
   * @param userId - מזהה המשתמש
   * @param sku - מק"ט המוצר
   * @returns URL של התמונה אם קיימת
   */
  static async getImageUrl(userId: string, sku: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .list(`${userId}/${sku}`)

      if (error) throw error

      if (!data || data.length === 0) return null

      const imageFile = data.find(file => file.name.startsWith('image.'))
      if (!imageFile) return null

      const { data: { publicUrl } } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(`${userId}/${sku}/${imageFile.name}`)

      return publicUrl
    } catch (error) {
      console.error('Error getting product image URL:', error)
      return null
    }
  }
} 