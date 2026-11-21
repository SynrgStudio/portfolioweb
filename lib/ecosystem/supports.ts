// Los soportes de un proyecto de Breadslicer, reconstruidos desde su chunk SUPP.
//
// Breadslicer no guarda los soportes como malla: guarda cada pieza con sus medidas (bases, troncos,
// ramas, hojas, twigs, sticks, riostras y uniones, en milímetros y en coordenadas de la placa), y
// los vuelve a armar al abrir el archivo. La página hace lo mismo, acá, en el navegador.
//
// Cada pieza es un sólido convexo (un tronco de cono, una esfera, un prisma), así el corte de una
// capa se puede pintar pieza por pieza sin que las que se tocan se anulen entre sí.

type V3 = [number, number, number]
type P = { x: number; y: number; z: number }

export type Prim = { t0: number; t1: number; zmin: number; zmax: number }
export type Supports = {
  vertices: Float32Array
  triangles: Uint32Array
  prims: Prim[]
  counts: { bases: number; trunks: number; branches: number; leaves: number; twigs: number; sticks: number; braces: number; tips: number }
  min: V3
  max: V3
  ms: number
}

/** El sobre de SUPP (SPEC.md 7.3): la primera entrada, con el nombre y la versión de su documento. */
export function readSupp(payload: Uint8Array): { generator: string; version: number; doc: unknown } | null {
  const dv = new DataView(payload.buffer, payload.byteOffset, payload.byteLength)
  let o = 0
  const u32 = () => {
    const v = dv.getUint32(o, true)
    o += 4
    return v
  }
  const bytes = () => {
    const n = u32()
    const b = payload.subarray(o, o + n)
    o += n
    return b
  }
  try {
    if (u32() < 1) return null
    u32() // el modelo
    u32() // la hoja de los soportes
    const generator = new TextDecoder().decode(bytes())
    const version = u32()
    const doc = JSON.parse(new TextDecoder().decode(bytes()))
    return { generator, version, doc }
  } catch {
    return null
  }
}

