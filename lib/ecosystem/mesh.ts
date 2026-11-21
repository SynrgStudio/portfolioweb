// Lo que /ecosystem calcula en el navegador de quien la mira, sobre la malla real del modelo:
// el análisis de bordes (lo que cuenta Caliper), el STL y la comparación bit a bit (lo que
// garantiza .bread), los puntos de soporte y el corte en capas (lo que hace Breadslicer).
// Todo en milímetros, Z arriba, como en el archivo.

export type Mesh = { vertices: Float32Array; triangles: Uint32Array }

export type Bounds = { min: [number, number, number]; max: [number, number, number] }

export function bounds(v: Float32Array): Bounds {
  const min: [number, number, number] = [Infinity, Infinity, Infinity]
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < v.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      const x = v[i + a]
      if (x < min[a]) min[a] = x
      if (x > max[a]) max[a] = x
    }
  }
  return { min, max }
}

// ------------------------------------------------------------------ análisis
export type Analysis = {
  edges: number
  open: number // usados por una sola cara
  nonManifold: number // usados por más de dos
  inconsistent: number // dos caras que recorren el borde en el mismo sentido
  openEdges: Uint32Array // pares de vértices de los bordes abiertos
  flippedEdges: Uint32Array // pares de vértices de los bordes con orientación inconsistente
  ms: number
}

/** Cuenta los defectos de borde de los triángulos `tris` (índices de a tres) que `keep` deja. */
export function analyze(mesh: Mesh, keep?: (t: number) => boolean, flipped?: Uint8Array): Analysis {
  const t0 = performance.now()
  const nv = mesh.vertices.length / 3
  const T = mesh.triangles
  const n = T.length / 3
  // clave del borde: menor * nv + mayor (entra en un double sin perder nada)
  const uses = new Map<number, number>() // usos
  const dir = new Map<number, number>() // suma de sentidos: +1 de menor a mayor, -1 al revés
  for (let t = 0; t < n; t++) {
    if (keep && !keep(t)) continue
    const f = flipped && flipped[t] ? 1 : 0
    for (let e = 0; e < 3; e++) {
      let a = T[t * 3 + e]
      let b = T[t * 3 + ((e + 1) % 3)]
      if (f) [a, b] = [b, a]
      const k = a < b ? a * nv + b : b * nv + a
      uses.set(k, (uses.get(k) ?? 0) + 1)
      dir.set(k, (dir.get(k) ?? 0) + (a < b ? 1 : -1))
    }
  }
  const open: number[] = []
  const inc: number[] = []
  let nonManifold = 0
  for (const [k, u] of uses) {
    const a = Math.floor(k / nv)
    const b = k - a * nv
    if (u === 1) open.push(a, b)
    else if (u > 2) nonManifold++
    else if (dir.get(k) !== 0) inc.push(a, b)
  }
  return {
    edges: uses.size,
    open: open.length / 2,
    nonManifold,
    inconsistent: inc.length / 2,
    openEdges: Uint32Array.from(open),
    flippedEdges: Uint32Array.from(inc),
    ms: performance.now() - t0,
  }
}

