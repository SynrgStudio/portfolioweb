// El modelo de /ecosystem: un STL de MZ4250 (CC BY 4.0), escrito como .bread con el mismo
// bread-write.wasm que usa la página, y leído de vuelta para comprobar que cada esquina vuelve
// bit a bit. Deja public/ecosystem/model.bread y public/ecosystem/model.json (tamaños y crédito).
//
//   node scripts/ecosystem-model.mjs "D:/MonsterManualMinis/Unsupported/Death Knight Updated.stl" "Death Knight"
//
// Tiene que ser un modelo sin soportes: Breadslicer es el que se los pone en la página.

import fs from "node:fs"
import path from "node:path"
import { load } from "../lib/bread-format/index.js"

const [stlPath, NAME = "Death Knight"] = process.argv.slice(2)
if (!stlPath) throw new Error('Uso: node scripts/ecosystem-model.mjs "<archivo.stl>"')
const root = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")))
const out = path.join(root, "public", "ecosystem")

const CREDIT = `${NAME}, by MZ4250 (mz4250.com), CC BY 4.0: https://creativecommons.org/licenses/by/4.0/`

const writer = await load(fs.readFileSync(path.join(out, "bread-write.wasm")))
const reader = await load(fs.readFileSync(path.join(out, "bread.wasm")))
const stl = new Uint8Array(fs.readFileSync(stlPath))

const mesh = writer.readStl(stl)
mesh.meta = { name: NAME, comment: CREDIT }
const scene = {
  meta: { name: NAME, comment: CREDIT },
  meshResources: [],
  nodes: [{ kind: "leaf", meta: { name: NAME, comment: null }, transform: null, mesh: 0 }],
  subtrees: [],
  roots: [0],
}
const file = writer.writeFile(scene, [mesh])

// De vuelta: cada esquina de cada triángulo, comparada con el STL bit a bit.
const back = reader.decodeMesh(reader.readChunks(file).find((c) => c.tag === "MESH"))
const view = new DataView(stl.buffer, stl.byteOffset, stl.byteLength)
const count = view.getUint32(80, true)
const bits = new Uint32Array(back.vertices.buffer, back.vertices.byteOffset, back.vertices.length)
let bad = 0
for (let t = 0; t < count; t++) {
  for (let c = 0; c < 3; c++) {
    const v = back.triangles[t * 3 + c]
    for (let a = 0; a < 3; a++) {
      if (view.getUint32(84 + t * 50 + 12 + c * 12 + a * 4, true) !== bits[v * 3 + a]) bad++
    }
  }
}
if (bad) throw new Error(`${bad} coordenadas no volvieron bit a bit`)

fs.writeFileSync(path.join(out, "model.bread"), file)
const info = {
  name: NAME,
  creator: "MZ4250",
  site: "https://mz4250.com/",
  license: "CC BY 4.0",
  license_url: "https://creativecommons.org/licenses/by/4.0/",
  changes: "None: the mesh is the STL's, every coordinate bit for bit.",
  stl_bytes: stl.byteLength,
  bread_bytes: file.byteLength,
  triangles: count,
  vertices: back.vertices.length / 3,
}
fs.writeFileSync(path.join(out, "model.json"), JSON.stringify(info, null, 2) + "\n")
console.log(info)
