import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/app/components/navbar"
import { useTranslation } from "@/app/i18n"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

export default async function PricingPage({
  params: { lng }
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "translation")

  const plans = [
    {
      name: t("pricing.basic.name"),
      price: t("pricing.basic.price"),
      description: t("pricing.basic.description"),
      features: [
        t("pricing.basic.features.f1"),
        t("pricing.basic.features.f2"),
        t("pricing.basic.features.f3"),
        t("pricing.basic.features.f4"),
      ],
    },
    {
      name: t("pricing.pro.name"),
      price: t("pricing.pro.price"),
      period: t("pricing.pro.period"),
      description: t("pricing.pro.description"),
      features: [
        t("pricing.pro.features.f1"),
        t("pricing.pro.features.f2"),
        t("pricing.pro.features.f3"),
        t("pricing.pro.features.f4"),
        t("pricing.pro.features.f5"),
        t("pricing.pro.features.f6"),
      ],
      popular: true,
    },
    {
      name: t("pricing.business.name"),
      price: t("pricing.business.price"),
      period: t("pricing.business.period"),
      description: t("pricing.business.description"),
      features: [
        t("pricing.business.features.f1"),
        t("pricing.business.features.f2"),
        t("pricing.business.features.f3"),
        t("pricing.business.features.f4"),
        t("pricing.business.features.f5"),
        t("pricing.business.features.f6"),
        t("pricing.business.features.f7"),
        t("pricing.business.features.f8"),
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar lng={lng} t={t} />

      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              {t("pricing.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("pricing.subtitle")}
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
                    {t("pricing.mostPopular")}
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
                    <Link href={`/${lng}/auth`}>
                      <Button
                        className="w-full text-lg"
                        variant={plan.popular ? "default" : "outline"}
                        style={
                          plan.popular
                            ? { backgroundColor: brandColors.deepTeal }
                            : { borderColor: brandColors.deepTeal, color: brandColors.deepTeal }
                        }
                      >
                        {plan.price === t("pricing.basic.price") ? t("pricing.startNow") : t("pricing.startTrial")}
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
              {t("pricing.faq.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{t("pricing.faq.q1")}</h3>
                  <p className="text-gray-600">
                    {t("pricing.faq.a1")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{t("pricing.faq.q2")}</h3>
                  <p className="text-gray-600">
                    {t("pricing.faq.a2")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{t("pricing.faq.q3")}</h3>
                  <p className="text-gray-600">
                    {t("pricing.faq.a3")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{t("pricing.faq.q4")}</h3>
                  <p className="text-gray-600">
                    {t("pricing.faq.a4")}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              {t("pricing.stillDeciding")}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t("pricing.talkToUs")}
            </p>
            <Link href={`/${lng}/contact`}>
              <Button
                size="lg"
                className="text-lg px-8"
                variant="outline"
                style={{ borderColor: brandColors.deepTeal, color: brandColors.deepTeal }}
              >
                {t("pricing.contactUs")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 