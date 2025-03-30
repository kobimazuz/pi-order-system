import type React from "react"
import { Navbar } from "@/app/components/navbar"
import { useTranslation } from "@/app/i18n"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

export default async function ContactPage({
  params: { lng }
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "translation")

  const contactMethods = [
    {
      title: t("contact.methods.email.title"),
      description: t("contact.methods.email.description"),
      icon: "📧",
      link: `mailto:${t("contact.email")}`,
      linkText: t("contact.methods.email.action"),
    },
    {
      title: t("contact.methods.phone.title"),
      description: t("contact.methods.phone.description"),
      icon: "📞",
      link: `tel:${t("contact.phone")}`,
      linkText: t("contact.methods.phone.action"),
    },
    {
      title: t("contact.methods.chat.title"),
      description: t("contact.methods.chat.description"),
      icon: "💬",
      link: "#",
      linkText: t("contact.methods.chat.action"),
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
              {t("contact.title")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{ color: brandColors.deepTeal }}>
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <a
                  href={method.link}
                  className="inline-flex items-center text-lg font-medium hover:underline"
                  style={{ color: brandColors.goldenOrange }}
                >
                  {method.linkText}
                </a>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-2xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              {t("contact.form.title")}
            </h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.form.firstName")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("contact.form.firstNamePlaceholder")}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("contact.form.lastName")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("contact.form.lastNamePlaceholder")}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contact.form.email")}
                </label>
                <Input
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contact.form.subject")}
                </label>
                <Input
                  type="text"
                  placeholder={t("contact.form.subjectPlaceholder")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("contact.form.message")}
                </label>
                <Textarea
                  placeholder={t("contact.form.messagePlaceholder")}
                  rows={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full text-white"
                style={{ backgroundColor: brandColors.deepTeal }}
              >
                {t("contact.form.submit")}
              </Button>
            </form>
          </div>

          {/* Office Information */}
          <div className="text-center mt-24">
            <h2 className="text-3xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
              {t("contact.office.title")}
            </h2>
            <p className="text-xl text-gray-600">
              {t("contact.office.address")}
            </p>
            <p className="text-xl text-gray-600">
              {t("contact.office.hours")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 