// La escena de /ecosystem: un solo canvas WebGL fijo detrás de la página, que el scroll
// maneja con un número, S: la parte entera es el capítulo y la fracción, cuánto se avanzó en él.
//   0 portada · 1 Caliper · 2 .bread · 3 Breadslicer · 4 cómo se conectan · 5 lo medido
// El modelo es real (MZ4250, CC BY 4.0), y todo lo que se muestra de él se calcula acá.

import * as THREE from "three"
import { load, placeMeshes } from "@/lib/bread-format/index.js"
import { analyze, bounds, clearLayer, cornerMismatches, damage, fillLayer, rasterize, slice, supportTips, toStl, type Analysis, type Bounds, type Mesh, type Tip } from "./mesh"
import { buildSupports, readSupp, type Supports } from "./supports"

export type Stats = {
  triangles?: number
  vertices?: number
  breadBytes?: number
  decodeMs?: number
  wasmKb?: number
  clean?: Analysis
  damaged?: Analysis
  holes?: number
  flipped?: number
  stlBytes?: number
  stlMs?: number
  writeBytes?: number
  writeMs?: number
  readMs?: number
  corners?: number
  mismatches?: number
  chunks?: { tag: string; bytes: number }[]
  tips?: number
  layer?: number
  layers?: number
  layerZ?: number
  segments?: number
  sliceMs?: number
  heightMm?: number
  webgl?: boolean
  project?: { tag: string; bytes: number }[]
  real?: boolean // los soportes y la orientación salen del proyecto de Breadslicer
  supports?: Supports["counts"] & { ms: number; triangles: number }
}

