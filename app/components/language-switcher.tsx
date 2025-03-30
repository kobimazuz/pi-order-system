import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { languages } from '@/app/i18n/settings'

export default function LanguageSwitcher({ lng }: { lng: string }) {
  const pathName = usePathname()
  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <div className="flex gap-2">
      {languages.map((l) => {
        return (
          <Link
            key={l}
            href={redirectedPathName(l)}
            className={`px-3 py-1 rounded-md text-sm ${
              l === lng
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {l === 'he' ? 'עברית' : 'English'}
          </Link>
        )
      })}
    </div>
  )
} 