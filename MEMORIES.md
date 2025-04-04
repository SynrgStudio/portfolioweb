# MEMORIES - Información importante del proyecto

## Errores a no cometer

1. **Problema con animaciones pulsantes**: 
   - Si las animaciones de fondo pulsante no son visibles, aumentar la opacidad (>0.3) y reducir la duración de la animación a menos de 10s para hacerlas más notorias.
   - Usar valores más altos para la variación de escala en el keyframe (0.9 a 1.1) para que el pulsado sea visible.
   - Si las animaciones se ven glitchy o entrecortadas, implementar múltiples clases de animación alternativas (animate-morph, animate-morph-alt1, animate-morph-alt2) con diferentes tiempos y valores para evitar la sincronización.

2. **Valores de Z-index importantes**:
   - Las formas orgánicas de fondo deben tener un z-index mayor a -5 pero menor a 0 para verse correctamente.
   - El valor -2 funciona bien para que estén sobre el fondo pero detrás del dodecaedro.

3. **Velocidades de animación**:
   - Para morphing de formas: usar animaciones de 5-8s para que sean perceptibles
   - Para el cambio de fase: multiplicador de deltaTime entre 0.1 y 0.2
   - Para el pulseSpeed de las formas: valores entre 0.5 y 1.0 funcionan mejor
   - Para evitar animaciones entrecortadas: reducir el multiplicador de deltaTime (0.1 en lugar de 0.2) y usar cálculos más suaves para las transiciones

4. **Evitar simetría y patrones predecibles**:
   - Evitar distribuciones simétricas horizontales y verticales de elementos visuales
   - Agregar pequeñas variaciones en coordenadas y transformaciones para evitar el efecto "espejo"
   - Utilizar valores iniciales aleatorios para rotaciones y posiciones
   - La perfecta regularidad matemática produce sensación artificial; las pequeñas asimetrías crean sensación de naturalidad

5. **Solución a problemas de titileo**:
   - Reducir la velocidad de rotación y animación (reducir todos los multiplicadores de deltaTime al menos a la mitad)
   - Minimizar cambios bruscos en tamaños (usar factores como 0.85 + 0.20 * sin en lugar de 0.75 + 0.35 * sin)
   - Utilizar la propiedad `will-change-transform` para mejorar el rendimiento
   - Añadir transiciones CSS a todas las propiedades que cambian (transform, opacity, background, etc.)
   - Usar transiciones lineales en lugar de transiciones ease-in-out para movimientos más fluidos
   - Configurar transiciones más rápidas para transform (0.2-0.3s) y más lentas para colores (0.5s)
   - Reducir frecuencia de actualización de tiempos (timeOffset: 0.0002 en lugar de 0.0005)

6. **Conexiones vértices-mouse**:
   - NO usar transiciones CSS en las líneas que conectan vértices con el mouse (eliminar transition en este caso)
   - NO aplicar efectos pulsantes a las líneas basados en la posición (dist/50), ya que causan que las líneas parezcan nunca llegar al mouse
   - Las conexiones siempre deben ser estáticas o tener efectos no dependientes de la distancia (solo el color y opacidad)
   - Usar `width: ${dist}px` exacto sin manipulaciones adicionales para que las líneas tengan exactamente la longitud correcta
   - Evitar factores variables como `Math.sin(pulsePhase + dist/X)` que causan "titilado" y efecto de conexión incompleta
   - Las líneas de conexión deben actualizarse sin animación para seguir instantáneamente al cursor

7. **Efecto Glitch Global (Consideraciones)**:
   - Implementar un glitch en *todo* el texto es complejo y puede afectar performance.
   - Es crucial respetar `prefers-reduced-motion` para accesibilidad.
   - La sincronización entre el efecto visual y el cambio de contenido real es clave.

8. **Modificar Tiempos de Efectos sin Confirmación:** No modificar los tiempos de `languageChangeDelay` (actualmente 250ms) y `visualEffectDuration` (actualmente 600ms) para el efecto glitch de cambio de idioma en `app/page.tsx` a menos que el USER lo pida explícitamente. (USER ajustó estos valores manualmente).

## Configuraciones exitosas

1. **Opacidad de elementos**:
   - Formas orgánicas: entre 0.35 y 0.6 para los colores primarios
   - Formas orgánicas: entre 0.3 y 0.5 para los colores secundarios
   - Aristas del dodecaedro: 0.3 funciona bien

2. **Configuración de animaciones**:
   - Propiedad will-change en CSS mejora el rendimiento
   - Duración ideal para la animación de morphing: 8s
   - Incluir tanto rotación como cambio de escala en la animación
   - Para evitar sincronización de animaciones y mejorar fluidez visual: usar múltiples clases de animación CSS con diferentes intervalos de tiempo y variaciones sutilmente distintas

