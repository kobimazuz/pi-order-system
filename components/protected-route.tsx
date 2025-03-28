"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "./auth-provider"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    // בדיקה האם אנחנו בתהליך אותנטיקציה
    const checkAuthState = () => {
      const hasAuthCookies = document.cookie.includes('sb-access-token') || 
                            document.cookie.includes('sb-refresh-token')
      const isCallbackRoute = pathname ? pathname.includes('/auth/callback') : false
      
      setIsAuthenticating(hasAuthCookies || isCallbackRoute)
      
      // לוג למעקב
      console.log('Auth State Check:', {
        hasAuthCookies,
        isCallbackRoute,
        pathname,
        cookies: document.cookie
      })
    }

    checkAuthState()
  }, [pathname])

  useEffect(() => {
    if (!isLoading && !user && !isAuthenticating) {
      const timeout = setTimeout(() => {
        // בדיקה נוספת לפני ההפניה
        if (!user && !isAuthenticating && 
            !document.cookie.includes('sb-access-token') && 
            !document.cookie.includes('sb-refresh-token')) {
          // ביטול זמני של ההפניה
          console.log('Would redirect to landing, but disabled for testing')
          // router.push("/landing")
        }
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [user, isLoading, isAuthenticating, router])

  if (isLoading || isAuthenticating) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  // גם כאן נוסיף לוג
  console.log('Protected Route State:', { user, isLoading, isAuthenticating })

  if (!user && !isAuthenticating) {
    return null
  }

  return <>{children}</>
}