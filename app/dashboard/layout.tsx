import type React from "react"
import Sidebar from "@/components/sidebar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </ProtectedRoute>
  )
}