// ------------------------------------------------------------------ el daño de la demo
/** Estado de cada triángulo para la demo de Caliper: 0 bien, 1 falta (agujero), 2 invertido. */
export function damage(mesh: Mesh, b: Bounds): Uint8Array {
  const T = mesh.triangles
  const V = mesh.vertices
  const n = T.length / 3
  const state = new Uint8Array(n)
  const h = b.max[2] - b.min[2]
  const cx = (b.min[0] + b.max[0]) / 2
  const cy = (b.min[1] + b.max[1]) / 2
  // Tres agujeros y una zona invertida, en lugares que se ven de frente: la cara del triángulo
  // más cercano a cada punto, en la superficie que mira a la cámara (-Y).
  const spots: { z: number; x: number; r: number; s: 1 | 2 }[] = [
    { z: 0.72, x: -0.18, r: 2.2, s: 1 },
    { z: 0.45, x: 0.22, r: 2.6, s: 1 },
    { z: 0.22, x: -0.05, r: 1.8, s: 1 },
    { z: 0.58, x: 0.02, r: 3.4, s: 2 },
  ]
  const cen = (t: number, a: number) => (V[T[t * 3] * 3 + a] + V[T[t * 3 + 1] * 3 + a] + V[T[t * 3 + 2] * 3 + a]) / 3
  for (const s of spots) {
    const px = cx + s.x * (b.max[0] - b.min[0])
    const pz = b.min[2] + s.z * h
    // el punto de la superficie más adelante (y mínima) cerca de esa columna
    let best = -1
    let bestY = Infinity
    for (let t = 0; t < n; t++) {
      const dx = cen(t, 0) - px
      const dz = cen(t, 2) - pz
      if (dx * dx + dz * dz > 1.2 * 1.2) continue
      const y = cen(t, 1)
      if (y < bestY) {
        bestY = y
        best = t
      }
    }
    if (best < 0) continue
    const c = [cen(best, 0), cen(best, 1), cen(best, 2)]
    for (let t = 0; t < n; t++) {
      const dx = cen(t, 0) - c[0]
      const dy = cen(t, 1) - c[1]
      const dz = cen(t, 2) - c[2]
      if (dx * dx + dy * dy + dz * dz < s.r * s.r) state[t] = s.s
    }
  }
  void cy
  return state
}

// ------------------------------------------------------------------ STL y bit a bit
/** El STL binario de la malla, con la normal de cada cara: lo que escribiría cualquier programa. */
export function toStl(mesh: Mesh): Uint8Array {
  const T = mesh.triangles
  const V = mesh.vertices
  const n = T.length / 3
  const buf = new ArrayBuffer(84 + n * 50)
  const dv = new DataView(buf)
  const head = "binary STL rebuilt in the browser from a .bread file"
  for (let i = 0; i < head.length; i++) dv.setUint8(i, head.charCodeAt(i))
  dv.setUint32(80, n, true)
  for (let t = 0; t < n; t++) {
    const o = 84 + t * 50
    const a = T[t * 3] * 3
    const b = T[t * 3 + 1] * 3
    const c = T[t * 3 + 2] * 3
    const ux = V[b] - V[a], uy = V[b + 1] - V[a + 1], uz = V[b + 2] - V[a + 2]
    const vx = V[c] - V[a], vy = V[c + 1] - V[a + 1], vz = V[c + 2] - V[a + 2]
    let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    const l = Math.hypot(nx, ny, nz) || 1
    nx /= l; ny /= l; nz /= l
    dv.setFloat32(o, nx, true); dv.setFloat32(o + 4, ny, true); dv.setFloat32(o + 8, nz, true)
    for (let k = 0; k < 3; k++) {
      const p = T[t * 3 + k] * 3
      dv.setFloat32(o + 12 + k * 12, V[p], true)
      dv.setFloat32(o + 16 + k * 12, V[p + 1], true)
      dv.setFloat32(o + 20 + k * 12, V[p + 2], true)
    }
  }
  return new Uint8Array(buf)
}

/** Cuántas coordenadas de esquina de `mesh` difieren, bit a bit, de las del STL. */
export function cornerMismatches(stl: Uint8Array, mesh: Mesh): { corners: number; bad: number } {
  const dv = new DataView(stl.buffer, stl.byteOffset, stl.byteLength)
  const n = dv.getUint32(80, true)
  const bits = new Uint32Array(mesh.vertices.buffer, mesh.vertices.byteOffset, mesh.vertices.length)
  const T = mesh.triangles
  let bad = 0
  for (let t = 0; t < n; t++) {
    for (let c = 0; c < 3; c++) {
      const v = T[t * 3 + c] * 3
      const o = 84 + t * 50 + 12 + c * 12
      if (dv.getUint32(o, true) !== bits[v] || dv.getUint32(o + 4, true) !== bits[v + 1] || dv.getUint32(o + 8, true) !== bits[v + 2]) bad++
    }
  }
  return { corners: n * 3, bad }
}

