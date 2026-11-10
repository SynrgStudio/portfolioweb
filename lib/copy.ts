// Todo el texto del sitio, en inglés y en español.
// Las cifras son las que publica cada herramienta en su propia página:
// si allá cambian, se cambian acá.

export type Lang = "en" | "es"
export type ToolId = "breadslicer" | "seek" | "jolt" | "caliper" | "webtomd"
export type SiteId = "puertorolero" | "breadslicer"
export type AddonId = "damtools" | "bambu" | "cleaner"

type ToolCopy = {
  kind: string
  body: string
  figure: string
  figureLabel: string
  meta: string
}

export type Copy = {
  nav: { work: string; software: string; web: string; threeD: string; method: string; why: string; contact: string }
  hero: { title: string; body: string; work: string; method: string }
  meter: {
    ready: (ms: number, requests: number, kb: number) => string
    where: string
    dev: string
    pending: string
  }
  software: { label: string; title: string; body: string }
  tools: Record<ToolId, ToolCopy>
  breadslicerSteps: Record<"transform" | "hollow" | "supports" | "slice" | "export", [string, string]>
  seekNote: string
  joltNote: string
  caliperSteps: [string, string][]
  webtomd: { raw: string; clean: string; tokens: string; note: string }
  web: {
    label: string
    title: string
    body: string
    captured: string
    sites: Record<SiteId, { kind: string; body: string }>
  }
  threeD: {
    label: string
    title: string
    body: string
    models: string
    addons: Record<AddonId, { kind: string; figure: string; figureLabel: string; body: string }>
  }
  method: {
    label: string
    title: string
    body: string
    rows: { name: string; body: string }[]
  }
  does: { label: string; title: string; rows: { name: string; body: string; proof: string }[] }
  index: { label: string; title: string; body: string; all: string }
  why: { label: string; title: string; rows: { name: string; body: string }[] }
  workPage: { label: string; title: string; body: string }
  contact: { label: string; title: string; body: string }
  form: {
    category: string
    categories: string[]
    name: string
    reply: string
    message: string
    copy: string
    copied: string
    note: string
    userHint: string
    userCopied: string
    elsewhere: string
  }
  footer: string
}

