# Documentación Técnica: Sistema de Cambio de Idioma y Efectos Visuales Glitch

## Introducción

Este documento detalla el funcionamiento interno del sistema de cambio de idioma implementado en la aplicación, así como la orquestación y ejecución de los efectos visuales tipo "glitch" que acompañan la transición. El sistema está diseñado para ser modular y gestionado centralmente a través de un Contexto de React.

## 1. Contexto de Idioma (`LanguageContext`)

El núcleo del sistema reside en un Contexto de React que centraliza el estado y la lógica del cambio de idioma.

*   **Archivo:** `contexts/LanguageContext.tsx`
*   **Propósito:** Proporcionar un estado global para el idioma actual (`language`), el estado de la transición (`isSwitchingLanguage`, `initialLanguageDuringSwitch`), y la función para iniciar el cambio (`toggleLanguage`).

### 1.1. Componentes Clave

#### 1.1.1. `LanguageContext`
Define la estructura del contexto que será compartida.

```typescript
// contexts/LanguageContext.tsx (Snippet)
interface LanguageContextProps {
  language: 'en' | 'es';
  isSwitchingLanguage: boolean;
  initialLanguageDuringSwitch: 'en' | 'es' | null;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);
```

#### 1.1.2. `LanguageProvider`
Componente HOC (Higher-Order Component) que envuelve la aplicación (o partes de ella) y provee el estado y las funciones del contexto a sus descendientes. Gestiona el estado interno usando `useState` y `useRef`.

*   **Integración:** Se utiliza en `app/layout.tsx` para envolver el contenido principal de la página.

```typescript
// app/layout.tsx (Snippet)
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ... */}
      <body>
        <ThemeProvider> {/* Asumiendo ThemeProvider existente */}
          <LanguageProvider> {/* Envoltura con LanguageProvider */}
            <Header />
            <main>{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

#### 1.1.3. `useLanguage` Hook
Hook personalizado para facilitar el consumo del contexto en los componentes funcionales, asegurando que se use dentro de un `LanguageProvider`.

```typescript
// contexts/LanguageContext.tsx (Snippet)
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

### 1.2. Estado Gestionado

*   `language ('en' | 'es')`: Almacena el idioma actualmente seleccionado.
*   `isSwitchingLanguage (boolean)`: Indica si una transición de idioma está en curso. Es `true` desde que se inicia el cambio hasta que finalizan los efectos visuales. Controla la desactivación del botón y la activación/desactivación de los efectos.
*   `initialLanguageDuringSwitch ('en' | 'es' | null)`: Almacena cuál era el idioma *antes* de iniciar el cambio actual. Se guarda para permitir potencialmente lógicas o textos específicos *durante* la transición basados en el idioma original, aunque actualmente esta funcionalidad no se explota.

### 1.3. Función `toggleLanguage`

Esta es la función clave que orquesta todo el proceso de cambio.

*   **Prevención de Clics Múltiples:** Utiliza `isSwitchingLanguageRef.current` para evitar que se inicie un nuevo cambio si ya hay uno en curso.
*   **Inicio de Transición:**
    *   Establece `isSwitchingLanguage` a `true`.
    *   Guarda el idioma actual en `initialLanguageDuringSwitch`.
*   **Cambio de Idioma (Retrasado):** Usa `setTimeout` para cambiar el estado `language` después de un retardo predefinido (`EFFECT_TEXT_CHANGE_DELAY` - 250ms). Este retardo permite que los efectos visuales comiencen *antes* de que el texto cambie efectivamente.
*   **Fin de Transición (Retrasado):** Usa otro `setTimeout` para establecer `isSwitchingLanguage` de nuevo a `false` después de la duración total de los efectos visuales (`EFFECT_TOTAL_DURATION` - 600ms).
*   **Limpieza:** Usa `useRef` para almacenar los IDs de los `setTimeout` y los limpia en el `useEffect` de desmontaje del provider para evitar fugas de memoria.

