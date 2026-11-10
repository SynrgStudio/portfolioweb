"use client"

import Link from "next/link"
import { useLang } from "@/components/language"
import { SectionHead } from "@/components/sections"
import { Dim } from "@/components/technical"
import { addons, sites, tools } from "@/lib/copy"

// Las secciones de la portada: qué hace el estudio, el índice de todo lo
// publicado y por qué elegirlo. El detalle de cada trabajo vive en /work.

// Filas de nombre y texto, con una línea opcional de prueba a la derecha.
function Rows({ code, rows }: { code: string; rows: { name: string; body: string; proof?: string }[] }) {
  return (
    <div className="mt-14 grid gap-x-10 lg:grid-cols-12">
      <dl className="border-t border-line lg:col-span-10 lg:col-start-3">
        {rows.map((row, i) => (
          <div
            key={row.name}
            className="grid gap-x-10 gap-y-1 border-b border-line py-6 sm:grid-cols-[3rem_13rem_minmax(0,1fr)]"
          >
            <span className="hidden pt-1.5 font-mono text-xs text-faint sm:block">
              {code}.{i + 1}
            </span>
            <dt className="text-xl font-semibold text-ink">{row.name}</dt>
            <dd className="max-w-2xl text-lg leading-relaxed text-muted">
              {row.body}
              {row.proof && <span className="mt-3 block font-mono text-xs uppercase tracking-wider text-ink">{row.proof}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// ---------------------------------------------------------------- Qué hacemos
export function Does() {
  const { t } = useLang()
  return (
    <section id="what" className="relative border-b border-line py-24 sm:py-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet="A" label={t.does.label} title={t.does.title} />
        <Rows code="A" rows={t.does.rows} />
      </div>
    </section>
  )
}

// --------------------------------------------------------------------- Índice
export function WorkIndex() {
  const { t } = useLang()

  const groups = [
    {
      label: t.nav.software,
      items: tools.map((tool) => ({
        anchor: tool.id,
        name: tool.name,
        kind: t.tools[tool.id].kind,
        figure: t.tools[tool.id].figure,
        tone: tool.tone,
      })),
    },
    {
      label: t.nav.web,
      items: sites.map((site) => ({
        anchor: `site-${site.id}`,
        name: site.name,
        kind: t.web.sites[site.id].kind,
        figure: site.host,
        tone: site.tone,
      })),
    },
    {
      label: t.nav.threeD,
      items: addons.map((addon) => ({
        anchor: `addon-${addon.id}`,
        name: addon.name,
        kind: t.threeD.addons[addon.id].kind,
        figure: t.threeD.addons[addon.id].figure,
        tone: addon.tone,
      })),
    },
    {
      label: t.nav.automation,
      items: [
        {
          anchor: "auto-sale",
          name: t.automation.name,
          kind: t.automation.kind,
          figure: t.automation.figure,
          tone: "#f2d94a",
        },
      ],
    },
  ]
  let n = 0

  return (
    <section id="work" className="relative border-b border-line py-24 sm:py-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet="B" label={t.index.label} title={t.index.title} body={t.index.body} />

        <div className="mt-14 grid gap-x-10 lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-3">
            {groups.map((group) => (
              <div key={group.label} className="[&:not(:first-child)]:mt-12">
                <p className="label border-b border-line-strong pb-3">{group.label}</p>
                {group.items.map((item) => (
                  <Link
                    key={item.anchor}
                    href={`/work#${item.anchor}`}
                    className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-x-4 border-b border-line py-4 transition-colors hover:bg-panel sm:grid-cols-[3rem_minmax(0,1.1fr)_minmax(0,1.3fr)_11rem_1.25rem] sm:gap-x-6 sm:px-3"
                    style={{ ["--tone" as string]: item.tone }}
                  >
                    <span className="font-mono text-xs text-faint">{String(++n).padStart(2, "0")}</span>
                    <span className="display text-xl transition-colors group-hover:!text-[var(--tone)] sm:text-2xl">
                      {item.name}
                    </span>
                    <span className="hidden text-muted sm:block">{item.kind}</span>
                    <span className="whitespace-nowrap text-right font-mono text-sm text-[var(--tone)]">{item.figure}</span>
                    <span className="hidden font-mono text-faint transition-colors group-hover:text-[var(--tone)] sm:block">→</span>
                  </Link>
                ))}
              </div>
            ))}

            <p className="mt-10 font-mono text-sm">
              <Link href="/work" className="go in">
                {t.index.all}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// -------------------------------------------------------------------- Por qué
export function Why() {
  const { t } = useLang()
  return (
    <section id="why" className="relative border-b border-line py-24 sm:py-32">
      <Dim />
      <div className="wrap">
        <SectionHead sheet="D" label={t.why.label} title={t.why.title} />
        <Rows code="D" rows={t.why.rows} />
      </div>
    </section>
  )
}

// ------------------------------------------------- Encabezado de la página /work
export function WorkHead() {
  const { t } = useLang()
  return (
    <section className="hero-grid relative border-b border-line py-20 sm:py-28">
      <Dim />
      <div className="wrap">
        <p className="label mb-6">{t.workPage.label}</p>
        <h1 className="display max-w-4xl text-[clamp(2.4rem,5.2vw,4.5rem)]">{t.workPage.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-body sm:text-xl">{t.workPage.body}</p>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
          <a href="#software" className="go in">
            {t.nav.software} · {tools.length}
          </a>
          <a href="#web" className="go in">
            {t.nav.web} · {sites.length}
          </a>
          <a href="#3d" className="go in">
            {t.nav.threeD} · {addons.length}
          </a>
          <a href="#automation" className="go in">
            {t.nav.automation} · 1
          </a>
        </div>
      </div>
    </section>
  )
}
