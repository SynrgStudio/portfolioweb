"use client"

import { useLang } from "@/components/language"
import { Frame } from "@/components/artifacts"
import { SectionHead } from "@/components/sections"
import { Dim } from "@/components/technical"
import { automationCase } from "@/lib/automation"

// La sección de automatización: un caso contado como una lámina técnica,
// con el camino de una venta etapa por etapa y cómo se resolvió cada parte.

const TONE = "#f2d94a"

export default function Automation() {
  const { t, lang } = useLang()
  const a = t.automation
  const c = automationCase[lang]

  return (
    <section id="automation" className="relative border-b border-line pt-24 sm:pt-32">
      <Dim />
      <div className="wrap pb-16">
        <SectionHead sheet="D" label={a.label} title={a.title} body={a.body} />
      </div>

      <article id="auto-sale" className="border-t border-line" style={{ ["--tone" as string]: TONE }}>
        <div className="wrap grid grid-cols-1 gap-x-10 gap-y-14 py-14 sm:py-20 lg:grid-cols-12">
          <p className="label lg:col-span-2 lg:pt-2">
            <span className="text-[var(--tone)]">D.1</span> / 1
          </p>

          <div className="lg:col-span-5">
            <h3 className="display text-4xl sm:text-5xl">{a.name}</h3>
            <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--tone)]">{a.kind}</p>
            <p className="mt-5 text-lg leading-relaxed text-body">{a.text}</p>
            <p className="mt-5 font-mono text-xs leading-relaxed text-faint">{a.meta}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
              <span className="display whitespace-nowrap text-6xl !text-[var(--tone)] sm:text-7xl">{a.figure}</span>
              <span className="max-w-[16rem] text-muted">{a.figureLabel}</span>
            </div>
            <p className="label mb-3 mt-10">{c.stackLabel}</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-xs text-body">
              {c.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* El camino de una venta, etapa por etapa */}
          <div className="lg:col-span-10 lg:col-start-3">
            <p className="label mb-5">{c.pipelineLabel}</p>
            <Frame>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {c.pipeline.map((stage, i) => (
                  <li key={stage.name} className="-mb-px -mr-px border-b border-r border-line p-4 sm:p-5">
                    <p className="flex items-center justify-between font-mono text-xs">
                      <span className="text-[var(--tone)]">{String(i + 1).padStart(2, "0")}</span>
                      {i < c.pipeline.length - 1 && <span className="text-faint">→</span>}
                    </p>
                    <p className="mt-3 font-semibold text-ink">{stage.name}</p>
                    <p className="mt-1 font-mono text-[11px] text-[var(--tone)]">{stage.tech}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{stage.what}</p>
                  </li>
                ))}
              </ol>
            </Frame>
          </div>

          {/* Cuatro números del diseño */}
          <dl className="grid grid-cols-2 border border-line lg:col-span-10 lg:col-start-3 lg:grid-cols-4">
            {c.numbers.map((n) => (
              <div
                key={n.label}
                className="flex flex-col-reverse justify-end gap-2 border-line p-4 odd:border-r max-lg:[&:nth-child(-n+2)]:border-b sm:p-6 lg:border-r lg:last:border-r-0"
              >
                <dt className="text-sm leading-snug text-muted">{n.label}</dt>
                <dd className="display whitespace-nowrap text-3xl !text-[var(--tone)] sm:text-4xl">{n.value}</dd>
              </div>
            ))}
          </dl>

          {/* Cómo se hizo */}
          <div className="lg:col-span-10 lg:col-start-3">
            <p className="label mb-2">{c.detailLabel}</p>
            <div className="grid gap-x-12 lg:grid-cols-2">
              {c.groups.map((group, g) => (
                <div key={group.title} className="mt-10">
                  <h4 className="flex items-baseline gap-3 border-b border-line-strong pb-3 text-xl font-semibold text-ink">
                    <span className="font-mono text-xs font-normal text-[var(--tone)]">D.1.{g + 1}</span>
                    {group.title}
                  </h4>
                  <dl>
                    {group.rows.map(([term, text]) => (
                      <div key={term} className="border-b border-line py-4">
                        <dt className="font-mono text-xs uppercase tracking-wider text-body">{term}</dt>
                        <dd className="mt-2 leading-relaxed text-muted">{text}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
