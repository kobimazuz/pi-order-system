import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { Navbar } from "../components/navbar"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

const plans = [
  {
    name: "בסיסי",
    price: "חינם",
    description: "מושלם לעסקים קטנים המתחילים את דרכם",
    features: [
      "עד 50 מוצרים",
      "5 הזמנות PI בחודש",
      "ייצוא לאקסל בסיסי",
      "תמיכה בדוא״ל",
    ],
  },
  {
    name: "מקצועי",
    price: "₪199",
    period: "לחודש",
    description: "לעסקים צומחים הזקוקים ליותר יכולות",
    features: [
      "עד 500 מוצרים",
      "הזמנות PI ללא הגבלה",
      "ייצוא לאקסל מותאם אישית",
      "תמיכה בצ׳אט",
      "ניהול ספקים מתקדם",
      "דוחות וניתוח נתונים",
    ],
    popular: true,
  },
  {
    name: "עסקי",
    price: "₪499",
    period: "לחודש",
    description: "לעסקים גדולים הזקוקים לפתרון מקיף",
    features: [
      "מוצרים ללא הגבלה",
      "הזמנות PI ללא הגבלה",
      "ייצוא לאקסל מותאם אישית",
      "תמיכה VIP",
      "ניהול ספקים מתקדם",
      "דוחות וניתוח נתונים מתקדמים",
      "API גישה",
      "שילוב עם מערכות חיצוניות",
    ],
  },
]

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              תוכניות מחירים פשוטות ושקופות
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              בחר את התוכנית המתאימה לך ותתחיל לנהל את הזמנות הספקים שלך בצורה חכמה יותר
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${
                  plan.popular ? "border-2" : "border"
                } border-primary shadow-lg hover:shadow-xl transition-shadow duration-300`}
              >
                {plan.popular && (
                  <div
                    className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 rounded-full text-white text-sm font-medium"
                    style={{ backgroundColor: brandColors.goldenOrange }}
                  >
                    הכי פופולרי
                  </div>
                )}
                <CardHeader>
                  <CardTitle>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold" style={{ color: brandColors.deepTeal }}>
                        {plan.price}
                      </span>
                      {plan.period && <span className="text-gray-600">/ {plan.period}</span>}
                    </div>
                  </CardTitle>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    <Link href="/auth">
                      <Button
                        className="w-full text-lg"
                        variant={plan.popular ? "default" : "outline"}
                        style={
                          plan.popular
                            ? { backgroundColor: brandColors.deepTeal }
                            : { borderColor: brandColors.deepTeal, color: brandColors.deepTeal }
                        }
                      >
                        {plan.price === "חינם" ? "התחל עכשיו" : "התחל ניסיון חינם"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center mb-12" style={{ color: brandColors.darkGray }}>
              שאלות נפוצות
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">האם יש תקופת ניסיון?</h3>
                  <p className="text-gray-600">
                    כן, אנחנו מציעים 14 ימי ניסיון חינם לתוכניות המקצועי והעסקי, ללא התחייבות.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">האם אפשר לשדרג תוכנית?</h3>
                  <p className="text-gray-600">
                    כן, ניתן לשדרג או לשנמך את התוכנית בכל עת. החיוב יתעדכן בהתאם.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">איך מתבצע החיוב?</h3>
                  <p className="text-gray-600">
                    החיוב מתבצע באופן חודשי. ניתן לבטל בכל עת ללא קנסות.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">האם המחירים כוללים מע״מ?</h3>
                  <p className="text-gray-600">
                    כן, כל המחירים המוצגים כוללים מע״מ.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              עדיין מתלבט?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              צוות התמיכה שלנו כאן כדי לעזור לך לבחור את התוכנית המתאימה ביותר עבורך
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="text-lg px-8"
                variant="outline"
                style={{ borderColor: brandColors.deepTeal, color: brandColors.deepTeal }}
              >
                דבר איתנו
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 