export const copy: Record<Lang, Copy> = {
  en: {
    nav: { work: "Work", software: "Software", web: "Web", threeD: "3D", method: "Method", why: "Why us", contact: "Contact" },
    hero: {
      title: "Software that doesn't make you wait.",
      body: "SynrgStudio makes native tools for Windows, websites, Blender add-ons and 3D models for print. Each tool is measured before it ships, and the numbers go on its page.",
      work: "See the work",
      method: "How we work",
    },
    meter: {
      ready: (ms, requests, kb) =>
        kb > 0
          ? `This page was ready in ${ms} ms, with ${requests} requests and ${kb} KB.`
          : `This page was ready in ${ms} ms, with ${requests} requests, from cache.`,
      where: "Measured in your browser, just now.",
      dev: "Development build: the published one is lighter.",
      pending: "Measuring this page…",
    },
    software: {
      label: "Software",
      title: "Five tools, each for one job.",
      body: "Every figure below was taken from a real run and is published on the tool's own page.",
    },
    tools: {
      breadslicer: {
        kind: "Resin slicer",
        body: "A native MSLA slicer written in Rust, with its own GPU renderer. Supports and hollowing are prepared in the background while you work, so they are ready before you ask.",
        figure: "0.66 s",
        figureLabel: "to slice 991 layers of a 92 MB miniature",
        meta: "Windows · Rust, Slint, wgpu · early access",
      },
      seek: {
        kind: "File search for AI agents",
        body: "An MCP server that finds any file by name on every drive, searches the text of folders and documents, and knows what you were working on. Its answers are a few hundred tokens long.",
        figure: "52 ms",
        figureLabel: "to find a file by name among 4.9 million, on every drive",
        meta: "Windows 10 and 11 · MCP · GPL v3",
      },
      jolt: {
        kind: "File explorer",
        body: "Folders open at once, a fuzzy filter starts as you type, and Space shows a preview. Tabs, split view and undo, with every shortcut yours to change.",
        figure: "46.7 ms",
        figureLabel: "to read a folder of 100,000 files",
        meta: "Windows 10 and 11 · no telemetry · GPL v3",
      },
      caliper: {
        kind: "STL viewer and repair",
        body: "Opens, inspects and repairs STL files. Analysis runs when you ask for it, and a repair is saved as a separate copy, so the original is never changed.",
        figure: "106 / 106",
        figureLabel: "real test models come out of a repair closed",
        meta: "Windows · Linux in Nightly · free",
      },
      webtomd: {
        kind: "Markdown proxy for LLMs",
        body: "Put md.synrgs.tech/v1/ in front of any URL and get the page back as clean Markdown, without the navigation, scripts and styles a model would pay to read.",
        figure: "−99%",
        figureLabel: "tokens to read the CNN homepage",
        meta: "HTTP API · free · open source",
      },
    },
    breadslicerSteps: {
      transform: ["Transform", "to open 1.9 million triangles"],
      hollow: ["Hollow", "for the live cavity preview"],
      supports: ["Supports", "from Generate to supports on screen"],
      slice: ["Slice", "to slice 991 layers"],
      export: ["Export", "to write the 26.9 MB printer file"],
    },
    seekNote: "A real answer, typo included.",
    joltNote: "Split view: two panes, each with its own tabs.",
    caliperSteps: [
      ["Open", "Browse your STL files. The camera stays where you left it."],
      ["Inspect", "Mesh analysis runs when you ask, not on every file you open."],
      ["Repair", "Review the result and save a copy. The original stays as it was."],
    ],
    webtomd: {
      raw: "Raw HTML",
      clean: "Clean Markdown",
      tokens: "tokens",
      note: "Both bars are drawn to the same scale.",
    },
    web: {
      label: "Web",
      title: "Websites, from design to code.",
      body: "The studio designs and builds websites too. Here are two of them, captured as they are today.",
      captured: "Captured at",
      sites: {
        puertorolero: {
          kind: "Online store",
          body: "A shop in Buenos Aires for 3D-printed miniatures, terrain and dice for tabletop RPGs. More than 3,800 products, with search, a cart and orders over WhatsApp.",
        },
        breadslicer: {
          kind: "Product site",
          body: "Breadslicer's own page. As you scroll, it builds a real sliced miniature, layer by layer.",
        },
      },
    },
    threeD: {
      label: "3D",
      title: "Miniatures and Blender add-ons.",
      body: "SynrgStudio also designs in 3D: miniatures for wargaming and tabletop RPGs, made for resin printing, and add-ons for Blender. Three add-ons are published on Superhive.",
      models: "The models are on Patreon and Ko-fi.",
      addons: {
        damtools: {
          kind: "Modeling toolkit",
          figure: "90+",
          figureLabel: "tools behind one shortcut, Shift+W",
          body: "Tools for cutting, placing, mirroring, aligning and cleaning up models, grouped in one pie menu per mode. Booleans show a live preview, and a model goes to Bambu Studio or PrusaSlicer in one click.",
        },
        bambu: {
          kind: "Slicer export",
          figure: "2 steps",
          figureLabel: "instead of 5: select the objects, send them",
          body: "Sends the selected objects from Blender to Bambu Studio, without exporting and importing files by hand. It can also update a model that is already open in the slicer.",
        },
        cleaner: {
          kind: "Mesh cleanup",
          figure: "1 click",
          figureLabel: "from a messy mesh to a clean one",
          body: "Removes loose geometry, merges duplicate vertices, turns triangles into quads and recalculates normals. Hold Alt and it repeats until the mesh is clean.",
        },
      },
    },
    method: {
      label: "Method",
      title: "How it is built.",
      body: "Slow software charges its user a little every day: a wait here, a spinner there. The studio builds so that cost is never paid. These four rules are how.",
      rows: [
        {
          name: "Native",
          body: "No browser engine inside. Breadslicer is one 67 MB executable that talks to the GPU directly, and Jolt is a single file.",
        },
        {
          name: "Measured",
          body: "A figure only goes on a page if a run produced it. Seek publishes its raw results and the command that runs them again on your PC.",
        },
        {
          name: "Local",
          body: "Caliper never uploads a model. Jolt doesn't connect to the network unless you turn on update checks.",
        },
        {
          name: "Plain about limits",
          body: "Where another tool does something better, Seek's page says so, tool by tool.",
        },
      ],
    },
    does: {
      label: "What we do",
      title: "Three kinds of work, made the same way.",
      rows: [
        {
          name: "Software",
          body: "Native tools for Windows, written in Rust and C++: a resin slicer, a file explorer, a file search for AI agents and an STL repair tool.",
          proof: "5 tools published",
        },
        {
          name: "Web",
          body: "Sites designed and built by the studio, from a product page to an online store with thousands of products.",
          proof: "2 sites online",
        },
        {
          name: "3D",
          body: "Blender add-ons that take steps out of everyday modeling, and miniatures made for resin printing.",
          proof: "3 add-ons on Superhive",
        },
      ],
    },
    index: {
      label: "Work",
      title: "Everything published so far.",
      body: "Ten pieces of work. Each one opens with its screenshots and its numbers.",
      all: "All the work",
    },
    why: {
      label: "Why us",
      title: "Why work with this studio.",
      rows: [
        {
          name: "It gets finished",
          body: "Nothing here is a concept. Five tools, three add-ons and two sites are published and in use today.",
        },
        {
          name: "Numbers, not adjectives",
          body: "You get what was measured and how, so you can check it yourself. Jolt reads a folder of 100,000 files in 46.7 ms, and the test that says so is in its repository.",
        },
        {
          name: "Small and fast",
          body: "Seek is one file of 1.0 MB, Caliper 1.5 MB, Jolt 2.5 MB. There is less to download, less to break and nothing to wait for.",
        },
        {
          name: "Design and code together",
          body: "The same studio draws the interface, writes the engine and builds the site. Breadslicer and breadslicer.app were made that way.",
        },
      ],
    },
    workPage: {
      label: "Work",
      title: "The work, piece by piece.",
      body: "Software, websites and 3D. Every figure here came out of a real run.",
    },
    contact: {
      label: "Contact",
      title: "Tell us what you need.",
      body: "A tool, a site or a 3D job. The fastest way to reach the studio is Discord.",
    },
    form: {
      category: "What it is about",
      categories: ["Software", "Web", "3D", "Something else"],
      name: "Your name",
      reply: "Where to answer you",
      message: "Message",
      copy: "Copy the message",
      copied: "Copied. Paste it in a message to nd_synrg on Discord.",
      note: "This form doesn't send anything yet: it puts your message together to paste in Discord.",
      userHint: "Click the name to copy it.",
      userCopied: "Copied.",
      elsewhere: "Also on",
    },
    footer: "Made by SynrgStudio.",
  },

  es: {
    nav: { work: "Trabajo", software: "Software", web: "Web", threeD: "3D", method: "Método", why: "Por qué", contact: "Contacto" },
    hero: {
      title: "Software que no te hace esperar.",
      body: "SynrgStudio hace herramientas nativas para Windows, sitios web, addons de Blender y modelos 3D para imprimir. Cada herramienta se mide antes de salir, y los números van en su página.",
      work: "Ver el trabajo",
      method: "Cómo trabajamos",
    },
    meter: {
      ready: (ms, requests, kb) =>
        kb > 0
          ? `Esta página estuvo lista en ${ms} ms, con ${requests} pedidos y ${kb} KB.`
          : `Esta página estuvo lista en ${ms} ms, con ${requests} pedidos, desde la caché.`,
      where: "Medido en tu navegador, recién.",
      dev: "Versión de desarrollo: la publicada pesa menos.",
      pending: "Midiendo esta página…",
    },
    software: {
      label: "Software",
      title: "Cinco herramientas, cada una para un trabajo.",
      body: "Cada cifra de abajo salió de una corrida real y está publicada en la página de su herramienta.",
    },
    tools: {
      breadslicer: {
        kind: "Slicer de resina",
        body: "Un slicer MSLA nativo escrito en Rust, con su propio renderer en GPU. Los soportes y el vaciado se preparan de fondo mientras trabajás, así que están listos antes de que los pidas.",
        figure: "0.66 s",
        figureLabel: "para cortar 991 capas de una miniatura de 92 MB",
        meta: "Windows · Rust, Slint, wgpu · acceso anticipado",
      },
      seek: {
        kind: "Búsqueda de archivos para agentes de IA",
        body: "Un servidor MCP que encuentra cualquier archivo por nombre en todos los discos, busca texto en carpetas y documentos, y sabe en qué estabas trabajando. Sus respuestas ocupan unos cientos de tokens.",
        figure: "52 ms",
        figureLabel: "para encontrar un archivo por nombre entre 4,9 millones, en todos los discos",
        meta: "Windows 10 y 11 · MCP · GPL v3",
      },
      jolt: {
        kind: "Explorador de archivos",
        body: "Las carpetas abren al instante, el filtro difuso arranca apenas escribís y Espacio muestra una vista previa. Pestañas, vista dividida y deshacer, con todos los atajos a tu gusto.",
        figure: "46,7 ms",
        figureLabel: "para leer una carpeta de 100.000 archivos",
        meta: "Windows 10 y 11 · sin telemetría · GPL v3",
      },
      caliper: {
        kind: "Visor y reparador de STL",
        body: "Abre, inspecciona y repara archivos STL. El análisis corre cuando lo pedís, y una reparación se guarda como copia aparte, así que el original nunca cambia.",
        figure: "106 / 106",
        figureLabel: "modelos reales de prueba salen cerrados de una reparación",
        meta: "Windows · Linux en Nightly · gratis",
      },
      webtomd: {
        kind: "Proxy de Markdown para LLM",
        body: "Poné md.synrgs.tech/v1/ delante de cualquier URL y recibís la página en Markdown limpio, sin la navegación, los scripts ni los estilos que un modelo pagaría por leer.",
        figure: "−99%",
        figureLabel: "de tokens para leer la portada de CNN",
        meta: "API HTTP · gratis · código abierto",
      },
    },
    breadslicerSteps: {
      transform: ["Transformar", "para abrir 1,9 millones de triángulos"],
      hollow: ["Vaciar", "para la vista previa de la cavidad"],
      supports: ["Soportes", "de Generar a los soportes en pantalla"],
      slice: ["Cortar", "para cortar 991 capas"],
      export: ["Exportar", "para escribir el archivo de 26,9 MB"],
    },
    seekNote: "Una respuesta real, con el error de tipeo incluido.",
    joltNote: "Vista dividida: dos paneles, cada uno con sus pestañas.",
    caliperSteps: [
      ["Abrir", "Recorré tus archivos STL. La cámara queda donde la dejaste."],
      ["Inspeccionar", "El análisis de malla corre cuando lo pedís, no en cada archivo que abrís."],
      ["Reparar", "Revisá el resultado y guardá una copia. El original queda como estaba."],
    ],
    webtomd: {
      raw: "HTML crudo",
      clean: "Markdown limpio",
      tokens: "tokens",
      note: "Las dos barras están dibujadas a la misma escala.",
    },
    web: {
      label: "Web",
      title: "Sitios web, del diseño al código.",
      body: "El estudio también diseña y hace sitios web. Acá hay dos, capturados como están hoy.",
      captured: "Capturado a",
      sites: {
        puertorolero: {
          kind: "Tienda online",
          body: "Una tienda de Buenos Aires de miniaturas, terrenos y dados impresos en 3D para rol de mesa. Más de 3.800 productos, con buscador, carrito y pedidos por WhatsApp.",
        },
        breadslicer: {
          kind: "Sitio de producto",
          body: "La página del propio Breadslicer. Al bajar, arma capa por capa una miniatura cortada de verdad.",
        },
      },
    },
    threeD: {
      label: "3D",
      title: "Miniaturas y addons de Blender.",
      body: "SynrgStudio también diseña en 3D: miniaturas para wargames y juegos de rol de mesa, hechas para imprimir en resina, y addons para Blender. Hay tres addons publicados en Superhive.",
      models: "Los modelos están en Patreon y Ko-fi.",
      addons: {
        damtools: {
          kind: "Herramientas de modelado",
          figure: "90+",
          figureLabel: "herramientas detrás de un atajo, Shift+W",
          body: "Herramientas para cortar, ubicar, espejar, alinear y limpiar modelos, agrupadas en un menú circular por modo. Los booleanos muestran una vista previa, y un modelo va a Bambu Studio o PrusaSlicer con un clic.",
        },
        bambu: {
          kind: "Exportar al slicer",
          figure: "2 pasos",
          figureLabel: "en vez de 5: seleccionar los objetos, enviarlos",
          body: "Manda los objetos seleccionados de Blender a Bambu Studio, sin exportar e importar archivos a mano. También actualiza un modelo que ya está abierto en el slicer.",
        },
        cleaner: {
          kind: "Limpieza de mallas",
          figure: "1 clic",
          figureLabel: "de una malla desprolija a una limpia",
          body: "Quita geometría suelta, une vértices duplicados, convierte triángulos en quads y recalcula las normales. Con Alt apretado, repite hasta que la malla queda limpia.",
        },
      },
    },
    method: {
      label: "Método",
      title: "Cómo se hace.",
      body: "El software lento le cobra un poco a su usuario todos los días: una espera acá, un cargando allá. El estudio trabaja para que ese costo no se pague nunca. Estas cuatro reglas son el cómo.",
      rows: [
        {
          name: "Nativo",
          body: "Sin motor de navegador adentro. Breadslicer es un ejecutable de 67 MB que le habla directo a la GPU, y Jolt es un solo archivo.",
        },
        {
          name: "Medido",
          body: "Una cifra va a una página solo si salió de una corrida. Seek publica sus resultados crudos y el comando para repetirlos en tu PC.",
        },
        {
          name: "Local",
          body: "Caliper nunca sube un modelo. Jolt no se conecta a la red salvo que actives el aviso de actualizaciones.",
        },
        {
          name: "Claro con los límites",
          body: "Donde otra herramienta hace algo mejor, la página de Seek lo dice, herramienta por herramienta.",
        },
      ],
    },
    does: {
      label: "Qué hacemos",
      title: "Tres tipos de trabajo, hechos de la misma manera.",
      rows: [
        {
          name: "Software",
          body: "Herramientas nativas para Windows, escritas en Rust y C++: un slicer de resina, un explorador de archivos, un buscador de archivos para agentes de IA y un reparador de STL.",
          proof: "5 herramientas publicadas",
        },
        {
          name: "Web",
          body: "Sitios diseñados y hechos por el estudio, desde la página de un producto hasta una tienda online con miles de productos.",
          proof: "2 sitios en línea",
        },
        {
          name: "3D",
          body: "Addons de Blender que le sacan pasos al modelado de todos los días, y miniaturas hechas para imprimir en resina.",
          proof: "3 addons en Superhive",
        },
      ],
    },
    index: {
      label: "Trabajo",
      title: "Todo lo publicado hasta hoy.",
      body: "Diez trabajos. Cada uno se abre con sus capturas y sus números.",
      all: "Todo el trabajo",
    },
    why: {
      label: "Por qué",
      title: "Por qué trabajar con este estudio.",
      rows: [
        {
          name: "Se termina",
          body: "Acá nada es un concepto. Cinco herramientas, tres addons y dos sitios están publicados y en uso hoy.",
        },
        {
          name: "Números, no adjetivos",
          body: "Recibís qué se midió y cómo, para que puedas comprobarlo. Jolt lee una carpeta de 100.000 archivos en 46,7 ms, y la prueba que lo dice está en su repositorio.",
        },
        {
          name: "Chico y rápido",
          body: "Seek es un archivo de 1,0 MB, Caliper pesa 1,5 MB y Jolt 2,5 MB. Hay menos para descargar, menos para romperse y nada que esperar.",
        },
        {
          name: "Diseño y código juntos",
          body: "El mismo estudio dibuja la interfaz, escribe el motor y hace el sitio. Breadslicer y breadslicer.app se hicieron así.",
        },
      ],
    },
    workPage: {
      label: "Trabajo",
      title: "El trabajo, pieza por pieza.",
      body: "Software, sitios web y 3D. Cada cifra de acá salió de una corrida real.",
    },
    contact: {
      label: "Contacto",
      title: "Contanos qué necesitás.",
      body: "Una herramienta, un sitio o un trabajo en 3D. La forma más rápida de llegar al estudio es Discord.",
    },
    form: {
      category: "De qué se trata",
      categories: ["Software", "Web", "3D", "Otra cosa"],
      name: "Tu nombre",
      reply: "Dónde responderte",
      message: "Mensaje",
      copy: "Copiar el mensaje",
      copied: "Copiado. Pegalo en un mensaje a nd_synrg en Discord.",
      note: "Este formulario todavía no envía nada: arma tu mensaje para pegarlo en Discord.",
      userHint: "Hacé clic en el nombre para copiarlo.",
      userCopied: "Copiado.",
      elsewhere: "También en",
    },
    footer: "Hecho por SynrgStudio.",
  },
}

