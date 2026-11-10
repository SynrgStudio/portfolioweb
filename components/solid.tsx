"use client"

import { useEffect, useRef } from "react"

// El sólido del encabezado: un dodecaedro en alambre que gira despacio.
// Con el cursor cerca, cada vértice tiende una línea hacia él, y las de los
// más cercanos se dibujan como cotas: con topes y la distancia en píxeles.

const PHI = (1 + Math.sqrt(5)) / 2
const VERTS: number[][] = []
for (const a of [-1, 1])
  for (const b of [-1, 1]) {
    for (const c of [-1, 1]) VERTS.push([a, b, c])
    VERTS.push([0, a / PHI, b * PHI], [a / PHI, b * PHI, 0], [a * PHI, 0, b / PHI])
  }

const EDGE = 2 / PHI
const EDGES: [number, number][] = []
for (let i = 0; i < VERTS.length; i++)
  for (let j = i + 1; j < VERTS.length; j++) {
    const d = Math.hypot(VERTS[i][0] - VERTS[j][0], VERTS[i][1] - VERTS[j][1], VERTS[i][2] - VERTS[j][2])
    if (Math.abs(d - EDGE) < 0.01) EDGES.push([i, j])
  }

const RADIUS = Math.sqrt(3) // del centro a cada vértice
const CAMERA = 9
const RANGE = 680 // px: hasta dónde un vértice alcanza al cursor
const DIMS = 4 // cuántos vértices reciben cota
const DIM_ALPHA = [0.9, 0.55, 0.4, 0.3]
const INK = "240, 240, 237"

