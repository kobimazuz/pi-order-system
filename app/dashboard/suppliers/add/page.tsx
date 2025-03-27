import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, ArrowRight, Upload } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { LoadingSpinner } from "@/components/loading"
import { Suspense } from "react"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/lib/auth"

// סכמת ולידציה
const supplierSchema = z.object({
  code: z.string().min(1, "קוד ספק הוא שדה חובה").max(10, "קוד ספק ארוך מדי"),
  name: z.string().min(2, "שם ספק חייב להכיל לפחות 2 תווים"),
  description: z.string().optional(),
  type: z.enum(["manufacturer", "distributor", "wholesaler", "retailer"]),
  category: z.enum(["clothing", "electronics", "food", "other"]),
  contact_name: z.string().min(2, "שם איש קשר חייב להכיל לפחות 2 תווים"),
  position: z.string().optional(),
  email: z.string().email("כתובת אימייל לא תקינה"),
  phone: z.string().regex(/^[0-9-+\s()]*$/, "מספר טלפון לא תקין"),
  address: z.string().min(5, "כתובת חייבת להכיל לפחות 5 תווים"),
  city: z.string().min(2, "שם עיר חייב להכיל לפחות 2 תווים"),
  zip: z.string().optional(),
  country: z.string().min(2, "יש לבחור מדינה"),
  payment_terms: z.enum(["immediate", "net15", "net30", "net60", "net90"]),
  currency: z.enum(["ils", "usd", "eur", "gbp"]),
  bank_name: z.string().optional(),
  bank_branch: z.string().optional(),
  account_number: z.string().optional(),
  tax_id: z.string().optional(),
  is_active: z.boolean().default(true),
  is_preferred: z.boolean().default(false),
  notes: z.string().optional(),
});

// Server Action לשמירת ספק חדש
async function createSupplier(formData: FormData) {
  "use server"
  
  try {
    // קבלת המשתמש הנוכחי
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("לא נמצא משתמש מחובר");
    }

    const data = {
      code: formData.get("code"),
      name: formData.get("name"),
      description: formData.get("description"),
      type: formData.get("type"),
      category: formData.get("category"),
      contact_name: formData.get("contact_name"),
      position: formData.get("position"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      city: formData.get("city"),
      zip: formData.get("zip"),
      country: formData.get("country"),
      payment_terms: formData.get("payment_terms"),
      currency: formData.get("currency"),
      bank_name: formData.get("bank_name"),
      bank_branch: formData.get("bank_branch"),
      account_number: formData.get("account_number"),
      tax_id: formData.get("tax_id"),
      is_active: formData.get("is_active") === "true",
      is_preferred: formData.get("is_preferred") === "true",
      notes: formData.get("notes"),
    };

    // ולידציה
    const validatedData = supplierSchema.parse(data);

    // שמירה במסד הנתונים
    await prisma.supplier.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    // ביטול קשינג של דף הספקים
    revalidateTag("suppliers");

    // הפניה לדף הספקים
    redirect("/dashboard/suppliers");
  } catch (error) {
    if (error instanceof z.ZodError) {
      // במקום להחזיר אובייקט שגיאה, נזרוק שגיאה
      throw error;
    }
    throw error;
  }
}

// קומפוננטת הטופס
function SupplierForm() {
  return (
    <form action={createSupplier} id="supplier-form">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>פרטי ספק</CardTitle>
              <CardDescription>הזן את פרטי הספק הבסיסיים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">קוד ספק</Label>
                  <Input id="code" name="code" placeholder="SUP001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">שם ספק</Label>
                  <Input id="name" name="name" placeholder="שם הספק" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">תיאור</Label>
                <Textarea id="description" name="description" placeholder="תיאור קצר של הספק" rows={3} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">סוג ספק</Label>
                  <Select name="type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג ספק" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturer">יצרן</SelectItem>
                      <SelectItem value="distributor">מפיץ</SelectItem>
                      <SelectItem value="wholesaler">סיטונאי</SelectItem>
                      <SelectItem value="retailer">קמעונאי</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">קטגוריה</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר קטגוריה" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clothing">ביגוד</SelectItem>
                      <SelectItem value="electronics">אלקטרוניקה</SelectItem>
                      <SelectItem value="food">מזון</SelectItem>
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>פרטי קשר</CardTitle>
              <CardDescription>הזן את פרטי הקשר של הספק</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_name">איש קשר</Label>
                  <Input id="contact_name" name="contact_name" placeholder="שם איש הקשר" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">תפקיד</Label>
                  <Input id="position" name="position" placeholder="תפקיד איש הקשר" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <Input id="email" name="email" type="email" placeholder="example@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input id="phone" name="phone" placeholder="050-1234567" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">כתובת</Label>
                <Input id="address" name="address" placeholder="כתובת מלאה" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">עיר</Label>
                  <Input id="city" name="city" placeholder="עיר" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">מיקוד</Label>
                  <Input id="zip" name="zip" placeholder="מיקוד" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">מדינה</Label>
                  <Select name="country" defaultValue="israel" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="israel">ישראל</SelectItem>
                      <SelectItem value="usa">ארה"ב</SelectItem>
                      <SelectItem value="uk">בריטניה</SelectItem>
                      <SelectItem value="china">סין</SelectItem>
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>פרטי תשלום</CardTitle>
              <CardDescription>הגדר את פרטי התשלום לספק</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="payment_terms">תנאי תשלום</Label>
                  <Select name="payment_terms" required>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר תנאי תשלום" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">מיידי</SelectItem>
                      <SelectItem value="net15">שוטף + 15</SelectItem>
                      <SelectItem value="net30">שוטף + 30</SelectItem>
                      <SelectItem value="net60">שוטף + 60</SelectItem>
                      <SelectItem value="net90">שוטף + 90</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">מטבע</Label>
                  <Select name="currency" defaultValue="ils" required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ils">₪ שקל</SelectItem>
                      <SelectItem value="usd">$ דולר</SelectItem>
                      <SelectItem value="eur">€ יורו</SelectItem>
                      <SelectItem value="gbp">£ ליש"ט</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bank_name">שם בנק</Label>
                  <Input id="bank_name" name="bank_name" placeholder="שם הבנק" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_branch">סניף</Label>
                  <Input id="bank_branch" name="bank_branch" placeholder="מספר סניף" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="account_number">מספר חשבון</Label>
                  <Input id="account_number" name="account_number" placeholder="מספר חשבון" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax_id">מספר עוסק/ח.פ.</Label>
                  <Input id="tax_id" name="tax_id" placeholder="מספר עוסק או ח.פ." />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>סטטוס ספק</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ספק פעיל</Label>
                  <p className="text-sm text-muted-foreground">האם הספק פעיל במערכת</p>
                </div>
                <Switch name="is_active" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>ספק מועדף</Label>
                  <p className="text-sm text-muted-foreground">סמן כספק מועדף</p>
                </div>
                <Switch name="is_preferred" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הערות</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea name="notes" placeholder="הערות נוספות לגבי הספק" rows={5} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>מסמכים</CardTitle>
              <CardDescription>העלה מסמכים הקשורים לספק</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">גרור קבצים לכאן או לחץ להעלאה</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

// דף ראשי
export default async function AddSupplierPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/suppliers">
            <Button variant="outline" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">הוספת ספק חדש</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/suppliers">
            <Button variant="outline">ביטול</Button>
          </Link>
          <Button type="submit" form="supplier-form">
            <Save className="mr-2 h-4 w-4" />
            שמור ספק
          </Button>
        </div>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <SupplierForm />
      </Suspense>
    </div>
  );
}