3. **Desplazamiento de formas**:
   - Usar movimientos entre 10-15 píxeles para moveX y moveY
   - Combinar múltiples funciones sinusoidales con distintas frecuencias
   - Para el cálculo del tamaño: usar una función sinusoidal más lenta (factor 0.75 + 0.35 * sin) en lugar de una más agresiva (factor 0.75 + 0.45 * sin)

4. **Aleatoriedad controlada para efectos naturales**:
   - Valores iniciales aleatorios para rotaciones (Math.random() * Math.PI * 2)
   - Pequeñas variaciones aleatorias en posiciones iniciales (+/- 5 unidades)
   - Variaciones aleatorias en tamaños iniciales (0.9 - 1.1 veces el tamaño base)
   - Fase inicial aleatoria para cada forma orgánica para evitar sincronización de movimientos
   - Vértices con pequeñas asimetrías (variaciones de 0.01 a 0.05 en las coordenadas) para romper la simetría perfecta

5. **Efecto Glitch en Texto (Concepto)**:
   - **Componente Wrapper (`GlitchText`)**: Envolver el texto a "glitchear".
   - **Estado Global/Local**: Manejar `isSwitchingLanguage`.
   - **CSS Keyframes**: Usar `steps()` para saltos bruscos y `transform: translate()` para el shift.
   - **Capas + Colores**: Crear múltiples capas del mismo texto con `position: absolute`, aplicarles colores contrastantes (magenta/cian) y `text-shadow` para aberración cromática.
   - **Sincronización**: Usar `setTimeout` en JS para cambiar el texto *después* de la duración de la animación CSS.
   - **Optimización**: Limitar el número de capas y la complejidad de la animación. Usar `will-change`.

6. **Efecto Glitch de Cambio de Idioma (Título Principal - `app/page.tsx`)**:
    - **Capas:** Texto base (`.base-char`), Aberración Rojo/Azul (pseudo-elementos de `.base-char` con animaciones aleatorias), Glitch Principal Magenta/Cian (pseudo-elementos de `.title-container` con variantes A-E).
    - **Rotura Base (`charBreakAnim`):** Animación rápida (`0.2s`, `steps(12)`) aplicada a `.base-char.char-breaking`, usa `transform` y `clip-path` para simular explosión de fragmentos / tiras.
    - **Aberración Base (`charAberrationRed/Blue_A/B/C`):** Animaciones muy rápidas (`0.04s`) aplicadas a pseudo-elementos de `.base-char` vía clases aleatorias (`.use-aberration-...`), usan `transform` para distorsión/desplazamiento.
    - **Glitch Principal (Variantes A-E):** Animaciones rápidas aplicadas a pseudo-elementos de `.title-container` vía clase aleatoria (`.glitch-variant-...`), usan `transform` y `clip-path`. Opacidad base `0.75` para transparencia.
    - **Temporización:** Efecto visual total dura 600ms (`visualEffectDuration`), cambio de idioma (`setLanguage`) ocurre a los 250ms (`languageChangeDelay`). **(Tiempos ajustados por USER)**.
    - **Activación:** JS añade/quita clases `.glitch-active`, `.glitch-variant-X`, `.char-breaking`, `.use-aberration-...` y aplica `animation-delay` aleatorio a `.base-char`.

7. **Gestión de Idioma y Efecto Glitch:**
   - **Contexto Global (`LanguageContext`):** Maneja `language`, `isSwitchingLanguage`, `initialLanguageDuringSwitch`, y `toggleLanguage`.
   - **Provider:** `LanguageProvider` envuelve el layout en `app/layout.tsx`.
   - **Hook:** `useLanguage` se usa en `app/page.tsx` y `components/header.tsx`.
   - **Aplicación de Efectos (`app/page.tsx`):** Un `useEffect` observa `isSwitchingLanguage` para añadir/quitar clases de glitch y rotura (`.glitch-active`, `.glitch-variant-X`, `.char-breaking`, `.use-aberration-...`) y delays aleatorios.
   - **Botón de Cambio (`components/header.tsx`):** Integrado en el header, a la derecha de la nav, con estilo de píldora. Muestra texto dinámico (EN/ES, Cambiando.../Switching...) basado en el contexto y usa `toggleLanguage`.
   - **Rotura Base (`charBreakAnim`):** Animación (`0.4s`, `steps(6)`) que simula bloques rotos en `.base-char`.
   - **Aberración Base (Roja/Azul):** Animaciones (`0.06s`) aplicadas a pseudo-elementos de `.base-char` vía clases aleatorias (`.use-aberration-...`).
   - **Glitch Principal (Magenta/Cian):** Animaciones aplicadas a pseudo-elementos de `.title-container` vía clase aleatoria (`.glitch-variant-...`). Opacidad `0.75` para transparencia.
   - **Temporización:** Efecto visual total dura 600ms, cambio de idioma ocurre a los 250ms (ajustado por USER).

