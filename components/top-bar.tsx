"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLang } from "@/components/language"
import Logo from "@/components/logo"
import { Coords } from "@/components/technical"

export default function TopBar() {
  const { lang, t, setLang } = useLang()
  const onWork = usePathname().startsWith("/work")
  const item = "hidden transition-colors hover:text-ink sm:block"

  return (
    <header className="topbar sticky top-0 z-50 border-b border-line">
      <div className="wrap flex h-14 items-center justify-between gap-6">
        <Link href="/" className="display flex items-center gap-2.5 text-lg" style={{ letterSpacing: "-0.02em" }}>
          <Logo className="h-6 w-6" />
          <span>SynrgStudio</span>
        </Link>
        <span className="mr-auto">
          <Coords />
        </span>

        <nav className="flex items-center gap-6 font-mono text-xs text-muted sm:gap-8">
          <Link href="/work" className={onWork ? "text-ink" : "transition-colors hover:text-ink"} aria-current={onWork ? "page" : undefined}>
            {t.nav.work}
          </Link>
          <Link href="/#method" className={item}>
            {t.nav.method}
          </Link>
          <Link href="/#why" className={item}>
            {t.nav.why}
          </Link>
          <Link href="/#contact" className={item}>
            {t.nav.contact}
          </Link>

          {/* Un solo botón: cada clic pasa al otro idioma, sin mover el cursor */}
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
            className="-my-2 flex items-center gap-1.5 border-l border-line py-2 pl-6"
          >
            <span className={lang === "en" ? "text-ink" : "text-faint"}>EN</span>
            <span className="text-faint">/</span>
            <span className={lang === "es" ? "text-ink" : "text-faint"}>ES</span>
          </button>
        </nav>
      </div>
    </header>
  )
}
