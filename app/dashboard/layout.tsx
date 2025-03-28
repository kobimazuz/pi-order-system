"use client"

import type React from "react"
import Sidebar from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"
import { useIsMobile } from "@/hooks/use-mobile"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = useIsMobile()

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {!isMobile && <Sidebar />}
        <div className="flex-1 flex flex-col">
          {isMobile && (
            <div className="h-14 border-b flex items-center px-4">
              <Sidebar />
              <h1 className="text-xl font-bold text-primary flex-1 text-center">מערכת PI</h1>
            </div>
          )}
          <main className="flex-1 overflow-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