export default function Solid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const monoFamily =
      getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace"

    let w = 0
    let h = 0
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const mouse = { x: 0, y: 0, inside: false }
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.inside = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= rect.width && mouse.y <= rect.height
    }
    const onLeave = () => {
      mouse.inside = false
    }

    let angle = 0.6
    let tilt = 0.42
    let last = 0
    let raf = 0
    let visible = true
    const px = new Float32Array(VERTS.length)
    const py = new Float32Array(VERTS.length)
    const pz = new Float32Array(VERTS.length)

    const frame = (time: number) => {
      raf = 0
      const dt = last ? Math.min((time - last) / 1000, 0.05) : 0.016
      last = time
      if (!reduced) angle += dt * 0.11

      const wide = w >= 1024
      const cx = wide ? w * 0.77 : w * 0.5
      const cy = wide ? h * 0.5 : h * 0.62
      const size = wide ? Math.min(w * 0.19, h * 0.36) : Math.min(w * 0.4, h * 0.26)
      const dim = wide ? 1 : 0.4 // en pantallas chicas queda detrás del texto

      // El cursor inclina apenas el sólido
      const targetTilt = 0.42 + (mouse.inside ? (mouse.y / h - 0.5) * 0.35 : 0)
      tilt += (targetTilt - tilt) * Math.min(dt * 4, 1)

      const cosY = Math.cos(angle)
      const sinY = Math.sin(angle)
      const cosX = Math.cos(tilt)
      const sinX = Math.sin(tilt)
      for (let i = 0; i < VERTS.length; i++) {
        const [x, y, z] = VERTS[i]
        const x1 = x * cosY + z * sinY
        const z1 = -x * sinY + z * cosY
        const y2 = y * cosX - z1 * sinX
        const z2 = y * sinX + z1 * cosX
        const k = ((size / RADIUS) * CAMERA) / (CAMERA - z2)
        px[i] = cx + x1 * k
        py[i] = cy + y2 * k
        pz[i] = (z2 + RADIUS) / (RADIUS * 2) // 0 lejos, 1 cerca
      }

      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1

      for (const [a, b] of EDGES) {
        const depth = (pz[a] + pz[b]) / 2
        ctx.strokeStyle = `rgba(${INK}, ${(0.08 + 0.42 * depth) * dim})`
        ctx.beginPath()
        ctx.moveTo(px[a], py[a])
        ctx.lineTo(px[b], py[b])
        ctx.stroke()
      }

      // Anotaciones de plano: círculo circunscrito, centro, cota del diámetro
      // y la lectura del giro. Son las medidas reales de lo que se dibuja.
      if (wide) {
        const r = size
        ctx.font = `10px ${monoFamily}`
        ctx.textBaseline = "middle"

        ctx.strokeStyle = `rgba(${INK}, 0.16)`
        ctx.setLineDash([3, 6])
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        const dy = cy + r + 30
        ctx.strokeStyle = `rgba(${INK}, 0.3)`
        ctx.beginPath()
        ctx.moveTo(cx - 7, cy)
        ctx.lineTo(cx + 7, cy)
        ctx.moveTo(cx, cy - 7)
        ctx.lineTo(cx, cy + 7)
        for (const ex of [cx - r, cx + r]) {
          ctx.moveTo(ex, cy + r * 0.5)
          ctx.lineTo(ex, dy + 6)
          ctx.moveTo(ex - 4, dy + 4)
          ctx.lineTo(ex + 4, dy - 4)
        }
        ctx.moveTo(cx - r, dy)
        ctx.lineTo(cx + r, dy)
        ctx.stroke()

        const diameter = `Ø ${Math.round(r * 2)} px`
        const dw = ctx.measureText(diameter).width
        ctx.fillStyle = "#111214"
        ctx.fillRect(cx - dw / 2 - 6, dy - 8, dw + 12, 16)
        ctx.fillStyle = `rgba(${INK}, 0.75)`
        ctx.textAlign = "center"
        ctx.fillText(diameter, cx, dy)

        const deg = (rad: number) => (((rad * 180) / Math.PI) % 360).toFixed(1).padStart(5, "0")
        ctx.fillStyle = `rgba(${INK}, 0.45)`
        ctx.textAlign = "left"
        ctx.fillText("V 20   E 30   F 12", cx - r, cy - r - 20)
        ctx.textAlign = "right"
        ctx.fillText(`ROT ${deg(angle)}°   TILT ${deg(tilt)}°`, cx + r, cy - r - 20)
      }

      // Los vértices al alcance del cursor, del más cercano al más lejano
      const reach: { i: number; d: number }[] = []
      if (mouse.inside && wide) {
        for (let i = 0; i < VERTS.length; i++) {
          const d = Math.hypot(mouse.x - px[i], mouse.y - py[i])
          if (d < RANGE) reach.push({ i, d })
        }
        reach.sort((m, n) => m.d - n.d)
      }

      // Una línea tenue desde cada uno, más marcada cuanto más cerca
      for (const { i, d } of reach) {
        const t = 1 - d / RANGE
        ctx.strokeStyle = `rgba(${INK}, ${Math.pow(t, 1.4) * 0.42})`
        ctx.beginPath()
        ctx.moveTo(px[i], py[i])
        ctx.lineTo(mouse.x, mouse.y)
        ctx.stroke()
      }

      for (let i = 0; i < VERTS.length; i++) {
        ctx.fillStyle = `rgba(${INK}, ${(0.25 + 0.7 * pz[i]) * dim})`
        ctx.fillRect(Math.round(px[i]) - 1.5, Math.round(py[i]) - 1.5, 3, 3)
      }

      // Las cotas: a los vértices más cercanos, la primera más marcada.
      // Se dibujan de la más lejana a la más cercana, para que esta quede arriba.
      ctx.font = `11px ${monoFamily}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const dims = reach.slice(0, DIMS).filter(({ d }) => d > 24)
      for (let k = dims.length - 1; k >= 0; k--) {
        const { i, d } = dims[k]
        const strength = DIM_ALPHA[k]
        const ax = px[i]
        const ay = py[i]
        const nx = -(mouse.y - ay) / d
        const ny = (mouse.x - ax) / d
        ctx.strokeStyle = `rgba(${INK}, ${strength})`
        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(mouse.x, mouse.y)
        for (const [ex, ey] of [
          [ax, ay],
          [mouse.x, mouse.y],
        ]) {
          ctx.moveTo(ex - nx * 5, ey - ny * 5)
          ctx.lineTo(ex + nx * 5, ey + ny * 5)
        }
        ctx.stroke()

        // La etiqueta va sobre la línea, más cerca del vértice que del cursor,
        // para que las de varias cotas no se pisen junto al puntero.
        const label = `${Math.round(d)} px`
        const tw = ctx.measureText(label).width
        const side = ny > 0 ? -1 : 1 // siempre del lado de arriba
        const along = k === 0 ? 0.5 : 0.3
        const lx = ax + (mouse.x - ax) * along + nx * 14 * side
        const ly = ay + (mouse.y - ay) * along + ny * 14 * side
        ctx.fillStyle = "#111214"
        ctx.fillRect(lx - tw / 2 - 4, ly - 8, tw + 8, 16)
        ctx.fillStyle = `rgba(${INK}, ${Math.min(1, strength + 0.1)})`
        ctx.fillText(label, lx, ly)
      }

      schedule()
    }

    const schedule = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      last = 0
      schedule()
    })
    observer.observe(canvas)

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove, { passive: true })
    document.documentElement.addEventListener("mouseleave", onLeave)
    document.addEventListener("visibilitychange", schedule)
    schedule()

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("visibilitychange", schedule)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
}
