import type React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Navbar } from "../components/navbar"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

const faqCategories = [
  {
    title: "כללי",
    questions: [
      {
        q: "מה זה FlexiPI?",
        a: "FlexiPI היא פלטפורמה מתקדמת לניהול הזמנות ספקים (PI) המיועדת במיוחד לבעלי חנויות אי-קומרס. המערכת מאפשרת ניהול קטלוג מוצרים, יצירת הזמנות אוטומטיות וייצוא לאקסל בפורמט מותאם אישית.",
      },
      {
        q: "למי מיועדת המערכת?",
        a: "המערכת מיועדת לעסקים המזמינים מוצרים מספקים בחו״ל, במיוחד בעלי חנויות אי-קומרס. היא מתאימה לעסקים בכל גודל, מעסקים קטנים ועד רשתות גדולות.",
      },
      {
        q: "האם המערכת מתאימה לכל סוגי העסקים?",
        a: "המערכת מתאימה במיוחד לעסקים בתחום האופנה, מוצרי צריכה, אלקטרוניקה וכל תחום אחר שבו נדרשת הזמנת מוצרים מספקים בחו״ל.",
      },
    ],
  },
  {
    title: "תכונות ויכולות",
    questions: [
      {
        q: "אילו סוגי קבצים ניתן לייצא מהמערכת?",
        a: "המערכת מאפשרת ייצוא הזמנות PI לקבצי אקסל בפורמט מותאם אישית. הקבצים כוללים את כל פרטי ההזמנה, כולל תמונות מוצרים, כמויות, מחירים ופרטי אריזה.",
      },
      {
        q: "האם ניתן לנהל מספר ספקים במערכת?",
        a: "כן, המערכת מאפשרת ניהול של מספר בלתי מוגבל של ספקים (בהתאם לחבילה שנבחרה). לכל ספק ניתן לשמור פרטי קשר, היסטוריית הזמנות ופרטים נוספים.",
      },
      {
        q: "האם המערכת תומכת בשפות שונות?",
        a: "כן, המערכת תומכת בעברית ואנגלית באופן מלא. ממשק המשתמש וכל התוכן זמינים בשתי השפות.",
      },
    ],
  },
  {
    title: "טכני ואבטחה",
    questions: [
      {
        q: "איך מאובטח המידע שלי במערכת?",
        a: "אנו משתמשים בטכנולוגיות אבטחה מתקדמות להגנה על המידע שלך, כולל הצפנת SSL, אימות דו-שלבי, וגיבויים אוטומטיים. כל המידע נשמר בשרתים מאובטחים ומגובים.",
      },
      {
        q: "האם ניתן לייצא את הנתונים שלי מהמערכת?",
        a: "כן, ניתן לייצא את כל הנתונים שלך מהמערכת בכל עת. אנו מספקים אפשרויות ייצוא לפורמטים שונים כולל Excel ו-CSV.",
      },
      {
        q: "האם יש אפשרות לשלב את המערכת עם מערכות אחרות?",
        a: "כן, בחבילה העסקית אנו מספקים גישת API שמאפשרת אינטגרציה עם מערכות חיצוניות כגון מערכות ERP, מערכות ניהול מלאי ופלטפורמות אי-קומרס.",
      },
    ],
  },
  {
    title: "תמיכה ותשלומים",
    questions: [
      {
        q: "איזו תמיכה מקבלים?",
        a: "אנו מספקים תמיכה בהתאם לחבילה שנבחרה: תמיכה בדוא״ל בחבילה הבסיסית, תמיכה בצ׳אט בחבילה המקצועית, ותמיכת VIP עם מנהל תיק לקוח בחבילה העסקית.",
      },
      {
        q: "מה כולל תהליך ההדרכה הראשוני?",
        a: "כל לקוח חדש מקבל הדרכה מקיפה על המערכת, כולל וובינר הדרכה, גישה למדריכי וידאו, ותיעוד מפורט. לקוחות בחבילה העסקית מקבלים גם הדרכה אישית.",
      },
      {
        q: "האם יש התחייבות לתקופה מינימלית?",
        a: "לא, אין התחייבות לתקופה מינימלית. ניתן לבטל את המנוי בכל עת ללא קנסות. החיוב הוא חודשי והתשלום מתבצע בתחילת כל חודש.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              שאלות נפוצות
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              מצא תשובות לשאלות הנפוצות ביותר על מערכת FlexiPI
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, index) => (
              <div key={category.title} className={index > 0 ? "mt-12" : ""}>
                <h2
                  className="text-2xl font-bold mb-6"
                  style={{ color: brandColors.deepTeal }}
                >
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((item, qIndex) => (
                    <AccordionItem
                      key={qIndex}
                      value={`${index}-${qIndex}`}
                      className="bg-white rounded-lg border p-4"
                    >
                      <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600 pt-2">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Still Have Questions */}
          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              לא מצאת תשובה לשאלה שלך?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              צוות התמיכה שלנו זמין לכל שאלה
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@flexipi.com"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md text-white"
                style={{ backgroundColor: brandColors.deepTeal }}
              >
                שלח לנו מייל
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md border"
                style={{ borderColor: brandColors.deepTeal, color: brandColors.deepTeal }}
              >
                צור קשר
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 