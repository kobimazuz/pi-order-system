"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCallback, useTransition } from "react"
import { useDebounce } from "@/hooks/use-debounce"

export function ProductFilters() {
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
        `/dashboard/products?${createQueryString({
          query: value || null,
        })}`
      )
    })
  }, 500)

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Input
          placeholder="חיפוש לפי מק״ט, שם מוצר..."
          defaultValue={searchParams?.get("query") ?? ""}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Select
          defaultValue={searchParams?.get("category") ?? "all"}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(
                `/dashboard/products?${createQueryString({
                  category: value,
                })}`
              )
            })
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
        <Select
          defaultValue={searchParams?.get("status") ?? "all"}
          onValueChange={(value) => {
            startTransition(() => {
              router.push(
                `/dashboard/products?${createQueryString({
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
            <SelectItem value="active">זמין</SelectItem>
            <SelectItem value="inactive">לא זמין</SelectItem>
            <SelectItem value="out_of_stock">אזל מהמלאי</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 