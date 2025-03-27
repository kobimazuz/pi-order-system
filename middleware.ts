import { clerkMiddleware } from '@clerk/nextjs/server'

// Using Clerk middleware for authentication
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internal paths and static assets
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}