// Datos que no cambian con el idioma.
export const tools: {
  id: ToolId
  name: string
  icon: string
  tone: string
  site: { label: string; href: string }
  repo?: string
}[] = [
  {
    id: "breadslicer",
    name: "Breadslicer",
    icon: "/tools/breadslicer.png",
    tone: "#d7a75a",
    site: { label: "breadslicer.app", href: "https://breadslicer.app" },
  },
  {
    id: "seek",
    name: "Seek",
    icon: "/tools/seek.png",
    tone: "#55b8ff",
    site: { label: "seek.synrgs.tech", href: "https://seek.synrgs.tech" },
    repo: "https://github.com/SynrgStudio/seek",
  },
  {
    id: "caliper",
    name: "Caliper",
    icon: "/tools/caliper.svg",
    tone: "#f68a3b",
    site: { label: "caliper.synrgs.tech", href: "https://caliper.synrgs.tech" },
  },
  {
    id: "jolt",
    name: "Jolt",
    icon: "/tools/jolt.png",
    tone: "#4f8cf7",
    site: { label: "jolt.synrgs.tech", href: "https://jolt.synrgs.tech" },
    repo: "https://github.com/SynrgStudio/jolt",
  },
  {
    id: "webtomd",
    name: "WebToMD",
    icon: "",
    tone: "#e4e4e7",
    site: { label: "md.synrgs.tech", href: "https://md.synrgs.tech" },
    repo: "https://github.com/SynrgStudio/webtomd",
  },
]

