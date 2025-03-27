"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useTransition } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function OrdersFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString())
      
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })
      
      return newSearchParams.toString()
    },
    [searchParams]
  )

  const debouncedSearch = useDebounce((value: string) => {
    startTransition(() => {
      router.push(
        `/dashboard/orders?${createQueryString({
          query: value || null,
        })}`
      )
    })
  }, 500)

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="חיפוש לפי מספר PI, לקוח..."
          defaultValue={searchParams?.get("query") ?? ""}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select
          defaultValue={searchParams?.get("status") ?? "all"}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(
                `/dashboard/orders?${createQueryString({
                  status: value,
                })}`
              )
            })
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="סטטוס" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הסטטוסים</SelectItem>
            <SelectItem value="completed">הושלם</SelectItem>
            <SelectItem value="processing">בתהליך</SelectItem>
            <SelectItem value="draft">טיוטה</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue={searchParams?.get("date") ?? "all"}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(
                `/dashboard/orders?${createQueryString({
                  date: value,
                })}`
              )
            })
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="תאריך" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל התאריכים</SelectItem>
            <SelectItem value="today">היום</SelectItem>
            <SelectItem value="week">השבוע</SelectItem>
            <SelectItem value="month">החודש</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 