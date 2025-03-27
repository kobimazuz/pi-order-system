import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileSpreadsheet, Package, ClipboardList, BarChart3, Truck, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header with theme toggle */}
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">מערכת ניהול הזמנות PI</h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          פתרון מקיף לניהול הזמנות PI, מעקב אחר מוצרים וייצוא נתונים לאקסל בקלות ובמהירות
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8">
              התחל בחינם
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8">
              גלה עוד
            </Button>
          </Link>
        </div>
      </header>

      {/* Dashboard Preview */}
      <section className="container mx-auto px-4 py-12">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="תצוגת דשבורד המערכת"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">תכונות מרכזיות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileSpreadsheet className="h-10 w-10 text-primary" />}
            title="ייצוא לאקסל"
            description="ייצא הזמנות PI לקבצי אקסל מעוצבים בלחיצת כפתור"
          />
          <FeatureCard
            icon={<Package className="h-10 w-10 text-primary" />}
            title="ניהול מוצרים"
            description="נהל את מלאי המוצרים, קטגוריות, צבעים ומידות בממשק ידידותי"
          />
          <FeatureCard
            icon={<ClipboardList className="h-10 w-10 text-primary" />}
            title="יצירת הזמנות"
            description="צור הזמנות PI חדשות בקלות עם ממשק משתמש אינטואיטיבי"
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-primary" />}
            title="דוחות וסטטיסטיקות"
            description="קבל תובנות עסקיות עם דוחות מפורטים וגרפים אינטראקטיביים"
          />
          <FeatureCard
            icon={<Truck className="h-10 w-10 text-primary" />}
            title="ניהול ספקים"
            description="שמור ונהל את פרטי הספקים שלך במקום אחד"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="אבטחה מתקדמת"
            description="הנתונים שלך מאובטחים עם טכנולוגיות אבטחה מתקדמות"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">איך זה עובד?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">הרשמה מהירה</h3>
              <p className="text-gray-600">הירשם למערכת בחינם והתחל להשתמש בה מיד</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">הגדרת המערכת</h3>
              <p className="text-gray-600">הוסף את המוצרים, הספקים והקטגוריות שלך</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">יצירת הזמנות</h3>
              <p className="text-gray-600">צור הזמנות PI וייצא אותן לאקסל בקלות</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">לקוחות מספרים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            quote="המערכת חסכה לנו שעות רבות של עבודה ידנית. כעת אנחנו יכולים ליצור הזמנות PI במהירות ובקלות."
            author="ישראל ישראלי"
            company="חברת אופנה בע״מ"
          />
          <TestimonialCard
            quote="הממשק אינטואיטיבי ונוח לשימוש. הצוות שלנו למד להשתמש במערכת תוך יום אחד בלבד."
            author="שרה כהן"
            company="יבוא ושיווק בע״מ"
          />
          <TestimonialCard
            quote="היכולת לייצא הזמנות לאקסל בפורמט מותאם אישית חסכה לנו זמן רב ושיפרה את התקשורת עם הספקים שלנו."
            author="דוד לוי"
            company="רשת חנויות הלבשה"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">מוכנים להתחיל?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">הצטרפו למאות עסקים שכבר משתמשים במערכת ניהול הזמנות PI שלנו</p>
          <Link href="/auth">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              התחל בחינם
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-primary">מערכת PI</h3>
              <p className="text-gray-600 mt-2">פתרון מקיף לניהול הזמנות PI</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-bold mb-2">קישורים</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#features" className="text-gray-600 hover:text-primary">
                      תכונות
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth" className="text-gray-600 hover:text-primary">
                      התחברות
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth" className="text-gray-600 hover:text-primary">
                      תמיכה
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">צור קשר</h4>
                <ul className="space-y-2">
                  <li className="text-gray-600">info@pi-system.com</li>
                  <li className="text-gray-600">03-1234567</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} מערכת PI. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, author, company }: { quote: string; author: string; company: string }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <p className="text-gray-600 mb-4">"{quote}"</p>
        <div>
          <p className="font-bold">{author}</p>
          <p className="text-gray-500 text-sm">{company}</p>
        </div>
      </CardContent>
    </Card>
  )
}

