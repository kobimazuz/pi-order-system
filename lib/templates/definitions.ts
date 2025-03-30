/**
 * הגדרות טמפלייטים לייצוא לאקסל
 */

export type ValidationRuleType = 'textLength' | 'decimal' | 'list' | 'custom'
export type DataValidationOperator = "between" | "notBetween" | "equal" | "notEqual" | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual"

export interface ValidationRule {
  type: ValidationRuleType
  operator?: DataValidationOperator
  value?: number
  formula?: string
  allowBlank?: boolean
  errorMessage: string
}

export interface TemplateDefinition {
  headers: string[]
  example: string[]
  validations?: Record<string, ValidationRule>
}

export const templateDefinitions: Record<string, TemplateDefinition> = {
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

// פונקצית עזר למיפוי כותרות לשדות במסד הנתונים
export function mapHeaderToKey(header: string, type: string) {
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