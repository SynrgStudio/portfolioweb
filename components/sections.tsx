"use client"

import { useState } from "react"
import Image from "next/image"
import { useLang } from "@/components/language"
import { addons, links, sites, tools, type ToolId } from "@/lib/copy"
import { BreadslicerSteps, CaliperSteps, Frame, JoltShot, SeekTranscript, TokenBars } from "@/components/artifacts"
import { Dim } from "@/components/technical"
import SpecSheet from "@/components/spec-sheet"
import ContactForm from "@/components/contact-form"
import SiteStats from "@/components/site-stats"
import { specLabels, specs } from "@/lib/specs"

const artifacts: Record<ToolId, () => React.ReactNode> = {
  breadslicer: BreadslicerSteps,
  seek: SeekTranscript,
  jolt: JoltShot,
  caliper: CaliperSteps,
  webtomd: TokenBars,
}

// Cada sección lleva una letra, como las vistas de un plano.
export function SectionHead({ sheet, label, title, body }: { sheet: string; label: string; title: string; body?: string }) {
  return (
    <div className="grid gap-x-10 gap-y-4 lg:grid-cols-12">
      <p className="label lg:col-span-2 lg:pt-3">
        <span className="text-ink">{sheet}</span> — {label}
      </p>
      <div className="lg:col-span-10">
        <h2 className="display max-w-4xl text-[clamp(2rem,4.4vw,3.75rem)]">{title}</h2>
        {body && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{body}</p>}
      </div>
    </div>
  )
}

// Una lámina por herramienta. Si tiene ficha técnica, la cifra grande y el
// botón la abren debajo.
function ToolArticle({ tool, index }: { tool: (typeof tools)[number]; index: number }) {
  const { t, lang } = useLang()
  const [open, setOpen] = useState(false)
  const c = t.tools[tool.id]
  const Artifact = artifacts[tool.id]
  const spec = specs[tool.id]?.[lang]
  const code = `A.${index + 1}`
  const toggle = () => setOpen((v) => !v)

  const figure = (
    <span className="display whitespace-nowrap text-6xl !text-[var(--tone)] sm:text-7xl">{c.figure}</span>
  )

  return (
    <article id={tool.id} className="border-t border-line" style={{ ["--tone" as string]: tool.tone }}>
      <div className="wrap grid grid-cols-1 gap-x-10 gap-y-10 py-14 sm:py-20 lg:grid-cols-12">
        <p className="label lg:col-span-2 lg:pt-2">
          <span className="text-[var(--tone)]">{code}</span> / {tools.length}
        </p>

        <div className="lg:col-span-4">
          <div className="flex items-center gap-4">
            {tool.icon ? (
              <Image src={tool.icon} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line-strong font-mono text-sm text-ink">
                .md
              </span>
            )}
            <h3 className="display text-4xl sm:text-5xl">{tool.name}</h3>
          </div>
          <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--tone)]">{c.kind}</p>
          <p className="mt-5 text-lg leading-relaxed text-body">{c.body}</p>
          <p className="mt-5 font-mono text-xs leading-relaxed text-faint">{c.meta}</p>
          <div className="mt-7 flex flex-wrap items-baseline gap-x-7 gap-y-3 font-mono text-sm">
            <a href={tool.site.href} target="_blank" rel="noopener noreferrer" className="go">
              {tool.site.label}
            </a>
            {tool.repo && (
              <a href={tool.repo} target="_blank" rel="noopener noreferrer" className="go">
                GitHub
              </a>
            )}
          </div>
          {spec && (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              className="mt-8 flex items-center gap-3 border border-line-strong px-4 py-2.5 font-mono text-sm text-ink transition-colors hover:border-[var(--tone)] hover:text-[var(--tone)]"
            >
              <span className="text-[var(--tone)]">{open ? "[−]" : "[+]"}</span>
              <span>{specLabels[lang].open}</span>
            </button>
          )}
        </div>

        <div className="lg:col-span-6">
          <div className="mb-7 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {spec ? (
              <button type="button" onClick={toggle} aria-expanded={open} title={specLabels[lang].open}>
                {figure}
              </button>
            ) : (
              figure
            )}
            <span className="max-w-[16rem] text-muted">{c.figureLabel}</span>
          </div>
          <Artifact />
        </div>

        {spec && open && (
          <div className="lg:col-span-10 lg:col-start-3">
            <SpecSheet id={code} spec={spec} site={tool.site} onClose={() => setOpen(false)} />
          </div>
        )}
      </div>
    </article>
  )
}

// ------------------------------------------------------------------- Software
export function Software() {
  const { t } = useLang()

  return (
    <section id="software" className="relative border-b border-line pt-24 sm:pt-32">
      <Dim />
      <div className="wrap pb-16">
        <SectionHead sheet="A" label={t.software.label} title={t.software.title} body={t.software.body} />
      </div>

      {tools.map((tool, i) => (
        <ToolArticle key={tool.id} tool={tool} index={i} />
      ))}
    </section>
  )
}

// ------------------------------------------------------------------------ Web
const SHOT = { width: 1440, height: 900 }

