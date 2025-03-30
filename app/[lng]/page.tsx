import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileSpreadsheet, Package, ClipboardList, BarChart3, Truck, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/app/components/navbar"
import { useTranslation } from "@/app/i18n"

// Define brand colors
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

export default async function LandingPage({
  params: { lng }
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "translation")

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <Navbar lng={lng} t={t} />

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: brandColors.darkGray }}>
          {t("hero.title")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${lng}/auth`}>
            <Button size="lg" className="text-lg px-8" style={{ backgroundColor: brandColors.deepTeal }}>
              {t("hero.cta")}
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8" style={{ borderColor: brandColors.goldenOrange, color: brandColors.goldenOrange }}>
              {t("hero.viewDemo")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Dashboard Preview */}
      <section className="container mx-auto px-4 py-12">
        <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl border">
          <Image
            src="/dashboard-preview.png"
            alt="FlexiPI Dashboard Preview"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/5"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: brandColors.darkGray }}>
          {t("features.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<FileSpreadsheet className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title={t("features.automatedPI.title")}
            description={t("features.automatedPI.description")}
          />
          <FeatureCard
            icon={<Package className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title={t("features.catalog.title")}
            description={t("features.catalog.description")}
          />
          <FeatureCard
            icon={<ClipboardList className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title={t("features.exports.title")}
            description={t("features.exports.description")}
          />
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title={t("features.tracking.title")}
            description={t("features.tracking.description")}
          />
          <FeatureCard
            icon={<Truck className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title={t("benefits.efficiency.title")}
            description={t("benefits.efficiency.description")}
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10" style={{ color: brandColors.deepTeal }} />}
            title={t("benefits.reliability.title")}
            description={t("benefits.reliability.description")}
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: brandColors.darkGray }}>
            {t("howItWorks.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.deepTeal}20` }}>
                <span className="text-2xl font-bold" style={{ color: brandColors.deepTeal }}>{t("howItWorks.step1.number")}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.step1.title")}</h3>
              <p className="text-gray-600">{t("howItWorks.step1.description")}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.deepTeal}20` }}>
                <span className="text-2xl font-bold" style={{ color: brandColors.deepTeal }}>{t("howItWorks.step2.number")}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.step2.title")}</h3>
              <p className="text-gray-600">{t("howItWorks.step2.description")}</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${brandColors.deepTeal}20` }}>
                <span className="text-2xl font-bold" style={{ color: brandColors.deepTeal }}>{t("howItWorks.step3.number")}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{t("howItWorks.step3.title")}</h3>
              <p className="text-gray-600">{t("howItWorks.step3.description")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: brandColors.deepTeal }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">{t("cta.title")}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            {t("cta.subtitle")}
          </p>
          <Link href={`/${lng}/auth`}>
            <Button size="lg" className="text-lg px-8" style={{ backgroundColor: brandColors.goldenOrange }}>
              {t("cta.button")}
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
              <p className="text-gray-600">{t("footer.tagline")}</p>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div>
                <h4 className="font-bold mb-2">{t("footer.product")}</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#features" className="text-gray-600 hover:text-primary">
                      {t("nav.features")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lng}/pricing`} className="text-gray-600 hover:text-primary">
                      {t("nav.pricing")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lng}/auth`} className="text-gray-600 hover:text-primary">
                      {t("nav.login")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">{t("footer.company")}</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href={`/${lng}/faq`} className="text-gray-600 hover:text-primary">
                      {t("nav.faq")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lng}/contact`} className="text-gray-600 hover:text-primary">
                      {t("nav.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2">{t("footer.legal")}</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href={`/${lng}/terms`} className="text-gray-600 hover:text-primary">
                      {t("footer.termsOfService")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lng}/privacy`} className="text-gray-600 hover:text-primary">
                      {t("footer.privacyPolicy")}
                    </Link>
                  </li>
                  <li>
                    <Link href={`/${lng}/accessibility`} className="text-gray-600 hover:text-primary">
                      {t("footer.accessibility")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>{t("footer.copyright")}</p>
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