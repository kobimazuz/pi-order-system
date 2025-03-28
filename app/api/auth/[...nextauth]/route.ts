import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    try {
      const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin)) // שינוי ל-/dashboard
      
      const cookieStore = await cookies()
      
      const supabaseCookies = ['sb-access-token', 'sb-refresh-token', 'supabase-auth-token', 
        'sb-provider-token', 'sb-auth-token', 'supabase-auth-token-code-verifier']
      
      supabaseCookies.forEach(name => {
        response.cookies.set({
          name,
          value: '',
          maxAge: 0,
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
      })

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            flowType: 'pkce',
            autoRefreshToken: true,
            detectSessionInUrl: true,
            persistSession: true,
          },
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: any) {
              try {
                response.cookies.set({
                  name,
                  value,
                  ...options,
                  path: '/',
                  sameSite: 'lax',
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production'
                })
              } catch (error) {
                console.error('שגיאה בהגדרת קוקי:', error)
              }
            },
            remove(name: string, options: any) {
              try {
                response.cookies.set({
                  name,
                  value: '',
                  ...options,
                  path: '/',
                  maxAge: 0,
                  sameSite: 'lax',
                  httpOnly: true,
                  secure: process.env.NODE_ENV === 'production'
                })
              } catch (error) {
                console.error('שגיאה במחיקת קוקי:', error)
              }
            },
          },
        }
      )

      console.log('מנסה להחליף קוד לסשן ב-[...nextauth] עם הקוד:', code)
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        throw error
      }
      
      console.log('סשן נוצר בהצלחה ב-[...nextauth]')
      return response
    } catch (sessionError: any) {
      console.error('שגיאה בהחלפת קוד אימות לסשן ב-[...nextauth]:', sessionError)
      
      if (sessionError.message?.includes('code challenge') || 
          sessionError.code === 'bad_code_verifier') {
        console.log('מתבצעת הפניה להתחברות מחדש בגלל בעיית code challenge')
        return NextResponse.redirect(new URL('/auth/login?refresh=true', requestUrl.origin))
      }
      
      return NextResponse.redirect(new URL(`/auth/login?error=${encodeURIComponent(sessionError.message || 'session_error')}`, requestUrl.origin))
    }
  }

  return NextResponse.redirect(new URL('/dashboard', requestUrl.origin)) // שינוי ל-/dashboard
}

export async function POST(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  
  try {
    const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin), { // שינוי ל-/dashboard
      status: 301,
    })
    
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'pkce',
          autoRefreshToken: true,
          detectSessionInUrl: true,
          persistSession: true,
        },
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              response.cookies.set({
                name,
                value,
                ...options,
                path: '/',
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
              })
            } catch (error) {
              console.error('שגיאה בהגדרת קוקי:', error)
            }
          },
          remove(name: string, options: any) {
            try {
              response.cookies.set({
                name,
                value: '',
                ...options,
                path: '/',
                maxAge: 0,
                sameSite: 'lax',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
              })
            } catch (error) {
              console.error('שגיאה במחיקת קוקי:', error)
            }
          },
        },
      }
    )

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return new NextResponse(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return response
  } catch (error) {
    console.error('שגיאה בהתחברות:', error)
    return new NextResponse(JSON.stringify({ error: 'שגיאה כללית בהתחברות' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}