8. **Botón de Idioma con Efecto "Bleeding Pixels":**
   - **Componente (`BleedingPixels.tsx`):** Genera ~35 píxeles cuadrados (`w-2 h-2`) magenta/cyan que "gotean" desde el botón de idioma.
   - **Posicionamiento:** Se origina a media altura (`top-1/2`) y detrás (`z-[-1]` en el contenedor de píxeles, `z-10` en el botón) del botón de idioma (contenido en un `div relative` en `Header.tsx`).
   - **Generación:** Intervalo de ~50ms, posición horizontal aleatoria `random(10, 80)`, color aleatorio.
   - **Animación (Framer Motion):**
     - Cae una distancia `random(20, 80)` con `ease: "easeIn"`.
     - Duración aleatoria `random(1.2, 2.2)` segundos.
     - Se desvanece (`opacity: 0`) durante la caída.
     - *Próximamente: Se encogerá (`scale`) mientras cae.*
   - **Gestión:** Usa `AnimatePresence` y `setTimeout` para limpiar píxeles del estado.
   - **Botón:** Ancho fijo (`w-14`) y texto directo ("ES"/"EN") para evitar movimiento del layout. El fondo y efecto blur no cambian al desactivarse.

## INFORMACIÓN IMPORTANTE

- Proyecto Next.js con React Three Fiber para crear visualizaciones 3D
- Usando dynamic imports para cargar componentes 3D
- Three.js versión 0.150.1
- @react-three/fiber versión 8.18.0
- Se implementó un dodecaedro usando CSS y JavaScript puro sin Three.js para evitar problemas de compatibilidad
- La implementación usa:
  - Matemáticas de proyección 3D a 2D para simular el efecto 3D
  - Rotación de vértices en el espacio 3D
  - Cálculo de distancias para crear efectos interactivos con el mouse
  - Dibujo de líneas usando elementos DIV rotados
- Se implementó un efecto "frosted glass" (cristal escarchado) global para todos los elementos de la interfaz:
  - Estilo visual consistente con fondo semitransparente, desenfoque y bordes sutiles
  - Aplicado a botones, tarjetas, inputs, textarea, select, footer, y otros componentes
  - Implementado mediante CSS con backdrop-filter y clases de utilidad personalizadas
  - Efecto visual moderno que combina con el fondo dinámico de dodecaedro
  - Solución para navbar: se excluyeron específicamente los elementos header y nav del efecto global, y se usaron clases de anulación (!important) para evitar duplicación
- Los efectos glitch para el cambio de idioma están implementados de la siguiente manera:
  - **Ubicación principal**: El código del efecto glitch está en:
    - CSS: `app/globals.css` (líneas 213-394) define las clases y animaciones
    - JS: `app/page.tsx` (líneas 78-135) maneja la activación de clases y variantes
    - Hook: `hooks/useGlitchEffect.ts` contiene la lógica central del efecto
  
    1. **Glitch Principal (título)**: Utiliza la clase `.title-container.glitch-active` con variantes A-E
       - Utiliza pseudo-elementos `::before` y `::after` con colores magenta y cyan
       - Usa `clip-path` y `transform` para animar fragmentos del texto
       - Las variantes (A-E) tienen diferentes velocidades y tipos de animación
    2. **Rotura de Caracteres**: Clase `.base-char.char-breaking` que divide y rompe los caracteres 
       - Usa animación `charBreakAnim` con `steps()` para efecto cortado
       - Se aplica a los caracteres individuales dentro del contenedor del título
    3. **Aberración Cromática**: Clases `.use-aberration-red-X` y `.use-aberration-blue-X` (donde X es a, b, o c)
       - Crea pseudo-elementos coloridos que se desplazan ligeramente del carácter original
       - Utiliza animaciones infinitas muy rápidas (0.04s-0.1s) para crear el efecto tembloroso
    4. **Línea Completa Glitch**: `.line-glitching-main` (usado en demostraciones)
       - Aplica efecto glitch a una línea completa de texto
    5. **Elementos con Glitch**: El efecto se aplica a los siguientes elementos:
       - Título y subtítulo principal
       - Botones "Ver Proyectos" y "Contacto" en la página principal
       - Elementos de navegación (Home/Inicio, Projects/Proyectos, About/Sobre mí, Contact/Contacto)
       - Botón de cambio de idioma (ES/EN)
  - **Activación**: Los efectos se activan principalmente cuando:
    - Se cambia el idioma de la página (usando el botón en la navegación)
    - Se activan manualmente en la página de demostración (`glitch-demonstration/page.tsx`)
    - Se puede ver en la documentación (`glitch-documentation/page.tsx`)

