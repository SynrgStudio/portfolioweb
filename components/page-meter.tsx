"use client"

import { useEffect, useState } from "react"
import { useLang } from "@/components/language"

// El sitio se mide a sí mismo con la misma vara que usa para sus
// herramientas: tiempo hasta estar listo, pedidos y peso, leídos del
// navegador de quien lo visita.
export default function PageMeter() {
  const { t } = useLang()
  const [m, setM] = useState<{ ms: number; requests: number; kb: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined
      if (!nav) return
      const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[]
      const bytes = resources.reduce((sum, r) => sum + (r.transferSize || 0), nav.transferSize || 0)
      setM({
        ms: Math.round(nav.domContentLoadedEventEnd),
        requests: resources.length + 1,
        kb: Math.round(bytes / 1024),
      })
    }
    // Un momento después de cargar, para contar también lo último en llegar.
    const later = () => setTimeout(measure, 400)
    if (document.readyState === "complete") {
      const id = later()
      return () => clearTimeout(id)
    }
    window.addEventListener("load", later, { once: true })
    return () => window.removeEventListener("load", later)
  }, [])

  return (
    <p className="font-mono text-xs leading-relaxed text-faint">
      <span className="mr-2 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-[#6fcf97]" />
      {m ? (
        <>
          <span className="text-body">{t.meter.ready(m.ms, m.requests, m.kb)}</span> {t.meter.where}
          {process.env.NODE_ENV === "development" && <> {t.meter.dev}</>}
        </>
      ) : (
        t.meter.pending
      )}
    </p>
  )
}
