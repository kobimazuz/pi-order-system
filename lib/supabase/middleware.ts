import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// נתיבים שדורשים אימות
const PROTECTED_ROUTES = [
  '/dashboard',
  '/invitation',
  '/profile',
  '/settings',
  '/attributes',
  '/excel-export',
  '/(protected)'
];

// נתיבים פתוחים לכולם
const PUBLIC_ROUTES = [
  '/',
  '/landing',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/reset-password',
  '/auth/new-password'
];

// בדיקה האם הנתיב הנוכחי הוא נתיב מוגן
const isProtectedRoute = (path: string) => {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

// בדיקה האם הנתיב הנוכחי הוא נתיב ציבורי
const isPublicRoute = (path: string) => {
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
};

function forceLoginWithReturn(request: NextRequest) {
  const originalUrl = new URL(request.url);
  const path = originalUrl.pathname;
  const query = originalUrl.searchParams.toString();
  return NextResponse.redirect(new URL(`/auth/login?returnUrl=${encodeURIComponent(path + (query ? `?${query}` : ''))}`, request.url));
}

export const validateSession = async (request: NextRequest) => {
  try {
    // בדיקת הנתיב הנוכחי
    const path = request.nextUrl.pathname;
    
    // אם זה נתיב ציבורי, אפשר להמשיך בלי בדיקות
    if (isPublicRoute(path)) {
      return NextResponse.next();
    }

    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value,
              ...options,
              sameSite: 'lax',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
            });
          },
          remove(name: string, options: CookieOptions) {
            response.cookies.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
              sameSite: 'lax',
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
            });
          },
        },
      }
    );

    // בדיקת המשתמש רק אם זה נתיב מוגן
    if (isProtectedRoute(path)) {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return forceLoginWithReturn(request);
      }
    }

    return response;
  } catch (e) {
    console.error('Supabase client error:', e);
    // במקרה של שגיאה בנתיב מוגן, נעביר למסך התחברות
    if (isProtectedRoute(request.nextUrl.pathname)) {
      return forceLoginWithReturn(request);
    }
    return NextResponse.next();
  }
}; 