```typescript
// contexts/LanguageContext.tsx (Snippet - Lógica simplificada de toggleLanguage)

const EFFECT_TEXT_CHANGE_DELAY = 250; // ms - Momento del cambio de texto
const EFFECT_TOTAL_DURATION = 600;    // ms - Duración total del efecto visual

// ... dentro de LanguageProvider ...
const isSwitchingLanguageRef = useRef(false);
const timeoutIdTextChange = useRef<NodeJS.Timeout | null>(null);
const timeoutIdEffectEnd = useRef<NodeJS.Timeout | null>(null);

const toggleLanguage = useCallback(() => {
  if (isSwitchingLanguageRef.current) {
    return; // Prevenir clics múltiples
  }

  isSwitchingLanguageRef.current = true;
  const initialLang = language;
  setInitialLanguageDuringSwitch(initialLang);
  setIsSwitchingLanguage(true);

  // Limpiar timeouts previos por si acaso (aunque la guarda debería prevenirlo)
  if (timeoutIdTextChange.current) clearTimeout(timeoutIdTextChange.current);
  if (timeoutIdEffectEnd.current) clearTimeout(timeoutIdEffectEnd.current);

  // Cambiar el idioma después de un delay
  timeoutIdTextChange.current = setTimeout(() => {
    setLanguage(prevLanguage => (prevLanguage === 'en' ? 'es' : 'en'));
  }, EFFECT_TEXT_CHANGE_DELAY);

  // Finalizar el estado de switching después de la duración total del efecto
  timeoutIdEffectEnd.current = setTimeout(() => {
    setIsSwitchingLanguage(false);
    setInitialLanguageDuringSwitch(null);
    isSwitchingLanguageRef.current = false;
  }, EFFECT_TOTAL_DURATION);

}, [language]);

// ... useEffect de limpieza ...
useEffect(() => {
    return () => {
      if (timeoutIdTextChange.current) clearTimeout(timeoutIdTextChange.current);
      if (timeoutIdEffectEnd.current) clearTimeout(timeoutIdEffectEnd.current);
    };
}, []);
```

## 2. Botón de Cambio de Idioma (`Header`)

El botón en el Header actúa como el disparador de la interfaz de usuario para el cambio de idioma.

*   **Archivo:** `components/header.tsx`
*   **Propósito:** Mostrar el idioma opuesto al actual y llamar a `toggleLanguage` al hacer clic.

### 2.1. Integración con Contexto

Consume el contexto usando `useLanguage` para obtener `language`, `isSwitchingLanguage` y `toggleLanguage`.

```typescript
// components/header.tsx (Snippet)
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { language, isSwitchingLanguage, toggleLanguage } = useLanguage();
  // ... resto del componente ...
}
```

### 2.2. Renderizado y Funcionalidad

*   **Texto Dinámico:** Muestra "ES" si `language` es 'en', y "EN" si es 'es'.
*   **Animación de Texto:** Utiliza `AnimatePresence` y `motion.span` de `framer-motion` para una transición suave (fade y ligero desplazamiento vertical) entre "ES" y "EN". La `key` del `motion.span` se basa en `language` para disparar la animación de salida/entrada.
*   **Llamada a `toggleLanguage`:** El atributo `onClick` del botón llama directamente a `toggleLanguage`.
*   **Estado Desactivado:** El atributo `disabled` se establece a `true` cuando `isSwitchingLanguage` es `true`. Las clases CSS `text-white/50` y `cursor-not-allowed` se aplican condicionalmente para dar feedback visual, **sin** alterar la opacidad general del botón para no afectar el efecto visual de fondo (blur/frosted glass).
*   **Ancho Fijo:** Tiene una clase `w-14` para asegurar que su tamaño no cambie entre "ES" y "EN", evitando movimientos del layout.

