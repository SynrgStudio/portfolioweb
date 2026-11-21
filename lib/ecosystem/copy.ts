// Los textos de /ecosystem. Las cifras fijas salen de la página de cada herramienta (o de su
// corpus, en synrgs-web/corpus/bread/facts.toml) y dicen de dónde; las que la página mide en el
// navegador de quien la mira las pone el motor, y se presentan como medidas en ese momento.

import type { Lang } from "@/lib/copy"

export const FACTS = {
  // bread.synrgs.tech, facts.toml: mz4250_models, mz4250_stl_gb, mz4250_bread_gb, mz4250_ratio_overall
  mz4250Models: 2288,
  mz4250Stl: 162,
  mz4250Bread: 11.6,
  mz4250Ratio: 14,
  // facts.toml [implementations.caliper]: lee y escribe .bread desde la 0.9.6
  caliperBreadSince: "0.9.6",
  // facts.toml: conformance_valid, conformance_invalid; spec v2 (tag spec-v2)
  conformanceValid: 22,
  conformanceInvalid: 24,
}

type Copy = {
  meta: { title: string; description: string }
  hero: { label: string; title: [string, string, string]; body: string; scroll: string; loading: string; decoded: (tri: string, ms: string) => string; nowebgl: string }
  caliper: {
    kicker: string
    title: string
    body: string
    steps: [string, string, string]
    rows: { open: string; flipped: string; nonManifold: string }
    closed: string
    note: string
    facts: [string, string][]
  }
  bread: {
    kicker: string
    title: string
    body: string
    steps: [string, string, string, string]
    live: { stl: string; write: string; read: string; compare: string; identical: (n: string) => string; differ: (n: string) => string; waiting: string }
    labels: { stl: (mb: string) => string; bread: (mb: string, x: string) => string; verify: (n: string) => string; verifying: string }
    smaller: (x: string) => string
    chunks: string
    slicer: string
    facts: [string, string][]
  }
  slicer: {
    kicker: string
    title: string
    body: string
    steps: [string, string, string]
    layer: (n: string, total: string) => string
    layerSub: (z: string, seg: string, ms: string) => string
    idle: string
    note: string
    real: (c: { bases: string; trunks: string; branches: string; leaves: string; braces: string; tips: string }) => string
    rebuilt: (ms: string, tri: string) => string
    facts: [string, string][]
  }
  loop: {
    kicker: string
    title: string
    body: string
    nodes: { blender: string; caliper: string; bread: string; slicer: string; printer: string; browser: string }
    edges: { bridge: string; caliper: string; slicer: string; printer: string; browser: string }
  }
  measured: {
    kicker: string
    title: string
    body: string
    rows: { decode: string; analyze: string; stl: string; write: string; read: string; corners: string; slice: string }
    pending: string
    machine: string
  }
  get: {
    title: string
    caliper: { kind: string; body: string; cta: string }
    bread: { kind: string; body: string; cta: string }
    slicer: { kind: string; body: string; cta: string }
  }
  credit: string
}

