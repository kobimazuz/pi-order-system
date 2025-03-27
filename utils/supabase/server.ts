import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// פונקציה אסינכרונית ליצירת client באופן תקין עם cookies() אסינכרוני
export async function createClient() {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options)
          } catch (error) {
            // ייתכן שאנחנו בסביבה ללא כתיבה לקוקיז
          }
        },
        remove(name, options) {
          try {
            cookieStore.delete(name)
          } catch (error) {
            // ייתכן שאנחנו בסביבה ללא מחיקת קוקיז
          }
        },
      },
    }
  )
} 