```typescript
// components/header.tsx (Snippet - Botón)
<button
  onClick={toggleLanguage}
  disabled={isSwitchingLanguage}
  className={cn(
    "relative z-10 flex h-12 items-center justify-center rounded-full w-14 px-4 text-sm font-medium transition-colors", // Ancho fijo w-14
    "border border-white/10 bg-black/40 backdrop-blur-md",
    "shadow-[0_4px_12px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.1)]",
    isSwitchingLanguage
      ? "text-white/50 cursor-not-allowed" // Estado desactivado sin opacity
      : "text-white/80 hover:text-white hover:bg-white/10"
  )}
  aria-label={language === 'en' ? "Switch language to Spanish" : "Cambiar idioma a Inglés"}
>
  <AnimatePresence mode="wait" initial={false}>
    <motion.span
      key={language} // Key basada en el idioma final
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      transition={{ duration: 0.15 }}
      className="inline-block whitespace-nowrap"
    >
      {/* Texto directo sin estado intermedio */}
      {language === 'en' ? 'ES' : 'EN'}
    </motion.span>
  </AnimatePresence>
</button>
// {/* <BleedingPixels /> */} {/* Efecto comentado actualmente */}
```

## 3. Orquestación de Efectos Visuales (`Home Page`)

La página principal (`Home`) es responsable de aplicar y limpiar las clases CSS que disparan los efectos visuales en el título cuando cambia el estado `isSwitchingLanguage`.

*   **Archivo:** `app/page.tsx`
*   **Propósito:** Observar el estado `isSwitchingLanguage` del contexto y manipular las clases CSS del contenedor del título y sus caracteres individuales.

### 3.1. Hook `useEffect` Clave

Un `useEffect` se suscribe a los cambios en `isSwitchingLanguage`.

```typescript
// app/page.tsx (Snippet - useEffect principal)
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef, useEffect } from "react";

export default function Home() {
  const { language, isSwitchingLanguage } = useLanguage();
  const titleRef = useRef<HTMLDivElement>(null);
  const currentGlitchVariant = useRef<string | null>(null);
  const addedAberrationClassesMap = useRef(new Map<HTMLElement, string[]>());

  useEffect(() => {
    if (!titleRef.current) return;
    const container = titleRef.current;
    const chars = container.querySelectorAll('.base-char');

    if (isSwitchingLanguage) {
      // --- Aplicar Efectos ---

      // 1. Glitch Principal (Contenedor)
      const variants = ['a', 'b', 'c', 'd', 'e'];
      const randomIndex = Math.floor(Math.random() * variants.length);
      const chosenVariant = `glitch-variant-${variants[randomIndex]}`;
      currentGlitchVariant.current = chosenVariant;
      container.classList.add('glitch-active', chosenVariant);

      // 2. Rotura y Aberración (Caracteres)
      const redAberrationClasses = ['use-aberration-red-a', 'use-aberration-red-b', 'use-aberration-red-c'];
      const blueAberrationClasses = ['use-aberration-blue-a', 'use-aberration-blue-b', 'use-aberration-blue-c'];
      addedAberrationClassesMap.current.clear();

      chars.forEach(char => {
        const element = char as HTMLElement;
        const classesToAdd: string[] = ['char-breaking']; // Aplicar siempre rotura

        // Aplicar aberración roja aleatoria
        const randomRedIndex = Math.floor(Math.random() * redAberrationClasses.length);
        const chosenRedClass = redAberrationClasses[randomRedIndex];
        classesToAdd.push(chosenRedClass);

        // Aplicar aberración azul aleatoria
        const randomBlueIndex = Math.floor(Math.random() * blueAberrationClasses.length);
        const chosenBlueClass = blueAberrationClasses[randomBlueIndex];
        classesToAdd.push(chosenBlueClass);

        element.classList.add(...classesToAdd);
        addedAberrationClassesMap.current.set(element, classesToAdd); // Guardar clases aplicadas

        // Aplicar delay aleatorio a la rotura
        element.style.animationDelay = `${Math.random() * 0.1}s`;
      });

    } else {
      // --- Limpiar Efectos ---

      // 1. Limpiar Glitch Principal
      if (currentGlitchVariant.current) {
        container.classList.remove('glitch-active', currentGlitchVariant.current);
        currentGlitchVariant.current = null;
      }

      // 2. Limpiar Rotura y Aberración (Caracteres)
      addedAberrationClassesMap.current.forEach((classesToRemove, element) => {
         element.classList.remove(...classesToRemove);
         element.style.animationDelay = ''; // Limpiar delay
      });
      addedAberrationClassesMap.current.clear(); // Limpiar mapa
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitchingLanguage]); // Dependencia clave
  // ... resto del componente ...
}
```