export const copy: Record<Lang, Copy> = {
  en: {
    meta: {
      title: "One model, three tools — SynrgStudio",
      description: "How Caliper, the .bread format and Breadslicer connect, shown on a real miniature that your browser decodes, checks, repairs and slices while you scroll.",
    },
    hero: {
      label: "Ecosystem · Caliper × .bread × Breadslicer",
      title: ["One model.", "Three tools.", "Not one bit lost."],
      body: "Caliper makes a model printable, .bread carries it without losing a bit, and Breadslicer turns it into layers. Scroll, and watch the whole chain run on a real miniature. Nothing here is a video: whatever can run in a browser is running in yours.",
      scroll: "Scroll",
      loading: "Decoding the model…",
      decoded: (tri, ms) => `${tri} triangles decoded from .bread in ${ms}, by the format's own WebAssembly, in this browser`,
      nowebgl: "This browser can't draw WebGL, so the 3D scene is off. Every number below is still measured here.",
    },
    caliper: {
      kicker: "01 · Caliper",
      title: "First, make it printable.",
      body: "Downloaded models arrive broken: holes, faces turned inside out, edges shared by three faces. A slicer can't tell inside from outside on a mesh like that. Caliper finds every defect, draws it on the model, and closes it. The original file is never touched.",
      steps: ["Analyze", "Repair", "Closed"],
      rows: { open: "Open edges", flipped: "Inconsistent winding", nonManifold: "Non-manifold edges" },
      closed: "Closed: every edge shared by exactly two faces, all facing out.",
      note: "The damage is made here, on a copy, to show the idea, and the edges are counted live in your browser. Caliper's real repairs are below.",
      facts: [
        ["106 / 106", "real test models come out of a repair closed"],
        ["0.44 s", "to open 20 million triangles"],
        ["1.5 MB", "the whole Caliper.exe"],
      ],
    },
    bread: {
      kicker: "02 · .bread",
      title: "Then, pack it without losing a bit.",
      body: "An STL writes every corner again for every triangle that touches it. .bread stores each vertex once, predicts it from its neighbours, and keeps all 32 bits of every coordinate. Your browser just did it, with the format's own WebAssembly module:",
      steps: ["STL", ".bread", "Read back", "Compare"],
      labels: {
        stl: (mb) => `STL · ${mb}`,
        bread: (mb, x) => `.bread · ${mb} · ${x}× smaller`,
        verify: (n) => `✓ ${n} corners identical`,
        verifying: "comparing every corner…",
      },
      live: {
        stl: "STL rebuilt from the mesh",
        write: ".bread written",
        read: "read back",
        compare: "corners compared, bit for bit",
        identical: (n) => `${n} identical`,
        differ: (n) => `${n} differ`,
        waiting: "measuring…",
      },
      smaller: (x) => `${x}× smaller, and the same model`,
      chunks: "Chunks in this project, as Breadslicer saved it",
      slicer: "THMB is the thumbnail, SCNE the scene with the model's place on the plate, PROJ the printer and the resin, SUPP every support as data, MESH the model. A file can also carry hollows (HOLW), a support preview (SPRV), what each part is (ROLE) and who made it (META).",
      facts: [
        [`${FACTS.mz4250Ratio}×`, `smaller than STL over ${FACTS.mz4250Models.toLocaleString("en-US")} public miniatures, ${FACTS.mz4250Stl} GB to ${FACTS.mz4250Bread} GB`],
        ["0 bits", "lost: every one of them came back exactly"],
        [`${FACTS.conformanceValid} + ${FACTS.conformanceInvalid}`, "conformance files, for anyone writing a reader"],
      ],
    },
    slicer: {
      kicker: "03 · Breadslicer",
      title: "Finally, slice it.",
      body: "Breadslicer turns the model the way it prints best, lifts it off the plate and grows supports under everything that hangs. Then it cuts it into the layers your printer's screen will light, one by one.",
      steps: ["Orient", "Support", "Slice"],
      layer: (n, total) => `Layer ${n} of ${total}`,
      layerSub: (z, seg, ms) => `z = ${z} mm · ${seg} edges cut in ${ms}, here`,
      idle: "The layer appears here when the cut starts.",
      note: "Layers are cut live from the real mesh, 0.05 mm each, 50 µm per pixel. The supports are a sketch computed here from the faces that look down; Breadslicer's generator does much more.",
      real: (c) => `This is the project as Breadslicer saved it: the turn, the lift and every support come from its .bread file. Supports are kept as data, never as a mesh: ${c.bases} bases, ${c.trunks} trunks, ${c.branches} branches, ${c.leaves} leaves, ${c.braces} braces and ${c.tips} tips, rebuilt here piece by piece. Every layer is cut live, 0.05 mm each, 50 µm per pixel.`,
      rebuilt: (ms, tri) => `supports rebuilt from SUPP in ${ms}, ${tri} triangles`,
      facts: [
        ["0.66 s", "to slice 991 layers of a 1.9 M-triangle miniature, with supports"],
        ["0.65 s", "to review a large hollow model for islands and suction cups, from 58 s"],
        ["157", "printers, with their real resolutions and file formats"],
      ],
    },
    loop: {
      kicker: "04 · The chain",
      title: "How they talk to each other.",
      body: "One open format in the middle, so no tool has to guess what another one meant.",
      nodes: { blender: "Blender", caliper: "Caliper", bread: ".bread", slicer: "Breadslicer", printer: "Printer", browser: "Any browser" },
      edges: {
        bridge: "Caliper Bridge runs Caliper from Blender",
        caliper: `reads and writes .bread, since ${FACTS.caliperBreadSince}`,
        slicer: "projects in .bread, with supports",
        printer: "CTB, GOO, Anycubic and more",
        browser: "the viewer opens .bread on the web",
      },
    },
    measured: {
      kicker: "05 · Receipts",
      title: "Measured just now, in your browser.",
      body: "Not our machine, not a benchmark from last month: these ran on this device while you scrolled.",
      rows: {
        decode: "Decode the .bread",
        analyze: "Analyze every edge",
        stl: "Rebuild the STL",
        write: "Write .bread from it",
        read: "Read it back",
        corners: "Corners identical",
        slice: "Cut one layer",
      },
      pending: "not yet",
      machine: "Fixed numbers above were measured on a Ryzen 7 5800X; each tool's page says how.",
    },
    get: {
      title: "Get them.",
      caliper: { kind: "Repair · free", body: "Analysis and repair of meshes for 3D printing, for Windows.", cta: "caliper.synrgs.tech" },
      bread: { kind: "Format · Apache-2.0", body: "The specification, version 2, the conformance files and the reference implementation.", cta: "bread.synrgs.tech" },
      slicer: { kind: "Slicer · alpha", body: "The resin slicer, free software. The first alpha for Windows is out.", cta: "breadslicer.app" },
    },
    credit: "The model: Death Knight, by MZ4250, under CC BY 4.0, unchanged: every coordinate is the STL's, bit for bit. The project around it, its orientation, supports and printer, was made in Breadslicer.",
  },
  es: {
    meta: {
      title: "Un modelo, tres herramientas — SynrgStudio",
      description: "Cómo se conectan Caliper, el formato .bread y Breadslicer, sobre una miniatura real que tu navegador decodifica, revisa, repara y corta mientras bajás.",
    },
    hero: {
      label: "Ecosistema · Caliper × .bread × Breadslicer",
      title: ["Un modelo.", "Tres herramientas.", "Ni un bit perdido."],
      body: "Caliper deja un modelo listo para imprimir, .bread lo lleva sin perder un bit y Breadslicer lo convierte en capas. Bajá y mirá la cadena entera sobre una miniatura real. Nada de esto es un video: lo que puede correr en un navegador corre en el tuyo.",
      scroll: "Bajá",
      loading: "Decodificando el modelo…",
      decoded: (tri, ms) => `${tri} triángulos decodificados del .bread en ${ms}, con el WebAssembly del propio formato, en este navegador`,
      nowebgl: "Este navegador no dibuja WebGL, así que la escena 3D está apagada. Igual, cada número de abajo se mide acá.",
    },
    caliper: {
      kicker: "01 · Caliper",
      title: "Primero, que se pueda imprimir.",
      body: "Los modelos que se bajan llegan rotos: agujeros, caras dadas vuelta, bordes que comparten tres caras. En una malla así, un slicer no sabe qué es adentro y qué es afuera. Caliper encuentra cada defecto, lo dibuja sobre el modelo y lo cierra. El archivo original no se toca.",
      steps: ["Analizar", "Reparar", "Cerrado"],
      rows: { open: "Bordes abiertos", flipped: "Orientación inconsistente", nonManifold: "Bordes no-manifold" },
      closed: "Cerrado: cada borde lo comparten exactamente dos caras, todas mirando hacia afuera.",
      note: "El daño se hace acá, sobre una copia, para mostrar la idea, y los bordes se cuentan en vivo en tu navegador. Las reparaciones reales de Caliper están abajo.",
      facts: [
        ["106 / 106", "modelos reales de prueba salen cerrados de una reparación"],
        ["0,44 s", "para abrir 20 millones de triángulos"],
        ["1,5 MB", "todo Caliper.exe"],
      ],
    },
    bread: {
      kicker: "02 · .bread",
      title: "Después, guardarlo sin perder un bit.",
      body: "Un STL vuelve a escribir cada esquina por cada triángulo que la toca. .bread guarda cada vértice una vez, lo predice a partir de sus vecinos y conserva los 32 bits de cada coordenada. Tu navegador acaba de hacerlo, con el módulo de WebAssembly del propio formato:",
      steps: ["STL", ".bread", "Leer", "Comparar"],
      labels: {
        stl: (mb) => `STL · ${mb}`,
        bread: (mb, x) => `.bread · ${mb} · ${x} veces más chico`,
        verify: (n) => `✓ ${n} esquinas idénticas`,
        verifying: "comparando cada esquina…",
      },
      live: {
        stl: "STL rearmado desde la malla",
        write: ".bread escrito",
        read: "leído de vuelta",
        compare: "esquinas comparadas, bit a bit",
        identical: (n) => `${n} idénticas`,
        differ: (n) => `${n} distintas`,
        waiting: "midiendo…",
      },
      smaller: (x) => `${x} veces más chico, y el mismo modelo`,
      chunks: "Chunks de este proyecto, como lo guardó Breadslicer",
      slicer: "THMB es la miniatura, SCNE la escena con el lugar del modelo en la placa, PROJ la impresora y la resina, SUPP cada soporte como datos, MESH el modelo. Un archivo también puede llevar ahuecados (HOLW), una vista previa de los soportes (SPRV), qué es cada parte (ROLE) y quién lo hizo (META).",
      facts: [
        [`${FACTS.mz4250Ratio}×`, `más chico que el STL en ${FACTS.mz4250Models.toLocaleString("es-AR")} miniaturas públicas, de ${FACTS.mz4250Stl} GB a ${String(FACTS.mz4250Bread).replace(".", ",")} GB`],
        ["0 bits", "perdidos: cada una volvió exactamente igual"],
        [`${FACTS.conformanceValid} + ${FACTS.conformanceInvalid}`, "archivos de conformidad, para quien escriba un lector"],
      ],
    },
    slicer: {
      kicker: "03 · Breadslicer",
      title: "Por último, cortarlo.",
      body: "Breadslicer gira el modelo como mejor se imprime, lo levanta de la placa y le pone soportes debajo de todo lo que cuelga. Después lo corta en las capas que va a encender la pantalla de tu impresora, una por una.",
      steps: ["Orientar", "Soportes", "Cortar"],
      layer: (n, total) => `Capa ${n} de ${total}`,
      layerSub: (z, seg, ms) => `z = ${z} mm · ${seg} bordes cortados en ${ms}, acá`,
      idle: "La capa aparece acá cuando empieza el corte.",
      note: "Las capas se cortan en vivo de la malla real, de 0,05 mm cada una, a 50 µm por píxel. Los soportes son un boceto calculado acá a partir de las caras que miran hacia abajo; el generador de Breadslicer hace mucho más.",
      real: (c) => `Este es el proyecto tal como lo guardó Breadslicer: el giro, la altura y cada soporte salen de su archivo .bread. Los soportes se guardan como datos, nunca como malla: ${c.bases} bases, ${c.trunks} troncos, ${c.branches} ramas, ${c.leaves} hojas, ${c.braces} riostras y ${c.tips} puntas, rearmados acá pieza por pieza. Cada capa se corta en vivo, de 0,05 mm, a 50 µm por píxel.`,
      rebuilt: (ms, tri) => `soportes rearmados desde SUPP en ${ms}, ${tri} triángulos`,
      facts: [
        ["0,66 s", "para cortar 991 capas de una miniatura de 1,9 M de triángulos, con soportes"],
        ["0,65 s", "para revisar islas y ventosas de un modelo hueco grande, antes 58 s"],
        ["157", "impresoras, con su resolución y sus formatos de archivo reales"],
      ],
    },
    loop: {
      kicker: "04 · La cadena",
      title: "Cómo se hablan entre ellas.",
      body: "Un formato abierto en el medio, así ninguna herramienta tiene que adivinar qué quiso decir otra.",
      nodes: { blender: "Blender", caliper: "Caliper", bread: ".bread", slicer: "Breadslicer", printer: "Impresora", browser: "Cualquier navegador" },
      edges: {
        bridge: "Caliper Bridge corre Caliper desde Blender",
        caliper: `lee y escribe .bread, desde la ${FACTS.caliperBreadSince}`,
        slicer: "proyectos en .bread, con soportes",
        printer: "CTB, GOO, Anycubic y más",
        browser: "el visor abre .bread en la web",
      },
    },
    measured: {
      kicker: "05 · Las pruebas",
      title: "Medido recién, en tu navegador.",
      body: "No en nuestra máquina ni en un benchmark del mes pasado: esto corrió en este dispositivo mientras bajabas.",
      rows: {
        decode: "Decodificar el .bread",
        analyze: "Analizar cada borde",
        stl: "Rearmar el STL",
        write: "Escribir el .bread",
        read: "Leerlo de vuelta",
        corners: "Esquinas idénticas",
        slice: "Cortar una capa",
      },
      pending: "todavía no",
      machine: "Las cifras fijas de arriba se midieron en un Ryzen 7 5800X; la página de cada herramienta dice cómo.",
    },
    get: {
      title: "Conseguilas.",
      caliper: { kind: "Reparación · gratis", body: "Análisis y reparación de mallas para impresión 3D, para Windows.", cta: "caliper.synrgs.tech" },
      bread: { kind: "Formato · Apache-2.0", body: "La especificación, versión 2, los archivos de conformidad y la implementación de referencia.", cta: "bread.synrgs.tech" },
      slicer: { kind: "Slicer · alfa", body: "El slicer de resina, software libre. Ya salió la primera alfa para Windows.", cta: "breadslicer.app" },
    },
    credit: "El modelo: Death Knight, de MZ4250, bajo CC BY 4.0, sin cambios: cada coordenada es la del STL, bit a bit. El proyecto alrededor, su orientación, sus soportes y su impresora, se hizo en Breadslicer.",
  },
}
