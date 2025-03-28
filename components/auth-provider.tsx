"use client"

import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"
import { type User } from "@supabase/supabase-js"
import { AuthService } from "@/app/services/auth-service"

const AuthContext = createContext<{
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
}>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        persistSession: true,
        storage: {
          getItem: (key) => {
            if (typeof window === 'undefined') return null
            const value = window.localStorage.getItem(key)
            console.log('Storage getItem:', { key, value: value?.substring(0, 20) + '...' })
            return value
          },
          setItem: (key, value) => {
            if (typeof window === 'undefined') return
            console.log('Storage setItem:', { key, value: value.substring(0, 20) + '...' })
            window.localStorage.setItem(key, value)
          },
          removeItem: (key) => {
            if (typeof window === 'undefined') return
            console.log('Storage removeItem:', key)
            window.localStorage.removeItem(key)
          }
        }
      },
      cookies: {
        get(name: string) {
          if (typeof document === 'undefined') return ''
          
          console.log('Trying to get cookie:', name)
          
          // מחפש את הקוקי הספציפי
          const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${name}=`))
          
          if (!cookie) {
            console.log(`No cookie found: ${name}`)
            return ''
          }
          
          const value = cookie.split('=')[1]
          console.log(`Found cookie ${name}:`, value.substring(0, 20) + '...')
          
          try {
            const decodedValue = decodeURIComponent(value)
            console.log('Decoded cookie value:', decodedValue.substring(0, 20) + '...')
            
            if (name.includes('code-verifier')) {
              // מנקה מרכאות כפולות
              const cleanValue = decodedValue.replace(/^"|"$/g, '')
              console.log('Clean code verifier:', cleanValue)
              
              // מטפל בקידוד base64
              if (cleanValue.startsWith('base64-')) {
                return cleanValue.slice(7)
              }
              return cleanValue
            }
            
            return decodedValue
          } catch (e) {
            console.log(`Error decoding cookie ${name}:`, e)
            return value
          }
        },
        set(name: string, value: string, options: { path?: string; domain?: string; maxAge?: number; secure?: boolean }) {
          if (typeof document === 'undefined') return
          console.log('Setting cookie:', { name, value: value.substring(0, 20) + '...', options })
          
          let cookieValue = value
          if (name.includes('code-verifier') && !value.startsWith('base64-')) {
            cookieValue = `base64-${value}`
          }
          
          const cookieString = `${name}=${encodeURIComponent(cookieValue)}; path=${options.path || '/'}${
            options.domain ? `; domain=${options.domain}` : ''
          }${options.maxAge ? `; max-age=${options.maxAge}` : ''}${
            options.secure ? '; secure' : ''
          }; SameSite=Lax`
          
          console.log('Setting cookie string:', cookieString)
          document.cookie = cookieString
        },
        remove(name: string, options: { path?: string; domain?: string }) {
          if (typeof document === 'undefined') return
          console.log('Removing cookie:', name)
          document.cookie = `${name}=; path=${options.path || '/'}${
            options.domain ? `; domain=${options.domain}` : ''
          }; max-age=0; SameSite=Lax`
        }
      }
    }
  )

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth state...')
        // מבטל זמנית את בדיקת הסשן
        setUser({ id: 'temp-user' } as any) // משתמש זמני לצורך בדיקה
        setIsLoading(false)
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user)
      
      // מבטל זמנית את כל הבדיקות
      setUser({ id: 'temp-user' } as any) // משתמש זמני לצורך בדיקה
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      })
      if (error) throw error
    } catch (error) {
      console.error("Google login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await AuthService.signOut()
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}