### 3.2. Lógica de Aplicación (`isSwitchingLanguage === true`)

1.  **Referencia:** Obtiene la referencia al `div` contenedor del título (`titleRef`).
2.  **Glitch Contenedor:** Añade la clase `glitch-active` y una clase de variante aleatoria (`glitch-variant-X`) al contenedor para activar el efecto principal. Guarda la variante elegida para poder limpiarla después.
3.  **Efectos Caracteres:**
    *   Selecciona todos los elementos con clase `.base-char` (cada carácter envuelto).
    *   A cada carácter:
        *   Añade la clase `char-breaking` para activar la animación de rotura.
        *   Añade una clase aleatoria `use-aberration-red-X` y `use-aberration-blue-X` para activar las animaciones de aberración roja y azul en sus pseudo-elementos.
        *   Aplica un `animation-delay` aleatorio (entre 0 y 0.1s) para desincronizar ligeramente el inicio de la animación de rotura entre caracteres.
        *   Guarda las clases específicas añadidas a *este* carácter en un `Map` (`addedAberrationClassesMap`) para poder eliminarlas selectivamente después.

### 3.3. Lógica de Limpieza (`isSwitchingLanguage === false`)

1.  **Glitch Contenedor:** Elimina `glitch-active` y la clase de variante específica (`currentGlitchVariant.current`) del contenedor.
2.  **Efectos Caracteres:**
    *   Itera sobre el `Map` (`addedAberrationClassesMap`) que contiene las clases añadidas a cada carácter.
    *   Para cada carácter, elimina *exactamente* las clases que se le añadieron (`char-breaking`, `use-aberration-...`).
    *   Limpia el `animation-delay` del estilo inline del carácter.
    *   Vacía el `Map` para la próxima activación.

## 4. Efectos Visuales Detallados (CSS)

Las clases aplicadas por JavaScript activan animaciones y estilos definidos principalmente en `app/globals.css`.

*   **Archivo Principal:** `app/globals.css`

*(Nota: Los valores exactos de `transform`, `clip-path` y otros dentro de los `@keyframes` en los siguientes snippets son representativos del mecanismo. La implementación final puede contener ligeras variaciones en estos valores, pero la lógica y estructura descritas son las aplicadas.)*

### 4.1. Glitch Principal (Contenedor)

Este efecto crea dos capas (magenta y cyan) sobre el texto principal, desplazadas y recortadas erráticamente.

*   **Selector Base:** `.title-container.glitch-active`
*   **Pseudo-elementos:** Se utilizan `::before` (magenta) y `::after` (cyan).
*   **Contenido:** Ambos pseudo-elementos toman su texto del atributo `data-text` del `.title-container`. Este atributo se actualiza en `page.tsx` con el texto completo del título actual (`${titlePart1} ${titlePart2}`).
    ```typescript
    // app/page.tsx (Snippet - Generación data-text)
    const currentTitleText = `${texts[language].title1} ${texts[language].title2}`;
    // ...
    <div ref={titleRef} data-text={currentTitleText} className="title-container ...">
      {/* ... */}
    </div>
    ```
*   **Estilo:** Posicionamiento absoluto para superponerse, `opacity: 0.75` para transparencia.
*   **Animaciones:** Se aplican animaciones separadas a `::before` y `::after` (ej. `glitchAnim1`, `glitchAnim2`). Estas animaciones manipulan `transform: translateX()` y `clip-path` para crear el efecto de desplazamiento y recorte.
*   **Variantes:** Las clases `glitch-variant-X` (añadidas aleatoriamente en `page.tsx`) probablemente modifican ligeramente el `animation-name` o `animation-timing-function` para variar sutilmente el patrón del glitch en cada activación.

