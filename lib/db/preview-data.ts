import { prisma } from '@/lib/prisma'

export interface PreviewItem {
  id: string
  name: string
  description?: string
  parent?: string
  status: string
  hex_code?: string
  category?: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
}

export async function getPreviewData(type: string): Promise<PreviewItem[]> {
  // TODO: להחליף את זה בקריאה אמיתית ל-DB
  switch (type) {
    case 'categories':
      return [
        { id: "CAT001", name: "חולצות", description: "כל סוגי החולצות", parent: "", status: "פעיל" },
        { id: "CAT002", name: "מכנסיים", description: "כל סוגי המכנסיים", parent: "", status: "פעיל" },
        { id: "CAT003", name: "חולצות טי", description: "חולצות טי קצרות", parent: "CAT001", status: "פעיל" },
        { id: "CAT004", name: "חולצות פולו", description: "חולצות פולו", parent: "CAT001", status: "פעיל" },
        { id: "CAT005", name: "ג'ינסים", description: "מכנסי ג'ינס", parent: "CAT002", status: "פעיל" },
      ]
    
    case 'colors':
      return [
        { id: "COL001", name: "שחור", hex_code: "#000000", status: "פעיל" },
        { id: "COL002", name: "לבן", hex_code: "#FFFFFF", status: "פעיל" },
        { id: "COL003", name: "אדום", hex_code: "#FF0000", status: "פעיל" },
        { id: "COL004", name: "כחול", hex_code: "#0000FF", status: "פעיל" },
        { id: "COL005", name: "ירוק", hex_code: "#00FF00", status: "פעיל" },
      ]
    
    case 'sizes':
      return [
        { id: "SIZ001", name: "S", description: "קטן", category: "חולצות", status: "פעיל" },
        { id: "SIZ002", name: "M", description: "בינוני", category: "חולצות", status: "פעיל" },
        { id: "SIZ003", name: "L", description: "גדול", category: "חולצות", status: "פעיל" },
        { id: "SIZ004", name: "XL", description: "גדול מאוד", category: "חולצות", status: "פעיל" },
        { id: "SIZ005", name: "XXL", description: "גדול במיוחד", category: "חולצות", status: "פעיל" },
      ]
    
    case 'suppliers':
      return [
        {
          id: "SUP001",
          name: "ספק א",
          contact_name: "ישראל ישראלי",
          email: "supplier1@example.com",
          phone: "050-1234567",
          address: "רחוב הספקים 1, תל אביב",
          status: "פעיל",
        },
        {
          id: "SUP002",
          name: "ספק ב",
          contact_name: "שרה כהן",
          email: "supplier2@example.com",
          phone: "050-2345678",
          address: "רחוב הספקים 2, תל אביב",
          status: "פעיל",
        },
        {
          id: "SUP003",
          name: "ספק ג",
          contact_name: "דוד לוי",
          email: "supplier3@example.com",
          phone: "050-3456789",
          address: "רחוב הספקים 3, תל אביב",
          status: "פעיל",
        },
        {
          id: "SUP004",
          name: "ספק ד",
          contact_name: "רחל אברהם",
          email: "supplier4@example.com",
          phone: "050-4567890",
          address: "רחוב הספקים 4, תל אביב",
          status: "לא פעיל",
        },
        {
          id: "SUP005",
          name: "ספק ה",
          contact_name: "יוסף חיים",
          email: "supplier5@example.com",
          phone: "050-5678901",
          address: "רחוב הספקים 5, תל אביב",
          status: "פעיל",
        },
      ]
    
    default:
      return []
  }
} 