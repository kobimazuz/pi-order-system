import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Rubik } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import { registerLicense } from '@syncfusion/ej2-base'

// רישום רישיון Syncfusion פעם אחת באפליקציה
registerLicense('GTBMmhhan1/fWBgaGRifGJhfGpqampzYWBpZmppZmpoODwxOn0+MikmKRM0PjI6P30wPD4=')

const inter = Inter({ subsets: ["latin"] })
const rubik = Rubik({ subsets: ['hebrew', 'latin'] })

export const metadata: Metadata = {
  title: "מערכת ניהול הזמנות PI",
  description: "מערכת ליצירת הזמנות PI ויצוא לאקסל",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <Toaster position="top-center" dir="rtl" />
      </body>
    </html>
  )
}

import './globals.css'