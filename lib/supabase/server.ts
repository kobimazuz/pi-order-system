import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const createClient = async (response?: NextResponse) => {
  const cookieStore = await cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: false,
        persistSession: true,
      },
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value
          if (!value) return undefined
          try {
            const parsed = JSON.parse(decodeURIComponent(value))
            if (typeof parsed === 'string' && parsed.startsWith('base64-')) {
              return atob(parsed.replace('base64-', ''))
            }
            return parsed
          } catch {
            return value
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            if (response) {
              response.cookies.set({
                name,
                value,
                ...options,
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
              })
            } else {
              cookieStore.set({
                name,
                value,
                ...options,
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
              })
            }
          } catch (error) {
            console.error('שגיאה בהגדרת קוקי:', error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            if (response) {
              response.cookies.set({
                name,
                value: '',
                ...options,
                maxAge: 0,
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
              })
            } else {
              cookieStore.set({
                name,
                value: '',
                ...options,
                maxAge: 0,
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
              })
            }
          } catch (error) {
            console.error('שגיאה במחיקת קוקי:', error)
          }
        },
      },
    }
  )
}