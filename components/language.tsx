"use client"

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { copy, type Copy, type Lang } from "@/lib/copy"

const LanguageContext = createContext<{ lang: Lang; t: Copy; setLang: (lang: Lang) => void }>({
  lang: "en",
  t: copy.en,
  setLang: () => {},
})

// ---------------------------------------------------------------- El glitch
// Al cambiar de idioma, todo el texto a la vista se rompe en símbolos, cambia
// y vuelve. Se hace sobre los nodos de texto del documento, así que alcanza a
// toda la página sin envolver cada cadena. Nada va en orden: cada paso sortea
// cuánto se rompe cada texto, cuáles se parten en franjas y cuánto se sacude
// la página.

const GLYPHS = "!<>-_\\/[]{}=+*^?#%&01"
const TICK = 30 // ms
const OUT_TICKS = 4
const IN_TICKS = 8
const ROOT_VARS = ["--gx", "--gs", "--ga", "--gy", "--gh", "--go"]

const rnd = (min: number, max: number) => min + Math.random() * (max - min)

type Target = {
  node: Text
  original: string
  written: string
  el: HTMLElement | null // el elemento que se puede partir en franjas, si hay
}

function visibleTargets(): Target[] {
  const targets: Target[] = []
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const text = node.nodeValue
    if (!text?.trim()) continue
    const parent = node.parentElement
    if (!parent || parent.closest("script, style, noscript")) continue
    const rect = parent.getBoundingClientRect()
    if (rect.width === 0 || rect.bottom < 0 || rect.top > window.innerHeight) continue

    // Las franjas se dibujan con ::before y ::after: sirve solo un elemento
    // cuyo único contenido es este texto y que no usa ya esos pseudoelementos.
    let el: HTMLElement | null = null
    if (parent.childNodes.length === 1) {
      const free = (pseudo: string) => ["none", "normal"].includes(getComputedStyle(parent, pseudo).content)
      if (getComputedStyle(parent).position === "static" && free("::before") && free("::after")) el = parent
    }
    targets.push({ node, original: text, written: text, el })
  }
  return targets
}

function scramble(text: string, amount: number) {
  let out = ""
  for (const ch of text)
    out += /\s/.test(ch) || Math.random() > amount ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  return out
}

// Rompe lo que está a la vista durante `ticks` pasos y después lo deja como
// estaba, salvo los textos que React haya cambiado mientras tanto.
function play(ticks: number, amountAt: (progress: number) => number) {
  const targets = visibleTargets()
  const root = document.documentElement.style
  return new Promise<void>((resolve) => {
    let step = 0
    const tick = () => {
      step++
      const done = step > ticks
      const base = done ? 0 : amountAt(step / ticks)

      // Sacudida, aberración y franja invertida: valores nuevos en cada paso
      root.setProperty("--gx", Math.random() < 0.3 ? "0px" : `${rnd(-10, 10).toFixed(1)}px`)
      root.setProperty("--gs", `${rnd(-1.4, 1.4).toFixed(2)}deg`)
      root.setProperty("--ga", `${rnd(-6, 6).toFixed(1)}px`)
      root.setProperty("--gy", `${rnd(0, 95).toFixed(0)}vh`)
      root.setProperty("--gh", `${rnd(1, 16).toFixed(0)}vh`)
      root.setProperty("--go", Math.random() < 0.45 ? "1" : "0")

      for (const t of targets) {
        if (t.node.nodeValue === t.written) {
          // Cada texto sortea su propia rotura; cada tanto uno se rompe entero.
          const amount = Math.random() < 0.12 ? 1 : base * rnd(0.4, 1.5)
          t.written = done ? t.original : scramble(t.original, Math.min(amount, 1))
          t.node.nodeValue = t.written
        }
        if (!t.el) continue
        if (!done && Math.random() < 0.4) {
          t.el.dataset.g = String(1 + Math.floor(Math.random() * 4))
          t.el.dataset.gt = t.node.nodeValue ?? ""
        } else {
          delete t.el.dataset.g
          delete t.el.dataset.gt
        }
      }

      if (done) {
        clearInterval(id)
        resolve()
      }
    }
    const id = setInterval(tick, TICK)
    tick() // el primer paso va ya, sin esperar un intervalo
  })
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en")
  const current = useRef<Lang>("en")
  const busy = useRef(false)

  // La elección se recuerda; la primera visita sigue el idioma del navegador.
  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem("lang")
    } catch {}
    const initial: Lang | null =
      saved === "en" || saved === "es" ? saved : navigator.language.toLowerCase().startsWith("es") ? "es" : null
    if (initial) {
      current.current = initial
      setLangState(initial)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback(async (next: Lang) => {
    if (busy.current || next === current.current) return
    current.current = next
    try {
      localStorage.setItem("lang", next)
    } catch {}

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLangState(next)
      return
    }

    busy.current = true
    const root = document.documentElement
    root.classList.add("glitching")
    try {
      await play(OUT_TICKS, (p) => 0.35 + 0.5 * p)
      flushSync(() => setLangState(next))
      await play(IN_TICKS, (p) => 0.85 * (1 - p) + 0.08)
    } finally {
      root.classList.remove("glitching")
      for (const name of ROOT_VARS) root.style.removeProperty(name)
      busy.current = false
    }
  }, [])

  return <LanguageContext.Provider value={{ lang, t: copy[lang], setLang }}>{children}</LanguageContext.Provider>
}

export const useLang = () => useContext(LanguageContext)
