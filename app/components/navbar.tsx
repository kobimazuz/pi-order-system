import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import LanguageSwitcher from "./language-switcher"

// Define brand colors from landing page
const brandColors = {
  deepTeal: "#008F8C",
  goldenOrange: "#FF9800",
  darkGray: "#2E2E2E",
}

interface NavbarProps {
  lng: string
  t: (key: string) => string
}

export function Navbar({ lng, t }: NavbarProps) {
  const navLinks = [
    { href: `/${lng}`, label: t("nav.home") },
    { href: `/${lng}/pricing`, label: t("nav.pricing") },
    { href: `/${lng}/faq`, label: t("nav.faq") },
    { href: `/${lng}/contact`, label: t("nav.contact") },
  ]

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${lng}`} className="flex items-center gap-2">
            <Image
              src="/placeholder-logo.svg"
              alt="FlexiPI Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher lng={lng} />
            <Link href={`/${lng}/auth`}>
              <Button
                variant="outline"
                className="hidden md:inline-flex"
                style={{ borderColor: brandColors.deepTeal, color: brandColors.deepTeal }}
              >
                {t("nav.login")}
              </Button>
            </Link>
            <Link href={`/${lng}/auth`}>
              <Button
                className="hidden md:inline-flex"
                style={{ backgroundColor: brandColors.deepTeal }}
              >
                {t("nav.getStarted")}
              </Button>
            </Link>
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (Hidden by default) */}
        <div className="md:hidden hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2">
              <Link href={`/${lng}/auth`}>
                <Button
                  variant="outline"
                  className="w-full"
                  style={{ borderColor: brandColors.deepTeal, color: brandColors.deepTeal }}
                >
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href={`/${lng}/auth`}>
                <Button
                  className="w-full"
                  style={{ backgroundColor: brandColors.deepTeal }}
                >
                  {t("nav.getStarted")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 