import { prisma } from '@/lib/prisma'

export interface ImportHistory {
  id: number
  type: string
  filename: string
  date: string
  status: string
  records: number
  user: string
}

export async function getImportHistory(): Promise<ImportHistory[]> {
  // TODO: להחליף את זה בקריאה אמיתית ל-DB
  return [
    {
      id: 1,
      type: "קטגוריות",
      filename: "categories_import_20231105.xlsx",
      date: "05/11/2023 10:30",
      status: "הושלם",
      records: 15,
      user: "ישראל ישראלי",
    },
    {
      id: 2,
      type: "צבעים",
      filename: "colors_import_20231102.xlsx",
      date: "02/11/2023 14:15",
      status: "הושלם",
      records: 24,
      user: "שרה כהן",
    },
    {
      id: 3,
      type: "ספקים",
      filename: "suppliers_import_20231028.xlsx",
      date: "28/10/2023 09:45",
      status: "שגיאה",
      records: 0,
      user: "דוד לוי",
    },
    {
      id: 4,
      type: "מידות",
      filename: "sizes_import_20231025.xlsx",
      date: "25/10/2023 16:20",
      status: "הושלם",
      records: 8,
      user: "רחל אברהם",
    },
    {
      id: 5,
      type: "מוצרים",
      filename: "products_import_20231020.xlsx",
      date: "20/10/2023 11:30",
      status: "הושלם חלקית",
      records: 42,
      user: "ישראל ישראלי",
    },
  ]
} 