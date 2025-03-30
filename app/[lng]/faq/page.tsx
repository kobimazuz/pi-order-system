import type React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Navbar } from "@/app/components/navbar"
import { useTranslation } from "@/app/i18n"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

export default async function FAQPage({
  params: { lng }
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "translation")

  const faqCategories = [
    {
      title: t("faq.general.title"),
      questions: [
        {
          q: t("faq.general.q1"),
          a: t("faq.general.a1"),
        },
        {
          q: t("faq.general.q2"),
          a: t("faq.general.a2"),
        },
        {
          q: t("faq.general.q3"),
          a: t("faq.general.a3"),
        },
      ],
    },
    {
      title: t("faq.features.title"),
      questions: [
        {
          q: t("faq.features.q1"),
          a: t("faq.features.a1"),
        },
        {
          q: t("faq.features.q2"),
          a: t("faq.features.a2"),
        },
        {
          q: t("faq.features.q3"),
          a: t("faq.features.a3"),
        },
      ],
    },
    {
      title: t("faq.technical.title"),
      questions: [
        {
          q: t("faq.technical.q1"),
          a: t("faq.technical.a1"),
        },
        {
          q: t("faq.technical.q2"),
          a: t("faq.technical.a2"),
        },
        {
          q: t("faq.technical.q3"),
          a: t("faq.technical.a3"),
        },
      ],
    },
    {
      title: t("faq.support.title"),
      questions: [
        {
          q: t("faq.support.q1"),
          a: t("faq.support.a1"),
        },
        {
          q: t("faq.support.q2"),
          a: t("faq.support.a2"),
        },
        {
          q: t("faq.support.q3"),
          a: t("faq.support.a3"),
        },
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
              {t("faq.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("faq.subtitle")}
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
              {t("faq.notFound.title")}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {t("faq.notFound.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${t("contact.email")}`}
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md text-white"
                style={{ backgroundColor: brandColors.deepTeal }}
              >
                {t("faq.notFound.emailUs")}
              </a>
              <a
                href={`/${lng}/contact`}
                className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-md border"
                style={{ borderColor: brandColors.deepTeal, color: brandColors.deepTeal }}
              >
                {t("faq.notFound.contact")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 