const v = (p: P): V3 => [p.x, p.y, p.z]
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s]
const len = (a: V3) => Math.hypot(a[0], a[1], a[2])
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const norm = (a: V3): V3 => {
  const l = len(a) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

/** Arma la malla de los soportes de un documento `df` de Breadslicer (versión 2). */
export function buildSupports(doc: any): Supports {
  const t0 = performance.now()
  const pos: number[] = []
  const tri: number[] = []
  const prims: Prim[] = []
  const SIDES = 10

  const begin = () => ({ v0: pos.length / 3, t0: tri.length / 3 })
  const end = (b: { v0: number; t0: number }) => {
    let zmin = Infinity, zmax = -Infinity
    for (let i = b.v0 * 3 + 2; i < pos.length; i += 3) {
      if (pos[i] < zmin) zmin = pos[i]
      if (pos[i] > zmax) zmax = pos[i]
    }
    if (tri.length / 3 > b.t0) prims.push({ t0: b.t0, t1: tri.length / 3, zmin, zmax })
  }
  const vert = (p: V3) => {
    pos.push(p[0], p[1], p[2])
    return pos.length / 3 - 1
  }

  /** Un tronco de cono cerrado de `a` (radio ra) a `b` (radio rb). */
  const frustum = (a: V3, b: V3, ra: number, rb: number) => {
    const d = sub(b, a)
    if (len(d) < 1e-6) return
    const B = begin()
    const ax = norm(d)
    const ref: V3 = Math.abs(ax[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]
    const u = norm(cross(ax, ref))
    const w = cross(ax, u)
    const ringA: number[] = [], ringB: number[] = []
    for (let i = 0; i < SIDES; i++) {
      const t = (i / SIDES) * Math.PI * 2
      const dir = add(mul(u, Math.cos(t)), mul(w, Math.sin(t)))
      ringA.push(vert(add(a, mul(dir, ra))))
      ringB.push(vert(add(b, mul(dir, rb))))
    }
    for (let i = 0; i < SIDES; i++) {
      const j = (i + 1) % SIDES
      tri.push(ringA[i], ringA[j], ringB[j], ringA[i], ringB[j], ringB[i])
    }
    // tapas, con vértices propios para que la luz las vea planas
    const ca = vert(a), cb = vert(b)
    const capA: number[] = [], capB: number[] = []
    for (let i = 0; i < SIDES; i++) {
      capA.push(vert([pos[ringA[i] * 3], pos[ringA[i] * 3 + 1], pos[ringA[i] * 3 + 2]]))
      capB.push(vert([pos[ringB[i] * 3], pos[ringB[i] * 3 + 1], pos[ringB[i] * 3 + 2]]))
    }
    for (let i = 0; i < SIDES; i++) {
      const j = (i + 1) % SIDES
      tri.push(ca, capA[j], capA[i], cb, capB[i], capB[j])
    }
    end(B)
  }

  const sphere = (c: V3, r: number) => {
    if (r <= 0) return
    const B = begin()
    const R = 6, S = 8
    const rows: number[][] = []
    for (let i = 0; i <= R; i++) {
      const phi = (i / R) * Math.PI
      const row: number[] = []
      for (let j = 0; j < S; j++) {
        const th = (j / S) * Math.PI * 2
        row.push(vert([c[0] + r * Math.sin(phi) * Math.cos(th), c[1] + r * Math.sin(phi) * Math.sin(th), c[2] + r * Math.cos(phi)]))
      }
      rows.push(row)
    }
    for (let i = 0; i < R; i++)
      for (let j = 0; j < S; j++) {
        const k = (j + 1) % S
        tri.push(rows[i][j], rows[i + 1][j], rows[i + 1][k], rows[i][j], rows[i + 1][k], rows[i][k])
      }
    end(B)
  }

  /** Un prisma de base convexa, de z0 a z1: la balsa. */
  const prism = (pts: [number, number][], z0: number, z1: number) => {
    if (pts.length < 3) return
    const B = begin()
    const bot = pts.map(([x, y]) => vert([x, y, z0]))
    const top = pts.map(([x, y]) => vert([x, y, z1]))
    const n = pts.length
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      tri.push(bot[i], bot[j], top[j], bot[i], top[j], top[i])
    }
    const cb = vert([pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n, z0])
    const ct = vert([pos[cb * 3], pos[cb * 3 + 1], z1])
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n
      tri.push(cb, bot[j], bot[i], ct, top[i], top[j])
    }
    end(B)
  }

  const st = doc.state ?? {}
  const vals = (o: unknown) => (o && typeof o === "object" ? Object.values(o as Record<string, any>) : []) as any[]
  const knots = new Map<string, any>(vals(st.knots).map((k) => [k.id, k]))
  const roots = new Map<string, any>(vals(st.roots).map((r) => [r.id, r]))
  let tips = 0

  // una cadena de segmentos: troncos de cono entre uniones, y una esfera en cada unión
  const chain = (segments: any[], start: V3 | null) => {
    let prev = start
    for (const s of segments ?? []) {
      const top = v(s.topJoint.pos)
      const bottom = s.bottomJoint ? v(s.bottomJoint.pos) : prev
      if (bottom) frustum(bottom, top, s.diameter / 2, s.diameter / 2)
      sphere(top, (s.topJoint.diameter ?? s.diameter) / 2)
      prev = top
    }
    return prev
  }
  // la punta: un cono del cuerpo al punto de contacto, que termina en una esfera del diámetro del contacto
  const cone = (c: any, from: V3 | null) => {
    if (!c?.pos) return
    const p = v(c.pos)
    const prof = c.profile ?? {}
    const n = c.normal ? v(c.normal) : [0, 0, -1] as V3
    const L = prof.lengthMm ?? 2
    const base = add(p, mul(norm(n), L))
    const body = (prof.bodyDiameterMm ?? 0.8) / 2
    if (from && len(sub(base, from)) > 0.05) frustum(from, base, body, body)
    frustum(base, p, body, (prof.contactDiameterMm ?? 0.24) / 2)
    sphere(p, (prof.contactDiameterMm ?? 0.24) / 2)
    tips++
  }
  const disk = (d: any, from: V3 | null, r: number) => {
    if (!d?.pos) return
    const p = v(d.pos)
    if (from) frustum(from, p, r, r * 0.7)
    sphere(p, r * 0.8)
    tips++
  }

  for (const r of roots.values()) {
    const p = v(r.transform.pos)
    frustum([p[0], p[1], 0], [p[0], p[1], r.diskHeight ?? 0.25], r.diameter / 2, r.diameter / 2)
    if (r.coneHeight > 0) frustum([p[0], p[1], r.diskHeight], [p[0], p[1], r.diskHeight + r.coneHeight], r.diameter / 2, r.diameter / 4)
  }
  for (const t of vals(st.trunks)) {
    const r = roots.get(t.rootId)
    const start: V3 | null = r ? [r.transform.pos.x, r.transform.pos.y, r.diskHeight ?? 0.25] : null
    if (start && r.joinConeMm) frustum(start, add(start, [0, 0, r.joinConeMm]), (t.baseDiameterMm ?? 1) * 0.8, (t.baseDiameterMm ?? 1) / 2)
    cone(t.contactCone, chain(t.segments, start))
  }
  for (const b of vals(st.branches)) {
    const k = knots.get(b.parentKnotId)
    cone(b.contactCone, chain(b.segments, k ? v(k.pos) : null))
  }
  for (const l of vals(st.leaves)) {
    const k = knots.get(l.parentKnotId)
    cone(l.contactCone, k ? v(k.pos) : null)
  }
  for (const s of vals(st.sticks)) {
    const segs = s.segments ?? []
    chain(segs, null)
    const first = segs[0]?.bottomJoint ? v(segs[0].bottomJoint.pos) : null
    const last = segs.length ? v(segs[segs.length - 1].topJoint.pos) : null
    cone(s.contactConeA, first)
    cone(s.contactConeB, last)
  }
  for (const t of vals(st.twigs)) {
    const segs = t.segments ?? []
    chain(segs, null)
    const r = (segs[0]?.diameter ?? 0.3) / 2
    const first = segs[0]?.bottomJoint ? v(segs[0].bottomJoint.pos) : null
    const last = segs.length ? v(segs[segs.length - 1].topJoint.pos) : null
    disk(t.contactDiskA, first, r)
    disk(t.contactDiskB, last, r)
  }
  for (const b of vals(st.braces)) {
    const a = knots.get(b.startKnotId), c = knots.get(b.endKnotId)
    if (a && c) {
      const d = (b.profile?.diameter ?? 0.7) / 2
      frustum(v(a.pos), v(c.pos), d, d)
    }
  }
  for (const k of knots.values()) sphere(v(k.pos), (k.diameter ?? 0.8) / 2)

  // la balsa: la envolvente de las bases, del espesor de la receta
  const opts = doc.recipe?.options ?? {}
  if (opts.raft && opts.raft !== "none" && roots.size) {
    const pts: [number, number][] = []
    for (const r of roots.values()) {
      const R = r.diameter / 2 + 0.6
      for (let i = 0; i < 16; i++) pts.push([r.transform.pos.x + R * Math.cos((i / 16) * Math.PI * 2), r.transform.pos.y + R * Math.sin((i / 16) * Math.PI * 2)])
    }
    prism(hull(pts), 0, opts.raftThicknessMm ?? 0.5)
  }

  const vertices = Float32Array.from(pos)
  const min: V3 = [Infinity, Infinity, Infinity], max: V3 = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < vertices.length; i += 3)
    for (let a = 0; a < 3; a++) {
      min[a] = Math.min(min[a], vertices[i + a])
      max[a] = Math.max(max[a], vertices[i + a])
    }
  return {
    vertices,
    triangles: Uint32Array.from(tri),
    prims,
    counts: {
      bases: roots.size,
      trunks: vals(st.trunks).length,
      branches: vals(st.branches).length,
      leaves: vals(st.leaves).length,
      twigs: vals(st.twigs).length,
      sticks: vals(st.sticks).length,
      braces: vals(st.braces).length,
      tips,
    },
    min,
    max,
    ms: performance.now() - t0,
  }
}

/** La envolvente convexa de puntos en el plano (cadena monótona), en sentido antihorario. */
function hull(pts: [number, number][]): [number, number][] {
  const p = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const c = (o: number[], a: number[], b: number[]) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lo: [number, number][] = []
  for (const q of p) {
    while (lo.length >= 2 && c(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop()
    lo.push(q)
  }
  const up: [number, number][] = []
  for (const q of p.reverse()) {
    while (up.length >= 2 && c(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop()
    up.push(q)
  }
  return lo.slice(0, -1).concat(up.slice(0, -1))
}
