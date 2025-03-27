# תכנית מעבר לאימות Supabase בלבד

## מיפוי קבצים הקשורים לאימות

### קבצי Core-Auth

| קובץ | תיאור | מה צריך לשנות |
| ---- | ----- | ------------- |
| `middleware.ts` | משתמש ב-Clerk middleware | להחליף ל-Supabase middleware |
| `lib/auth.ts` | משתמש ב-NextAuth | להחליף לפונקציית אימות Supabase |
| `app/api/auth/[...nextauth]/route.ts` | נקודת קצה של NextAuth עם מימוש Supabase | לשדרג להשתמש בשירות Supabase המובנה |
| `app/api/auth/logout/route.ts` | נקודת קצה להתנתקות - כבר משתמש ב-Supabase | להשאיר כמו שהוא |
| `lib/supabase/middleware.ts` | Middleware של Supabase | להשתמש בזה במקום ה-Clerk middleware |
| `lib/supabase/server.ts` | יצירת Client צד שרת | להשאיר כמו שהוא |
| `lib/supabase/client.ts` | יצירת Client צד לקוח | להשאיר כמו שהוא |
| `utils/supabase/server.ts` | יצירת Client צד שרת (גרסה אחרת) | לאחד עם `lib/supabase/server.ts` |
| `utils/supabase/client.ts` | יצירת Client צד לקוח (גרסה אחרת) | לאחד עם `lib/supabase/client.ts` |

### קבצי UI ורכיבים

| קובץ | תיאור | מה צריך לשנות |
| ---- | ----- | ------------- |
| `components/auth-provider.tsx` | מספק קונטקסט אימות - משתמש כבר ב-Supabase | להסיר אזכורים ל-Clerk ולהתמקד ב-Supabase בלבד |
| `components/protected-route.tsx` | בודק אם המשתמש מחובר | להשאיר כמו שהוא - משתמש בקונטקסט אימות |
| `components/next-auth-provider.tsx` | רכיב NextAuth provider | להסיר לחלוטין |
| `components/sidebar.tsx` | סרגל צד עם מידע על המשתמש | להשאיר כמו שהוא - משתמש בקונטקסט אימות |
| `app/auth/page.tsx` | עמוד אימות | לעדכן להשתמש רק ב-Supabase |
| `app/auth/callback/route.ts` | נקודת קצה לאימות OAuth | להשאיר כמו שהוא - כבר משתמש ב-Supabase |
| `app/auth/reset-password/*` | עמודי איפוס סיסמה | לשדרג לשימוש בפונקציות Supabase |
| `app/auth/new-password/*` | עמודי סיסמה חדשה | לשדרג לשימוש בפונקציות Supabase |
| `app/dashboard/layout.tsx` | לייאאוט הדשבורד | להשאיר כמו שהוא - משתמש ב-ProtectedRoute |
| `app/dashboard/page.tsx` | דף ראשי בדשבורד | להחליף את `auth` מ-Clerk ל-Supabase |

### שירותים וכלים

| קובץ | תיאור | מה צריך לשנות |
| ---- | ----- | ------------- |
| `app/services/auth-service.ts` | שירות אימות - משתמש כבר ב-Supabase | להשאיר כמו שהוא |

### דפים עם תלות באימות

כל הדפים בספריית `/app/dashboard/*` תלויים באימות דרך ה-`layout.tsx` שמשתמש ב-`ProtectedRoute`. מכיוון שה-ProtectedRoute משתמש בקונטקסט אימות, הוא יעבוד אחרי השינוי ואין צורך לעדכן את כל הדפים בנפרד.

## חבילות וספריות להסרה

| חבילה | סיבה להסרה |
| ----- | ----------- |
| `@clerk/nextjs` | לא יהיה בשימוש יותר |
| `next-auth` | לא יהיה בשימוש יותר |
| `@auth/prisma-adapter` | לא יהיה בשימוש יותר |
| `@auth/supabase-adapter` | לא יהיה בשימוש יותר |

## שינויים בקבצי קונפיגורציה

| קובץ | שינויים נדרשים |
| ---- | -------------- |
| `.env` | להסיר משתני סביבה של Clerk ו-NextAuth |
| `package.json` | להסיר את התלויות שצוינו לעיל |

