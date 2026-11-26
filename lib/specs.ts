// Fichas: lo que se abre al hacer clic en una herramienta. Son cortas a
// propósito: cuatro cifras, una comparación y cuatro puntos fuertes. El
// detalle completo vive en la página de cada herramienta.
// Las cifras las pasó el proyecto de cada una y salieron de corridas reales.
// Si no hay ficha, la herramienta no muestra el botón.

import type { Lang, ToolId } from "@/lib/copy"

export type Spec = {
  numbers: { value: string; label: string }[]
  compare: {
    title: string
    rows: { name: string; value: string; amount: number; own?: boolean }[] // barras a escala
  }
  highlights: string[]
  note: string
}

export const specLabels: Record<Lang, { open: string; close: string; title: string; more: string }> = {
  en: { open: "More numbers", close: "Close", title: "In numbers", more: "The full detail is on" },
  es: { open: "Más números", close: "Cerrar", title: "En números", more: "El detalle completo está en" },
}

export const specs: Partial<Record<ToolId, Record<Lang, Spec>>> = {
  breadslicer: {
    en: {
      numbers: [
        { value: "35 / 35", label: "real broken meshes repaired" },
        { value: "0.000 mm", label: "between the hollowing preview and the result" },
        { value: "11×", label: "smaller than the STL, with nothing lost" },
        { value: "157", label: "printers in the catalogue" },
      ],
      compare: {
        title: '"Fix all" on a large hollowed scene',
        rows: [
          { name: "Before", value: "868 s", amount: 868 },
          { name: "Now", value: "3.3 s", amount: 3.3, own: true },
        ],
      },
      highlights: [
        "Automatic supports you can still edit by hand.",
        "Layer review before export: islands, suction cups and thin parts.",
        "Auto-orientation took one model from 232 support tips to 51.",
        "1.9 million triangles drawn in 0.44 ms per frame.",
      ],
      note: "Measured on a Ryzen 7 5800X with an RTX 3090, on development builds.",
    },
    es: {
      numbers: [
        { value: "35 / 35", label: "mallas rotas reales reparadas" },
        { value: "0,000 mm", label: "entre la vista previa del ahuecado y el resultado" },
        { value: "11×", label: "más chico que el STL, sin perder nada" },
        { value: "157", label: "impresoras en el catálogo" },
      ],
      compare: {
        title: '"Corregir todo" en una escena grande ahuecada',
        rows: [
          { name: "Antes", value: "868 s", amount: 868 },
          { name: "Ahora", value: "3,3 s", amount: 3.3, own: true },
        ],
      },
      highlights: [
        "Soportes automáticos que igual se editan a mano.",
        "Revisión de capas antes de exportar: islas, ventosas y partes finas.",
        "La auto-orientación llevó un modelo de 232 puntas de soporte a 51.",
        "1,9 millones de triángulos dibujados en 0,44 ms por cuadro.",
      ],
      note: "Medido en un Ryzen 7 5800X con una RTX 3090, en versiones de desarrollo.",
    },
  },

  caliper: {
    en: {
      numbers: [
        { value: "0.44 s", label: "to open 20 million triangles" },
        { value: "0 mm", label: "median distance from a repaired vertex to the original" },
        { value: "106 / 106", label: "give the very same file when repaired twice" },
        { value: "1.5 MB", label: "the whole Caliper.exe" },
      ],
      compare: {
        title: "Time to open a model, ready to draw",
        rows: [
          { name: "A 75 MB miniature, 1.5 million triangles", value: "40 ms", amount: 40, own: true },
          { name: "A test model, 20 million triangles", value: "0.44 s", amount: 440, own: true },
        ],
      },
      highlights: [
        "A repair comes out closed: no open or non-manifold edges.",
        "Batch mode analyses and repairs whole folders in parallel.",
        "Finds closed cavities and lets you choose which to keep.",
        "Works offline, and it is free with every feature.",
      ],
      note: "Measured on a Ryzen 7 5800X with an RTX 3090: repairs on 106 real models with Caliper 0.9.4, opening times on a development build.",
    },
    es: {
      numbers: [
        { value: "0,44 s", label: "para abrir 20 millones de triángulos" },
        { value: "0 mm", label: "distancia mediana de un vértice reparado al original" },
        { value: "106 / 106", label: "dan exactamente el mismo archivo al repararlos dos veces" },
        { value: "1,5 MB", label: "todo Caliper.exe" },
      ],
      compare: {
        title: "Tiempo para abrir un modelo, listo para dibujar",
        rows: [
          { name: "Una miniatura de 75 MB, 1,5 millones de triángulos", value: "40 ms", amount: 40, own: true },
          { name: "Un modelo de prueba, 20 millones de triángulos", value: "0,44 s", amount: 440, own: true },
        ],
      },
      highlights: [
        "Una reparación sale cerrada: sin bordes abiertos ni no-manifold.",
        "El modo carpeta analiza y repara carpetas enteras en paralelo.",
        "Encuentra cavidades cerradas y deja elegir cuáles conservar.",
        "Funciona sin conexión, y es gratis con todas las funciones.",
      ],
      note: "Medido en un Ryzen 7 5800X con una RTX 3090: las reparaciones, sobre 106 modelos reales con Caliper 0.9.4; los tiempos de apertura, en una versión de desarrollo.",
    },
  },

  harbor: {
    en: {
      numbers: [
        { value: "19.1 MB", label: "the APK for phones, torrent engine and FFmpeg audio included" },
        { value: "Android 10", label: "or later" },
        { value: "0", label: "API keys inside the APK: metadata works without signing up" },
        { value: "0", label: "stream addons inside: it plays what your own addons return" },
      ],
      compare: {
        title: "Janky frames while scrolling Home, on a Galaxy A54 at 120 Hz",
        rows: [
          { name: "0.1.0", value: "2.63 %", amount: 2.63 },
          { name: "0.2.0", value: "1.31 %", amount: 1.31, own: true },
        ],
      },
      highlights: [
        "Sync both ways with your Stremio account, watched marks in Stremio's own format.",
        "Every addon asked at once; each one's streams show as soon as it answers.",
        "Torrents through librqbit, the same Rust engine as Harbor desktop, behind its HTTP API.",
        "Updates itself from GitHub, checked against the SHA-256 GitHub publishes.",
      ],
      note: "Measured on a Samsung Galaxy A54 (Android 16, 120 Hz) with release builds 0.1.0 and 0.2.0; later versions were not measured again. Sizes from the 0.7.0 release.",
    },
    es: {
      numbers: [
        { value: "19,1 MB", label: "el APK para celulares, con el motor de torrents y el audio de FFmpeg" },
        { value: "Android 10", label: "o más nuevo" },
        { value: "0", label: "claves de API dentro del APK: los metadatos andan sin registrarse" },
        { value: "0", label: "addons de streams adentro: reproduce lo que devuelven tus addons" },
      ],
      compare: {
        title: "Cuadros con tirón al deslizar el Inicio, en un Galaxy A54 a 120 Hz",
        rows: [
          { name: "0.1.0", value: "2,63 %", amount: 2.63 },
          { name: "0.2.0", value: "1,31 %", amount: 1.31, own: true },
        ],
      },
      highlights: [
        "Sincroniza en los dos sentidos con tu cuenta de Stremio, con los vistos en el formato de Stremio.",
        "Les pregunta a todos los addons a la vez; los streams de cada uno aparecen apenas contesta.",
        "Torrents con librqbit, el mismo motor en Rust que Harbor de escritorio, detrás de su API HTTP.",
        "Se actualiza sola desde GitHub, comparada con el SHA-256 que publica GitHub.",
      ],
      note: "Medido en un Samsung Galaxy A54 (Android 16, 120 Hz) con builds de release 0.1.0 y 0.2.0; las versiones siguientes no se volvieron a medir. Tamaños de la release 0.7.0.",
    },
  },

  jolt: {
    en: {
      numbers: [
        { value: "0.47 ms", label: "to read a folder of 1,000 files" },
        { value: "105 ms", label: "from launch to ready, measured without a window" },
        { value: "100", label: "steps of undo" },
        { value: "2.5 MB", label: "the program and its installer, in one file" },
      ],
      compare: {
        title: "Read a folder of 100,000 files",
        rows: [
          { name: "Jolt", value: "46.7 ms", amount: 46.7, own: true },
          { name: "Windows Shell API", value: "1,247 ms", amount: 1247 },
        ],
      },
      highlights: [
        "Space previews images, code, PDF, video and archives.",
        "Ctrl+P searches every drive.",
        "Undo for rename, move, copy, delete and create.",
        "The real Windows context menu, trimmed to your taste.",
      ],
      note: "Measured on a Ryzen 7 5800X with an NVMe SSD. The times are for reading the folder, not for showing it on screen.",
    },
    es: {
      numbers: [
        { value: "0,47 ms", label: "para leer una carpeta de 1.000 archivos" },
        { value: "105 ms", label: "del arranque a estar listo, medido sin ventana" },
        { value: "100", label: "pasos de deshacer" },
        { value: "2,5 MB", label: "el programa y su instalador, en un archivo" },
      ],
      compare: {
        title: "Leer una carpeta de 100.000 archivos",
        rows: [
          { name: "Jolt", value: "46,7 ms", amount: 46.7, own: true },
          { name: "API del Shell de Windows", value: "1.247 ms", amount: 1247 },
        ],
      },
      highlights: [
        "Espacio muestra imágenes, código, PDF, video y comprimidos.",
        "Ctrl+P busca en todos los discos.",
        "Deshacer para renombrar, mover, copiar, borrar y crear.",
        "El menú contextual real de Windows, recortado a tu gusto.",
      ],
      note: "Medido en un Ryzen 7 5800X con un SSD NVMe. Los tiempos son de leer la carpeta, no de mostrarla en pantalla.",
    },
  },

  seek: {
    en: {
      numbers: [
        { value: "9 ms", label: "to list what you changed lately" },
        { value: "0.4 ms", label: "to search text in a repository, once warm" },
        { value: "128", label: "tokens in a whole answer" },
        { value: "1.0 MB", label: "the entire program, in one file" },
      ],
      compare: {
        title: "Find a file by name, on every drive",
        rows: [
          { name: "Seek", value: "52 ms", amount: 52, own: true },
          { name: "Everything", value: "93 ms", amount: 93 },
          { name: "fd", value: "4.7 s", amount: 4700 },
          { name: "ripgrep", value: "5.8 s", amount: 5800 },
          { name: "dir /s", value: "84.7 s", amount: 84700 },
        ],
      },
      highlights: [
        'Finds "fuzzy.inl" when asked for "fuzy.inl". Everything did not.',
        "Answers with a summary, not with thousands of paths.",
        "One process serves every agent on the PC.",
        "Read-only, and it stays out of private places.",
      ],
      note: "Measured on a Ryzen 7 5800X, with 4.9 million files on three drives.",
    },
    es: {
      numbers: [
        { value: "9 ms", label: "para listar lo que cambiaste últimamente" },
        { value: "0,4 ms", label: "para buscar texto en un repositorio, ya caliente" },
        { value: "128", label: "tokens en una respuesta entera" },
        { value: "1,0 MB", label: "el programa completo, en un archivo" },
      ],
      compare: {
        title: "Encontrar un archivo por nombre, en todos los discos",
        rows: [
          { name: "Seek", value: "52 ms", amount: 52, own: true },
          { name: "Everything", value: "93 ms", amount: 93 },
          { name: "fd", value: "4,7 s", amount: 4700 },
          { name: "ripgrep", value: "5,8 s", amount: 5800 },
          { name: "dir /s", value: "84,7 s", amount: 84700 },
        ],
      },
      highlights: [
        'Encuentra "fuzzy.inl" cuando le piden "fuzy.inl". Everything no.',
        "Responde con un resumen, no con miles de rutas.",
        "Un solo proceso atiende a todos los agentes de la PC.",
        "Solo lee, y no entra en lugares privados.",
      ],
      note: "Medido en un Ryzen 7 5800X, con 4,9 millones de archivos en tres discos.",
    },
  },
}