const LIFT = 5 // mm: Breadslicer levanta 5 mm un modelo que apoya en la placa
const LAYER = 0.05 // mm
const STL_CUBE = 30 // mm: el lado del cubo del STL; el del .bread sale de los bytes medidos
const C = {
  model: new THREE.Color("#c4bcae"),
  flipped: new THREE.Color("#a96bff"),
  open: new THREE.Color("#ff4d4d"),
  bread: new THREE.Color("#f2e3c2"),
  support: new THREE.Color("#66717d"),
  amber: new THREE.Color("#ffb347"),
  caliper: new THREE.Color("#f68a3b"),
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Key = { theta: number; phi: number; dist: number; ty: number; shift: number }
// La cámara de cada capítulo: ángulo alrededor, altura, distancia, a qué altura mira y cuánto
// se corre el modelo a la derecha en pantallas anchas.
const KEYS: Key[] = [
  { theta: 0.0, phi: 0.12, dist: 134, ty: 25, shift: 0.27 },
  { theta: 0.0, phi: 0.05, dist: 104, ty: 26, shift: 0.2 },
  { theta: 0.0, phi: 0.1, dist: 120, ty: 26, shift: 0.2 },
  { theta: -0.55, phi: 0.36, dist: 168, ty: 27, shift: 0.2 },
  { theta: 0.6, phi: 0.25, dist: 160, ty: 24, shift: 0.22 },
  { theta: 0.9, phi: 0.25, dist: 190, ty: 24, shift: 0.0 },
]

export class Engine {
  stats: Stats = {}
  onStats: (s: Stats) => void = () => {}
  onReady: () => void = () => {}

  private canvas: HTMLCanvasElement
  private renderer?: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(32, 1, 1, 2000)
  private group = new THREE.Group() // el modelo, de Z arriba (archivo) a Y arriba (three)
  private lifted = new THREE.Group()
  private upright = new THREE.Group() // dentro del modelo, pero con Y arriba: soportes y balsa giran con él
  private clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4)
  private ghostClip = new THREE.Plane(new THREE.Vector3(0, 1, 0), -1e4)

  private mesh?: Mesh
  private b?: Bounds
  private state?: Uint8Array
  private tips: Tip[] = []
  private mats: { model?: THREE.MeshStandardMaterial; flipped?: THREE.MeshStandardMaterial; hole?: THREE.MeshStandardMaterial; ghost?: THREE.MeshBasicMaterial } = {}
  private surface?: THREE.Mesh
  private ghost?: THREE.Mesh
  private points?: THREE.Points
  private pointsMat?: THREE.ShaderMaterial
  private openLines?: THREE.LineSegments
  private flipLines?: THREE.LineSegments
  private contour?: THREE.LineSegments
  private contourBuf = new Float32Array(4096)
  private supports?: { trunks: THREE.InstancedMesh; cones: THREE.InstancedMesh; balls: THREE.InstancedMesh; raft: THREE.Mesh }
  private plate?: THREE.Group
  private cubes?: THREE.Group
  private cubeCenter = new THREE.Vector3() // en coordenadas del archivo
  private small = 1 / Math.cbrt(13.5) // lado del cubo .bread sobre el del STL, hasta medirlo
  private labels: { stl?: HTMLElement; bread?: HTMLElement; verify?: HTMLElement } = {}
  private lastScan = -1

  private S = 0
  private k = 1 // la altura del modelo sobre 50 mm: la cámara se aleja en proporción
  private target = 0
  private cam = { ...KEYS[0] }
  private spin = 0
  private intro = 0
  private t0 = 0
  private last = 0
  private raf = 0
  private reduced: boolean
  private layerCanvas?: HTMLCanvasElement
  private layerImg?: ImageData
  private lastLayer = -1
  private lastSupportGrow = -1
  private running = true
  private sliceSeg: Float32Array = new Float32Array(8192)
  // El proyecto de Breadslicer: la orientación de la placa y los soportes rebuilt desde SUPP.
  private real?: { R: THREE.Quaternion; cV: THREE.Vector3; cU: THREE.Vector3; cP: THREE.Vector3; placed: Mesh; sup: Supports; supMesh?: THREE.Mesh; top: number }
  private supClip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e4)
  private plateContour?: THREE.LineSegments

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.reduced = typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
    try {
      this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" })
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      this.renderer.outputColorSpace = THREE.SRGBColorSpace
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping
      this.renderer.toneMappingExposure = 1.05
      this.renderer.localClippingEnabled = true
      this.stats.webgl = true
    } catch {
      this.stats.webgl = false
    }
    this.scene.add(this.group)
    this.lights()
  }

  /** Etiquetas HTML que siguen a los cubos y a la línea de verificación. */
  setLabels(l: { stl?: HTMLElement | null; bread?: HTMLElement | null; verify?: HTMLElement | null }) {
    this.labels = { stl: l.stl ?? undefined, bread: l.bread ?? undefined, verify: l.verify ?? undefined }
  }

  setLayerCanvas(c: HTMLCanvasElement | null) {
    this.layerCanvas = c ?? undefined
    this.layerImg = undefined
    this.lastLayer = -1
  }

  /** El scroll: capítulo + fracción. */
  setProgress(s: number) {
    this.target = s
  }

  setRunning(r: boolean) {
    this.running = r
  }

  // ------------------------------------------------------------------ carga
  async load(base: string) {
    const t = performance.now()
    const [reader, bytes] = await Promise.all([
      load(fetch(`${base}/bread.wasm`)),
      fetch(`${base}/model.bread`).then((r) => r.arrayBuffer()),
    ])
    const file = new Uint8Array(bytes)
    const d0 = performance.now()
    const chunks = reader.readChunks(file)
    const mesh = reader.decodeMesh(chunks.find((c: { tag: string }) => c.tag === "MESH")!) as Mesh
    const decodeMs = performance.now() - d0
    void t
    this.mesh = mesh
    this.b = bounds(mesh.vertices)
    Object.assign(this.stats, {
      triangles: mesh.triangles.length / 3,
      vertices: mesh.vertices.length / 3,
      breadBytes: file.byteLength,
      decodeMs,
      heightMm: this.b.max[2] - this.b.min[2],
    })
    this.k = (this.b.max[2] - this.b.min[2]) / 50
    this.stats.project = chunks.map((c: { tag: string; payload?: Uint8Array }) => ({ tag: c.tag, bytes: c.payload?.byteLength ?? 0 }))
    try {
      this.readProject(reader, chunks)
    } catch {
      this.real = undefined
    }
    this.emit()
    this.state = damage(mesh, this.b)
    this.build()
    this.onReady()
    this.t0 = performance.now()
    this.loop()
    // Lo que cuesta CPU va después de que la miniatura se armó, para no trabar la entrada.
    setTimeout(() => this.measure(reader, base), this.reduced ? 100 : 2600)
  }

  /** Si el archivo es un proyecto de Breadslicer: dónde va el modelo en la placa, y sus soportes. */
  private readProject(reader: Awaited<ReturnType<typeof load>>, chunks: { tag: string; payload: Uint8Array }[]) {
    const supp = chunks.find((c) => c.tag === "SUPP")
    const doc = supp ? readSupp(supp.payload) : null
    if (!doc || doc.generator !== "df" || doc.version > 2) return // un documento que no conocemos: como si no estuviera
    const place = placeMeshes(reader.decodeScene(chunks as never)).find((x: { mesh: number }) => x.mesh === 0)
    if (!place) return
    const M = new THREE.Matrix4().fromArray(place.matrix)
    const V = this.mesh!.vertices
    const pv = new Float32Array(V.length)
    const e = M.elements
    for (let i = 0; i < V.length; i += 3) {
      const x = V[i], y = V[i + 1], z = V[i + 2]
      pv[i] = e[0] * x + e[4] * y + e[8] * z + e[12]
      pv[i + 1] = e[1] * x + e[5] * y + e[9] * z + e[13]
      pv[i + 2] = e[2] * x + e[6] * y + e[10] * z + e[14]
    }
    const placed = { vertices: pv, triangles: this.mesh!.triangles }
    const pb = bounds(pv)
    const sup = buildSupports(doc.doc)
    const b = this.b!
    const cV = new THREE.Vector3((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, (b.min[2] + b.max[2]) / 2)
    const R = new THREE.Quaternion().setFromRotationMatrix(M)
    this.real = {
      R,
      cV,
      cU: new THREE.Vector3(0, 0, (b.max[2] - b.min[2]) / 2),
      cP: cV.clone().applyMatrix4(M),
      placed,
      sup,
      top: Math.max(pb.max[2], sup.max[2]),
    }
    Object.assign(this.stats, { real: true, supports: { ...sup.counts, ms: sup.ms, triangles: sup.triangles.length / 3 } })
  }

  private async measure(reader: Awaited<ReturnType<typeof load>>, base: string) {
    const mesh = this.mesh!
    const st = this.state!
    const idle = () => new Promise<void>((r) => ("requestIdleCallback" in window ? (window as unknown as { requestIdleCallback: (f: () => void) => void }).requestIdleCallback(() => r()) : setTimeout(r, 30)))
    await idle()
    const clean = analyze(mesh)
    await idle()
    const flipped = st.map((s) => (s === 2 ? 1 : 0))
    const damaged = analyze(mesh, (t) => st[t] !== 1, flipped)
    let holes = 0, flips = 0
    for (const s of st) (s === 1 ? holes++ : s === 2 ? flips++ : 0)
    Object.assign(this.stats, { clean, damaged, holes, flipped: flips })
    this.buildDefects(damaged)
    this.emit()

    await idle()
    const t1 = performance.now()
    const stl = toStl(mesh)
    const stlMs = performance.now() - t1
    Object.assign(this.stats, { stlBytes: stl.byteLength, stlMs })
    this.emit()

    const writer = await load(fetch(`${base}/bread-write.wasm`))
    await idle()
    const t2 = performance.now()
    const { file } = writer.fromStl([{ name: "Death Knight.stl", bytes: stl }])
    const writeMs = performance.now() - t2
    await idle()
    const t3 = performance.now()
    const chunks = reader.readChunks(file)
    const back = reader.decodeMesh(chunks.find((c: { tag: string }) => c.tag === "MESH")!) as Mesh
    const readMs = performance.now() - t3
    const cmp = cornerMismatches(stl, back)
    Object.assign(this.stats, {
      writeBytes: file.byteLength,
      writeMs,
      readMs,
      corners: cmp.corners,
      mismatches: cmp.bad,
      chunks: chunks.map((c: { tag: string; payload?: Uint8Array }) => ({ tag: c.tag, bytes: c.payload?.byteLength ?? 0 })),
    })
    this.emit()
  }

  private emit() {
    this.onStats({ ...this.stats })
  }

  // ------------------------------------------------------------------ escena
  private lights() {
    this.scene.add(new THREE.HemisphereLight(0xe8eef5, 0x1a1714, 0.9))
    const key = new THREE.DirectionalLight(0xfff1dc, 2.4)
    key.position.set(60, 90, 80)
    this.scene.add(key)
    const rim = new THREE.DirectionalLight(0x8fb4ff, 1.6)
    rim.position.set(-80, 40, -70)
    this.scene.add(rim)
    const fill = new THREE.DirectionalLight(0xffc98a, 0.5)
    fill.position.set(-40, -20, 60)
    this.scene.add(fill)
  }

  private build() {
    const mesh = this.mesh!
    const b = this.b!
    const st = this.state!
    const cx = (b.min[0] + b.max[0]) / 2
    const cy = (b.min[1] + b.max[1]) / 2
    // de Z arriba a Y arriba: (x, y, z) → (x, z, -y); centrado en XY, con la base en y = 0
    this.group.rotation.x = -Math.PI / 2
    this.group.position.set(0, 0, 0)
    this.lifted.position.set(-cx, -cy, -b.min[2])
    this.group.add(this.lifted)
    this.upright.rotation.x = Math.PI / 2
    this.group.add(this.upright)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute("position", new THREE.BufferAttribute(mesh.vertices, 3))
    // los triángulos sanos primero, después los invertidos y al final los que faltan
    const T = mesh.triangles
    const n = T.length / 3
    const idx = new Uint32Array(T.length)
    let k = 0
    const counts = [0, 0, 0]
    for (const want of [0, 2, 1]) {
      for (let t = 0; t < n; t++) {
        if (st[t] !== want) continue
        idx[k++] = T[t * 3]
        idx[k++] = want === 2 ? T[t * 3 + 2] : T[t * 3 + 1]
        idx[k++] = want === 2 ? T[t * 3 + 1] : T[t * 3 + 2]
        counts[want]++
      }
    }
    geo.setIndex(new THREE.BufferAttribute(idx, 1))
    geo.computeVertexNormals()
    geo.addGroup(0, counts[0] * 3, 0)
    geo.addGroup(counts[0] * 3, counts[2] * 3, 1)
    geo.addGroup((counts[0] + counts[2]) * 3, counts[1] * 3, 2)

    const common = { roughness: 0.58, metalness: 0.04, clippingPlanes: [this.clip], transparent: true }
    this.mats.model = new THREE.MeshStandardMaterial({ color: C.model, ...common })
    this.mats.flipped = new THREE.MeshStandardMaterial({ color: C.model.clone(), side: THREE.DoubleSide, emissive: C.flipped.clone(), emissiveIntensity: 0, ...common })
    this.mats.hole = new THREE.MeshStandardMaterial({ color: C.model, ...common })
    this.surface = new THREE.Mesh(geo, [this.mats.model, this.mats.flipped, this.mats.hole])
    this.lifted.add(this.surface)

    // lo que falta imprimir, apenas insinuado sobre el plano de corte
    this.mats.ghost = new THREE.MeshBasicMaterial({ color: 0xf0f0ed, wireframe: false, transparent: true, opacity: 0, depthWrite: false, clippingPlanes: [this.ghostClip] })
    this.ghost = new THREE.Mesh(geo, this.mats.ghost)
    this.ghost.visible = false
    this.lifted.add(this.ghost)

    this.buildPoints()
    this.buildCubes()
    this.buildPlate()
    if (this.real) this.buildRealSupports()
    else this.buildSupports()

    const cg = new THREE.BufferGeometry()
    cg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3 * 2 * 8192), 3))
    cg.setDrawRange(0, 0)
    this.contour = new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: C.amber, transparent: true, depthTest: false }))
    this.contour.renderOrder = 10
    this.lifted.add(this.contour)
  }

  private buildDefects(a: Analysis) {
    const V = this.mesh!.vertices
    const lines = (pairs: Uint32Array, color: THREE.Color) => {
      const pos = new Float32Array(pairs.length * 3)
      for (let i = 0; i < pairs.length; i++) pos.set(V.subarray(pairs[i] * 3, pairs[i] * 3 + 3), i * 3)
      const g = new THREE.BufferGeometry()
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3))
      const l = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0, depthTest: false }))
      l.renderOrder = 5
      this.lifted.add(l)
      return l
    }
    this.openLines = lines(a.openEdges, C.open)
    this.flipLines = lines(a.flippedEdges, C.flipped)
  }

  private buildPoints() {
    const V = this.mesh!.vertices
    const b = this.b!
    const n = V.length / 3
    const seed = new Float32Array(n * 3)
    const cube = new Float32Array(n * 3)
    const side = Math.ceil(Math.cbrt(n))
    const L = STL_CUBE
    const c = [(b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, b.min[2] + (b.max[2] - b.min[2]) * 0.5]
    this.cubeCenter.set(c[0], c[1], c[2])
    for (let i = 0; i < n; i++) {
      // dirección al azar, para que los vértices lleguen desde lejos
      const u = Math.random() * 2 - 1
      const th = Math.random() * Math.PI * 2
      const r = Math.sqrt(1 - u * u)
      const d = 30 + Math.random() * 70
      seed[i * 3] = r * Math.cos(th) * d
      seed[i * 3 + 1] = r * Math.sin(th) * d
      seed[i * 3 + 2] = u * d
      const gx = i % side, gy = Math.floor(i / side) % side, gz = Math.floor(i / (side * side))
      cube[i * 3] = c[0] + (gx / (side - 1) - 0.5) * L
      cube[i * 3 + 1] = c[1] + (gy / (side - 1) - 0.5) * L
      cube[i * 3 + 2] = c[2] + (gz / (side - 1) - 0.5) * L
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(V, 3))
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 3))
    g.setAttribute("aCube", new THREE.BufferAttribute(cube, 3))
    this.pointsMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uScatter: { value: 1 },
        uCube: { value: 0 },
        uOpacity: { value: 0 },
        uSize: { value: 1.6 },
        uColor: { value: C.bread.clone() },
        uTime: { value: 0 },
        uPx: { value: 1 },
        uSqueeze: { value: 0 },
        uSmall: { value: this.small },
        uCenter: { value: this.cubeCenter },
        uScanZ: { value: -1e9 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aSeed;
        attribute vec3 aCube;
        uniform float uScatter, uCube, uSize, uTime, uPx, uSqueeze, uSmall;
        uniform vec3 uCenter;
        varying float vFade;
        varying float vZ;
        void main() {
          float k = fract(sin(dot(aSeed.xy, vec2(12.9898, 78.233))) * 43758.5453);
          float s = clamp(uScatter * 1.25 - k * 0.25, 0.0, 1.0);
          s = s * s * (3.0 - 2.0 * s);
          vec3 p = mix(position, position + aSeed, s);
          float c = clamp(uCube * 1.3 - k * 0.3, 0.0, 1.0);
          c = c * c * (3.0 - 2.0 * c);
          vec3 target = uCenter + (aCube - uCenter) * mix(1.0, uSmall, uSqueeze);
          p = mix(p, target, c);
          vZ = position.z;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * uPx * (90.0 / -mv.z);
          vFade = 1.0 - 0.6 * s;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        uniform float uOpacity;
        uniform float uScanZ;
        varying float vFade;
        varying float vZ;
        void main() {
          if (vZ < uScanZ) discard; // lo que la verificación ya pasó es sólido
          vec2 d = gl_PointCoord - 0.5;
          float r = dot(d, d);
          if (r > 0.25) discard;
          gl_FragColor = vec4(uColor, uOpacity * vFade * (1.0 - r * 3.2));
        }`,
    })
    this.points = new THREE.Points(g, this.pointsMat)
    this.points.frustumCulled = false
    this.lifted.add(this.points)
  }

  /** Dos cubos con el volumen proporcional a los bytes: el STL y el .bread. */
  private buildCubes() {
    const b = this.b!
    const c = new THREE.Vector3((b.min[0] + b.max[0]) / 2, (b.min[1] + b.max[1]) / 2, b.min[2] + (b.max[2] - b.min[2]) * 0.5)
    this.cubes = new THREE.Group()
    const box = (side: number, color: THREE.Color, opacity: number) => {
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(side, side, side)), new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
      e.position.copy(c)
      e.userData.base = opacity
      this.cubes!.add(e)
      return e
    }
    box(STL_CUBE, new THREE.Color("#9aa0a6"), 0.6).name = "stl"
    box(STL_CUBE, C.bread, 0.95).name = "bread"
    this.cubes.visible = false
    this.lifted.add(this.cubes)
  }

  /** El cubo del .bread, con el volumen proporcional a los bytes medidos. */
  private fixCubes() {
    const st = this.stats
    const bread = st.writeBytes ?? st.breadBytes
    const stl = st.stlBytes ?? (st.triangles ? 84 + st.triangles * 50 : undefined)
    if (stl && bread) this.small = 1 / Math.cbrt(stl / bread)
    this.pointsMat!.uniforms.uSmall.value = this.small
    ;(this.cubes!.getObjectByName("bread") as THREE.LineSegments).scale.setScalar(this.small)
  }

  private buildPlate() {
    const g = new THREE.Group()
    const W = 140, D = 90
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.9, metalness: 0.2, transparent: true }))
    plane.rotation.x = -Math.PI / 2
    plane.position.y = -0.02
    g.add(plane)
    const fine: number[] = []
    const strong: number[] = []
    for (let x = -W / 2; x <= W / 2 + 0.01; x += 5) (Math.abs(x % 25) < 0.01 ? strong : fine).push(x, 0, -D / 2, x, 0, D / 2)
    for (let z = -D / 2; z <= D / 2 + 0.01; z += 5) (Math.abs((z + D / 2) % 25) < 0.01 ? strong : fine).push(-W / 2, 0, z, W / 2, 0, z)
    const ln = (arr: number[], color: number, opacity: number) => {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", new THREE.Float32BufferAttribute(arr, 3))
      const l = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
      l.userData.base = opacity
      g.add(l)
    }
    ln(fine, 0x9aa3ab, 0.14)
    ln(strong, 0xc9ced2, 0.32)
    // las esquinas del volumen de impresión, entre corchetes
    const H = 70
    const br: number[] = []
    for (const [x, z] of [[-W / 2, -D / 2], [W / 2, -D / 2], [-W / 2, D / 2], [W / 2, D / 2]]) {
      const sx = x < 0 ? 1 : -1, sz = z < 0 ? 1 : -1
      br.push(x, 0, z, x + sx * 8, 0, z, x, 0, z, x, 0, z + sz * 8, x, 0, z, x, 10, z)
      br.push(x, H, z, x + sx * 8, H, z, x, H, z, x, H, z + sz * 8, x, H, z, x, H - 10, z)
    }
    ln(br, 0xd7a75a, 0.7)
    g.visible = false
    this.plate = g
    this.scene.add(g)
  }

  /** Los soportes del proyecto, como Breadslicer los guarda, rearmados pieza por pieza. */
  private buildRealSupports() {
    const r = this.real!
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(r.sup.vertices, 3))
    g.setIndex(new THREE.BufferAttribute(r.sup.triangles, 1))
    g.computeVertexNormals()
    const mat = new THREE.MeshStandardMaterial({ color: C.support, roughness: 0.48, metalness: 0.12, side: THREE.DoubleSide, clippingPlanes: [this.clip, this.supClip] })
    r.supMesh = new THREE.Mesh(g, mat)
    r.supMesh.visible = false
    this.group.add(r.supMesh) // el grupo está en coordenadas de la placa: Z arriba, en mm
    const cg = new THREE.BufferGeometry()
    cg.setAttribute("position", new THREE.BufferAttribute(new Float32Array(3 * 2 * 16384), 3))
    cg.setDrawRange(0, 0)
    this.plateContour = new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: C.amber, transparent: true, depthTest: false }))
    this.plateContour.renderOrder = 10
    this.group.add(this.plateContour)
  }

  private buildSupports() {
    const b = this.b!
    this.tips = supportTips(this.mesh!, b)
    this.stats.tips = this.tips.length
    const n = this.tips.length
    const mat = new THREE.MeshStandardMaterial({ color: C.support, roughness: 0.5, metalness: 0.1, clippingPlanes: [this.clip] })
    const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.42, 0.42, 1, 10, 1), mat, n)
    const cones = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.42, 1, 10, 1), mat, n)
    const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.16, 10, 8), mat, n)
    // la balsa: un rectángulo fino bajo todas las puntas
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const t of this.tips) {
      x0 = Math.min(x0, t.x); x1 = Math.max(x1, t.x); y0 = Math.min(y0, t.y); y1 = Math.max(y1, t.y)
    }
    const cx = (b.min[0] + b.max[0]) / 2, cy = (b.min[1] + b.max[1]) / 2
    const raft = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 3, 0.6, y1 - y0 + 3), mat)
    raft.position.set((x0 + x1) / 2 - cx, 0.3, -((y0 + y1) / 2 - cy))
    for (const m of [trunks, cones, balls]) {
      m.frustumCulled = false
      this.upright.add(m)
    }
    this.upright.add(raft)
    this.supports = { trunks, cones, balls, raft }
    this.growSupports(0)
  }

  private growSupports(g: number) {
    if (!this.supports || Math.abs(g - this.lastSupportGrow) < 0.002) return
    this.lastSupportGrow = g
    const b = this.b!
    const cx = (b.min[0] + b.max[0]) / 2, cy = (b.min[1] + b.max[1]) / 2
    const { trunks, cones, balls, raft } = this.supports
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const v = new THREE.Vector3()
    const s = new THREE.Vector3()
    this.tips.forEach((t, i) => {
      const x = t.x - cx, z = -(t.y - cy)
      const top = t.z - b.min[2] + LIFT // altura de la punta, en la placa
      const delay = (i % 17) / 17 * 0.35
      const k = smooth(delay, delay + 0.65, g)
      const cone = Math.min(1.4, top * 0.3)
      const trunkH = Math.max(0.01, (top - cone) * k)
      m.compose(v.set(x, 0.6 + trunkH / 2 - 0.3, z), q, s.set(1, Math.max(0.001, trunkH - 0.6), 1))
      trunks.setMatrixAt(i, m)
      const showTip = smooth(0.85, 1, k)
      m.compose(v.set(x, top - cone / 2, z), q, s.set(showTip || 0.001, cone * (showTip || 0.001), showTip || 0.001))
      cones.setMatrixAt(i, m)
      m.compose(v.set(x, top, z), q, s.setScalar(showTip || 0.001))
      balls.setMatrixAt(i, m)
    })
    trunks.instanceMatrix.needsUpdate = true
    cones.instanceMatrix.needsUpdate = true
    balls.instanceMatrix.needsUpdate = true
    raft.scale.set(1, Math.max(0.001, smooth(0, 0.2, g)), 1)
  }

  // ------------------------------------------------------------------ cuadro a cuadro
  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (!this.running || !this.renderer || !this.mesh) return
    const now = performance.now()
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000)
    this.last = now
    this.intro = this.reduced ? 1 : Math.min(1, (now - this.t0) / 2400)
    this.S += (this.target - this.S) * (this.reduced ? 1 : 1 - Math.pow(0.0015, dt))
    this.frame(dt)
    this.renderer.render(this.scene, this.camera)
  }

  private frame(dt: number) {
    const S = this.S
    const ch = Math.floor(S)
    const f = S - ch
    const at = (c: number) => (ch === c ? f : ch > c ? 1 : 0) // avance dentro del capítulo c
    const inCh = (c: number, a = 0, b = 1) => smooth(c + a - 0.12, c + a, S) * (1 - smooth(c + b, c + b + 0.12, S))

    // --- cámara
    const k0 = KEYS[Math.min(ch, KEYS.length - 1)]
    const k1 = KEYS[Math.min(ch + 1, KEYS.length - 1)]
    const w = smooth(0.62, 1, f)
    const key = { theta: lerp(k0.theta, k1.theta, w), phi: lerp(k0.phi, k1.phi, w), dist: lerp(k0.dist, k1.dist, w), ty: lerp(k0.ty, k1.ty, w), shift: lerp(k0.shift, k1.shift, w) }
    const damp = this.reduced ? 1 : 1 - Math.pow(0.02, dt)
    for (const p of ["theta", "phi", "dist", "ty", "shift"] as const) this.cam[p] += (key[p] - this.cam[p]) * damp
    const portrait = this.canvas.clientWidth < this.canvas.clientHeight * 0.9
    const dist = this.cam.dist * this.k * (portrait ? 1.7 : 1)
    const ty = this.cam.ty * this.k
    this.camera.position.set(Math.sin(this.cam.theta) * Math.cos(this.cam.phi) * dist, ty + Math.sin(this.cam.phi) * dist, Math.cos(this.cam.theta) * Math.cos(this.cam.phi) * dist)
    this.camera.lookAt(0, ty, 0)
    this.resize(portrait ? 0 : this.cam.shift, portrait ? 0.14 : 0)

    // --- giro: libre en la portada y en el final; de frente para Caliper, .bread y el corte
    const free = 1 - inCh(1, 0, 3)
    if (!this.reduced) this.spin += dt * 0.32 * free
    if (free < 0.5) {
      const home = Math.round(this.spin / (Math.PI * 2)) * Math.PI * 2
      this.spin += (home - this.spin) * (1 - Math.pow(0.05, dt))
    }
    this.group.rotation.z = this.spin // el grupo está tumbado: su Z es el eje vertical de la escena

    // --- la entrada: los vértices llegan y la superficie aparece
    const intro = this.intro
    const pm = this.pointsMat!
    pm.uniforms.uPx.value = this.renderer!.getPixelRatio()

    // .bread, en cuatro fases que el panel de la izquierda sigue:
    //   STL: la superficie se deshace en vértices que llenan un cubo del tamaño del STL
    //   .bread: el cubo se aprieta al tamaño del .bread medido
    //   leer: los vértices vuelven al modelo
    //   comparar: una línea verde sube y lo que pasó queda sólido
    const br = at(2)
    const toPoints = smooth(0.05, 0.18, br) * (1 - smooth(0.9, 0.97, br))
    const toCube = smooth(0.2, 0.36, br) * (1 - smooth(0.56, 0.7, br))
    const squeeze = br < 0.72 ? smooth(0.38, 0.52, br) : 0
    const verifying = ch === 2 && br > 0.7 && br < 0.985
    const H0 = this.b!.max[2] - this.b!.min[2]
    const scanH = smooth(0.72, 0.92, br) * H0
    pm.uniforms.uScatter.value = 1 - smooth(0, 0.85, intro)
    pm.uniforms.uCube.value = toCube
    pm.uniforms.uSqueeze.value = squeeze
    pm.uniforms.uScanZ.value = verifying ? this.b!.min[2] + scanH : -1e9
    const pointsOn = Math.max(1 - smooth(0.7, 1, intro), toPoints)
    pm.uniforms.uOpacity.value = pointsOn * 0.75
    pm.uniforms.uColor.value.copy(ch >= 2 ? C.bread : C.model)
    this.points!.visible = pointsOn > 0.01
    const surfIn = smooth(0.55, 1, intro)
    const surf = verifying ? surfIn : surfIn * (1 - toPoints)
    for (const m of [this.mats.model!, this.mats.flipped!, this.mats.hole!]) {
      m.opacity = surf
      m.depthWrite = surf > 0.98
      m.visible = surf > 0.01
    }
    this.fixCubes()
    this.cubes!.visible = toCube > 0.01
    const stlBox = this.cubes!.getObjectByName("stl") as THREE.LineSegments
    const breadBox = this.cubes!.getObjectByName("bread") as THREE.LineSegments
    ;(stlBox.material as THREE.LineBasicMaterial).opacity = (stlBox.userData.base as number) * toCube * (1 - 0.55 * squeeze)
    ;(breadBox.material as THREE.LineBasicMaterial).opacity = (breadBox.userData.base as number) * toCube * squeeze
    this.placeLabels(toCube * (1 - 0.5 * squeeze), toCube * squeeze, verifying ? smooth(0.72, 0.76, br) * (1 - smooth(0.93, 0.98, br)) : 0, scanH)
    this.updateScan(verifying, scanH)

    // Caliper: el daño aparece y se repara
    const cal = at(1)
    const broken = ch >= 1 ? smooth(0.06, 0.18, cal) * (1 - smooth(0.55, 0.8, cal)) : 0
    const holeOn = 1 - broken
    this.mats.hole!.opacity = surf * smooth(0, 1, holeOn) // los agujeros se cierran
    this.mats.hole!.visible = holeOn > 0.01 && surf > 0.01
    this.mats.flipped!.emissiveIntensity = broken * 0.9
    this.mats.flipped!.color.copy(C.model).lerp(C.flipped, broken * 0.7)
    for (const l of [this.openLines, this.flipLines]) {
      if (!l) continue
      ;(l.material as THREE.LineBasicMaterial).opacity = broken * surf
      l.visible = broken > 0.01
    }

    // Breadslicer: placa, levantar, soportes, cortar
    const bs = at(3)
    const slicerOn = smooth(2.85, 3.05, S)
    const plateOn = slicerOn
    this.plate!.visible = plateOn > 0.01
    this.plate!.children.forEach((c) => {
      const m = (c as THREE.Mesh).material as THREE.Material & { opacity: number }
      m.opacity = (c.userData.base ?? 1) * plateOn
    })
    const r = this.real
    let top: number
    if (r) {
      // de parado a como lo dejó Breadslicer: girado y levantado, alrededor de su centro
      const o = smooth(0.02, 0.2, bs)
      const q = new THREE.Quaternion().slerpQuaternions(new THREE.Quaternion(), r.R, o)
      const c = r.cU.clone().lerp(r.cP, o)
      this.lifted.quaternion.copy(q)
      this.lifted.position.copy(c.sub(r.cV.clone().applyQuaternion(q)))
      const grow = ch >= 3 ? smooth(0.2, 0.47, bs) : 0
      this.supClip.constant = grow >= 1 ? 1e4 : grow * r.top
      r.supMesh!.visible = grow > 0.001
      top = r.top
    } else {
      const lift = LIFT * smooth(0.02, 0.16, bs)
      this.lifted.position.z = -this.b!.min[2] + lift
      const grow = ch >= 3 ? smooth(0.14, 0.42, bs) : 0
      this.growSupports(grow)
      const supVis = grow > 0.001
      for (const m of Object.values(this.supports!)) m.visible = supVis
      if (this.supports) this.supports.raft.visible = supVis
      top = this.b!.max[2] - this.b!.min[2] + LIFT
    }

    // el corte: el plano sube de la placa a la punta del modelo
    const cut = ch === 3 ? smooth(0.5, 0.95, bs) : 0
    const slicing = ch === 3 && bs > 0.48 && bs < 0.985
    const h = slicing ? Math.max(LAYER, cut * top) : 1e4
    this.clip.constant = verifying ? scanH : h
    this.ghostClip.constant = -h
    this.ghost!.visible = slicing
    this.mats.ghost!.opacity = slicing ? 0.06 : 0
    this.updateLayer(slicing, h, top)

    // en la cadena queda de fondo, y antes de lo medido se apaga
    const fade = (1 - smooth(4.72, 5.02, S)) * (1 - 0.78 * smooth(3.86, 4.1, S))
    this.canvas.style.opacity = String(fade)
  }

  private placeLabels(stlOn: number, breadOn: number, verifyOn: number, scanH: number) {
    const w = this.canvas.clientWidth, h = this.canvas.clientHeight
    const put = (el: HTMLElement | undefined, local: THREE.Vector3, on: number) => {
      if (!el) return
      el.style.opacity = String(on)
      if (on < 0.01) return
      const v = this.lifted.localToWorld(local.clone()).project(this.camera)
      // siempre adentro de la pantalla: si no entra a la derecha, se corre hacia adentro
      const x = Math.min(((v.x + 1) / 2) * w, w - el.offsetWidth - 16)
      el.style.transform = `translate(${x}px, ${((1 - v.y) / 2) * h}px)`
    }
    const c = this.cubeCenter
    const half = STL_CUBE / 2
    put(this.labels.stl, new THREE.Vector3(c.x + half, c.y, c.z + half), stlOn)
    put(this.labels.bread, new THREE.Vector3(c.x + half * this.small, c.y, c.z + half * this.small), breadOn)
    put(this.labels.verify, new THREE.Vector3(this.b!.max[0], c.y, this.b!.min[2] + scanH), verifyOn)
  }

  /** La verificación: el corte real de la malla a la altura de la línea, en verde. */
  private updateScan(on: boolean, scanH: number) {
    const q = on ? Math.round(scanH / 0.15) : -1
    if (q === this.lastScan) return
    this.lastScan = q
    if (!on) {
      if (this.lastLayer <= 0) this.contour!.geometry.setDrawRange(0, 0)
      ;(this.contour!.material as THREE.LineBasicMaterial).color.copy(C.amber)
      return
    }
    ;(this.contour!.material as THREE.LineBasicMaterial).color.set("#7bd88f")
    this.drawContour(this.b!.min[2] + scanH)
  }

  private drawContour(z: number) {
    const { seg, count } = slice(this.mesh!, z, this.sliceSeg)
    this.sliceSeg = seg
    const cg = this.contour!.geometry
    let arr = (cg.getAttribute("position") as THREE.BufferAttribute).array as Float32Array
    if (count * 6 > arr.length) {
      arr = new Float32Array(count * 6 * 2)
      cg.setAttribute("position", new THREE.BufferAttribute(arr, 3))
    }
    for (let i = 0; i < count; i++) {
      arr[i * 6] = seg[i * 4]; arr[i * 6 + 1] = seg[i * 4 + 1]; arr[i * 6 + 2] = z
      arr[i * 6 + 3] = seg[i * 4 + 2]; arr[i * 6 + 4] = seg[i * 4 + 3]; arr[i * 6 + 5] = z
    }
    ;(cg.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true
    cg.setDrawRange(0, count * 2)
    return { seg, count }
  }

  private updateLayer(slicing: boolean, h: number, top: number) {
    const layers = Math.ceil(top / LAYER)
    const layer = slicing ? Math.min(layers, Math.max(1, Math.round(h / LAYER))) : 0
    if (layer === this.lastLayer) return
    this.lastLayer = layer
    const cg = this.contour!.geometry
    if (!slicing) {
      cg.setDrawRange(0, 0)
      this.plateContour?.geometry.setDrawRange(0, 0)
      Object.assign(this.stats, { layer: 0, layers })
      this.emit()
      return
    }
    if (this.real) return this.realLayer(layer, layers, h)
    // en coordenadas del archivo: la altura del plano menos lo que se levantó
    ;(this.contour!.material as THREE.LineBasicMaterial).color.copy(C.amber)
    const z = this.b!.min[2] + (h - LIFT)
    const t = performance.now()
    const { seg, count } = slice(this.mesh!, z, this.sliceSeg)
    this.sliceSeg = seg
    const sliceMs = performance.now() - t
    const pos = cg.getAttribute("position") as THREE.BufferAttribute
    let arr = pos.array as Float32Array
    if (count * 6 > arr.length) {
      arr = new Float32Array(count * 6 * 2)
      cg.setAttribute("position", new THREE.BufferAttribute(arr, 3))
    }
    for (let i = 0; i < count; i++) {
      arr[i * 6] = seg[i * 4]; arr[i * 6 + 1] = seg[i * 4 + 1]; arr[i * 6 + 2] = z
      arr[i * 6 + 3] = seg[i * 4 + 2]; arr[i * 6 + 4] = seg[i * 4 + 3]; arr[i * 6 + 5] = z
    }
    ;(cg.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true
    cg.setDrawRange(0, count * 2)
    this.drawLayer(seg, count, h)
    Object.assign(this.stats, { layer, layers, layerZ: h, segments: count, sliceMs })
    this.emit()
  }

  /** El corte del proyecto: el modelo como un sólido, y cada pieza de soporte como otro. */
  private realLayer(layer: number, layers: number, h: number) {
    const r = this.real!
    const t = performance.now()
    let { seg, count } = slice(r.placed, h, this.sliceSeg)
    const ranges: [number, number][] = [[0, count]]
    const sm = { vertices: r.sup.vertices, triangles: r.sup.triangles }
    for (const pr of r.sup.prims) {
      if (pr.zmin > h || pr.zmax < h) continue
      const from = count
      ;({ seg, count } = slice(sm, h, seg, pr.t0, pr.t1, count))
      if (count > from) ranges.push([from, count])
    }
    this.sliceSeg = seg
    const sliceMs = performance.now() - t

    const cg = this.plateContour!.geometry
    let arr = (cg.getAttribute("position") as THREE.BufferAttribute).array as Float32Array
    if (count * 6 > arr.length) {
      arr = new Float32Array(count * 6 * 2)
      cg.setAttribute("position", new THREE.BufferAttribute(arr, 3))
    }
    for (let i = 0; i < count; i++) {
      arr[i * 6] = seg[i * 4]; arr[i * 6 + 1] = seg[i * 4 + 1]; arr[i * 6 + 2] = h
      arr[i * 6 + 3] = seg[i * 4 + 2]; arr[i * 6 + 4] = seg[i * 4 + 3]; arr[i * 6 + 5] = h
    }
    ;(cg.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true
    cg.setDrawRange(0, count * 2)

    const c = this.layerCanvas
    if (c) {
      const pb = bounds(r.placed.vertices)
      const pad = 1
      const x0 = Math.min(pb.min[0], r.sup.min[0]) - pad, y0 = Math.min(pb.min[1], r.sup.min[1]) - pad
      const x1 = Math.max(pb.max[0], r.sup.max[0]) + pad, y1 = Math.max(pb.max[1], r.sup.max[1]) + pad
      const px = 0.05
      const W = Math.ceil((x1 - x0) / px), H = Math.ceil((y1 - y0) / px)
      if (c.width !== W || c.height !== H) {
        c.width = W
        c.height = H
        this.layerImg = undefined
      }
      const ctx = c.getContext("2d")!
      this.layerImg ??= ctx.createImageData(W, H)
      clearLayer(this.layerImg)
      for (const [a, b] of ranges) fillLayer(seg, a, b, this.layerImg, x0, y0, px, [235, 238, 240])
      ctx.putImageData(this.layerImg, 0, 0)
    }
    Object.assign(this.stats, { layer, layers, layerZ: h, segments: count, sliceMs })
    this.emit()
  }

  /** La capa en píxeles, como la pantalla de la impresora: 50 µm por píxel. */
  private drawLayer(seg: Float32Array, count: number, h: number) {
    const c = this.layerCanvas
    if (!c) return
    const b = this.b!
    const px = 0.05
    const pad = 2
    const x0 = b.min[0] - pad, y0 = b.min[1] - pad
    const W = Math.ceil((b.max[0] - b.min[0] + pad * 2) / px)
    const H = Math.ceil((b.max[1] - b.min[1] + pad * 2) / px)
    if (c.width !== W || c.height !== H) {
      c.width = W
      c.height = H
      this.layerImg = undefined
    }
    const ctx = c.getContext("2d")!
    this.layerImg ??= ctx.createImageData(W, H)
    // los soportes cortados a esta altura: los que todavía no llegaron a su punta
    const under = this.tips.filter((t) => t.z - b.min[2] + LIFT > h)
    const r = h < 0.6 ? 0 : 0.42
    rasterize(seg, count, this.layerImg, x0, y0, px, r ? under : [], r, [235, 238, 240])
    ctx.putImageData(this.layerImg, 0, 0)
  }

  private resize(shift: number, up = 0) {
    const r = this.renderer!
    const w = this.canvas.clientWidth
    const h = this.canvas.clientHeight
    if (!w || !h) return
    const size = r.getSize(new THREE.Vector2())
    if (size.x !== w || size.y !== h) {
      r.setSize(w, h, false)
    }
    this.camera.aspect = w / h
    this.camera.setViewOffset(w, h, -shift * w, up * h, w, h)
    this.camera.updateProjectionMatrix()
  }

  dispose() {
    cancelAnimationFrame(this.raf)
    this.renderer?.dispose()
  }
}
