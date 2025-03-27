import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    console.log('Auth callback initiated with code:', code ? 'present' : 'missing')

    if (code) {
      const supabase = await createClient()
      
      const response = NextResponse.redirect(new URL('/dashboard', request.url))

      console.log('Exchanging code for session')
      const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (sessionError) {
        console.error('Auth error details:', sessionError)
        return NextResponse.redirect(new URL('/auth?error=auth_callback_error', request.url))
      }

      if (session) {
        try {
          // בדיקה אם המשתמש קיים
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profileError || !profile) {
            // יצירת פרופיל חדש למשתמש
            const { error: insertError } = await supabase
              .from('profiles')
              .upsert([
                {
                  id: session.user.id,
                  email: session.user.email,
                  full_name: session.user.user_metadata?.full_name || '',
                  avatar_url: session.user.user_metadata?.avatar_url || '',
                  role: 'user',
                  status: 'active',
                  last_login: new Date().toISOString(),
                  created_at: new Date().toISOString()
                }
              ], {
                onConflict: 'id'
              })

            if (insertError) {
              console.error('Error creating profile:', insertError)
              // ממשיכים למרות השגיאה כי המשתמש כבר מחובר
            }
          }
        } catch (error) {
          console.error('Error checking user profile:', error)
          // ממשיכים למרות השגיאה כי המשתמש כבר מחובר
        }
      }

      console.log('Auth successful, redirecting to dashboard')
      return response
    }

    console.log('No code provided in callback')
    return NextResponse.redirect(new URL('/auth?error=no_code', request.url))
  } catch (error) {
    console.error('Callback error details:', error)
    return NextResponse.redirect(new URL('/auth?error=unknown_error', request.url))
  }
} 