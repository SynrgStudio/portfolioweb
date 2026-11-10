"use client"

import { useLang } from "@/components/language"

// Las cifras de esta misma página, medidas con Lighthouse sobre el sitio
// publicado. No se actualizan solas: son las de la fecha que se muestra.
// Para medir de nuevo:
//   npx lighthouse https://synrgs.tech/ --preset=desktop
// y sin --preset para el perfil de celular. Después se cambian acá.
const MEASURED = {
  date: { en: "10 November 2026", es: "10 de noviembre de 2026" },
  tool: "Lighthouse 13.6",
  desktop: { performance: 100, lcp: "0.3 s", blocking: "0 ms", shift: "0" },
  mobile: { performance: 99, lcp: "0.9 s" },
  weightKb: 294,
  requests: 16,
  accessibility: 100,
  bestPractices: 100,
  seo: 100,
}

const text = {
  en: {
    label: "This page, by the same rule",
    performance: "Lighthouse performance score, out of 100",
    lcp: "until the largest element is on screen",
    blocking: "with the page blocked while it loads",
    weight: (requests: number) => `to download the whole page, in ${requests} requests`,
    note: (m: typeof MEASURED) =>
      `Measured on synrgs.tech with ${m.tool}, desktop profile, on ${m.date.en}. On the mobile profile: ${m.mobile.performance} and ${m.mobile.lcp}. Layout shift ${m.desktop.shift}; accessibility ${m.accessibility}, best practices ${m.bestPractices}, SEO ${m.seo}. The times change a little from one run to the next.`,
  },
  es: {
    label: "Esta página, con la misma regla",
    performance: "puntaje de rendimiento de Lighthouse, sobre 100",
    lcp: "hasta que el elemento más grande está en pantalla",
    blocking: "con la página bloqueada mientras carga",
    weight: (requests: number) => `para descargar la página entera, en ${requests} pedidos`,
    note: (m: typeof MEASURED) =>
      `Medido en synrgs.tech con ${m.tool}, perfil de escritorio, el ${m.date.es}. En el perfil de celular: ${m.mobile.performance} y ${m.mobile.lcp.replace(".", ",")}. Corrimiento de diseño ${m.desktop.shift}; accesibilidad ${m.accessibility}, buenas prácticas ${m.bestPractices}, SEO ${m.seo}. Los tiempos cambian un poco de una corrida a otra.`,
  },
}

export default function SiteStats() {
  const { lang } = useLang()
  const l = text[lang]
  const local = (value: string) => (lang === "es" ? value.replace(".", ",") : value)
  const numbers = [
    { value: String(MEASURED.desktop.performance), label: l.performance },
    { value: local(MEASURED.desktop.lcp), label: l.lcp },
    { value: MEASURED.desktop.blocking, label: l.blocking },
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
        <p className="mt-4 font-mono text-xs leading-relaxed text-faint">{l.note(MEASURED)}</p>
      </div>
    </div>
  )
}
