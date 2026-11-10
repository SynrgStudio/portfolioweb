"use client"

import { useLang } from "@/components/language"

// Las cifras de esta misma página, medidas sobre el sitio publicado con
// PageSpeed Insights (el Lighthouse de Google, corrido desde sus servidores).
// No se actualizan solas: son las de la fecha que se muestra. Para medir de
// nuevo: https://pagespeed.web.dev/ con https://synrgs.tech/, en celular y en
// escritorio; el peso y los pedidos salen de `npx lighthouse https://synrgs.tech/`.
const MEASURED = {
  date: { en: "10 November 2026", es: "10 de noviembre de 2026" },
  performance: 100, // en celular y en escritorio
  mobileLcp: "0.9 s",
  desktopLcp: "0.3 s",
  weightKb: 257,
  requests: 17,
}

const text = {
  en: {
    label: "This page, by the same rule",
    performance: "performance score, on mobile and on desktop",
    mobile: "to show the page on a mid-range phone with slow 4G",
    desktop: "to show it on a desktop",
    weight: (requests: number) => `to download the whole page, in ${requests} requests`,
    note: (date: string) =>
      `Measured on synrgs.tech with PageSpeed Insights (Lighthouse 13.6) on ${date}. On mobile it also scores 100 in accessibility, best practices and SEO. The times change a little from one run to the next.`,
  },
  es: {
    label: "Esta página, con la misma regla",
    performance: "puntaje de rendimiento, en celular y en escritorio",
    mobile: "para mostrar la página en un celular de gama media con 4G lento",
    desktop: "para mostrarla en una computadora",
    weight: (requests: number) => `para descargar la página entera, en ${requests} pedidos`,
    note: (date: string) =>
      `Medido en synrgs.tech con PageSpeed Insights (Lighthouse 13.6) el ${date}. En celular también saca 100 en accesibilidad, buenas prácticas y SEO. Los tiempos cambian un poco de una corrida a otra.`,
  },
}

export default function SiteStats() {
  const { lang } = useLang()
  const l = text[lang]
  const local = (value: string) => (lang === "es" ? value.replace(".", ",") : value)
  const numbers = [
    { value: String(MEASURED.performance), label: l.performance },
    { value: local(MEASURED.mobileLcp), label: l.mobile },
    { value: local(MEASURED.desktopLcp), label: l.desktop },
    { value: `${MEASURED.weightKb} KB`, label: l.weight(MEASURED.requests) },
  ]

  return (
    <div className="mt-16 grid gap-x-10 lg:grid-cols-12">
      <div className="lg:col-span-10 lg:col-start-3">
        <p className="label mb-5">{l.label}</p>
        <dl className="grid grid-cols-2 border border-line lg:grid-cols-4">
          {numbers.map((n) => (
            <div
              key={n.label}
              className="flex flex-col-reverse justify-end gap-2 border-line p-4 odd:border-r max-lg:[&:nth-child(-n+2)]:border-b sm:p-6 lg:border-r lg:last:border-r-0"
            >
              <dt className="text-sm leading-snug text-muted">{n.label}</dt>
              <dd className="display whitespace-nowrap text-3xl sm:text-4xl">{n.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 font-mono text-xs leading-relaxed text-faint">{l.note(MEASURED.date[lang])}</p>
      </div>
    </div>
  )
}
