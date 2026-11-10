# MEMORIES - Sitio de SynrgStudio

Rehecho de cero en 2026-11. La versión anterior (plantilla de v0 con fondo de dodecaedro, efecto glitch y vidrio) está en el historial de git y en `git stash` ("portfolio v1").

## Idea

El estudio hace software nativo, addons de Blender y modelos 3D. Lo que tienen en común sus herramientas es que se miden y publican sus números. El sitio hace lo mismo: se mide a sí mismo en el navegador de quien lo visita (`components/page-meter.tsx`).

## Reglas de diseño

- Pedido del USER: nada de "página de IA" (chips, títulos con degradado, grillas de tarjetas con cifras, manchas de color, portadas generadas). Mostrar el producto real.
- Fondo grafito `#111214`, el mismo de las páginas de las herramientas. El estudio es neutro (tinta clara); cada herramienta trae un solo color de acento (`tone` en `lib/copy.ts`), que llega a su bloque por la variable CSS `--tone`.
- Tipografías: Archivo ensanchada (`.display`) para títulos y cifras grandes, Archivo normal para texto, JetBrains Mono para etiquetas, cifras chicas y enlaces.
- Cada herramienta se acompaña con algo suyo y real (`components/artifacts.tsx`): capturas, una respuesta real, sus pasos, o sus números a escala. No inventar cifras: salen de la página de cada herramienta.
- El único vidrio es la barra superior.
- Al USER le gustan las líneas que siguen al mouse: están en el sólido del encabezado (`components/solid.tsx`), con la del vértice más cercano dibujada como cota.

## Dónde está cada cosa

- Texto en inglés y español, datos y enlaces: `lib/copy.ts`.
- Idioma: `components/language.tsx` (se recuerda en localStorage).
- Secciones: `components/sections.tsx`. Encabezado: `components/hero.tsx`.
- Imágenes de las herramientas: `public/tools/`.

## Pendiente

- Sección 3D: faltan renders de las miniaturas y los nombres de los addons de Blender.
- `package.json` todavía lista las dependencias de la plantilla (radix, framer-motion, three, expo…); el sitio solo usa next, react y tailwind.
- No correr `next build` mientras `next dev` está abierto: comparten `.next` y se rompe la caché.

## Agregado después (10 nov 2026)

- **Sección Web** (`Web` en `components/sections.tsx`, datos en `sites` de `lib/copy.ts`): Puerto Rolero y breadslicer.app, con capturas reales de 1440 × 900 en `public/web/`. La de Breadslicer se tomó con movimiento reducido para que el título saliera completo.
- **Glitch al cambiar de idioma** (`components/language.tsx` + clase `.glitching` en `app/globals.css`): rompe en símbolos los nodos de texto que están a la vista, cambia el idioma y los recompone de izquierda a derecha, con aberración cromática, sacudida y líneas de barrido. Con movimiento reducido el cambio es directo.
- **Capa de plano técnico** (`components/technical.tsx`): `Dim` (cota vertical con la altura real de cada sección), `Ruler` (regla al pie del encabezado), `Coords` (posición del cursor en la barra) y `Guides` (líneas guía de la columna). El sólido suma círculo circunscrito, cota del diámetro y lectura del giro. Las secciones llevan letra (A a E) y los marcos, marcas de corte. Regla: todo número que se muestra es una medida real.

## Estructura en dos páginas (10 nov 2026)

- **Portada (`app/page.tsx`)**: da el panorama. Encabezado, A Qué hacemos, B índice de todo lo publicado (cada fila enlaza a su lámina en /work), C Método (con el porqué), D Por qué elegir al estudio, E Contacto. Las secciones nuevas están en `components/home.tsx`.
- **Trabajo (`app/work/page.tsx`)**: el detalle. Software con sus fichas cortas (`lib/specs.ts`, `components/spec-sheet.tsx`), Web y 3D con los tres addons de Superhive.
- Las fichas son cortas a pedido del usuario: cuatro cifras, una comparación y cuatro puntos fuertes. El detalle largo queda en la página de cada herramienta.
- Fondo: grilla de puntos cada 20 px (`Sheet` en `components/technical.tsx`).
