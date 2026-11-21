// El modelo de /ecosystem: un proyecto de Breadslicer (.bread) con un modelo de MZ4250 (CC BY 4.0),
// orientado y con soportes. La página lo abre tal cual: decodifica la malla, toma la orientación de
// la escena y rearma los soportes desde SUPP (lib/ecosystem/supports.ts).
//
//   node scripts/ecosystem-model.mjs "<proyecto.bread>" "<el STL original>" "Death Knight"
//
// Comprueba que la malla del proyecto sea la del STL, cada esquina bit a bit (el crédito dice "sin
// cambios"), y que SUPP sea un documento df que la página sabe leer. Deja public/ecosystem/model.bread
// y public/ecosystem/model.json.

import fs from "node:fs"
import path from "node:path"
import { load } from "../lib/bread-format/index.js"

const [projectPath, stlPath, NAME = "Death Knight"] = process.argv.slice(2)
if (!projectPath || !stlPath) throw new Error('Uso: node scripts/ecosystem-model.mjs "<proyecto.bread>" "<archivo.stl>" "<nombre>"')
const root = path.dirname(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")))
const out = path.join(root, "public", "ecosystem")

const reader = await load(fs.readFileSync(path.join(out, "bread.wasm")))
const file = new Uint8Array(fs.readFileSync(projectPath))
const stl = new Uint8Array(fs.readFileSync(stlPath))
const chunks = reader.readChunks(file)
const mesh = reader.decodeMesh(chunks.find((c) => c.tag === "MESH"))

// cada esquina, contra el STL
const view = new DataView(stl.buffer, stl.byteOffset, stl.byteLength)
const count = view.getUint32(80, true)
if (count * 3 !== mesh.triangles.length) throw new Error("el proyecto no tiene los mismos triángulos que el STL")
const bits = new Uint32Array(mesh.vertices.buffer, mesh.vertices.byteOffset, mesh.vertices.length)
let bad = 0
for (let t = 0; t < count; t++)
  for (let c = 0; c < 3; c++)
    for (let a = 0; a < 3; a++) if (view.getUint32(84 + t * 50 + 12 + c * 12 + a * 4, true) !== bits[mesh.triangles[t * 3 + c] * 3 + a]) bad++
if (bad) throw new Error(`${bad} coordenadas difieren del STL: el modelo no está "sin cambios"`)

// SUPP: un documento df que la página sabe leer
const supp = chunks.find((c) => c.tag === "SUPP")
if (!supp) throw new Error("el proyecto no tiene soportes (SUPP)")
const dv = new DataView(supp.payload.buffer, supp.payload.byteOffset, supp.payload.byteLength)
const glen = dv.getUint32(12, true)
const generator = new TextDecoder().decode(supp.payload.subarray(16, 16 + glen))
const version = dv.getUint32(16 + glen, true)
if (generator !== "df" || version > 2) throw new Error(`SUPP es ${generator} ${version}: lib/ecosystem/supports.ts lee df hasta la versión 2`)

fs.copyFileSync(projectPath, path.join(out, "model.bread"))
const info = {
  name: NAME,
  creator: "MZ4250",
  site: "https://mz4250.com/",
  license: "CC BY 4.0",
  license_url: "https://creativecommons.org/licenses/by/4.0/",
  changes: "None to the model: every coordinate is the STL's, bit for bit. The file is a Breadslicer project around it: orientation, supports and printer.",
  chunks: chunks.map((c) => c.tag),
  stl_bytes: stl.byteLength,
  bread_bytes: file.byteLength,
  triangles: count,
  vertices: mesh.vertices.length / 3,
  supports: { generator, version },
}
fs.writeFileSync(path.join(out, "model.json"), JSON.stringify(info, null, 2) + "\n")
console.log(info)