## ERRORES A NO COMETER

- TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner') - Error en el componente dodecahedron-background.tsx relacionado con React Three Fiber
  - Solución aplicada: 
    - Cambiar `float32BufferAttribute` a `bufferAttribute` con propiedades actualizadas
    - Usar la importación directa de `Vector3` desde 'three' en lugar de `THREE.Vector3`
    - Cambiar `frameloop="always"` a `frameloop="demand"` para mejorar el rendimiento y reducir posibles conflictos
    - **Solución definitiva:** Reemplazar completamente el componente Three.js por un componente React básico usando CSS para evitar problemas de compatibilidad entre la versión de React (18.2.0) y @react-three/fiber (8.18.0)
    - Nota importante: Hay problemas de compatibilidad entre React 18 y la versión actual de react-three-fiber, lo que causa errores de 'ReactCurrentOwner'
    - **Nueva solución:** Implementar visualizaciones 3D sin Three.js utilizando matemáticas de proyección y transformaciones CSS para un efecto similar

- Duplicación del efecto frosted glass en el navbar
  - Causa: Al aplicar el estilo frosted-glass a todos los elementos nav y header, se duplica con el estilo ya existente en el navbar
  - Solución:
    - Excluir específicamente header y nav de las reglas globales de frosted-glass 
    - Usar clases con !important para anular cualquier estilo aplicado automáticamente
    - Mantener el estilo personalizado original del navbar 

- Errores de tipo en useGlitchEffect al pasar referencias React
  - Causa: El tipo `ElementRef<T extends HTMLElement = HTMLElement>` era restrictivo y no aceptaba `null` que es parte de los RefObjects de React.
  - Síntoma: Errores del tipo "Argument of type 'RefObject<HTMLDivElement | null>' is not assignable to parameter of type 'ElementRef<HTMLElement>'."
  - Solución:
    - Cambiar la definición de tipo por `React.RefObject<HTMLElement>` directamente en los métodos `applyGlitchEffect` y `cleanupGlitchEffect`
    - Eliminar los genéricos que complicaban la tipificación y usar una tipificación más simple y compatible con las referencias de React
    - Mantener la verificación de `if (!elementRef.current) return` para manejar el caso null de forma segura

- Problemas con el efecto glitch en diferentes páginas
  - Causa: Los estilos CSS para el efecto glitch estaban definidos de manera inconsistente entre páginas.
  - Síntoma: Al cambiar de idioma, el efecto glitch se veía incompleto en páginas secundarias, con las distorsiones cortadas.
  - Solución:
    - Garantizar que todos los contenedores del efecto glitch tengan `overflow: visible !important`
    - Agregar propiedades globales para `.title-container` y `.base-char` en `globals.css`
    - Eliminar estilos locales en `page.tsx` que podrían estar sobrescribiendo los globales
    - Asegurar que todos los elementos que utilizan el efecto compartan las mismas propiedades base de CSS
    - Verificar que los pseudo-elementos también tengan configurado correctamente el `overflow: visible`

- Efecto glitch recortado en páginas específicas (projects, about, contact)
  - Causa: Diferencias en la estructura DOM entre home y otras páginas causaban que el efecto glitch se recortara.
  - Síntoma: En home el efecto se veía correctamente con las distorsiones saliendo del texto, mientras que en otras páginas el efecto se quedaba confinado al área del texto.
  - Soluciones intentadas:
    - Agregar `overflow: visible !important` a todos los elementos del DOM que contienen o rodean el efecto glitch.
    - Garantizar que `header`, `nav`, `a`, y todos los contenedores anidados tengan `overflow: visible`.
    - Agregar tanto clases CSS como estilos inline para asegurar que ningún componente sobrescriba esta propiedad.
    - Asignar `z-index` altos (9999) a los elementos con el efecto glitch para garantizar que aparezcan por encima de otros elementos.
    - Aplicar `transform-style: preserve-3d` y `backface-visibility: hidden` para mejorar el renderizado de las transformaciones.
    - Verificar que `layout.tsx` no tenga limitaciones de overflow en el body o contenedores principales.
    - Usar un enfoque basado en estados: crear una variable de estado `headerGlitchActive` en el componente Header.
    - Esta variable se activa/desactiva junto con `isSwitchingLanguage` para controlar cuándo aplicar los estilos especiales.
    - Agregar clases específicas en CSS (`.header-glitch-active` y `.nav-glitch-active`) que se aplican solo durante el efecto.
    - Estas clases usan selectores simples con `overflow: visible !important` para asegurar que el efecto glitch se muestre correctamente.
  - **Solución final adoptada**:
    - Se decidió eliminar completamente el efecto glitch del navbar debido a problemas de inconsistencia visual entre páginas.
    - Al tratar de arreglar el recorte del efecto glitch, se alteraba inadvertidamente su apariencia visual.
    - Los intentos de restaurar la apariencia original mientras se solucionaba el recorte resultaron en comportamientos impredecibles.
    - La estructura DOM diferente en cada página hacía difícil mantener una apariencia consistente del efecto.
    - Se optó por mantener el diseño limpio del navbar sin efectos especiales.

