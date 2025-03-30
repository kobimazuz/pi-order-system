import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { languages, fallbackLng } from '@/app/i18n/settings'

// רשימת נתיבים מוגנים - מושבתת זמנית
const PROTECTED_ROUTES: string[] = [];

// כל הנתיבים פתוחים זמנית
const PUBLIC_ROUTES = [
  '/',
  '/landing',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/auth/reset-password',
  '/auth/new-password',
  '/dashboard',
  '/invitation',
  '/profile',
  '/settings',
  '/attributes',
  '/excel-export',
  '/(protected)'
];

const isProtectedRoute = (path: string) => {
  return false; // מבטל זמנית את בדיקת הנתיבים המוגנים
};

const isPublicRoute = (path: string) => {
  return true; // כל הנתיבים פתוחים זמנית
};

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const locales = languages
  const negotiatorLanguages = new Negotiator({ headers: negotiatorHeaders }).languages()

  return matchLocale(negotiatorLanguages, locales, fallbackLng)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = languages.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};