import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileSpreadsheet, Package, ClipboardList, BarChart3, Truck, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "../components/navbar"

// Define brand colors
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
          FlexiPI - ניהול הזמנות ספקים מתקדם
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          פלטפורמה אוטומטית לניהול קטלוג מוצרים, יצירת הזמנות PI וניהול ספקים - הכל במקום אחד
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8" style={{ backgroundColor: brandColors.deepTeal }}>
              התחל בחינם
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8" style={{ borderColor: brandColors.goldenOrange, color: brandColors.goldenOrange }}>
              גלה עוד
            </Button>
          </Link>
        </div>
      </header>

      {/* Dashboard Preview */}
      <section className="container mx-auto px-4 py-12">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border">
          <Image
            src="/dashboard-preview.png"
            alt="תצוגת מערכת FlexiPI"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: brandColors.darkGray }}>
          יתרונות המערכת
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileSpreadsheet className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title="יצירת PI אוטומטית"
            description="צור הזמנות PI מקצועיות בלחיצת כפתור, כולל חישובי כמויות ומחירים"
          />
          <FeatureCard
            icon={<Package className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title="ניהול קטלוג מוצרים"
            description="נהל את כל פרטי המוצרים, תמונות, מחירים ופרטי אריזה במקום אחד"
          />
          <FeatureCard
            icon={<ClipboardList className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title="ייצוא לאקסל"
            description="ייצא הזמנות לאקסל בפורמט מותאם אישית, כולל תמונות ופרטים מלאים"
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title="ניתוח נתונים"
            description="קבל תובנות עסקיות וסטטיסטיקות על הזמנות וספקים"
          />
          <FeatureCard
            icon={<Truck className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title="ניהול ספקים"
            description="רכז את כל המידע על הספקים והתקשורת איתם במערכת אחת"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title="אבטחה מתקדמת"
            description="המידע שלך מאובטח עם טכנולוגיות אבטחה מתקדמות"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: brandColors.darkGray }}>
            איך זה עובד?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.deepTeal}20` }}>
                <span className="text-2xl font-bold" style={{ color: brandColors.deepTeal }}>1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">הרשמה מהירה</h3>
              <p className="text-gray-600">הירשם למערכת בחינם והתחל להשתמש בה מיד</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.deepTeal}20` }}>
                <span className="text-2xl font-bold" style={{ color: brandColors.deepTeal }}>2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ניהול מוצרים וספקים</h3>
              <p className="text-gray-600">הוסף את המוצרים, הספקים והקטגוריות שלך למערכת</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.deepTeal}20` }}>
                <span className="text-2xl font-bold" style={{ color: brandColors.deepTeal }}>3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">יצירת הזמנות</h3>
              <p className="text-gray-600">צור הזמנות PI וייצא אותן לאקסל בקלות</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: brandColors.deepTeal }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">מוכנים להתחיל?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            הצטרפו למאות עסקים שכבר משפרים את ניהול ההזמנות שלהם עם FlexiPI
          </p>
          <Link href="/auth">
            <Button size="lg" className="text-lg px-8" style={{ backgroundColor: brandColors.goldenOrange }}>
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
              <Image
                src="/placeholder-logo.svg"
                alt="FlexiPI Logo"
                width={100}
                height={35}
                className="h-8 w-auto mb-2"
              />
              <p className="text-gray-600">פתרון מקיף לניהול הזמנות ספקים</p>
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
                    <Link href="/pricing" className="text-gray-600 hover:text-primary">
                      מחירים
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth" className="text-gray-600 hover:text-primary">
                      התחברות
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">משאבים</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/faq" className="text-gray-600 hover:text-primary">
                      שאלות נפוצות
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-gray-600 hover:text-primary">
                      תמיכה
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-600 hover:text-primary">
                      צור קשר
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">משפטי</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="text-gray-600 hover:text-primary">
                      תנאי שימוש
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-gray-600 hover:text-primary">
                      מדיניות פרטיות
                    </Link>
                  </li>
                  <li>
                    <Link href="/accessibility" className="text-gray-600 hover:text-primary">
                      נגישות
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© {new Date().getFullYear()} FlexiPI. כל הזכויות שמורות.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  )
}

