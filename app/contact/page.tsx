import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Navbar } from "../components/navbar"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

const contactInfo = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: "דוא״ל",
    details: ["support@flexipi.com", "sales@flexipi.com"],
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "טלפון",
    details: ["03-1234567", "054-1234567"],
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "כתובת",
    details: ["רחוב הברזל 3", "תל אביב, ישראל"],
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "שעות פעילות",
    details: ["א׳-ה׳: 09:00-18:00", "ו׳: 09:00-13:00"],
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar />

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              צור קשר
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              צוות התמיכה שלנו כאן כדי לעזור. מלא את הטופס או השתמש באחת מדרכי ההתקשרות הנוספות
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">שם מלא</label>
                          <Input placeholder="הכנס את שמך המלא" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">דוא״ל</label>
                          <Input type="email" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">טלפון</label>
                        <Input type="tel" placeholder="050-1234567" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">נושא הפנייה</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="בחר נושא" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">שאלה כללית</SelectItem>
                            <SelectItem value="sales">מכירות ותמחור</SelectItem>
                            <SelectItem value="support">תמיכה טכנית</SelectItem>
                            <SelectItem value="feature">בקשת תכונה חדשה</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">תוכן הפנייה</label>
                        <Textarea
                          placeholder="כתוב את הודעתך כאן..."
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                    <Button
                      className="w-full text-lg"
                      style={{ backgroundColor: brandColors.deepTeal }}
                    >
                      שלח הודעה
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${brandColors.deepTeal}20`, color: brandColors.deepTeal }}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="font-bold mb-2">{item.title}</h3>
                          {item.details.map((detail, i) => (
                            <p key={i} className="text-gray-600">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map */}
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-video w-full bg-gray-100 rounded-lg">
                    {/* כאן יש להוסיף את המפה האינטראקטיבית */}
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      מפה אינטראקטיבית
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4">עקבו אחרינו</h3>
                  <div className="flex gap-4">
                    <a
                      href="#"
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${brandColors.deepTeal}20`, color: brandColors.deepTeal }}
                    >
                      LinkedIn
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${brandColors.deepTeal}20`, color: brandColors.deepTeal }}
                    >
                      Twitter
                    </a>
                    <a
                      href="#"
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${brandColors.deepTeal}20`, color: brandColors.deepTeal }}
                    >
                      Facebook
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 