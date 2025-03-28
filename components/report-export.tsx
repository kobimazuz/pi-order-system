"use client"

import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Download } from "lucide-react"
import { toast } from "sonner"

export function ReportExport() {
  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/reports/export?format=${format}`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("שגיאה בייצוא הדוח")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `report.${format.toLowerCase()}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`הדוח יוצא בהצלחה בפורמט ${format}`)
    } catch (error) {
      console.error("שגיאה בייצוא דוח:", error)
      toast.error("שגיאה בייצוא הדוח")
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => handleExport("XLSX")}>
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Excel
      </Button>

      <Button variant="outline" onClick={() => handleExport("PDF")}>
        <Download className="mr-2 h-4 w-4" />
        PDF
      </Button>

      <Button variant="outline" onClick={() => handleExport("CSV")}>
        <Download className="mr-2 h-4 w-4" />
        CSV
      </Button>
    </div>
  )
} 