export function Web() {
  const { t } = useLang()

  return (
    <section id="web" className="relative border-b border-line py-24 sm:py-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet="B" label={t.web.label} title={t.web.title} body={t.web.body} />

        <div className="mt-14 grid gap-x-10 lg:grid-cols-12">
          <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:col-span-10 lg:col-start-3">
            {sites.map((site, i) => {
              const c = t.web.sites[site.id]
              return (
                <article key={site.id} id={`site-${site.id}`} style={{ ["--tone" as string]: site.tone }}>
                  <a href={site.href} target="_blank" rel="noopener noreferrer" className="block">
                    <Frame>
                      <div className="flex items-center justify-between gap-4 border-b border-line px-3 py-2 font-mono text-[11px] text-faint">
                        <span className="truncate text-muted">{site.host}</span>
                        <span className="whitespace-nowrap">
                          {t.web.captured} {SHOT.width} × {SHOT.height}
                        </span>
                      </div>
                      <Image
                        src={site.image}
                        alt={site.name}
                        width={SHOT.width}
                        height={SHOT.height}
                        sizes="(max-width: 768px) 100vw, 500px"
                        className="h-auto w-full"
                      />
                    </Frame>
                  </a>
                  <p className="label mt-7">
                    <span className="text-[var(--tone)]">B.{i + 1}</span> / {sites.length}
                  </p>
                  <h3 className="display mt-3 text-3xl sm:text-4xl">{site.name}</h3>
                  <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--tone)]">{c.kind}</p>
                  <p className="mt-4 text-lg leading-relaxed text-body">{c.body}</p>
                  <p className="mt-6 font-mono text-sm">
                    <a href={site.href} target="_blank" rel="noopener noreferrer" className="go">
                      {site.host}
                    </a>
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------------- 3D
export function ThreeD() {
  const { t } = useLang()

  return (
    <section id="3d" className="relative border-b border-line py-24 sm:py-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet="C" label={t.threeD.label} title={t.threeD.title} body={t.threeD.body} />

        <div className="mt-14 grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-3">
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-3">
              {addons.map((addon, i) => {
                const c = t.threeD.addons[addon.id]
                return (
                  <article key={addon.id} id={`addon-${addon.id}`} style={{ ["--tone" as string]: addon.tone }}>
                    <a href={addon.href} target="_blank" rel="noopener noreferrer" className="block" aria-label={addon.name}>
                      <Frame>
                        <Image
                          src={addon.image}
                          alt={addon.name}
                          width={1200}
                          height={600}
                          sizes="(max-width: 768px) 100vw, 330px"
                          className="h-auto w-full"
                        />
                      </Frame>
                    </a>
                    <p className="label mt-7">
                      <span className="text-[var(--tone)]">C.{i + 1}</span> / {addons.length}
                    </p>
                    <h3 className="display mt-3 text-2xl md:min-h-[2.1em]">{addon.name}</h3>
                    <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--tone)]">{c.kind}</p>
                    <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="display whitespace-nowrap text-4xl !text-[var(--tone)]">{c.figure}</span>
                      <span className="text-sm text-muted">{c.figureLabel}</span>
                    </p>
                    <p className="mt-5 leading-relaxed text-body">{c.body}</p>
                    <p className="mt-4 font-mono text-xs text-faint">{addon.meta}</p>
                    <p className="mt-6 font-mono text-sm">
                      <a href={addon.href} target="_blank" rel="noopener noreferrer" className="go">
                        Superhive
                      </a>
                    </p>
                  </article>
                )
              })}
            </div>

            <div className="mt-16 flex flex-wrap items-baseline gap-x-7 gap-y-3 border-t border-line pt-8 font-mono text-sm">
              <span className="text-muted">{t.threeD.models}</span>
              <a href={links.patreon} target="_blank" rel="noopener noreferrer" className="go">
                Patreon
              </a>
              <a href={links.kofi} target="_blank" rel="noopener noreferrer" className="go">
                Ko-fi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// --------------------------------------------------------------------- Método
export function Method() {
  const { t } = useLang()

  return (
    <section id="method" className="relative border-b border-line py-24 sm:py-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet="C" label={t.method.label} title={t.method.title} body={t.method.body} />

        <div className="mt-14 grid gap-x-10 lg:grid-cols-12">
          <div className="border-t border-line lg:col-span-10 lg:col-start-3">
            {t.method.rows.map((row, i) => (
              <div
                key={row.name}
                className="grid gap-x-10 gap-y-1 border-b border-line py-6 sm:grid-cols-[3rem_13rem_minmax(0,1fr)]"
              >
                <span className="hidden pt-1.5 font-mono text-xs text-faint sm:block">C.{i + 1}</span>
                <h3 className="text-xl font-semibold text-ink">{row.name}</h3>
                <p className="max-w-2xl text-lg leading-relaxed text-muted">{row.body}</p>
              </div>
            ))}
          </div>
        </div>

        <SiteStats />
      </div>
    </section>
  )
}

// ------------------------------------------------------------------- Contacto
export function Contact({ sheet = "E" }: { sheet?: string }) {
  const { t } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="relative pt-24 sm:pt-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet={sheet} label={t.contact.label} title={t.contact.title} body={t.contact.body} />

        <div className="mt-14 grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-3">
            <ContactForm />
          </div>
        </div>

        <div className="mt-24 flex flex-wrap items-baseline justify-between gap-4 border-t border-line py-8 font-mono text-xs text-faint">
          <span>{t.footer}</span>
          <span>© {year} SynrgStudio</span>
        </div>
      </div>
    </footer>
  )
}