// ------------------------------------------------------------------ soportes
export type Tip = { x: number; y: number; z: number }

/**
 * Un boceto de soportes: en una grilla de `spacing` mm, el punto más bajo de las caras que miran
 * hacia abajo más de `angle` grados. No es el generador de Breadslicer, que hace mucho más: es la
 * idea, calculada acá. `lift` sube el modelo sobre la placa.
 */
export function supportTips(mesh: Mesh, b: Bounds, spacing = 1.6, angle = 50): Tip[] {
  const T = mesh.triangles
  const V = mesh.vertices
  const n = T.length / 3
  const lim = -Math.cos((angle * Math.PI) / 180)
  const cells = new Map<number, Tip>()
  const W = 10000
  for (let t = 0; t < n; t++) {
    const a = T[t * 3] * 3, bb = T[t * 3 + 1] * 3, c = T[t * 3 + 2] * 3
    const ux = V[bb] - V[a], uy = V[bb + 1] - V[a + 1], uz = V[bb + 2] - V[a + 2]
    const vx = V[c] - V[a], vy = V[c + 1] - V[a + 1], vz = V[c + 2] - V[a + 2]
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    const l = Math.hypot(nx, ny, nz)
    if (!l || nz / l > lim) continue
    const x = (V[a] + V[bb] + V[c]) / 3
    const y = (V[a + 1] + V[bb + 1] + V[c + 1]) / 3
    const z = (V[a + 2] + V[bb + 2] + V[c + 2]) / 3
    const k = Math.floor((x - b.min[0]) / spacing) * W + Math.floor((y - b.min[1]) / spacing)
    const o = cells.get(k)
    if (!o || z < o.z) cells.set(k, { x, y, z })
  }
  return [...cells.values()]
}

// ------------------------------------------------------------------ corte en capas
/**
 * El corte de la malla a la altura `z`: segmentos x1, y1, x2, y2 (en mm). Cada triángulo que la
 * cruza da uno. Es lo primero que hace un slicer con cada capa.
 */
export function slice(mesh: Mesh, z: number, out?: Float32Array, from = 0, to = -1, at = 0): { seg: Float32Array; count: number } {
  const T = mesh.triangles
  const V = mesh.vertices
  const n = to < 0 ? T.length / 3 : to
  let seg = out ?? new Float32Array(4096)
  let k = at * 4 // se puede seguir agregando a segmentos que ya están
  for (let t = from; t < n; t++) {
    const i0 = T[t * 3] * 3, i1 = T[t * 3 + 1] * 3, i2 = T[t * 3 + 2] * 3
    const z0 = V[i0 + 2], z1 = V[i1 + 2], z2 = V[i2 + 2]
    if ((z0 < z && z1 < z && z2 < z) || (z0 >= z && z1 >= z && z2 >= z)) continue
    const pts: number[] = []
    const edge = (p: number, q: number, zp: number, zq: number) => {
      if (zp < z !== zq < z) {
        const s = (z - zp) / (zq - zp)
        pts.push(V[p] + s * (V[q] - V[p]), V[p + 1] + s * (V[q + 1] - V[p + 1]))
      }
    }
    edge(i0, i1, z0, z1)
    edge(i1, i2, z1, z2)
    edge(i2, i0, z2, z0)
    if (pts.length < 4) continue
    if (k + 4 > seg.length) {
      const g = new Float32Array(seg.length * 2)
      g.set(seg)
      seg = g
    }
    seg[k++] = pts[0]; seg[k++] = pts[1]; seg[k++] = pts[2]; seg[k++] = pts[3]
  }
  return { seg, count: k / 4 }
}

/**
 * La capa como la mostraría la pantalla de la impresora: píxeles encendidos donde está el
 * sólido, por paridad de cruces en cada fila (no hace falta unir los segmentos en lazos).
 */
