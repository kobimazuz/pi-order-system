import { type NextRequest, NextResponse } from "next/server";

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

export async function middleware(request: NextRequest) {
  // מחזיר תמיד next ללא בדיקות אבטחה
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};