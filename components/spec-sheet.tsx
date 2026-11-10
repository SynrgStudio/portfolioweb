"use client"

import { useLang } from "@/components/language"
import { specLabels, type Spec } from "@/lib/specs"

// La ficha de una herramienta: se abre debajo de su lámina. Cuatro cifras
// grandes, una comparación a escala y cuatro puntos fuertes.

export default function SpecSheet({
  id,
  spec,
  site,
  onClose,
}: {
  id: string
  spec: Spec
  site: { label: string; href: string }
  onClose: () => void
}) {
  const { lang } = useLang()
  const l = specLabels[lang]
  const max = Math.max(...spec.compare.rows.map((row) => row.amount))

  return (
    <div className="border border-line-strong bg-bg">
      <div className="flex items-center justify-between gap-4 border-b border-line-strong px-4 py-2.5 font-mono text-xs sm:px-6">
        <span className="uppercase tracking-wider text-muted">
          <span className="text-[var(--tone)]">{id}</span> — {l.title}
        </span>
        <button type="button" onClick={onClose} className="text-faint transition-colors hover:text-ink">
          [×] {l.close}
        </button>
      </div>

      <dl className="grid grid-cols-2 border-b border-line lg:grid-cols-4">
        {spec.numbers.map((n) => (
          <div
            key={n.label}
            className="flex flex-col-reverse justify-end gap-2 border-line p-4 odd:border-r max-lg:[&:nth-child(-n+2)]:border-b sm:p-6 lg:border-r lg:last:border-r-0"
          >
            <dt className="text-sm leading-snug text-muted">{n.label}</dt>
            <dd className="display whitespace-nowrap text-3xl !text-[var(--tone)] sm:text-4xl">{n.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-x-12 gap-y-10 p-4 sm:p-6 lg:grid-cols-2">
        <div>
          <p className="mb-4 font-medium text-ink">{spec.compare.title}</p>
          <ul className="space-y-3 font-mono text-xs">
            {spec.compare.rows.map((row) => (
              <li key={row.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <span className={row.own ? "text-ink" : "text-muted"}>{row.name}</span>
                  <span className={row.own ? "text-[var(--tone)]" : "text-ink"}>{row.value}</span>
                </div>
                <div className="mt-1.5 h-2 bg-line/40">
                  <div
                    className="h-full"
                    style={{
                      width: `${Math.max((row.amount / max) * 100, 0.4)}%`,
                      background: row.own ? "var(--tone)" : "#73777b",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <ul className="space-y-3 self-center text-lg leading-snug text-body">
          {spec.highlights.map((item, i) => (
            <li key={i} className="grid grid-cols-[2rem_minmax(0,1fr)]">
              <span className="pt-1.5 font-mono text-xs text-[var(--tone)]">{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="border-t border-line px-4 py-3 font-mono text-xs leading-relaxed text-faint sm:px-6">
        {spec.note} {l.more}{" "}
        <a href={site.href} target="_blank" rel="noopener noreferrer" className="text-muted underline-offset-4 hover:text-[var(--tone)] hover:underline">
          {site.label}
        </a>
        .
      </p>
    </div>
  )
}
