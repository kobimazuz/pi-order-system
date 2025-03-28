import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })
    const cookieStore = await cookies()
    
    // רשימת קוקיז של Supabase
    const supabaseCookies = [
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token',
      'sb-provider-token',
      'sb-auth-token',
      'supabase-auth-token-code-verifier'
    ]

    // מחיקת כל הקוקיז המוכרים
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

    // ניסיון לאתר ולמחוק קוקיז נוספים
    const allCookies = cookieStore.getAll()
    allCookies.forEach(cookie => {
      if (cookie.name.startsWith('sb-') || cookie.name.includes('supabase')) {
        response.cookies.set({
          name: cookie.name,
          value: '',
          maxAge: 0,
          path: '/',
          sameSite: 'lax',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production'
        })
      }
    })

    return response
  } catch (error) {
    console.error('שגיאה במחיקת קוקיז:', error)
    return NextResponse.json({ error: 'שגיאה במחיקת קוקיז' }, { status: 500 })
  }
} 