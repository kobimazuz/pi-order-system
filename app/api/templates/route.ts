import { NextResponse } from "next/server"
import * as ExcelJS from "exceljs"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

type DataValidationOperator = "between" | "notBetween" | "equal" | "notEqual" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual"

interface ValidationRule {
  type: 'textLength' | 'decimal' | 'list' | 'custom'
  operator?: DataValidationOperator
  value?: number
  formula?: string
  allowBlank?: boolean
  errorMessage: string
}

interface TemplateDefinition {
  headers: string[]
  example: string[]
  validations?: Record<string, ValidationRule>
}

const templateDefinitions: Record<string, TemplateDefinition> = {
  categories: {
    headers: ["מספר", "קוד", "שם", "תיאור", "קטגוריית אב", "סטטוס", "פעולה נדרשת"],
    example: ["1", "CAT001", "קטגוריה לדוגמה", "תיאור של הקטגוריה", "", "פעיל", "הוספה"],
    validations: {
      "קוד": {
        type: "textLength",
        operator: "greaterThanOrEqual",
        value: 3,
        errorMessage: "קוד חייב להיות באורך של לפחות 3 תווים"
      },
      "שם": {
        type: "textLength",
        operator: "greaterThanOrEqual",
        value: 2,
        errorMessage: "שם חייב להיות באורך של לפחות 2 תווים"
      },
      "סטטוס": {
        type: "list",
        formula: "=Lists!$A$2:$A$3",
        errorMessage: "יש לבחור סטטוס מהרשימה"
      },
      "פעולה נדרשת": {
        type: "list",
        formula: "=Lists!$B$2:$B$5",
        errorMessage: "יש לבחור פעולה מהרשימה"
      }
    }
  },
  colors: {
    headers: ["מספר", "קוד", "שם", "קוד צבע", "סטטוס"],
    example: ["1", "COL001", "שחור", "#000000", "פעיל"],
    validations: {
      "קוד": { type: "textLength", operator: "greaterThan", value: 2, errorMessage: "קוד חייב להיות באורך של לפחות 3 תווים" },
      "שם": { type: "textLength", operator: "greaterThan", value: 1, errorMessage: "שם חייב להיות באורך של לפחות 2 תווים" },
      "קוד צבע": { type: "custom", formula: 'LEFT(TRIM(D2),1)="#"', errorMessage: "קוד צבע חייב להתחיל ב-#" },
      "סטטוס": { type: "list", allowBlank: false, errorMessage: "יש לבחור סטטוס מהרשימה" }
    }
  },
  sizes: {
    headers: ["מספר", "קוד", "שם", "תיאור", "קטגוריה", "סטטוס"],
    example: ["1", "SIZ001", "S", "קטן", "חולצות", "פעיל"],
    validations: {
      "קוד": { type: "textLength", operator: "greaterThan", value: 2, errorMessage: "קוד חייב להיות באורך של לפחות 3 תווים" },
      "שם": { type: "textLength", operator: "greaterThan", value: 0, errorMessage: "שם הוא שדה חובה" },
      "קטגוריה": { type: "list", allowBlank: true, errorMessage: "יש לבחור קטגוריה מהרשימה" },
      "סטטוס": { type: "list", allowBlank: false, errorMessage: "יש לבחור סטטוס מהרשימה" }
    }
  },
  materials: {
    headers: ["מספר", "קוד", "שם", "תיאור", "סטטוס"],
    example: ["1", "MAT001", "כותנה", "100% כותנה", "פעיל"],
    validations: {
      "קוד": { type: "textLength", operator: "greaterThan", value: 2, errorMessage: "קוד חייב להיות באורך של לפחות 3 תווים" },
      "שם": { type: "textLength", operator: "greaterThan", value: 1, errorMessage: "שם חייב להיות באורך של לפחות 2 תווים" },
      "סטטוס": { type: "list", allowBlank: false, errorMessage: "יש לבחור סטטוס מהרשימה" }
    }
  },
  suppliers: {
    headers: ["מספר", "קוד", "שם", "איש קשר", "אימייל", "טלפון", "כתובת", "סטטוס"],
    example: ["1", "SUP001", "ספק א", "ישראל ישראלי", "supplier@example.com", "050-1234567", "רחוב הספקים 1, תל אביב", "פעיל"],
    validations: {
      "קוד": { type: "textLength", operator: "greaterThan", value: 2, errorMessage: "קוד חייב להיות באורך של לפחות 3 תווים" },
      "שם": { type: "textLength", operator: "greaterThan", value: 1, errorMessage: "שם חייב להיות באורך של לפחות 2 תווים" },
      "אימייל": { type: "custom", formula: 'ISNUMBER(MATCH("*@*.?*",E2,0))', errorMessage: "כתובת אימייל לא תקינה" },
      "סטטוס": { type: "list", allowBlank: false, errorMessage: "יש לבחור סטטוס מהרשימה" }
    }
  },
  products: {
    headers: [
      "מספר",
      "מק\"ט",
      "שם",
      "תיאור",
      "קטגוריה",
      "ספק",
      "צבעים",
      "מידות",
      "כמות באריזה",
      "הוראות אריזה",
      "כמות בקרטון",
      "מחיר ליחידה",
      "סטטוס",
    ],
    example: [
      "1",
      "HY1001",
      "חולצת טי בייסיק",
      "חולצת טי כותנה בסיסית",
      "חולצות",
      "ספק א",
      "שחור,לבן",
      "S,M,L",
      "5",
      "לארוז בשקית ניילון",
      "100",
      "29.90",
      "פעיל",
    ],
    validations: {
      "מק\"ט": { type: "textLength", operator: "greaterThan", value: 5, errorMessage: "מק\"ט חייב להיות באורך של לפחות 6 תווים" },
      "שם": { type: "textLength", operator: "greaterThan", value: 1, errorMessage: "שם חייב להיות באורך של לפחות 2 תווים" },
      "קטגוריה": { type: "list", allowBlank: false, errorMessage: "יש לבחור קטגוריה מהרשימה" },
      "ספק": { type: "list", allowBlank: false, errorMessage: "יש לבחור ספק מהרשימה" },
      "כמות באריזה": { type: "decimal", operator: "greaterThan", value: 0, errorMessage: "כמות באריזה חייבת להיות מספר חיובי" },
      "כמות בקרטון": { type: "decimal", operator: "greaterThan", value: 0, errorMessage: "כמות בקרטון חייבת להיות מספר חיובי" },
      "מחיר ליחידה": { type: "decimal", operator: "greaterThan", value: 0, errorMessage: "מחיר ליחידה חייב להיות מספר חיובי" },
      "סטטוס": { type: "list", allowBlank: false, errorMessage: "יש לבחור סטטוס מהרשימה" }
    }
  },
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const includeData = searchParams.get("includeData") === "true"
    
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!type || !templateDefinitions[type as keyof typeof templateDefinitions]) {
      return NextResponse.json({ error: "Invalid template type" }, { status: 400 })
    }

    const template = templateDefinitions[type as keyof typeof templateDefinitions]
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(type)

    // הגדרת הכותרות
    const headers = template.headers
    worksheet.columns = headers.map(header => ({ header, key: header, width: 15 }))

    // עיצוב הכותרות
    worksheet.getRow(1).font = { bold: true }
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    }

    // הוספת גיליון רשימות
    const listsSheet = workbook.addWorksheet('Lists', { state: 'hidden' })
    
    // הוספת רשימות סטטוס
    listsSheet.getCell('A1').value = 'סטטוס'
    listsSheet.getCell('A2').value = 'פעיל'
    listsSheet.getCell('A3').value = 'לא פעיל'
    
    // הגדרת שם לרשימת סטטוס
    workbook.definedNames.add('StatusList', 'Lists!$A$2:$A$3')

    // הוספת רשימת פעולות
    listsSheet.getCell('B1').value = 'פעולה'
    listsSheet.getCell('B2').value = 'הוספה'
    listsSheet.getCell('B3').value = 'עדכון'
    listsSheet.getCell('B4').value = 'מחיקה'
    listsSheet.getCell('B5').value = 'ללא שינוי'
    
    // הגדרת שם לרשימת פעולות
    workbook.definedNames.add('ActionList', 'Lists!$B$2:$B$5')
    
    // הוספת רשימות דינמיות
    if (type === 'sizes' || type === 'products') {
      const categories = await prisma.category.findMany({
        where: { userId: session.user.id, status: 'active' },
        select: { name: true }
      })
      
      listsSheet.getCell('C1').value = 'קטגוריות'
      categories.forEach((cat, idx) => {
        listsSheet.getCell(`C${idx + 2}`).value = cat.name
      })
      
      // הגדרת שם לרשימת קטגוריות
      workbook.definedNames.add('CategoryList', `Lists!$C$2:$C$${categories.length + 1}`)
    }
    
    if (type === 'products') {
      const suppliers = await prisma.supplier.findMany({
        where: { userId: session.user.id, status: 'active' },
        select: { name: true }
      })
      
      listsSheet.getCell('D1').value = 'ספקים'
      suppliers.forEach((sup, idx) => {
        listsSheet.getCell(`D${idx + 2}`).value = sup.name
      })
      
      // הגדרת שם לרשימת ספקים
      workbook.definedNames.add('SupplierList', `Lists!$D$2:$D$${suppliers.length + 1}`)
    }

    // הוספת שורת דוגמה או נתונים קיימים
    if (includeData) {
      const data = await getExistingData(type, session.user.id)
      let rowNumber = 2
      for (const item of data) {
        const rowData = template.headers.map(header => {
          const key = mapHeaderToKey(header, type)
          return (item as any)[key] ?? ""
        })
        worksheet.addRow([rowNumber - 1, ...rowData.slice(1)])
        rowNumber++
      }
    } else {
      worksheet.addRow(template.example)
    }

    // הוספת ולידציות
    const validations = template.validations
    if (validations) {
      Object.entries(validations).forEach(([column, rule]) => {
        const colIndex = headers.indexOf(column) + 1
        if (colIndex > 0) {
          if (rule.type === 'list') {
            if (column === 'סטטוס') {
              worksheet.getColumn(colIndex).eachCell({ includeEmpty: false }, cell => {
                const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
                if (rowNum > 1) {
                  cell.dataValidation = {
                    type: 'list',
                    allowBlank: rule.allowBlank ?? true,
                    formulae: ['=StatusList'],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'שגיאה',
                    error: rule.errorMessage
                  }
                }
              })
            } else if (column === 'קטגוריה') {
              worksheet.getColumn(colIndex).eachCell({ includeEmpty: false }, cell => {
                const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
                if (rowNum > 1) {
                  cell.dataValidation = {
                    type: 'list',
                    allowBlank: rule.allowBlank ?? true,
                    formulae: ['=CategoryList'],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'שגיאה',
                    error: rule.errorMessage
                  }
                }
              })
            } else if (column === 'ספק') {
              worksheet.getColumn(colIndex).eachCell({ includeEmpty: false }, cell => {
                const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
                if (rowNum > 1) {
                  cell.dataValidation = {
                    type: 'list',
                    allowBlank: rule.allowBlank ?? true,
                    formulae: ['=SupplierList'],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'שגיאה',
                    error: rule.errorMessage
                  }
                }
              })
            }
          } else if (rule.type === 'textLength') {
            worksheet.getColumn(colIndex).eachCell({ includeEmpty: false }, cell => {
              const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
              if (rowNum > 1) {
                cell.dataValidation = {
                  type: 'textLength',
                  operator: rule.operator,
                  showErrorMessage: true,
                  errorStyle: 'error',
                  errorTitle: 'שגיאה',
                  error: rule.errorMessage,
                  formulae: [rule.value ?? 0]
                }
              }
            })
          } else if (rule.type === 'decimal') {
            worksheet.getColumn(colIndex).eachCell({ includeEmpty: false }, cell => {
              const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
              if (rowNum > 1) {
                cell.dataValidation = {
                  type: 'decimal',
                  operator: rule.operator,
                  showErrorMessage: true,
                  errorStyle: 'error',
                  errorTitle: 'שגיאה',
                  error: rule.errorMessage,
                  formulae: [rule.value ?? 0]
                }
              }
            })
          } else if (rule.type === 'custom') {
            worksheet.getColumn(colIndex).eachCell({ includeEmpty: false }, cell => {
              const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
              if (rowNum > 1) {
                cell.dataValidation = {
                  type: 'custom',
                  showErrorMessage: true,
                  errorStyle: 'error',
                  errorTitle: 'שגיאה',
                  error: rule.errorMessage,
                  formulae: [rule.formula ?? '']
                }
              }
            })
          }
        }
      })
    }

    // הוספת ולידציה לעמודת הפעולה הנדרשת
    const actionColumn = worksheet.getColumn(worksheet.columnCount)
    actionColumn.eachCell({ includeEmpty: false }, cell => {
      const rowNum = typeof cell.row === 'number' ? cell.row : parseInt(cell.row)
      if (rowNum > 1) {
        cell.dataValidation = {
          type: 'list',
          allowBlank: false,
          formulae: ['=ActionList'],
          showErrorMessage: true,
          errorStyle: 'error',
          errorTitle: 'שגיאת קלט',
          error: 'יש לבחור פעולה מהרשימה'
        }
      }
    })

    // נעילת עמודת המספר
    worksheet.getColumn(1).eachCell(cell => {
      cell.protection = { locked: true }
    })

    // הגנה על הגיליון
    worksheet.protect('', {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: true,
      formatColumns: true,
      formatRows: true,
      insertRows: true,
      deleteRows: true,
      sort: true,
      autoFilter: true
    })

    // יצירת הקובץ
    const buffer = await workbook.xlsx.writeBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=${type}_${includeData ? 'data' : 'template'}.xlsx`,
      },
    })
  } catch (error) {
    console.error("Error generating template:", error)
    return NextResponse.json({ error: "Failed to generate template" }, { status: 500 })
  }
}

// פונקצית עזר למיפוי כותרות לשדות במסד הנתונים
function mapHeaderToKey(header: string, type: string) {
  const mappings: Record<string, Record<string, string>> = {
    categories: {
      "קוד": "code",
      "שם": "name",
      "תיאור": "description",
      "קטגוריית אב": "parent_name",
      "סטטוס": "status"
    },
    colors: {
      "קוד": "code",
      "שם": "name",
      "קוד צבע": "hex_code",
      "סטטוס": "status"
    },
    sizes: {
      "קוד": "code",
      "שם": "name",
      "תיאור": "description",
      "קטגוריה": "category",
      "סטטוס": "status"
    },
    materials: {
      "קוד": "code",
      "שם": "name",
      "תיאור": "description",
      "סטטוס": "status"
    },
    suppliers: {
      "קוד": "code",
      "שם": "name",
      "איש קשר": "contact_name",
      "אימייל": "email",
      "טלפון": "phone",
      "כתובת": "address",
      "סטטוס": "status"
    },
    products: {
      "מק\"ט": "sku",
      "שם": "name",
      "תיאור": "description",
      "קטגוריה": "category_name",
      "ספק": "supplier_name",
      "צבעים": "colors",
      "מידות": "sizes",
      "כמות באריזה": "units_per_pack",
      "הוראות אריזה": "packing_info",
      "כמות בקרטון": "units_per_carton",
      "מחיר ליחידה": "price_per_unit",
      "סטטוס": "status"
    }
  }
  
  return mappings[type]?.[header] || header
}

// פונקציה לשליפת נתונים קיימים
async function getExistingData(type: string, userId: string) {
  switch (type) {
    case "products":
      const products = await prisma.product.findMany({
        where: { userId },
        include: {
          category: true,
          supplier: true,
          colors: true,
          sizes: true,
          materials: true
        }
      })
      
      return products.map((product: any) => ({
        ...product,
        category_name: product.category?.name || "",
        supplier_name: product.supplier?.name || "",
        colors: product.colors.map((c: any) => c.name).join(','),
        sizes: product.sizes.map((s: any) => s.name).join(','),
        materials: product.materials.map((m: any) => m.name).join(',')
      }))
      
    case "categories": 
      const categories = await prisma.category.findMany({
        where: { userId },
        include: {
          parent_category: true
        }
      })
      
      return categories.map((category: any) => ({
        ...category,
        parent_name: category.parent_category?.name || ""
      }))
      
    case "colors":
      return await prisma.color.findMany({
        where: { userId }
      })
      
    case "sizes":
      return await prisma.size.findMany({
        where: { userId }
      })
      
    case "materials":
      return await prisma.material.findMany({
        where: { userId }
      })
      
    case "suppliers":
      return await prisma.supplier.findMany({
        where: { userId }
      })
      
    default:
      return []
  }
} 