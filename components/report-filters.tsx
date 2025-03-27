"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"

export function ReportFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isGenerating, setIsGenerating] = useState(false)

  function createQueryString(name: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString() || "")
    params.set(name, value)
    return params.toString()
  }

  const type = searchParams?.get("type") || "sales"
  const period = searchParams?.get("period") || "month"

  const handleGenerateReport = () => {
    setIsGenerating(true)
    // עדכון הפרמטרים ב-URL
    router.push(`?${createQueryString("generated", "true")}`)
    setIsGenerating(false)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Select
          defaultValue={type}
          onValueChange={(value) => {
            router.push(`?${createQueryString("type", value)}`)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר סוג דוח" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sales">מכירות</SelectItem>
            <SelectItem value="products">מוצרים</SelectItem>
            <SelectItem value="inventory">מלאי</SelectItem>
            <SelectItem value="customers">לקוחות</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Select
          defaultValue={period}
          onValueChange={(value) => {
            router.push(`?${createQueryString("period", value)}`)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר תקופה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">חודש אחרון</SelectItem>
            <SelectItem value="quarter">רבעון אחרון</SelectItem>
            <SelectItem value="year">שנה אחרונה</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <DateRangePicker />
      </div>
      <div className="space-y-2">
        <Select
          defaultValue={searchParams?.get("category") || "all"}
          onValueChange={(value) => {
            router.push(`?${createQueryString("category", value)}`)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="קטגוריה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הקטגוריות</SelectItem>
            <SelectItem value="shirts">חולצות</SelectItem>
            <SelectItem value="pants">מכנסיים</SelectItem>
            <SelectItem value="accessories">אביזרים</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="md:col-span-3">
        <Button variant="outline" onClick={handleGenerateReport} disabled={isGenerating}>
          {isGenerating ? "מפעיל..." : "הפעל דוח"}
        </Button>
      </div>
    </div>
  )
} 