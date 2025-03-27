import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Send, FileQuestion, BookOpen, MessageSquare } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">תמיכה</h1>
      </div>

      <Tabs defaultValue="contact" className="space-y-4">
        <TabsList>
          <TabsTrigger value="contact">יצירת קשר</TabsTrigger>
          <TabsTrigger value="faq">שאלות נפוצות</TabsTrigger>
          <TabsTrigger value="docs">תיעוד</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>צור קשר עם התמיכה</CardTitle>
                <CardDescription>שלח לנו הודעה ונחזור אליך בהקדם</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם מלא</Label>
                    <Input id="name" placeholder="הזן את שמך" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">אימייל</Label>
                    <Input id="email" type="email" placeholder="הזן את האימייל שלך" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">נושא</Label>
                  <Input id="subject" placeholder="נושא ההודעה" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">הודעה</Label>
                  <Textarea id="message" placeholder="תוכן ההודעה" rows={6} />
                </div>
              </CardContent>
              <CardFooter>
                <Button>
                  <Send className="mr-2 h-4 w-4" />
                  שלח הודעה
                </Button>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>פרטי התקשרות</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="font-medium">טלפון</p>
                    <p className="text-sm">03-1234567</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">אימייל</p>
                    <p className="text-sm">support@example.com</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">שעות פעילות</p>
                    <p className="text-sm">א'-ה': 09:00-17:00</p>
                    <p className="text-sm">ו': 09:00-13:00</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>צ׳אט תמיכה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">צוות התמיכה שלנו זמין בצ׳אט בשעות הפעילות</p>
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    התחל צ׳אט
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>שאלות נפוצות</CardTitle>
              <CardDescription>תשובות לשאלות הנפוצות ביותר</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>איך יוצרים הזמנת PI חדשה?</AccordionTrigger>
                  <AccordionContent>
                    ליצירת הזמנת PI חדשה, יש לגשת לדף "יצירת PI" בתפריט הראשי. בדף זה תוכלו לבחור מוצרים מהקטגוריות
                    השונות, להזין כמויות ולייצא את ההזמנה לקובץ אקסל.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>איך מוסיפים מוצר חדש למערכת?</AccordionTrigger>
                  <AccordionContent>
                    להוספת מוצר חדש, יש לגשת לדף "מוצרים" וללחוץ על כפתור "הוסף מוצר". בטופס שייפתח יש למלא את כל פרטי
                    המוצר הנדרשים כולל שם, תיאור, מחיר, קטגוריה, צבעים ומידות זמינים.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>איך מייצאים הזמנה לאקסל?</AccordionTrigger>
                  <AccordionContent>
                    לאחר יצירת הזמנת PI והוספת כל המוצרים הרצויים, יש ללחוץ על כפתור "ייצא PI לאקסל" בתחתית דף ההזמנה.
                    המערכת תייצר קובץ אקסל מעוצב עם כל פרטי ההזמנה והמוצרים.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>איך מעדכנים פרטי מוצר קיים?</AccordionTrigger>
                  <AccordionContent>
                    לעדכון פרטי מוצר, יש לגשת לדף "מוצרים", לאתר את המוצר הרצוי ברשימה וללחוץ על אייקון העריכה (עיפרון)
                    בשורת המוצר. בדף העריכה שייפתח ניתן לשנות את כל פרטי המוצר ולשמור את השינויים.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>איך מפיקים דוחות במערכת?</AccordionTrigger>
                  <AccordionContent>
                    להפקת דוחות, יש לגשת לדף "דוחות" בתפריט הראשי. בדף זה ניתן לבחור את סוג הדוח הרצוי, להגדיר טווח
                    תאריכים וקטגוריות, ולהפיק את הדוח בפורמט גרף או טבלה. ניתן גם לייצא את הדוחות לקבצי אקסל, PDF או
                    CSV.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>תיעוד המערכת</CardTitle>
              <CardDescription>מדריכים ותיעוד לשימוש במערכת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">מדריך למשתמש</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">מדריך מקיף לשימוש בכל חלקי המערכת</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      צפה במדריך
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">מדריך ניהול מוצרים</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">הוספה, עריכה וניהול מוצרים במערכת</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      צפה במדריך
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">מדריך יצירת PI</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">יצירת הזמנות PI וייצוא לאקסל</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      צפה במדריך
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">מדריך דוחות</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">הפקת וניתוח דוחות במערכת</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      צפה במדריך
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">מדריך למנהל מערכת</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">ניהול משתמשים והגדרות מערכת</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <FileQuestion className="mr-2 h-4 w-4" />
                      צפה במדריך
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">וידאו הדרכה</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">סרטוני הדרכה לשימוש במערכת</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <BookOpen className="mr-2 h-4 w-4" />
                      צפה בסרטונים
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

