import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = document.cookie
            .split(';')
            .find((c) => c.trim().startsWith(name + '='))
          if (!cookie) return null
          const value = cookie.split('=')[1]
          if (!value) return null
          
          // טיפול בקוקיז של Supabase
          if (name.startsWith('sb-')) {
            // אם הערך מתחיל ב-base64-, נחזיר את החלק המקודד בלבד
            if (value.startsWith('base64-')) {
              return value.substring(7) // מסיר את התחילית 'base64-'
            }
            return value
          }
          
          try {
            return decodeURIComponent(value)
          } catch {
            return value
          }
        },
        set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean }) {
          let finalValue = value
          // אם זה קוקי של Supabase והערך לא מתחיל ב-base64-
          if (name.startsWith('sb-') && !value.startsWith('base64-')) {
            finalValue = `base64-${value}`
          } else if (!name.startsWith('sb-')) {
            finalValue = encodeURIComponent(value)
          }
          
          document.cookie = `${name}=${finalValue}${
            options?.path ? `;path=${options.path}` : ''
          }${options?.maxAge ? `;max-age=${options.maxAge}` : ''}${
            options?.domain ? `;domain=${options.domain}` : ''
          }${options?.secure ? ';secure' : ''}`
        },
        remove(name: string, options?: { path?: string }) {
          document.cookie = `${name}=;max-age=0${
            options?.path ? `;path=${options.path}` : ''
          }`
        }
      }
    }
  )
} 