## CONFIGURACIONES DE FORMAS ORGÁNICAS

- **Formas en esquina superior izquierda**:
  - Combinación de dos formas azuladas: una grande (baseSize: 50) y una pequeña acompañante (baseSize: 25)
  - Posicionamiento usando posX y posY negativos para colocarlas en la esquina superior izquierda
  - Tonalidades azules usando valores de color: 'rgba(59, 130, 246, 0.65)', 'rgba(37, 99, 235, 0.5)', 'rgba(96, 165, 250, 0.5)', etc.
  - PulseSpeed de 0.65 a 0.8 para crear un ritmo ligeramente diferente al resto de formas
  - Mayor opacidad (0.5-0.65) para destacar los tonos azules

- **Mejores combinaciones de colores**:
  - Púrpuras y violetas funcionan bien para el centro y parte inferior derecha
  - Azules y celestes para la esquina superior izquierda
  - Las combinaciones de gradientes con diferencia de 0.1-0.2 en opacidad entre color1 y color2 crean un efecto más suave
  - Usar values de pulseSpeed ligeramente diferentes para cada forma crea un efecto de "respiración" no sincronizada más orgánico 

- **Puntos focales dinámicos para gradientes**:
  - Usar posiciones focales dinámicas (focalX, focalY) en los gradientes radiales para crear un efecto más orgánico
  - Vincular los puntos focales con la rotación del dodecaedro (rotationX, rotationY) para que las formas parezcan interactuar con él
  - Añadir un factor de variación por índice (index * 0.2, index * 0.5) para que cada forma tenga un comportamiento ligeramente distinto
  - Los valores óptimos para el cálculo: 50 + Math.sin(pulsePhase + rotationX + index * 0.2) * 30

- **Animaciones CSS alternativas para formas orgánicas**:
  - Crear múltiples clases de animación (animate-morph, animate-morph-alt1, animate-morph-alt2) con diferentes tiempos y valores
  - Usar el índice de cada forma para asignar diferentes clases de animación (index % 3) para evitar que todas se animen sincronizadamente
  - Mantener el mismo tipo de efecto pero con variaciones sutiles en los keyframes para crear un conjunto más cohesivo pero natural
  - Rotar las formas más lentamente (customRotation * 0.1 en lugar de customRotation) para un movimiento más suave y natural

## EFECTOS INTERACTIVOS CON TEXTO

1. **Líneas energéticas hacia el texto**:
   - Crear un efecto donde el mouse emite líneas hacia las letras
   - Implementar efectos de pulsación con animaciones CSS keyframes
   - Añadir aleatoriedad a las líneas para que se sientan más orgánicas
   - Usar `setTimeout` para crear efectos de desvanecimiento gradual

2. **Campo de fuerza visual**:
   - Implementar un área brillante alrededor del cursor
   - Usar radial-gradient y blur para crear un efecto de halo
   - Animar el brillo de los elementos con animaciones CSS alternantes
   - Aplicar escalado suave para efectos de aparecer/desaparecer

3. **Optimizaciones de rendimiento**:
   - Limitar el número de elementos DOM creados (máximo ~15 líneas)
   - Eliminar elementos gradualmente para mejorar la fluidez
   - Usar transiciones CSS en lugar de cambios abruptos
   - Aplicar los efectos más intensos solo a los elementos cercanos al cursor 


## MODIFICACIONES FUTURAS
   - En el background las lineas que salen de los vertices hacia el mouse no salen DE LOS VERTICES, estan desfazadas de los vertices, la posicion de "entrada" al mouse esta bien, pero la de "salida" de los vertices esta levemente mal