```css
/* app/globals.css (Snippet - Glitch Principal Conceptual) */
.title-container.glitch-active::before,
.title-container.glitch-active::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  opacity: 0.75;
  background: none; /* Asegurar que no tape el texto original */
}

.title-container.glitch-active::before {
  color: magenta;
  animation: glitchAnim1 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite alternate;
  /* La variante podría cambiar la animación aquí */
}

.title-container.glitch-active::after {
  color: cyan;
  animation: glitchAnim2 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite alternate-reverse;
   /* La variante podría cambiar la animación aquí */
}

@keyframes glitchAnim1 {
  0% { transform: translate(0); clip-path: inset(10% 0 80% 0); }
  /* ... otros pasos con diferentes translate y clip-path ... */
  100% { transform: translate(-3px, -2px); clip-path: inset(40% 0 30% 0); }
}

@keyframes glitchAnim2 {
   0% { transform: translate(0); clip-path: inset(70% 0 10% 0); }
  /* ... otros pasos con diferentes translate y clip-path ... */
  100% { transform: translate(3px, 2px); clip-path: inset(20% 0 50% 0); }
}

/* Ejemplo de variante */
.title-container.glitch-active.glitch-variant-b::before {
  animation-name: glitchAnimVariantB1; /* Usa otra animación o timing */
}
```

### 4.2. Rotura de Caracteres (`.base-char`)

Este efecto simula que cada carácter se rompe en fragmentos por un instante.

*   **Selector:** `.base-char.char-breaking` (se aplica a cada `<span>` que envuelve un carácter).
*   **Animación:** `charBreakAnim`.
*   **Mecanismo:**
    *   `steps(6, end)`: Divide la animación en 6 fotogramas discretos, creando un efecto "cortado".
    *   `transform`: Aplica pequeñas translaciones, rotaciones y/o escalas en cada paso.
    *   `clip-path`: Recorta el carácter de diferentes maneras en cada paso para simular fragmentos.
*   **Duración:** `0.4s`. Se ejecuta una sola vez.
*   **Desincronización:** El `animation-delay` aleatorio (0-0.1s) aplicado inline desde `page.tsx` hace que cada carácter comience su animación de rotura en un momento ligeramente diferente, creando un efecto más caótico.

```css
/* app/globals.css (Snippet - Rotura de Caracteres) */
.base-char.char-breaking {
  animation: charBreakAnim 0.4s steps(6, end) forwards;
}

@keyframes charBreakAnim {
  0%   { opacity: 1; transform: translate(0, 0) scale(1); clip-path: inset(0 0 0 0); }
  20%  { opacity: 0.8; transform: translate(-1px, 1px) scale(1.05) rotate(-2deg); clip-path: inset(0 50% 50% 0); }
  40%  { opacity: 0.6; transform: translate(1px, -1px) scale(0.95) rotate(1deg); clip-path: inset(50% 0 0 50%); }
  60%  { opacity: 0.5; transform: translate(-2px, -1px) scale(1.1) rotate(3deg); clip-path: inset(30% 30% 30% 30%); }
  80%  { opacity: 0.3; transform: translate(2px, 1px) scale(0.9) rotate(-2deg); clip-path: inset(0 0 0 0); } /* Puede volver a ser visible brevemente */
  100% { opacity: 1; transform: translate(0, 0) scale(1); clip-path: inset(0 0 0 0); } /* Vuelve a la normalidad */
}
```

### 4.3. Aberración Cromática (`.base-char`)

Crea halos rojo y azul desalineados alrededor de cada carácter.

*   **Selectores:** `.base-char.use-aberration-red-X::before`, `.base-char.use-aberration-blue-X::after` (las clases `use-aberration-...` se aplican aleatoriamente en `page.tsx`).
*   **Pseudo-elementos:** `::before` (rojo) y `::after` (azul).
*   **Contenido:** Ambos toman su contenido del atributo `data-char` del `<span>` `.base-char`. Este atributo se establece en la función `wrapChars` en `page.tsx`. Es importante usar `data-char` y no `content: attr(data-text)` para que funcione por carácter.
    ```typescript
    // app/page.tsx (Snippet - wrapChars)
    const wrapChars = (text: string) => {
      return text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="base-char inline-block"
          data-char={char === ' ' ? '\u00A0' : char} // Atributo data-char
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    };
    ```
