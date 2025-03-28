import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { AuthError } from '@supabase/supabase-js'

function clearSupabaseCookies(response: NextResponse) {
  const supabaseCookies = [
    'sb-access-token',
    'sb-refresh-token',
    'supabase-auth-token',
    'sb-provider-token',
    'sb-auth-token',
    'supabase-auth-token-code-verifier'
  ]
  
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
  
  response.headers.append('Set-Cookie', 'clear_storage=true; path=/; max-age=5')
}

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  if (!code) {
    console.error('קוד אימות חסר בכתובת הקולבק')
    return NextResponse.redirect(new URL('/auth/login?error=missing_code', requestUrl.origin))
  }

  try {
    const response = NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
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
    
    try {
      console.log('Cookies:', cookieStore.getAll());
      const verifier = cookieStore.get('sb-yyrlrztrunxatigbvcfj-auth-token-code-verifier')?.value;
      console.log('Raw code verifier from cookie:', verifier);
      let finalVerifier = verifier;
      if (verifier) {
        const cleanValue = verifier.replace(/^"|"$/g, '');
        console.log('Clean code verifier:', cleanValue);
        
        if (cleanValue.startsWith('base64-base64-')) {
          finalVerifier = cleanValue.replace('base64-base64-', '');
        } else if (cleanValue.startsWith('base64-')) {
          finalVerifier = cleanValue.slice(7);
        } else {
          finalVerifier = cleanValue;
        }
      }
      console.log('Final code verifier sent to Supabase:', finalVerifier);
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('שגיאה בהחלפת קוד:', error)
        console.log('מפנה להתחברות מחדש עם ניקוי מלא')
        const cleanResponse = NextResponse.redirect(new URL('/auth/login?refresh=true', requestUrl.origin))
        clearSupabaseCookies(cleanResponse)
        return cleanResponse
      }

      console.log('סשן נוצר בהצלחה')
      return response
    } catch (error) {
      const sessionError = error as AuthError | Error
      console.error('שגיאה בהחלפת קוד אימות לסשן:', sessionError)
      return NextResponse.redirect(new URL('/auth/login?refresh=true&error=' + 
        encodeURIComponent(sessionError.message || 'session_error'), requestUrl.origin))
    }
  } catch (error) {
    console.error('שגיאה כללית בתהליך הקולבק:', error)
    return NextResponse.redirect(new URL('/auth/login?error=general_error', requestUrl.origin))
  }
}