## שינויים מפורטים בקבצים

### 1. middleware.ts

```typescript
// מקורי
import { clerkMiddleware } from '@clerk/nextjs/server'

// Using Clerk middleware for authentication
export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internal paths and static assets
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

// חדש
import { validateSession } from '@/lib/supabase/middleware';

export async function middleware(request) {
  return await validateSession(request);
}

export const config = {
  matcher: [
    // Skip Next.js internal paths and static assets
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
```

### 2. lib/auth.ts

```typescript
// מקורי
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function auth() {
  const session = await getServerSession(authOptions);
  return session;
}

// חדש
import { createClient } from '@/lib/supabase/server';

export async function auth() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
```

### 3. app/dashboard/page.tsx

```typescript
// מקורי
import { auth } from "@clerk/nextjs/server"
// ...
const session = await auth()
if (!session?.userId) {
  redirect("/sign-in")
}

// חדש
import { auth } from "@/lib/auth"
// ...
const session = await auth()
if (!session?.user) {
  redirect("/auth/login")
}
```

### 4. מיזוג של lib/supabase/server.ts ו-utils/supabase/server.ts

להשתמש בגרסת `lib/supabase/server.ts` ולהסיר את `utils/supabase/server.ts`.

### 5. מיזוג של lib/supabase/client.ts ו-utils/supabase/client.ts

להשתמש בגרסת `lib/supabase/client.ts` ולהסיר את `utils/supabase/client.ts`.

### 6. הסרת components/next-auth-provider.tsx

הקובץ לא יהיה נחוץ יותר ויש להסירו.

### 7. עדכון components/auth-provider.tsx

```typescript
// להסיר
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// להחליף
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

// ולשנות את כל האזכורים של supabase 
// מ-createClientComponentClient ל-getSupabaseBrowserClient
```

## עדכון .env

יש להסיר את משתני הסביבה הבאים, אם קיימים:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=*****
CLERK_SECRET_KEY=*****
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# NextAuth
NEXTAUTH_URL=*****
NEXTAUTH_SECRET=*****
```

## תכנית מימוש

1. **גיבוי**: ליצור גיבוי של הפרויקט לפני ביצוע השינויים.

2. **עדכון middleware.ts**: להחליף את ה-Clerk middleware ב-Supabase middleware.

3. **עדכון lib/auth.ts**: להחליף את קריאות NextAuth בקריאות Supabase.

4. **איחוד וניקוי הלקוחות**: לאחד את הגרסאות הכפולות של קליינט Supabase.
   - מיזוג `utils/supabase/server.ts` ל-`lib/supabase/server.ts`
   - מיזוג `utils/supabase/client.ts` ל-`lib/supabase/client.ts`
   - עדכון כל הייבואים הרלוונטיים בקוד

5. **עדכון דף הדשבורד**: להחליף את שימוש ה-Clerk באימות ב-`app/dashboard/page.tsx`.

6. **הסרת קבצים לא נחוצים**: להסיר את `components/next-auth-provider.tsx`.

7. **עדכון package.json**: להסיר את התלויות שאינן נחוצות יותר.
   ```
   npm uninstall @clerk/nextjs next-auth @auth/prisma-adapter @auth/supabase-adapter
   ```

8. **עדכון .env**: להסיר משתני סביבה שאינם נחוצים.

9. **התקנה מחדש**: להריץ התקנה מחדש ומחיקת תיקיית ה-node_modules.
   ```
   rm -rf node_modules
   npm install
   ```

10. **בדיקת בנייה**: להריץ `npm run build` לבדיקת שגיאות.

11. **בדיקת פונקציונליות**: לבדוק שהמערכת פועלת כצפוי בסביבת פיתוח.
    ```
    npm run dev
    ```

## סיכום

המעבר ל-Supabase מחייב שינויים ב-12 קבצים עיקריים ומספר קבצים נוספים. התהליך צריך להיות מדורג עם בדיקות אחרי כל שלב כדי לוודא שהמערכת עדיין פועלת כראוי. המעבר יבטל את התלות בשירותי אימות חיצוניים ויפשט את תהליך האימות במערכת.

האם אתה מעוניין שאתחיל ליישם את תכנית המעבר? 