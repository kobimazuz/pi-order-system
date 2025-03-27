# ניתוח מבנה הדשבורד

## מבנה כללי
המערכת מבוססת על Next.js 15 ומשתמשת ב-Prisma כ-ORM מול מסד נתונים PostgreSQL. 

## דפי המערכת

### 1. דף ייבוא נתונים בבולק (/dashboard/bulk-import)
**מצב נוכחי**: משתמש במוק דאטה
**שדות במוק דאטה**:
- קטגוריות:
  - id (CAT001)
  - name (שם)
  - description (תיאור)
  - parent (קטגוריית אב)
  - status (סטטוס)

- צבעים:
  - id (COL001)
  - name (שם)
  - hex_code (קוד צבע)
  - status (סטטוס)

- מידות:
  - id (SIZ001)
  - name (שם)
  - description (תיאור)
  - category (קטגוריה)
  - status (סטטוס)

- ספקים:
  - id (SUP001)
  - name (שם)
  - contact_name (איש קשר)
  - email (אימייל)
  - phone (טלפון)
  - address (כתובת)
  - status (סטטוס)

**התאמה לסכמה**:
- קטגוריות: תואם חלקית, חסר שדה code בסכמה
- צבעים: תואם חלקית, חסר שדה code בסכמה
- מידות: תואם חלקית, חסר שדה code בסכמה
- ספקים: תואם חלקית, חסר שדה code בסכמה

**המלצות**:
1. להוסיף שדה code לכל הטבלאות בסכמה
2. להמיר את הדף ל-SSR
3. להוסיף קשינג באמצעות Next.js Cache
4. להוסיף ולידציה לקבצי האקסל המיובאים

### 2. דף הגדרות (/dashboard/settings)
**מצב נוכחי**: טבלת Settings עודכנה להיות ברמת משתמש

**שדות בסכמה החדשה**:
- id (UUID)
- userId (UUID)
- key (מפתח)
- value (ערך)
- createdAt (תאריך יצירה)
- updatedAt (תאריך עדכון)

**המלצות**:
1. להמיר את הדף ל-SSR
2. להוסיף קשינג להגדרות
3. להגדיר מפתחות סטנדרטיים להגדרות

### 3. דף משתמשים (/dashboard/users)
**תיאור**: ניהול משתמשי המערכת
**טבלאות קשורות**: 
- Profile
- Subscription
- Invoice

**שדות נדרשים**:
- פרטי משתמש (Profile):
  - id
  - email
  - full_name
  - company_name
  - phone
  - address
  - role
  - status
  - created_at
  - last_login

- פרטי מנוי (Subscription):
  - status
  - start_date
  - end_date
  - auto_renew

**המלצות**:
1. להמיר ל-SSR
2. להוסיף קשינג לרשימת המשתמשים
3. להוסיף ניהול הרשאות לפי תפקיד

### 4. דף ספקים (/dashboard/suppliers)
**תיאור**: ניהול ספקים
**טבלאות קשורות**: 
- Supplier
- Product

**שדות בשימוש**:
- code
- name
- contact_name
- email
- phone
- address
- status

**המלצות**:
1. להמיר ל-SSR
2. להוסיף קשינג
3. להוסיף ולידציה לשדות

### 5. דף מוצרים (/dashboard/products)
**תיאור**: ניהול מוצרים
**טבלאות קשורות**: 
- Product
- Category
- Color
- Size
- Material
- Supplier

**שדות בשימוש**:
- sku
- name
- description
- image_url
- units_per_pack
- packing_info
- units_per_carton
- price_per_unit
- status
- categoryId
- supplierId
- colors[]
- sizes[]
- materials[]

**המלצות**:
1. להמיר ל-SSR
2. להוסיף קשינג
3. לשפר טיפול בתמונות
4. להוסיף ולידציה

### 6. דף הזמנות (/dashboard/orders)
**תיאור**: ניהול הזמנות
**טבלאות קשורות**: 
- Order
- OrderItem
- Product

**שדות בשימוש**:
- pi_number
- customer
- total_items
- total_units
- total_amount
- status
- orderItems[]

**המלצות**:
1. להמיר ל-SSR
2. להוסיף קשינג
3. להוסיף מערכת סטטוסים מתקדמת

### 7. דף יצירת PI (/dashboard/create-pi)
**תיאור**: יצירת הזמנה חדשה
**טבלאות קשורות**: 
- Order
- OrderItem
- Product
- Category
- Settings

**שדות בשימוש**:
- כל השדות מ-Order ו-OrderItem
- הגדרות משתמש רלוונטיות

**המלצות**:
1. להשאיר כ-Client Component בגלל אינטראקטיביות גבוהה
2. להוסיף קשינג לנתוני מוצרים
3. להוסיף ולידציה מתקדמת

### 8. דף קטגוריות (/dashboard/categories)
**תיאור**: ניהול קטגוריות מוצרים
**טבלאות קשורות**: 
- Category
- Product

**שדות בשימוש**:
- code
- name
- description
- parent
- status

**המלצות**:
1. להמיר ל-SSR
2. להוסיף קשינג
3. לשפר ניהול היררכיה

## שינויים נדרשים בסכמה

