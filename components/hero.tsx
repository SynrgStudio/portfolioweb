"use client"

import Link from "next/link"
import Solid from "@/components/solid"
import PageMeter from "@/components/page-meter"
import { useLang } from "@/components/language"
import { Dim, Ruler } from "@/components/technical"

export default function Hero() {
  const { t } = useLang()

  return (
    <section id="top" className="hero-grid relative overflow-hidden border-b border-line">
      <Solid />
      <Dim />
      <div className="wrap relative flex min-h-[min(calc(100svh-3.5rem),56rem)] flex-col justify-between pb-14 pt-10 sm:pb-16 sm:pt-14">
        <div className="flex flex-1 flex-col justify-center lg:max-w-[62%]">
          <h1 className="display text-[clamp(2.6rem,5.9vw,5.25rem)]">{t.hero.title}</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-body sm:text-xl">{t.hero.body}</p>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            <Link href="/work" className="go in">
              {t.hero.work}
            </Link>
            <a href="#method" className="go in">
              {t.hero.method}
            </a>
          </div>
        </div>
        <PageMeter />
      </div>
      <Ruler />
    </section>
  )
}
