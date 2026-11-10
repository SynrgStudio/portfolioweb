"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLang } from "@/components/language"

// Lo que acompaña a cada herramienta es algo suyo y real: sus capturas, una
// respuesta suya, sus pasos, o sus números dibujados a escala.

// El marco de cada pieza, con marcas de corte en las cuatro esquinas.
export function Frame({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <figure>
      <div className="relative">
        <span aria-hidden="true" className="absolute -left-2 -top-2 h-2.5 w-2.5 border-l border-t border-line-strong" />
        <span aria-hidden="true" className="absolute -right-2 -top-2 h-2.5 w-2.5 border-r border-t border-line-strong" />
        <span aria-hidden="true" className="absolute -bottom-2 -left-2 h-2.5 w-2.5 border-b border-l border-line-strong" />
        <span aria-hidden="true" className="absolute -bottom-2 -right-2 h-2.5 w-2.5 border-b border-r border-line-strong" />
        <div className="overflow-hidden rounded-sm border border-line bg-panel">{children}</div>
      </div>
      {note && <figcaption className="mt-3 font-mono text-xs text-faint">{note}</figcaption>}
    </figure>
  )
}

// ---------------------------------------------------------------- Breadslicer
const steps = [
  { key: "transform", time: "0.39" },
  { key: "hollow", time: "0.87" },
  { key: "supports", time: "0.15" },
  { key: "slice", time: "0.66" },
  { key: "export", time: "0.12" },
] as const
const STEP_MS = 3600

export function BreadslicerSteps() {
  const { t } = useLang()
  const [active, setActive] = useState(2)
  const [paused, setPaused] = useState(false)

  // Avanza solo; se detiene mientras el cursor está encima.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setTimeout(() => setActive((i) => (i + 1) % steps.length), STEP_MS)
    return () => clearTimeout(id)
  }, [active, paused])

  const [name, label] = t.breadslicerSteps[steps[active].key]

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <Frame>
        <div className="relative aspect-video bg-[#16181a]">
          {steps.map((step, i) => (
            <Image
              key={step.key}
              src={`/tools/breadslicer/${step.key}.webp`}
              alt={i === active ? `Breadslicer: ${name}` : ""}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className="object-cover transition-opacity duration-500"
              style={{ opacity: i === active ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/5">
            <div
              key={`${active}-${paused}`}
              className="h-full origin-left bg-[var(--tone)]"
              style={{ animation: paused ? "none" : `step-progress ${STEP_MS}ms linear forwards` }}
            />
          </div>
        </div>
        <ol className="grid grid-cols-5 border-t border-line font-mono text-xs">
          {steps.map((step, i) => (
            <li key={step.key} className="border-l border-line first:border-l-0">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-current={i === active}
                className="flex w-full flex-col gap-1 px-2 py-3 text-left transition-colors sm:px-3"
                style={{ color: i === active ? "#f0f0ed" : "#73777b" }}
              >
                <span className="truncate">{t.breadslicerSteps[step.key][0]}</span>
                <span style={{ color: i === active ? "var(--tone)" : undefined }}>{step.time} s</span>
              </button>
            </li>
          ))}
        </ol>
      </Frame>
      <p className="mt-3 font-mono text-xs text-faint">
        <span className="text-[var(--tone)]">{steps[active].time} s</span> {label}
      </p>
    </div>
  )
}

// ----------------------------------------------------------------------- Seek
export function SeekTranscript() {
  const { t } = useLang()
  return (
    <Frame note={t.seekNote}>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-body sm:p-5">
        <span className="text-[var(--tone)]">{'find {"query": "fuzy.inl"}'}</span>
        {"\n"}
        <span className="text-ink">{'find "fuzy.inl" on all drives: 3 matches:'}</span>
        {"\n"}
        {"C:\\Users\\me\\Projects\\jolt\\src\\fuzzy.inl"}
        <span className="text-faint">{"  ·  11 KB  ·  modified 9 h ago  ·  in a folder used in Jolt"}</span>
        {"\n"}
        {"C:\\Users\\me\\Backups\\jolt-old\\src\\fuzzy.inl"}
        <span className="text-faint">{"  ·  3.4 KB  ·  modified 2 days ago"}</span>
        {"\n"}
        <span className="text-faint">…</span>
      </pre>
    </Frame>
  )
}

// ----------------------------------------------------------------------- Jolt
export function JoltShot() {
  const { t } = useLang()
  return (
    <Frame note={t.joltNote}>
      <Image
        src="/tools/jolt-split.png"
        alt="Jolt"
        width={1084}
        height={792}
        sizes="(max-width: 1024px) 100vw, 700px"
        className="h-auto w-full"
      />
    </Frame>
  )
}

// -------------------------------------------------------------------- Caliper
export function CaliperSteps() {
  const { t } = useLang()
  return (
    <Frame>
      <ol>
        {t.caliperSteps.map(([name, body], i) => (
          <li
            key={name}
            className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-2 border-t border-line p-4 first:border-t-0 sm:grid-cols-[2.5rem_8rem_minmax(0,1fr)] sm:p-5"
          >
            <span className="font-mono text-xs leading-6 text-[var(--tone)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-medium text-ink">{name}</span>
            <span className="col-start-2 text-muted sm:col-start-3">{body}</span>
          </li>
        ))}
      </ol>
    </Frame>
  )
}

// -------------------------------------------------------------------- WebToMD
const RAW = 1381059
const CLEAN = 13652

export function TokenBars() {
  const { t, lang } = useLang()
  const fmt = (n: number) => n.toLocaleString(lang === "es" ? "es-AR" : "en-US")
  return (
    <Frame note={t.webtomd.note}>
      <div className="space-y-6 p-4 font-mono text-xs sm:p-5">
        {[
          { label: t.webtomd.raw, value: RAW, color: "#3d4044" },
          { label: t.webtomd.clean, value: CLEAN, color: "var(--tone)" },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex items-baseline justify-between gap-4">
              <span className="text-muted">{row.label}</span>
              <span className="text-ink">
                {fmt(row.value)} <span className="text-faint">{t.webtomd.tokens}</span>
              </span>
            </div>
            <div className="h-3">
              <div
                className="bar h-full"
                style={{ width: `${Math.max((row.value / RAW) * 100, 0.5)}%`, background: row.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  )
}
