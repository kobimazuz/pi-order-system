"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  FileSpreadsheet,
  BarChart3,
  Users,
  HelpCircle,
  Settings,
  Truck,
  Upload,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { User } from "@/types"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user || pathname === "/landing" || pathname === "/auth") {
    return null
  }

  const menuItems = [
    { name: "דשבורד", href: "/dashboard", icon: LayoutDashboard },
    { name: "מוצרים", href: "/dashboard/products", icon: Package },
    { name: "הזמנות", href: "/dashboard/orders", icon: ClipboardList },
    { name: "יצירת PI", href: "/dashboard/create-pi", icon: FileSpreadsheet },
    { name: "ספקים", href: "/dashboard/suppliers", icon: Truck },
    { name: "ייבוא בבולק", href: "/dashboard/bulk-import", icon: Upload },
    { name: "דוחות", href: "/dashboard/reports", icon: BarChart3 },
    { name: "ניהול משתמשים", href: "/dashboard/users", icon: Users },
    { name: "תמיכה", href: "/dashboard/support", icon: HelpCircle },
    { name: "הגדרות", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">מערכת PI</h1>
        <ThemeToggle />
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.user_metadata?.name?.substring(0, 2) || "PI"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.user_metadata?.name || "משתמש"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const isActive = item.href === "/dashboard" 
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href) ?? false
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button variant="ghost" className="w-full justify-start text-gray-700 hover:bg-gray-100" onClick={logout}>
          <LogOut className="h-5 w-5 ml-2" />
          התנתק
        </Button>
      </div>
    </div>
  )
}

