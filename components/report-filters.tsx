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
    <div className="flex flex-wrap items-center gap-4">
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
      <DateRangePicker />
      <Select
        defaultValue={searchParams?.get("category") || "all"}
        onValueChange={(value) => {
          router.push(`?${createQueryString("category", value)}`)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="קטגוריה" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">כל הקטגוריות</SelectItem>
          <SelectItem value="shirts">חולצות</SelectItem>
          <SelectItem value="pants">מכנסיים</SelectItem>
          <SelectItem value="accessories">אביזרים</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleGenerateReport} disabled={isGenerating}>
        {isGenerating ? "מפעיל..." : "הפעל דוח"}
      </Button>
    </div>
  )
} 