export const sites: {
  id: SiteId
  name: string
  host: string
  href: string
  image: string
  tone: string
}[] = [
  {
    id: "puertorolero",
    name: "Puerto Rolero",
    host: "puertorolero.com.ar",
    href: "https://www.puertorolero.com.ar/",
    image: "/web/puertorolero.webp",
    tone: "#e0a666",
  },
  {
    id: "breadslicer",
    name: "Breadslicer",
    host: "breadslicer.app",
    href: "https://breadslicer.app",
    image: "/web/breadslicer.webp",
    tone: "#d7a75a",
  },
]

export const addons: {
  id: AddonId
  name: string
  meta: string
  href: string
  image: string
  tone: string
}[] = [
  {
    id: "damtools",
    name: "damTools",
    meta: "v1.8.1 · Blender 4.5 – 5.0",
    href: "https://superhivemarket.com/products/damtools",
    image: "/addons/damtools.webp",
    tone: "#e4e4e7",
  },
  {
    id: "bambu",
    name: "Blender → Bambu Studio",
    meta: "v1.1.2 · Blender 3.0 – 4.3",
    href: "https://superhivemarket.com/products/blender-bambustudio-export",
    image: "/addons/bambu-export.webp",
    tone: "#2fbf5b",
  },
  {
    id: "cleaner",
    name: "1-Click Mesh Cleaner",
    meta: "v1.0.1 · Blender 4.2 – 5.0",
    href: "https://superhivemarket.com/products/1-click-mesh-cleaner",
    image: "/addons/mesh-cleaner.webp",
    tone: "#a9c93a",
  },
]

export const links = {
  discord: "nd_synrg",
  github: "https://github.com/SynrgStudio",
  patreon: "https://www.patreon.com/cw/synrgstudio",
  kofi: "https://ko-fi.com/synrg",
}
