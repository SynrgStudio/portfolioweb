"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { useLang } from "@/components/language"
import { copy as COPY } from "@/lib/ecosystem/copy"
import type { Engine, Stats } from "@/lib/ecosystem/engine"

// /ecosystem: una historia que se cuenta bajando. Un canvas WebGL fijo detrás (lib/ecosystem/engine)
// y, delante, un capítulo por herramienta. Cada capítulo es alto y su texto queda fijo mientras
// el scroll avanza la escena: S = capítulo + cuánto se avanzó en él.

const TONE = { caliper: "#f68a3b", bread: "#f2e3c2", slicer: "#d7a75a", ink: "#f0f0ed" }
const CHAPTERS = [150, 320, 320, 360, 220, 160] // alto de cada capítulo, en vh
const STORE = "https://apps.microsoft.com/detail/9P7V6VGWHDST?mode=full"

export default function Ecosystem() {
  const { lang } = useLang()
  const t = COPY[lang]
  const canvas = useRef<HTMLCanvasElement>(null)
  const layer = useRef<HTMLCanvasElement>(null)
  const sections = useRef<(HTMLElement | null)[]>([])
  const engine = useRef<Engine | null>(null)
  const [stats, setStats] = useState<Stats>({})
  const [S, setS] = useState(0)
  const [ready, setReady] = useState(false)

  const nf = useMemo(() => new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US"), [lang])
  const n = (v?: number) => (v === undefined ? "…" : nf.format(v))
  const ms = (v?: number) => (v === undefined ? "…" : `${new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { maximumFractionDigits: v < 10 ? 1 : 0 }).format(v)} ms`)
  const mb = (bytes?: number) => (bytes === undefined ? "…" : bytes >= 1e6 ? `${new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { maximumFractionDigits: 1 }).format(bytes / 1e6)} MB` : `${new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { maximumFractionDigits: 0 }).format(bytes / 1e3)} KB`)

  // --- el motor: se carga solo en el navegador, con three.js
  useEffect(() => {
    let disposed = false
    let e: Engine | null = null
    import("@/lib/ecosystem/engine").then(({ Engine }) => {
      if (disposed || !canvas.current) return
      e = new Engine(canvas.current)
      engine.current = e
      e.onStats = (s) => setStats(s)
      e.onReady = () => setReady(true)
      e.setLayerCanvas(layer.current)
      e.load("/ecosystem").catch(() => setStats((s) => ({ ...s, webgl: false })))
    })
    return () => {
      disposed = true
      e?.dispose()
    }
  }, [])

  // --- el scroll: en qué capítulo estamos y cuánto se avanzó en él
  useEffect(() => {
    let raf = 0
    const read = () => {
      raf = 0
      const y = window.scrollY
      const vh = window.innerHeight
      let s = 0
      sections.current.forEach((el, i) => {
        if (!el) return
        const top = el.offsetTop
        const h = el.offsetHeight
        if (y >= top - 1) s = i + Math.min(1, Math.max(0, (y - top) / Math.max(1, h - vh)))
      })
      engine.current?.setProgress(s)
      engine.current?.setRunning(s < 5.1)
      setS((old) => (Math.abs(old - s) > 0.004 ? s : old))
    }
    const on = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    addEventListener("scroll", on, { passive: true })
    addEventListener("resize", on)
    return () => {
      removeEventListener("scroll", on)
      removeEventListener("resize", on)
      cancelAnimationFrame(raf)
    }
  }, [])

  const at = (c: number) => (S < c ? 0 : S >= c + 1 ? 1 : S - c)
  const cal = at(1)
  const br = at(2)
  const bs = at(3)
  const calStep = cal < 0.5 ? 0 : cal < 0.8 ? 1 : 2
  const bsStep = bs < 0.14 ? 0 : bs < 0.44 ? 1 : 2
  const d = stats.damaged
  const repaired = cal >= 0.8
  const ratio = stats.stlBytes && stats.writeBytes ? stats.stlBytes / stats.writeBytes : undefined
  const ratioText = ratio ? new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { maximumFractionDigits: 1 }).format(ratio) : "…"
  const noGl = stats.webgl === false

  const sec = (i: number) => (el: HTMLElement | null) => {
    sections.current[i] = el
  }

  return (
    <div className="relative">
      {/* La escena: fija, detrás de todo */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-500" style={{ opacity: S > 4.98 ? 0 : 1 }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 70% at 66% 45%, rgba(215,167,90,.10), transparent 70%), radial-gradient(40% 50% at 20% 90%, rgba(246,138,59,.06), transparent 70%)" }} />
        <canvas ref={canvas} className="absolute inset-0 h-full w-full transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(transparent, #111214)" }} />
      </div>

      {/* ------------------------------------------------------------- 0 · portada */}
      <section ref={sec(0)} className="relative z-10" style={{ height: `${CHAPTERS[0]}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col justify-end pb-[10vh] pt-24">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[70%] lg:hidden" style={{ background: "linear-gradient(transparent, rgba(17,18,20,.92) 38%)" }} />
          <div className="wrap relative">
            <p className="label mb-6 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: TONE.slicer, boxShadow: `0 0 12px ${TONE.slicer}` }} />
              {t.hero.label}
            </p>
            <h1 className="display text-[clamp(2.4rem,5vw,4.9rem)]">
              {t.hero.title[0]}
              <br />
              {t.hero.title[1]}
              <br />
              <span style={{ background: `linear-gradient(90deg, ${TONE.caliper}, ${TONE.slicer} 45%, ${TONE.bread})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{t.hero.title[2]}</span>
            </h1>
            <p className="mt-7 max-w-[36rem] text-lg leading-relaxed text-body">{t.hero.body}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Hud on={stats.decodeMs !== undefined}>{stats.decodeMs === undefined ? t.hero.loading : t.hero.decoded(n(stats.triangles), ms(stats.decodeMs))}</Hud>
              <span className="label flex items-center gap-2" style={{ opacity: 1 - Math.min(1, S * 3) }}>
                {t.hero.scroll}
                <span className="inline-block animate-bounce">↓</span>
              </span>
            </div>
            {noGl && <p className="mt-6 max-w-[36rem] text-sm text-faint">{t.hero.nowebgl}</p>}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 1 · Caliper */}
      <Chapter refFn={sec(1)} vh={CHAPTERS[1]} tone={TONE.caliper} kicker={t.caliper.kicker} title={t.caliper.title} body={t.caliper.body}>
        <Steps steps={t.caliper.steps} active={calStep} tone={TONE.caliper} />
        <Panel tone={TONE.caliper}>
          <div className="grid gap-2.5 font-mono text-[13px]">
            <Row label={t.caliper.rows.open} value={repaired ? 0 : d?.open} dot="#ff4d4d" n={n} />
            <Row label={t.caliper.rows.flipped} value={repaired ? 0 : d?.inconsistent} dot="#a96bff" n={n} />
            <Row label={t.caliper.rows.nonManifold} value={repaired ? 0 : d?.nonManifold} dot="#83878b" n={n} />
          </div>
          <p className="mt-4 border-t border-line pt-3 text-[13px] leading-relaxed" style={{ color: repaired ? TONE.caliper : "#a3a4a6" }}>
            {repaired ? `✓ ${t.caliper.closed}` : `${n(stats.damaged?.edges)} · ${ms(stats.damaged?.ms)}`}
          </p>
        </Panel>
        <p className="text-xs leading-relaxed text-faint">{t.caliper.note}</p>
        <Facts facts={t.caliper.facts} tone={TONE.caliper} />
      </Chapter>

      {/* ------------------------------------------------------------- 2 · .bread */}
      <Chapter refFn={sec(2)} vh={CHAPTERS[2]} tone={TONE.bread} kicker={t.bread.kicker} title={t.bread.title} body={t.bread.body}>
        <Panel tone={TONE.bread}>
          <div className="grid gap-3 font-mono text-[13px]">
            <Live label={t.bread.live.stl} value={mb(stats.stlBytes)} sub={ms(stats.stlMs)} on={br > 0.05} />
            <Live label={t.bread.live.write} value={mb(stats.writeBytes)} sub={ms(stats.writeMs)} on={br > 0.2} tone={TONE.bread} />
            <Live label={t.bread.live.read} value={ms(stats.readMs)} on={br > 0.45} />
            <Live
              label={t.bread.live.compare}
              value={stats.mismatches === undefined ? t.bread.live.waiting : stats.mismatches === 0 ? `✓ ${t.bread.live.identical(n(stats.corners))}` : t.bread.live.differ(n(stats.mismatches))}
              on={br > 0.7}
              tone={stats.mismatches === 0 ? "#7bd88f" : undefined}
            />
          </div>
          <Bars stl={stats.stlBytes} bread={stats.writeBytes} on={br > 0.3} />
          <p className="mt-2 text-[13px]" style={{ color: TONE.bread }}>
            {t.bread.smaller(ratioText)}
          </p>
        </Panel>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
          <span className="label mr-1">{t.bread.chunks}</span>
          {(stats.chunks ?? [{ tag: "SCNE", bytes: 0 }, { tag: "MESH", bytes: 0 }]).map((c) => (
            <span key={c.tag} className="border px-2 py-1" style={{ borderColor: "rgba(242,227,194,.4)", color: TONE.bread }}>
              {c.tag}
            </span>
          ))}
          {["SUPP", "HOLW", "SPRV", "ROLE", "META"].map((c) => (
            <span key={c} className="border border-dashed border-line-strong px-2 py-1 text-faint">
              {c}
            </span>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-faint">{t.bread.slicer}</p>
        <Facts facts={t.bread.facts} tone={TONE.bread} />
      </Chapter>

      {/* ------------------------------------------------------------- 3 · Breadslicer */}
      <Chapter refFn={sec(3)} vh={CHAPTERS[3]} tone={TONE.slicer} kicker={t.slicer.kicker} title={t.slicer.title} body={t.slicer.body}>
        <Steps steps={t.slicer.steps} active={bsStep} tone={TONE.slicer} />
        <Panel tone={TONE.slicer}>
          <div className="flex items-start gap-4">
            <div className="relative aspect-square w-[42%] min-w-[120px] max-w-[190px] flex-none overflow-hidden border border-line bg-black">
              <canvas ref={layer} className="absolute inset-0 h-full w-full object-contain" style={{ imageRendering: "pixelated" }} />
              <div className="pointer-events-none absolute inset-0" style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, transparent 1px 3px)" }} />
            </div>
            <div className="min-w-0 font-mono text-[13px]">
              {stats.layer ? (
                <>
                  <p className="text-ink">{t.slicer.layer(n(stats.layer), n(stats.layers))}</p>
                  <p className="mt-2 leading-relaxed text-muted">
                    {t.slicer.layerSub(
                      new Intl.NumberFormat(lang === "es" ? "es-AR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(stats.layerZ ?? 0),
                      n(stats.segments),
                      ms(stats.sliceMs),
                    )}
                  </p>
                  <div className="mt-3 h-1 w-full bg-line">
                    <div className="h-full" style={{ width: `${((stats.layer ?? 0) / (stats.layers || 1)) * 100}%`, background: TONE.slicer }} />
                  </div>
                </>
              ) : (
                <p className="leading-relaxed text-faint">{t.slicer.idle}</p>
              )}
            </div>
          </div>
        </Panel>
        <p className="text-xs leading-relaxed text-faint">{t.slicer.note}</p>
        <Facts facts={t.slicer.facts} tone={TONE.slicer} />
      </Chapter>

      {/* ------------------------------------------------------------- 4 · la cadena */}
      <section ref={sec(4)} className="relative z-10" style={{ height: `${CHAPTERS[4]}vh` }}>
        <div className="sticky top-0 flex min-h-[100svh] items-center py-24">
          <div className="wrap">
            <p className="label" style={{ color: TONE.slicer }}>{t.loop.kicker}</p>
            <h2 className="display mt-4 max-w-[18ch] text-[clamp(2rem,4.6vw,3.8rem)]">{t.loop.title}</h2>
            <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-body">{t.loop.body}</p>
            <Chain t={t.loop} on={S > 3.7} />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- 5 · lo medido y dónde conseguirlas */}
      <section ref={sec(5)} className="relative z-10" style={{ minHeight: `${CHAPTERS[5]}vh` }}>
        <div className="wrap pb-24 pt-[18vh]">
          <p className="label" style={{ color: TONE.bread }}>{t.measured.kicker}</p>
          <h2 className="display mt-4 max-w-[18ch] text-[clamp(2rem,4.6vw,3.8rem)]">{t.measured.title}</h2>
          <p className="mt-5 max-w-[34rem] text-lg leading-relaxed text-body">{t.measured.body}</p>
          <div className="mt-10 grid max-w-[52rem] grid-cols-1 border-t border-line font-mono text-sm sm:grid-cols-2">
            {[
              [t.measured.rows.decode, stats.decodeMs !== undefined ? ms(stats.decodeMs) : undefined],
              [t.measured.rows.analyze, stats.clean ? `${ms(stats.clean.ms)} · ${n(stats.clean.edges)}` : undefined],
              [t.measured.rows.stl, stats.stlMs !== undefined ? `${ms(stats.stlMs)} · ${mb(stats.stlBytes)}` : undefined],
              [t.measured.rows.write, stats.writeMs !== undefined ? `${ms(stats.writeMs)} · ${mb(stats.writeBytes)}` : undefined],
              [t.measured.rows.read, stats.readMs !== undefined ? ms(stats.readMs) : undefined],
              [t.measured.rows.corners, stats.mismatches !== undefined ? `${n((stats.corners ?? 0) - stats.mismatches)} / ${n(stats.corners)}` : undefined],
              [t.measured.rows.slice, stats.sliceMs !== undefined ? `${ms(stats.sliceMs)} · ${n(stats.segments)}` : undefined],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-3 sm:odd:pr-6 sm:even:pl-6">
                <span className="text-muted">{k}</span>
                <span className={v ? "text-ink" : "text-faint"}>{v ?? t.measured.pending}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-[52rem] text-xs text-faint">{t.measured.machine}</p>

          <h2 className="display mt-24 text-[clamp(1.8rem,3.6vw,3rem)]">{t.get.title}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Card tone={TONE.caliper} name="Caliper" icon="/tools/caliper.svg" c={t.get.caliper} href="https://caliper.synrgs.tech">
              <a href={STORE} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block transition-opacity hover:opacity-85">
                <Image src={`/tools/microsoft-store-${lang}.svg`} alt={lang === "es" ? "Descargar desde Microsoft Store" : "Download from the Microsoft Store"} width={161} height={44} className="h-10 w-auto" />
              </a>
            </Card>
            <Card tone={TONE.bread} name=".bread" c={t.get.bread} href="https://bread.synrgs.tech" />
            <Card tone={TONE.slicer} name="Breadslicer" icon="/tools/breadslicer.png" c={t.get.slicer} href="https://breadslicer.app" />
          </div>
          <p className="mt-14 max-w-[52rem] text-xs leading-relaxed text-faint">
            {t.credit}{" "}
            <a className="underline underline-offset-4 hover:text-ink" href="https://mz4250.com/" target="_blank" rel="noopener noreferrer">mz4250.com</a> ·{" "}
            <a className="underline underline-offset-4 hover:text-ink" href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a> ·{" "}
            <a className="underline underline-offset-4 hover:text-ink" href="/ecosystem/NOTICE-bread-format.txt">bread-format (Apache-2.0)</a>
          </p>
        </div>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------- piezas

function Chapter({ refFn, vh, tone, kicker, title, body, children }: { refFn: (el: HTMLElement | null) => void; vh: number; tone: string; kicker: string; title: string; body: string; children: React.ReactNode }) {
  return (
    <section ref={refFn} className="relative z-10 pb-[75svh] pt-[58svh] lg:h-[var(--h)] lg:p-0" style={{ ["--h" as string]: `${vh}vh`, ["--tone" as string]: tone }}>
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-[100svh] lg:items-center">
        <div className="wrap">
          <div className="max-w-[30rem] rounded-sm border border-line/70 p-5 sm:p-6 lg:border-0 lg:p-0" style={{ background: "linear-gradient(180deg, rgba(17,18,20,.88), rgba(17,18,20,.95))" }}>
            <p className="label" style={{ color: tone }}>{kicker}</p>
            <h2 className="display mt-3 text-[clamp(1.9rem,4.2vw,3.4rem)]">{title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-body sm:text-base">{body}</p>
            <div className="mt-6 grid gap-4">{children}</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Panel({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <div className="relative border border-line bg-panel/80 p-4" style={{ boxShadow: `inset 0 1px 0 ${tone}22` }}>
      {[
        "-left-1.5 -top-1.5 border-l border-t",
        "-right-1.5 -top-1.5 border-r border-t",
        "-bottom-1.5 -left-1.5 border-b border-l",
        "-bottom-1.5 -right-1.5 border-b border-r",
      ].map((c) => (
        <span key={c} aria-hidden="true" className={`absolute h-2 w-2 ${c}`} style={{ borderColor: tone }} />
      ))}
      {children}
    </div>
  )
}

function Steps({ steps, active, tone }: { steps: string[]; active: number; tone: string }) {
  return (
    <ol className="flex gap-2 font-mono text-[11px] uppercase tracking-[.12em]">
      {steps.map((s, i) => (
        <li key={s} className="flex-1 border-t-2 pt-2 transition-colors duration-500" style={{ borderColor: i <= active ? tone : "#2b2d30", color: i === active ? tone : i < active ? "#a3a4a6" : "#83878b" }}>
          {String(i + 1).padStart(2, "0")} {s}
        </li>
      ))}
    </ol>
  )
}

function Row({ label, value, dot, n }: { label: string; value?: number; dot: string; n: (v?: number) => string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2.5 text-muted">
        <span className="h-2 w-2 flex-none" style={{ background: dot, boxShadow: value ? `0 0 10px ${dot}` : "none", opacity: value ? 1 : 0.35 }} />
        {label}
      </span>
      <span className="tabular-nums transition-colors duration-500" style={{ color: value ? dot : "#7bd88f" }}>
        {n(value)}
      </span>
    </div>
  )
}

function Live({ label, value, sub, on, tone }: { label: string; value: string; sub?: string; on: boolean; tone?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 transition-opacity duration-500" style={{ opacity: on ? 1 : 0.3 }}>
      <span className="text-muted">{label}</span>
      <span className="text-right tabular-nums" style={{ color: tone ?? "#f0f0ed" }}>
        {value}
        {sub && <span className="ml-2 text-faint">{sub}</span>}
      </span>
    </div>
  )
}

/** Los dos tamaños a escala: la barra del STL entera y la del .bread en proporción. */
function Bars({ stl, bread, on }: { stl?: number; bread?: number; on: boolean }) {
  const w = stl && bread ? Math.max(0.6, (bread / stl) * 100) : 0
  return (
    <div className="mt-4 grid gap-1.5" aria-hidden="true">
      <div className="h-2 bg-[#3d4044] transition-transform duration-1000" style={{ transform: `scaleX(${on ? 1 : 0})`, transformOrigin: "left" }} />
      <div className="h-2 transition-all duration-1000" style={{ width: on ? `${w}%` : 0, background: "#f2e3c2", boxShadow: "0 0 12px rgba(242,227,194,.7)" }} />
    </div>
  )
}

function Facts({ facts, tone }: { facts: [string, string][]; tone: string }) {
  return (
    <dl className="grid grid-cols-3 gap-3 border-t border-line pt-4">
      {facts.map(([v, l]) => (
        <div key={l}>
          <dt className="display text-[clamp(1.1rem,2vw,1.5rem)]" style={{ color: tone }}>{v}</dt>
          <dd className="mt-1 text-[11px] leading-snug text-faint">{l}</dd>
        </div>
      ))}
    </dl>
  )
}

function Hud({ on, children }: { on: boolean; children: React.ReactNode }) {
  return (
    <p className="flex max-w-[34rem] items-start gap-2.5 font-mono text-xs leading-relaxed text-muted">
      <span className="mt-1 inline-block h-2 w-2 flex-none rounded-full" style={{ background: on ? "#7bd88f" : "#83878b", boxShadow: on ? "0 0 10px #7bd88f" : "none" }} />
      <span>{children}</span>
    </p>
  )
}

type LoopCopy = (typeof COPY)["en"]["loop"]

/** Las tres herramientas y el formato en el medio, con lo que viaja por cada línea. */
function Chain({ t, on }: { t: LoopCopy; on: boolean }) {
  const nodes = [
    { id: "blender", x: 90, y: 70, label: t.nodes.blender, tone: "#83878b" },
    { id: "caliper", x: 90, y: 250, label: t.nodes.caliper, tone: TONE.caliper },
    { id: "bread", x: 480, y: 250, label: t.nodes.bread, tone: TONE.bread, big: true },
    { id: "slicer", x: 870, y: 250, label: t.nodes.slicer, tone: TONE.slicer },
    { id: "printer", x: 870, y: 430, label: t.nodes.printer, tone: "#83878b" },
    { id: "browser", x: 480, y: 430, label: t.nodes.browser, tone: "#83878b" },
  ]
  const at = (id: string) => nodes.find((x) => x.id === id)!
  // side: dónde va la etiqueta de una línea vertical (a la derecha o a la izquierda)
  const edges = [
    { a: "blender", b: "caliper", label: t.edges.bridge, tone: TONE.caliper, side: 1 },
    { a: "caliper", b: "bread", label: t.edges.caliper, tone: TONE.caliper, both: true },
    { a: "bread", b: "slicer", label: t.edges.slicer, tone: TONE.slicer, both: true },
    { a: "slicer", b: "printer", label: t.edges.printer, tone: TONE.slicer, side: -1 },
    { a: "bread", b: "browser", label: t.edges.browser, tone: TONE.bread, side: -1 },
  ]
  return (
    <div className="mt-10 overflow-x-auto pb-2">
      <svg viewBox="0 0 960 500" className="w-full min-w-[680px] max-w-[64rem]" role="img" aria-label={edges.map((e) => `${at(e.a).label} → ${at(e.b).label}: ${e.label}`).join(". ")}>
        <style>{`.flow{stroke-dasharray:3 11;animation:flow 1.4s linear infinite}.flow.back{animation-direction:reverse}@keyframes flow{to{stroke-dashoffset:-28}}@media (prefers-reduced-motion:reduce){.flow{animation:none}}`}</style>
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        {edges.map((e, i) => {
          const A = at(e.a), B = at(e.b)
          const vertical = A.x === B.x
          const ra = A.big ? 44 : 32, rb = B.big ? 44 : 32
          const x1 = vertical ? A.x : A.x + ra, x2 = vertical ? B.x : B.x - rb
          const y1 = vertical ? A.y + ra : A.y, y2 = vertical ? B.y - rb : B.y
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
          return (
            <g key={e.a + e.b} style={{ opacity: on ? 1 : 0, transition: `opacity .7s ${i * 0.12}s` }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2b2d30" strokeWidth={2} />
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={e.tone} strokeWidth={2} className="flow" strokeLinecap="round" />
              {e.both && <line x1={x1} y1={y1 + 7} x2={x2} y2={y2 + 7} stroke={e.tone} strokeOpacity={0.45} strokeWidth={1.5} className="flow back" strokeLinecap="round" />}
              <text
                x={vertical ? mx + (e.side ?? 1) * 16 : mx}
                y={vertical ? my + 4 : my - 16}
                textAnchor={vertical ? ((e.side ?? 1) > 0 ? "start" : "end") : "middle"}
                fill="#a3a4a6"
                style={{ font: "500 12.5px var(--font-mono), monospace" }}
              >
                {e.label}
              </text>
            </g>
          )
        })}
        {nodes.map((nd) => (
          <g key={nd.id} transform={`translate(${nd.x} ${nd.y})`}>
            {nd.big && <circle r={44} fill={nd.tone} opacity={0.18} filter="url(#glow)" />}
            <circle r={nd.big ? 44 : 32} fill="#111214" stroke={nd.tone} strokeWidth={nd.big ? 2 : 1.5} />
            {nd.big && <circle r={58} fill="none" stroke={nd.tone} strokeOpacity={0.22} strokeDasharray="2 6" />}
            <text y={nd.big ? 6 : 5} textAnchor="middle" fill={nd.tone} style={{ font: `700 ${nd.big ? 17 : 12}px var(--font-sans), sans-serif`, fontStretch: "125%" }}>
              {nd.big ? ".bread" : nd.label.slice(0, 1)}
            </text>
            {!nd.big && (
              <text y={52} textAnchor="middle" fill="#f0f0ed" style={{ font: "700 14px var(--font-sans), sans-serif", fontStretch: "125%" }}>
                {nd.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

function Card({ tone, name, icon, c, href, children }: { tone: string; name: string; icon?: string; c: { kind: string; body: string; cta: string }; href: string; children?: React.ReactNode }) {
  return (
    <div className="relative border border-line bg-panel/90 p-6" style={{ ["--tone" as string]: tone, boxShadow: `inset 0 2px 0 ${tone}` }}>
      <div className="flex items-center gap-3">
        {icon ? (
          <Image src={icon} alt="" width={32} height={32} className="h-8 w-8 object-contain" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center border font-mono text-[11px]" style={{ borderColor: tone, color: tone }}>.b</span>
        )}
        <h3 className="display text-2xl">{name}</h3>
      </div>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[.12em]" style={{ color: tone }}>{c.kind}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-body">{c.body}</p>
      <p className="mt-5 font-mono text-sm">
        <a href={href} target="_blank" rel="noopener noreferrer" className="go">{c.cta}</a>
      </p>
      {children}
    </div>
  )
}
