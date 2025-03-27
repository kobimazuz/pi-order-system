import { createBrowserClient } from "@supabase/ssr";

let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (typeof window === 'undefined') return null
  
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            if (typeof document === 'undefined') return ''
            const cookie = document.cookie
              .split('; ')
              .find((row) => row.startsWith(`${name}=`))
            if (!cookie) return ''
            const value = cookie.split('=')[1]
            if (!value) return ''
            try {
              return JSON.parse(decodeURIComponent(value))
            } catch {
              return value
            }
          },
          set(name: string, value: string, options: { path?: string; domain?: string; maxAge?: number; secure?: boolean }) {
            if (typeof document === 'undefined') return
            let cookieValue = value
            try {
              cookieValue = JSON.stringify(value)
            } catch {
              // If value is already a string, use it as is
            }
            document.cookie = `${name}=${encodeURIComponent(cookieValue)}; path=${options.path || '/'}${options.domain ? `; domain=${options.domain}` : ''}${options.maxAge ? `; max-age=${options.maxAge}` : ''}${options.secure ? '; secure' : ''}`
          },
          remove(name: string, options: { path?: string; domain?: string }) {
            if (typeof document === 'undefined') return
            document.cookie = `${name}=; path=${options.path || '/'}${options.domain ? `; domain=${options.domain}` : ''}; max-age=0`
          }
        }
      }
    )
  }

  return supabaseInstance
} 