export function rasterize(
  seg: Float32Array,
  count: number,
  img: ImageData,
  x0: number,
  y0: number,
  px: number,
  tips: Tip[],
  tipR: number,
  color: [number, number, number],
) {
  const { width: W, height: H, data } = img
  data.fill(0)
  for (let i = 3; i < data.length; i += 4) data[i] = 255
  const xs: number[] = []
  for (let r = 0; r < H; r++) {
    const y = y0 + (H - 1 - r + 0.5) * px
    xs.length = 0
    for (let s = 0; s < count; s++) {
      const ay = seg[s * 4 + 1], by = seg[s * 4 + 3]
      if (ay < y === by < y) continue
      const ax = seg[s * 4], bx = seg[s * 4 + 2]
      xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax))
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const c0 = Math.max(0, Math.ceil((xs[i] - x0) / px - 0.5))
      const c1 = Math.min(W - 1, Math.floor((xs[i + 1] - x0) / px - 0.5))
      for (let c = c0; c <= c1; c++) {
        const o = (r * W + c) * 4
        data[o] = color[0]; data[o + 1] = color[1]; data[o + 2] = color[2]
      }
    }
  }
  // los soportes que cruzan la capa: un círculo cada uno
  const rr = tipR / px
  for (const t of tips) {
    const cx = (t.x - x0) / px
    const cy = H - 1 - (t.y - y0) / px
    for (let r = Math.floor(cy - rr); r <= Math.ceil(cy + rr); r++) {
      if (r < 0 || r >= H) continue
      for (let c = Math.floor(cx - rr); c <= Math.ceil(cx + rr); c++) {
        if (c < 0 || c >= W) continue
        if ((c - cx) ** 2 + (r - cy) ** 2 > rr * rr) continue
        const o = (r * W + c) * 4
        data[o] = color[0]; data[o + 1] = color[1]; data[o + 2] = color[2]
      }
    }
  }
}

/** Pone la capa en negro. */
export function clearLayer(img: ImageData) {
  const d = img.data
  d.fill(0)
  for (let i = 3; i < d.length; i += 4) d[i] = 255
}

/**
 * Enciende los píxeles adentro de los segmentos [from, to) por paridad de cruces. Cada sólido se
 * pinta por separado, así dos que se tocan suman en vez de anularse.
 */
export function fillLayer(seg: Float32Array, from: number, to: number, img: ImageData, x0: number, y0: number, px: number, color: [number, number, number]) {
  const { width: W, height: H, data } = img
  let ymin = Infinity, ymax = -Infinity
  for (let s = from; s < to; s++) {
    ymin = Math.min(ymin, seg[s * 4 + 1], seg[s * 4 + 3])
    ymax = Math.max(ymax, seg[s * 4 + 1], seg[s * 4 + 3])
  }
  const r0 = Math.max(0, Math.floor(H - 1 - (ymax - y0) / px - 1))
  const r1 = Math.min(H - 1, Math.ceil(H - 1 - (ymin - y0) / px + 1))
  const xs: number[] = []
  for (let r = r0; r <= r1; r++) {
    const y = y0 + (H - 1 - r + 0.5) * px
    xs.length = 0
    for (let s = from; s < to; s++) {
      const ay = seg[s * 4 + 1], by = seg[s * 4 + 3]
      if (ay < y === by < y) continue
      const ax = seg[s * 4], bx = seg[s * 4 + 2]
      xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax))
    }
    xs.sort((a, b) => a - b)
    for (let i = 0; i + 1 < xs.length; i += 2) {
      const c0 = Math.max(0, Math.ceil((xs[i] - x0) / px - 0.5))
      const c1 = Math.min(W - 1, Math.floor((xs[i + 1] - x0) / px - 0.5))
      for (let c = c0; c <= c1; c++) {
        const o = (r * W + c) * 4
        data[o] = color[0]; data[o + 1] = color[1]; data[o + 2] = color[2]
      }
    }
  }
}