```prisma
// עדכונים נדרשים בסכמה
model Category {
  id          String    @id @default(uuid()) @db.Uuid
  userId      String    @db.Uuid
  code        String    // נוסף
  name        String
  description String?
  parent      String?   // נוסף - קטגוריית אב
  status      String    @default("active")
  created_at  DateTime  @default(now())
  updated_at  DateTime  @updatedAt
  
  // Relations
  user        Profile   @relation(fields: [userId], references: [id])
  products    Product[]
  children    Category[] @relation("CategoryToCategory") // נוסף
  parent_category Category? @relation("CategoryToCategory", fields: [parent], references: [id]) // נוסף

  @@unique([userId, code])
  @@map("categories")
}

// הוספת שדות חדשים למודל Settings
model Settings {
  id        String   @id @default(uuid()) @db.Uuid
  userId    String   @db.Uuid
  key       String
  value     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      Profile  @relation(fields: [userId], references: [id])

  @@unique([userId, key])
  @@map("settings")
}

// הוספת שדות למודל Order
model Order {
  id           String      @id @default(uuid()) @db.Uuid
  userId       String      @db.Uuid
  pi_number    String      @unique
  customer     String
  total_items  Int         @default(0)
  total_units  Int         @default(0)
  total_amount Float
  status       String      @default("pending")
  notes        String?     // נוסף
  created_at   DateTime    @default(now())
  updated_at   DateTime    @updatedAt
  
  // Relations
  user         Profile     @relation(fields: [userId], references: [id])
  orderItems   OrderItem[]

  @@map("orders")
}

// ... המשך עדכונים לשאר המודלים
```

## צעדים הבאים
1. עדכון הסכמה עם כל השינויים הנדרשים
2. יצירת מיגרציה חדשה
3. עדכון פוליסות ה-RLS
4. המרת דפים ל-SSR
5. הוספת מערכת קשינג
6. עדכון הדפים לעבודה מול השרת במקום מוק דאטה 

## לקחים והנחיות מניסיון דף הייבוא בבולק

### הנחיות כלליות לעבודה עם Prisma
1. **אין להשתמש ב-`select` ו-`include` ביחד באותה שאילתה**:
   - יש לבחור באחת מהגישות, או `select` או `include`.
   - אם צריך לבחור שדות ספציפיים וגם לכלול יחסים, יש להשתמש ב-`include` עם `select` בתוך ה-relation.
   ```typescript
   // נכון:
   const data = await prisma.category.findMany({
     include: {
       parent_category: {
         select: {
           name: true
         }
       }
     }
   });
   
   // לא נכון:
   const data = await prisma.category.findMany({
     select: { ... },
     include: { ... }
   });
   ```

2. **טיפול בטיפוסים עם Prisma**:
   - יש להגדיר טיפוסים מדויקים שתואמים למבנה הנתונים האמיתי.
   - להימנע מהמרות טיפוסים שרירותיות כמו `as SomeType[]` אלא אם נבדק שהטיפוס תואם.
   - לעבוד עם טיפוסים מורכבים דרך מיפוי מפורש (explicit mapping).
   ```typescript
   // רצוי:
   const categories = categoriesRaw.map(category => ({
     id: category.id,
     name: category.name,
     // יתר השדות...
     parent_name: category.parent_category?.name || null
   }));
   ```

3. **שימוש נכון ב-Promise.all**:
   - לוודא שהמערך מכיל רק Promise objects.
   - במקרה של תלויות בין שאילתות, להשתמש בשאילתות עוקבות ולא ב-Promise.all.
   - לעטוף ב-try-catch לטיפול שגיאות.

4. **מבנה קוד מסודר**:
   - לחלק את הקוד לפונקציות קטנות עם אחריות ברורה.
   - ליצור פונקציית `getPageData()` נפרדת לשליפת נתונים.
   - להשתמש ב-try-catch לטיפול שגיאות.
   ```typescript
   async function getPageData() {
     try {
       // שליפת נתונים...
       return { data1, data2, ... };
     } catch (error) {
       console.error('Error fetching data:', error);
       throw error;
     }
   }
   
   export default async function Page() {
     try {
       const data = await getPageData();
       return <Component {...data} />;
     } catch (error) {
       return <ErrorComponent error={error} />;
     }
   }
   ```

5. **בדיקת סכמה מראש**:
   - לבדוק את המבנה המדויק של סכמת Prisma לפני כתיבת קוד.
   - להבין את היחסים בין המודלים.
   - לבדוק מיפוי של שמות שדות מהסכמה לשמות משתנים בקוד.

### תוכנית מעודכנת לדפים הבאים

עבור כל אחד מהדפים הבאים:

1. **דף הגדרות** - להתמקד בפונקציית getData נפרדת, שימוש ב-try-catch, והבנת מבנה השדות.

2. **דף משתמשים** - טיפול זהיר ביחסים עם Subscription ו-Invoice, שימוש בפונקציית getData.

3. **דף ספקים** - לעקוב אחר התבנית המוצלחת שיישמנו בדף הייבוא.

4. **דף מוצרים** - טיפול ביחסים מורכבים בפונקציות נפרדות, שימוש רק ב-include.

5. **דף הזמנות** - הפרדה בין שליפת הזמנות לפריטי הזמנה, טיפול ביחסים.

6. **דף יצירת PI** - שימור כ-Client Component עם Server Actions, הפרדה בין קוד צד לקוח וצד שרת.

7. **דף קטגוריות** - טיפול זהיר ביחסי היררכיה וself-relation.