*   **Estilo:** Posicionamiento absoluto para superponerse.
*   **Animaciones:** Se aplican animaciones distintas y muy cortas (`0.06s`) a cada variante (ej. `charAberrationRedA`, `charAberrationBlueB`). Estas animaciones usan `transform` (translateX, translateY, scale, skew) para crear un rápido "jitter" o desalineación. Son `infinite` para mantenerse activas durante toda la transición.
*   **Aleatoriedad:** La elección aleatoria de las clases `use-aberration-...` en `page.tsx` hace que el patrón exacto de aberración varíe entre caracteres y entre activaciones.

```css
/* app/globals.css (Snippet - Aberración Cromática Conceptual) */
.base-char::before,
.base-char::after {
  content: attr(data-char); /* Usa data-char por caracter */
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Detrás del carácter principal */
}

.base-char.use-aberration-red-a::before { color: red; animation: charAberrationRedA 0.06s linear infinite; }
.base-char.use-aberration-red-b::before { color: red; animation: charAberrationRedB 0.06s linear infinite; }
/* ... otras variantes rojas ... */

.base-char.use-aberration-blue-a::after { color: blue; animation: charAberrationBlueA 0.06s linear infinite; }
.base-char.use-aberration-blue-b::after { color: blue; animation: charAberrationBlueB 0.06s linear infinite; }
/* ... otras variantes azules ... */


@keyframes charAberrationRedA {
  0%, 100% { transform: translate(-1px, 0px); }
  50%      { transform: translate(0.5px, -0.5px) skewX(-5deg); }
}
@keyframes charAberrationBlueB {
  0%, 100% { transform: translate(1px, 0px); }
  50%      { transform: translate(-0.5px, 0.5px) skewX(5deg); }
}
/* ... otras definiciones de keyframes ... */
```

## 5. Temporización Resumida

El flujo temporal del cambio de idioma es el siguiente:

1.  **0ms:** Usuario hace clic. `toggleLanguage` se ejecuta.
    *   `isSwitchingLanguage` se pone a `true`.
    *   `useEffect` en `page.tsx` reacciona:
        *   Aplica `glitch-active` y variante al contenedor (inicia animaciones glitch).
        *   Aplica `char-breaking`, `use-aberration-...` y `animation-delay` a caracteres (inicia animaciones de rotura y aberración de forma desincronizada).
2.  **~0-100ms:** Comienzan a verse los efectos de rotura y aberración debido a los delays aleatorios. El glitch principal también está activo.
3.  **250ms:** Se ejecuta el primer `setTimeout` en `toggleLanguage`.
    *   El estado `language` cambia ('en' -> 'es' o viceversa).
    *   El texto del título y el botón se actualizan para reflejar el nuevo idioma.
4.  **400ms:** La animación `charBreakAnim` (0.4s) completa su ciclo para la mayoría de los caracteres (considerando el delay máximo de 0.1s). Los caracteres vuelven a su estado normal, pero la aberración y el glitch principal continúan.
5.  **600ms:** Se ejecuta el segundo `setTimeout` en `toggleLanguage`.
    *   `isSwitchingLanguage` se pone a `false`.
    *   `useEffect` en `page.tsx` reacciona:
        *   Elimina `glitch-active` y variante del contenedor (detiene animación glitch).
        *   Elimina `char-breaking` y `use-aberration-...` de los caracteres (detiene animación de aberración y asegura limpieza). Limpia `animation-delay`.
6.  **>600ms:** Todos los efectos visuales han cesado. La interfaz muestra el nuevo idioma.

---

## Conclusión

Este diseño combina un manejo centralizado del estado del idioma mediante React Context con una orquestación basada en clases CSS para aplicar efectos visuales complejos de forma modular. La separación de la lógica de estado, la activación de efectos (JavaScript) y la definición de las animaciones (CSS) permite una gestión clara y una futura extensibilidad del sistema, asegurando una experiencia de usuario dinámica durante las transiciones de idioma.
