import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { templateDefinitions } from '@/lib/templates/definitions';
import { Workbook, Worksheet, defaults } from '@syncfusion/ej2-excel-export';

/**
 * מחולל טמפלייטים לייבוא נתונים
 * API route להורדת טמפלייטים של קבצי אקסל
 */
export async function GET(request: NextRequest) {
  try {
    // אימות משתמש
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const user = data.user;
    
    // קבלת פרמטרים מכתובת ה-URL
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const includeData = url.searchParams.get('includeData') === 'true';
    
    if (!type || !templateDefinitions[type]) {
      return new NextResponse(JSON.stringify({ error: 'Invalid template type' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // מציאת הגדרת התבנית
    const templateDef = templateDefinitions[type];
    
    // הגדרת כיוון RTL לאקסל (עברית)
    defaults.rightToLeft = true;
    
    // יצירת חוברת אקסל חדשה
    const workbook = new Workbook();
    
    // הוספת גיליון נתונים
    let dataSheet: Worksheet = workbook.addWorksheet(type);
    
    // הוספת כותרות
    for (let i = 0; i < templateDef.headers.length; i++) {
      dataSheet.rows[0].cells[i].value = templateDef.headers[i];
      dataSheet.rows[0].cells[i].style = {
        fontName: 'Arial',
        fontSize: 12,
        bold: true,
        hAlign: 'Center',
        vAlign: 'Center'
      };
    }
    
    // קביעת רוחב עמודות
    for (let i = 0; i < templateDef.headers.length; i++) {
      dataSheet.columns[i].width = 150;
    }
    
    // הוספת שורת דוגמה
    for (let i = 0; i < templateDef.example.length; i++) {
      dataSheet.rows[1].cells[i].value = templateDef.example[i];
    }
    
    // הוספת נתונים קיימים אם נדרש
    if (includeData) {
      const existingData = await getExistingData(type, user.id);
      
      existingData.forEach((item: any, rowIndex: number) => {
        templateDef.headers.forEach((header, colIndex) => {
          const key = mapHeaderToKey(header, type);
          dataSheet.rows[rowIndex + 2].cells[colIndex].value = item[key] || '';
        });
      });
    }
    
    // הוספת גיליון רשימות לולידציה
    if (templateDef.validations) {
      let listsSheet: Worksheet = workbook.addWorksheet('רשימות');
      
      // הוספת רשימת סטטוס
      listsSheet.rows[0].cells[0].value = 'סטטוס';
      listsSheet.rows[0].cells[0].style = {
        fontName: 'Arial',
        fontSize: 12,
        bold: true
      };
      
      const statusList = ['פעיל', 'לא פעיל'];
      for (let i = 0; i < statusList.length; i++) {
        listsSheet.rows[i + 1].cells[0].value = statusList[i];
      }
      
      // הוספת שורה ריקה
      listsSheet.rows[statusList.length + 1].cells[0].value = '';
      
      // הוספת רשימת פעולות
      listsSheet.rows[statusList.length + 2].cells[0].value = 'פעולה';
      listsSheet.rows[statusList.length + 2].cells[0].style = {
        fontName: 'Arial',
        fontSize: 12,
        bold: true
      };
      
      const actionList = ['הוספה', 'עדכון', 'מחיקה', 'ללא שינוי'];
      for (let i = 0; i < actionList.length; i++) {
        listsSheet.rows[statusList.length + 3 + i].cells[0].value = actionList[i];
      }
    }
    
    // המרת החוברת לבלוב
    const excelBlob = workbook.saveAsBlob();
    
    // החזרת קובץ האקסל עם כותרות מתאימות
    return new NextResponse(excelBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${type}_template.xlsx`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to generate template' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * פונקציה לשליפת נתונים קיימים עבור טמפלייט
 */
async function getExistingData(type: string, userId: string) {
  try {
    switch (type) {
      case 'categories':
        return await prisma.category.findMany({ 
          where: { userId },
          select: { id: true, code: true, name: true, description: true, parent: true, status: true }
        });
        
      case 'colors':
        return await prisma.color.findMany({ 
          where: { userId },
          select: { id: true, code: true, name: true, hex_code: true, status: true }
        });
        
      case 'sizes':
        return await prisma.size.findMany({ 
          where: { userId },
          select: { id: true, code: true, name: true, description: true, category: true, status: true }
        });
        
      case 'materials':
        return await prisma.material.findMany({ 
          where: { userId },
          select: { id: true, code: true, name: true, description: true, status: true }
        });
        
      case 'suppliers':
        return await prisma.supplier.findMany({ 
          where: { userId },
          select: { 
            id: true, code: true, name: true, contact_name: true, email: true, 
            phone: true, address: true, status: true 
          }
        });
        
      case 'products':
        return await prisma.product.findMany({ 
          where: { userId },
          select: { 
            id: true, sku: true, name: true, description: true, category: true, 
            supplier: true, quantity: true, cost: true, price: true, status: true 
          }
        });
        
      default:
        return [];
    }
  } catch (error) {
    console.error(`Error retrieving ${type} data:`, error);
    return [];
  }
}

/**
 * פונקצית עזר למיפוי כותרות לשדות במסד הנתונים
 */
function mapHeaderToKey(header: string, type: string) {
  // מימוש ספציפי לסוגי תבניות
  const mapping: Record<string, Record<string, string>> = {
    categories: {
      "קוד": "code",
      "שם": "name",
      "תיאור": "description",
      "קטגוריית אב": "parent.name",
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
      "קטגוריה": "category.name",
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
      "קטגוריה": "category.name",
      "ספק": "supplier.name",
      "צבעים": "colors",
      "מידות": "sizes",
      "כמות באריזה": "units_per_pack",
      "הוראות אריזה": "packing_info",
      "כמות בקרטון": "units_per_carton",
      "מחיר ליחידה": "price",
      "סטטוס": "status"
    }
  };
  
  return mapping[type]?.[header] || header.toLowerCase().replace(/\s+/g, '');
} 