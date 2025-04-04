'use client'

import React, { createContext, useContext, useRef, useCallback, useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Terminal } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Componente para mostrar bloques de código
const CodeBlock = ({ language, code }: { language: string; code: string }) => (
  <pre className="rounded-md bg-slate-950 p-4 my-2 overflow-x-auto">
    <code className={`language-${language} text-sm text-white`}>
      {code}
    </code>
  </pre>
)

// --- Componente de Ejemplo Interactivo: Botón de Idioma ---
const LanguageButtonExample = () => {
  const [exampleLang, setExampleLang] = useState<'en' | 'es'>('en');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    // Simula el delay y el cambio
    setTimeout(() => {
      setExampleLang(prev => (prev === 'en' ? 'es' : 'en'));
      setIsAnimating(false);
    }, 150); // Delay corto para la animación del botón
  };

  // Devuelve solo el texto y el botón, sin el div contenedor
  return (
    <>
      <p className="text-sm text-muted-foreground mb-4 text-center"> 
        Haz clic en el botón para ver la animación:
      </p>
      <button
        onClick={handleClick}
        disabled={isAnimating}
        className={cn(
          "relative z-10 flex h-12 items-center justify-center rounded-full w-14 px-4 text-sm font-medium transition-colors",
          "border border-white/10 bg-black/40 backdrop-blur-md",
          "shadow-[0_4px_12px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.1)]",
          isAnimating
            ? "text-white/50 cursor-not-allowed"
            : "text-white/80 hover:text-white hover:bg-white/10"
        )}
        aria-label="Ejemplo de cambio de idioma"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={exampleLang} // Key basada en el idioma
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="inline-block whitespace-nowrap"
          >
            {exampleLang === 'en' ? 'ES' : 'EN'}
          </motion.span>
        </AnimatePresence>
      </button>
    </>
  );
};

// --- Componente de Ejemplo Interactivo: Efecto Hover ---
const HoverEffectExample = () => {
  const areaRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!areaRef.current) return;
    const rect = areaRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Mueve el mouse sobre el área gris:
      </p>
      <div
        ref={areaRef}
        className="relative flex h-20 w-56 items-center justify-center rounded-lg border border-white/20 bg-gray-700/50 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <span className="text-xs text-white/50 z-10">Área de Hover</span>
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-full opacity-70"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
                filter: "blur(8px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// --- Utilidad para envolver caracteres (necesaria para ejemplos 4.2 y 4.3) ---
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

// --- Componente de Ejemplo Interactivo: Glitch Principal ---
const GlitchEffectExample = () => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<string | null>(null);
  const textToGlitch = "GLITCH ME";

  const toggleGlitch = () => {
    if (!isGlitching) {
      const variants = ['a', 'b', 'c', 'd', 'e'];
      const randomIndex = Math.floor(Math.random() * variants.length);
      const chosenVariant = `glitch-variant-${variants[randomIndex]}`;
      setCurrentVariant(chosenVariant);
    } else {
      setCurrentVariant(null);
    }
    setIsGlitching(!isGlitching);
  };

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Haz clic en el botón para activar/desactivar el efecto glitch:
      </p>
      <div 
        className={`title-container text-2xl font-bold mb-4 text-center ${isGlitching ? 'glitch-active' : ''} ${currentVariant ?? ''}`}
        data-text={textToGlitch} // Necesario para los pseudo-elementos
        style={{
          // Forzamos colores para que se vean los pseudo-elementos sobre fondo oscuro
          color: 'white', 
          // Necesitamos asegurar que las variables CSS de los colores de glitch estén definidas
          // o usar colores fijos aquí si no vienen de globals.css correctamente.
          // @ts-ignore
          '--glitch-color-1': 'magenta',
          // @ts-ignore
          '--glitch-color-2': 'cyan',
        }}
      >
        {textToGlitch}
      </div>
      <button
        onClick={toggleGlitch}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium",
          isGlitching
            ? "bg-red-600 hover:bg-red-700 text-white"
            : "bg-green-600 hover:bg-green-700 text-white"
        )}
      >
        {isGlitching ? 'Desactivar Glitch' : 'Activar Glitch'}
      </button>
    </>
  );
};

// --- Componente de Ejemplo Interactivo: Rotura de Caracteres ---
const CharacterBreakExample = () => {
  const [isBreaking, setIsBreaking] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const textToBreak = "BREAK ME";
  const animationDuration = 400; // ms, igual que la animación CSS
  const maxDelay = 100; // ms, igual que en el useEffect original

  const triggerBreak = () => {
    if (!textRef.current || isBreaking) return;
    setIsBreaking(true);

    const chars = textRef.current.querySelectorAll('.base-char');
    const timeouts: NodeJS.Timeout[] = [];

    chars.forEach(char => {
      const element = char as HTMLElement;
      // Aplicar clase y delay aleatorio
      element.classList.add('char-breaking');
      const randomDelay = Math.random() * maxDelay;
      element.style.animationDelay = `${randomDelay / 1000}s`;

      // Programar limpieza después de la duración + delay máximo
      const timeoutId = setTimeout(() => {
        element.classList.remove('char-breaking');
        element.style.animationDelay = '';
      }, animationDuration + maxDelay);
      timeouts.push(timeoutId);
    });

    // Limpiar el estado de isBreaking y los timeouts restantes
    const finalTimeout = setTimeout(() => {
      setIsBreaking(false);
    }, animationDuration + maxDelay + 50); // Un poco más de margen
    timeouts.push(finalTimeout);

    // Asegurar que todos los timeouts se limpien si el componente se desmonta
    return () => {
      timeouts.forEach(clearTimeout);
    };
  };

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Haz clic en el botón para activar el efecto de rotura:
      </p>
      <div 
        ref={textRef}
        className="text-2xl font-bold mb-4 text-center text-white"
        aria-label={textToBreak}
      >
        {wrapChars(textToBreak)} {/* Usar wrapChars */}
      </div>
      <button
        onClick={triggerBreak}
        disabled={isBreaking}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium text-white",
          isBreaking
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-purple-600 hover:bg-purple-700"
        )}
      >
        {isBreaking ? 'Rompiendo...' : 'Activar Rotura'}
      </button>
    </>
  );
};

// --- Componente de Ejemplo Interactivo: Aberración Cromática ---
const ChromaticAberrationExample = () => {
  const [isAberrating, setIsAberrating] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);
  const textToAberrate = "ABERRATION";
  const redAberrationClasses = ['use-aberration-red-a', 'use-aberration-red-b', 'use-aberration-red-c'];
  const blueAberrationClasses = ['use-aberration-blue-a', 'use-aberration-blue-b', 'use-aberration-blue-c'];
  const appliedClassesRef = useRef(new Map<HTMLElement, string[]>());

  const toggleAberration = () => {
    if (!textRef.current) return;
    const chars = textRef.current.querySelectorAll('.base-char');

    if (!isAberrating) {
      // Aplicar clases
      appliedClassesRef.current.clear(); // Limpiar mapa anterior
      chars.forEach(char => {
        const element = char as HTMLElement;
        const classesToAdd: string[] = [];

        // Aplicar aberración roja aleatoria
        const randomRedIndex = Math.floor(Math.random() * redAberrationClasses.length);
        const chosenRedClass = redAberrationClasses[randomRedIndex];
        classesToAdd.push(chosenRedClass);

        // Aplicar aberración azul aleatoria
        const randomBlueIndex = Math.floor(Math.random() * blueAberrationClasses.length);
        const chosenBlueClass = blueAberrationClasses[randomBlueIndex];
        classesToAdd.push(chosenBlueClass);

        element.classList.add(...classesToAdd);
        appliedClassesRef.current.set(element, classesToAdd); // Guardar clases aplicadas
      });
    } else {
      // Limpiar clases
      appliedClassesRef.current.forEach((classesToRemove, element) => {
         element.classList.remove(...classesToRemove);
      });
      appliedClassesRef.current.clear(); // Limpiar mapa
    }
    setIsAberrating(!isAberrating);
  };

  return (
    <>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        Haz clic en el botón para activar/desactivar el efecto:
      </p>
      <div 
        ref={textRef}
        className="text-2xl font-bold mb-4 text-center text-white"
        aria-label={textToAberrate}
      >
        {wrapChars(textToAberrate)} {/* Usar wrapChars */}
      </div>
      <button
        onClick={toggleAberration}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium text-white",
          isAberrating
            ? "bg-red-600 hover:bg-red-700"
            : "bg-indigo-600 hover:bg-indigo-700"
        )}
      >
        {isAberrating ? 'Desactivar Aberración' : 'Activar Aberración'}
      </button>
    </>
  );
};

export default function GlitchDocumentationPage() {
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Documentación Técnica: Cambio de Idioma y Efectos Glitch
      </h1>
      <p className="text-muted-foreground mb-10 text-xl">
        Análisis detallado del funcionamiento interno, la orquestación de efectos
        visuales y la temporización del sistema de cambio de idioma.
      </p>

      <Separator className="my-8" />

      {/* --- Sección 1: Contexto --- */}
      <Card className="mb-8 bg-black/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">1. Contexto de Idioma (`LanguageContext`)</CardTitle>
          <CardDescription>
            El núcleo del sistema que centraliza el estado y la lógica del idioma.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 mb-6 text-muted-foreground">
            <li><strong>Archivo:</strong> <code>contexts/LanguageContext.tsx</code></li>
            <li>
              <strong>Propósito:</strong> Proporcionar estado global (<code>language</code>, <code>isSwitchingLanguage</code>, <code>initialLanguageDuringSwitch</code>) y la función de cambio (<code>toggleLanguage</code>).
            </li>
          </ul>

          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
            1.1. Componentes Clave
          </h3>
          <Accordion type="single" collapsible className="w-full mb-6 border rounded-lg p-2">
            <AccordionItem value="item-1" className="border rounded-lg mb-3">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5">1.1.1. `LanguageContext`</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <p className="mb-2">Define la estructura del contexto que será compartida.</p>
                <CodeBlock language="typescript" code={`interface LanguageContextProps {
  language: 'en' | 'es';
  isSwitchingLanguage: boolean;
  initialLanguageDuringSwitch: 'en' | 'es' | null;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);`} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border rounded-lg mb-3">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5">1.1.2. `LanguageProvider`</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <p className="mb-2"><strong>Integración:</strong> Se utiliza en <code>app/layout.tsx</code> para envolver el contenido principal.</p>
                <CodeBlock language="typescript" code={`// app/layout.tsx (Snippet)
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
}`} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border rounded-lg">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5">1.1.3. `useLanguage` Hook</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <p className="mb-2">Hook personalizado para facilitar el consumo del contexto.</p>
                <CodeBlock language="typescript" code={`// contexts/LanguageContext.tsx (Snippet)
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};`} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
            1.2. Estado Gestionado
          </h3>
          <ul className="list-disc space-y-2 pl-5 mb-6 text-muted-foreground">
            <li><code>language ('en' | 'es')</code>: Idioma actual.</li>
            <li><code>isSwitchingLanguage (boolean)</code>: Indicador de transición en curso (controla botón y efectos).</li>
            <li><code>initialLanguageDuringSwitch ('en' | 'es' | null)</code>: Idioma *antes* del cambio. Guardado para permitir lógicas/textos específicos durante la transición (funcionalidad no explotada actualmente).</li>
          </ul>

           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
            1.3. Función `toggleLanguage`
          </h3>
           <p className="mb-4 text-muted-foreground">
            Función clave que orquesta el proceso de cambio, incluyendo prevención de clics múltiples, delays para sincronizar texto y efectos, y limpieza de temporizadores.
          </p>
          <Accordion type="single" collapsible className="w-full mb-6 border rounded-lg p-2">
             <AccordionItem value="item-toggle" className="border rounded-lg">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5">Detalles de la Lógica `toggleLanguage`</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                 <ul className="list-disc space-y-2 pl-5 mb-4 text-muted-foreground">
                    <li><strong>Prevención Clics Múltiples:</strong> Usa <code>isSwitchingLanguageRef.current</code>.</li>
                    <li><strong>Inicio Transición:</strong> Pone <code>isSwitchingLanguage</code> a <code>true</code> y guarda el idioma inicial.</li>
                    <li><strong>Cambio Idioma (Retrasado - 250ms):</strong> Usa <code>setTimeout</code> para cambiar <code>language</code>, permitiendo iniciar efectos antes.</li>
                    <li><strong>Fin Transición (Retrasado - 600ms):</strong> Usa <code>setTimeout</code> para poner <code>isSwitchingLanguage</code> a <code>false</code>.</li>
                    <li><strong>Limpieza:</strong> Los IDs de <code>setTimeout</code> se guardan en refs y se limpian al desmontar.</li>
                 </ul>
                <CodeBlock language="typescript" code={`// contexts/LanguageContext.tsx (Snippet - Lógica simplificada)
const EFFECT_TEXT_CHANGE_DELAY = 250;
const EFFECT_TOTAL_DURATION = 600;

const isSwitchingLanguageRef = useRef(false);
const timeoutIdTextChange = useRef<NodeJS.Timeout | null>(null);
const timeoutIdEffectEnd = useRef<NodeJS.Timeout | null>(null);

const toggleLanguage = useCallback(() => {
  if (isSwitchingLanguageRef.current) return;

  isSwitchingLanguageRef.current = true;
  const initialLang = language;
  setInitialLanguageDuringSwitch(initialLang);
  setIsSwitchingLanguage(true);

  if (timeoutIdTextChange.current) clearTimeout(timeoutIdTextChange.current);
  if (timeoutIdEffectEnd.current) clearTimeout(timeoutIdEffectEnd.current);

  timeoutIdTextChange.current = setTimeout(() => {
    setLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  }, EFFECT_TEXT_CHANGE_DELAY);

  timeoutIdEffectEnd.current = setTimeout(() => {
    setIsSwitchingLanguage(false);
    setInitialLanguageDuringSwitch(null);
    isSwitchingLanguageRef.current = false;
  }, EFFECT_TOTAL_DURATION);

}, [language]);

useEffect(() => { // Cleanup Effect
    return () => {
      if (timeoutIdTextChange.current) clearTimeout(timeoutIdTextChange.current);
      if (timeoutIdEffectEnd.current) clearTimeout(timeoutIdEffectEnd.current);
    };
}, []);`} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Separator className="my-8" />

       {/* --- Sección 2: Botón --- */}
      <Card className="mb-8 bg-black/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">2. Botón de Cambio de Idioma (`Header`)</CardTitle>
          <CardDescription>
            El disparador en la UI para iniciar la transición.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <ul className="list-disc space-y-2 pl-5 mb-6 text-muted-foreground">
            <li><strong>Archivo:</strong> <code>components/header.tsx</code></li>
            <li><strong>Propósito:</strong> Mostrar idioma opuesto y llamar a <code>toggleLanguage</code>.</li>
          </ul>

           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
            2.1. Integración con Contexto
          </h3>
          <p className="mb-4 text-muted-foreground">Consume el contexto con <code>useLanguage()</code>.</p>
          <CodeBlock language="typescript" code={`// components/header.tsx (Snippet)
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { language, isSwitchingLanguage, toggleLanguage } = useLanguage();
  // ... resto del componente ...
}`} />

           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3">
            2.2. Renderizado y Funcionalidad
          </h3>
           <ul className="list-disc space-y-2 pl-5 mb-4 text-muted-foreground">
              <li>Muestra "ES" o "EN".</li>
              <li>Animación suave de texto con Framer Motion (`AnimatePresence`).</li>
              <li><code>onClick</code> llama a <code>toggleLanguage</code>.</li>
              <li>Se deshabilita durante la transición (`isSwitchingLanguage`), cambiando solo el color del texto y el cursor, sin afectar la opacidad del fondo.</li>
              <li>Tiene ancho fijo (`w-14`) para evitar saltos de layout.</li>
           </ul>

           {/* --- Sub-Sección: Efecto Hover --- */}
           <p className="text-muted-foreground mb-4">
             Se aplica un efecto de gradiente radial que sigue al cursor cuando el mouse está sobre el contenedor, usando Framer Motion para la animación de aparición/desaparición.
           </p>
           <div className="flex flex-col lg:flex-row gap-6 mt-4 mb-8"> {/* Layout 1 */}
             {/* Columna Izquierda: Snippet Hover */}
             <div className="lg:w-2/3">
                <CodeBlock language="typescript" code={`// components/header.tsx (Snippet - Contenedor y Efecto Hover)
const navRef = useRef<HTMLDivElement>(null);\nconst [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });\nconst [isHovering, setIsHovering] = useState(false);\n\nconst handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {\n  // ... (lógica para actualizar mousePosition)\n}, []);\n\n// ...\n<div\n  ref={navRef}\n  // ... (otras props del contenedor)\n  onMouseMove={handleMouseMove}\n  onMouseEnter={() => setIsHovering(true)}\n  onMouseLeave={() => setIsHovering(false)}\n>\n  <AnimatePresence>\n    {isHovering && (\n      <motion.div\n        className="pointer-events-none absolute -inset-px rounded-full opacity-70"\n        style={{\n          background: \`radial-gradient(circle at \${mousePosition.x}px \${mousePosition.y}px, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)\`,\n          filter: "blur(8px)",\n        }}\n        initial={{ opacity: 0 }}\n        animate={{ opacity: 0.7 }}\n        exit={{ opacity: 0 }}\n        transition={{ duration: 0.2 }}\n      />\n    )}\n  </AnimatePresence>\n  {/* ... Contenido interno ... */}\n</div>`} />
             </div>
             {/* Columna Derecha: Ejemplo Hover */}
             <div className="lg:w-1/3">
                <Alert variant="default" className="bg-blue-950/30 border-blue-500/30">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-blue-300">Ejemplo Hover</AlertTitle>
                  <AlertDescription className="flex flex-col items-center justify-center py-6">
                    <HoverEffectExample />
                  </AlertDescription>
                </Alert>
             </div>
           </div>

           {/* --- Sub-Sección: Animación de Texto y Toggle --- */}
           <p className="text-muted-foreground mb-4 mt-6">
             El texto del botón ("ES"/"EN") cambia dinámicamente con una animación de fade y desplazamiento vertical. El botón se deshabilita y llama a `toggleLanguage` al hacer clic.
           </p>
           <div className="flex flex-col lg:flex-row gap-6 mt-4">
             {/* Columna Izquierda: Snippet de Código */}
             <div className="lg:w-2/3">
                <CodeBlock language="typescript" code={`// components/header.tsx (Snippet - Botón)
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
// {/* <BleedingPixels /> */} {/* Efecto comentado actualmente */}`} />
             </div>

             {/* Columna Derecha: Ejemplo Interactivo */}
             <div className="lg:w-1/3">
                <Alert variant="default" className="bg-blue-950/30 border-blue-500/30">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  <AlertTitle className="text-blue-300">Ejemplo Interactivo</AlertTitle>
                  {/* Aplicamos flex y centrado aquí */}
                  <AlertDescription className="flex flex-col items-center justify-center py-6">
                      <LanguageButtonExample />
                  </AlertDescription>
                </Alert>
             </div>
           </div>
           {/* --- Fin Layout dos columnas --- */}
        </CardContent>
      </Card>

      <Separator className="my-8" />

       {/* --- Sección 3: Orquestación --- */}
       <Card className="mb-8 bg-black/95 backdrop-blur-md">
         <CardHeader>
           <CardTitle className="text-2xl">3. Orquestación de Efectos Visuales (`Home Page`)</CardTitle>
           <CardDescription>
             Aplicación y limpieza de clases CSS para los efectos en el título.
           </CardDescription>
         </CardHeader>
         <CardContent>
            <ul className="list-disc space-y-2 pl-5 mb-6 text-muted-foreground">
              <li><strong>Archivo:</strong> <code>app/page.tsx</code></li>
              <li><strong>Propósito:</strong> Reaccionar a <code>isSwitchingLanguage</code> y manipular clases CSS del título.</li>
            </ul>

           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mb-3">
            3.1. Hook `useEffect` Clave
          </h3>
           <p className="mb-4 text-muted-foreground">
             Se suscribe a los cambios de <code>isSwitchingLanguage</code> para aplicar o limpiar efectos.
           </p>
           <CodeBlock language="typescript" code={`// app/page.tsx (Snippet - useEffect principal)
useEffect(() => {
  if (!titleRef.current) return;
  const container = titleRef.current;
  const chars = container.querySelectorAll('.base-char');

  if (isSwitchingLanguage) {
    // --- Aplicar Efectos ---
    // 1. Glitch Principal (Contenedor)
    const variants = ['a', 'b', 'c', 'd', 'e'];
    const randomIndex = Math.floor(Math.random() * variants.length);
    const chosenVariant = \`glitch-variant-\${variants[randomIndex]}\`;
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
      element.style.animationDelay = \`\${Math.random() * 0.1}s\`;
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
}, [isSwitchingLanguage]); // Dependencia clave`} />

           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3">
            3.2. Lógica de Aplicación (`isSwitchingLanguage === true`)
          </h3>
           <ol className="list-decimal space-y-2 pl-5 mb-6 text-muted-foreground">
             <li>Obtiene referencia al contenedor del título (`titleRef`).</li>
             <li>Añade <code>glitch-active</code> y variante aleatoria al contenedor.</li>
             <li>Para cada carácter (`.base-char`):
                <ul className="list-disc space-y-1 pl-5 mt-1">
                  <li>Añade <code>char-breaking</code>.</li>
                  <li>Añade clases aleatorias <code>use-aberration-red-X</code> y <code>use-aberration-blue-X</code>.</li>
                  <li>Aplica <code>animation-delay</code> aleatorio (0-0.1s).</li>
                  <li>Guarda las clases añadidas en un <code>Map</code> para limpieza selectiva.</li>
                </ul>
             </li>
           </ol>

           <h3 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3">
            3.3. Lógica de Limpieza (`isSwitchingLanguage === false`)
          </h3>
            <ol className="list-decimal space-y-2 pl-5 mb-6 text-muted-foreground">
              <li>Elimina clases de glitch del contenedor.</li>
              <li>Itera sobre el <code>Map</code> y elimina las clases específicas de cada carácter.</li>
              <li>Limpia el <code>animation-delay</code> inline.</li>
              <li>Vacía el <code>Map</code>.</li>
            </ol>
         </CardContent>
       </Card>

      <Separator className="my-8" />

       {/* --- Sección 4: Efectos CSS --- */}
      <Card className="mb-8 bg-black/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">4. Efectos Visuales Detallados (CSS)</CardTitle>
          <CardDescription>
            Definición de las animaciones y estilos en <code>app/globals.css</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="default" className="mb-6">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Nota sobre Snippets</AlertTitle>
            <AlertDescription>
              Los valores exactos de <code>transform</code>, <code>clip-path</code>, etc., en los siguientes keyframes son representativos. La implementación real puede tener ligeras variaciones, pero el mecanismo es el descrito.
            </AlertDescription>
          </Alert>

          <Accordion type="multiple" className="w-full p-2">
            {/* --- 4.1 Glitch Principal --- */}
            <AccordionItem value="effect-1" className="border rounded-lg mb-4">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5 text-lg">4.1. Glitch Principal (Contenedor)</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                 <p className="mb-4 text-muted-foreground">
                  Crea dos capas (magenta y cyan) sobre el texto principal, desplazadas y recortadas erráticamente, usando pseudo-elementos y el atributo <code>data-text</code>.
                </p>
                 <ul className="list-disc space-y-2 pl-5 mb-4 text-muted-foreground">
                    <li><strong>Selector:</strong> <code>.title-container.glitch-active</code></li>
                    <li><strong>Pseudo-elementos:</strong> <code>::before</code> (magenta), <code>::after</code> (cyan)</li>
                    <li><strong>Contenido:</strong> <code>attr(data-text)</code></li>
                    <li><strong>Estilo:</strong> Absoluto, <code>opacity: 0.75</code></li>
                    <li><strong>Animaciones:</strong> Manipulan <code>transform: translateX()</code> y <code>clip-path</code>.</li>
                    <li><strong>Variantes:</strong> Clases <code>glitch-variant-X</code> modifican sutilmente la animación.</li>
                 </ul>
                 
                 {/* Layout 2 columnas */}
                 <div className="flex flex-col lg:flex-row gap-6 mt-4">
                   {/* Columna Izquierda: Snippet CSS */}
                   <div className="lg:w-2/3">
                     <CodeBlock language="css" code={`/* app/globals.css (Snippet - Glitch Principal Conceptual) */
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
}`} />
                   </div>
                   {/* Columna Derecha: Ejemplo Interactivo */}
                   <div className="lg:w-1/3">
                     <Alert variant="default" className="bg-blue-950/30 border-blue-500/30">
                       <Terminal className="h-4 w-4 text-blue-400" />
                       <AlertTitle className="text-blue-300">Ejemplo Glitch Principal</AlertTitle>
                       <AlertDescription className="flex flex-col items-center justify-center py-6">
                         <GlitchEffectExample />
                       </AlertDescription>
                     </Alert>
                   </div>
                 </div>
                 {/* Fin Layout 2 columnas */}
              </AccordionContent>
            </AccordionItem>

            {/* --- 4.2 Rotura Caracteres --- */}
             <AccordionItem value="effect-2" className="border rounded-lg mb-4">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5 text-lg">4.2. Rotura de Caracteres (`.base-char`)</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="mb-4 text-muted-foreground">
                    Simula que cada carácter se rompe en fragmentos por un instante usando <code>steps()</code> y <code>clip-path</code>.
                  </p>
                  <ul className="list-disc space-y-2 pl-5 mb-4 text-muted-foreground">
                      <li><strong>Selector:</strong> <code>.base-char.char-breaking</code></li>
                      <li><strong>Animación:</strong> <code>charBreakAnim</code></li>
                      <li><strong>Mecanismo:</strong> <code>steps(6, end)</code>, <code>transform</code>, <code>clip-path</code></li>
                      <li><strong>Duración:</strong> 0.4s (una vez)</li>
                      <li><strong>Desincronización:</strong> <code>animation-delay</code> aleatorio (0-0.1s) desde JS.</li>
                  </ul>
                  <CodeBlock language="css" code={`/* app/globals.css (Snippet - Rotura) */
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
}`} />
                  
                  {/* Layout 2 columnas */}
                  <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    {/* Columna Izquierda: Snippet CSS */}
                    <div className="lg:w-2/3">
                       <CodeBlock language="css" code={`/* app/globals.css (Snippet - Rotura) */
.base-char.char-breaking {
  animation: charBreakAnim 0.4s steps(6, end) forwards;
}

@keyframes charBreakAnim {
/* ... (keyframes como se definieron antes) ... */
}`} />
                    </div>
                    {/* Columna Derecha: Ejemplo Interactivo */}
                    <div className="lg:w-1/3">
                       <Alert variant="default" className="bg-blue-950/30 border-blue-500/30">
                          <Terminal className="h-4 w-4 text-blue-400" />
                          <AlertTitle className="text-blue-300">Ejemplo Rotura Caracteres</AlertTitle>
                          <AlertDescription className="flex flex-col items-center justify-center py-6">
                             <CharacterBreakExample />
                          </AlertDescription>
                        </Alert>
                    </div>
                  </div>
                  {/* Fin Layout 2 columnas */}   
              </AccordionContent>
            </AccordionItem>

            {/* --- 4.3 Aberración Cromática --- */}
            <AccordionItem value="effect-3" className="border rounded-lg">
              <AccordionTrigger className="py-4 px-4 rounded-lg hover:bg-slate-50/5 text-lg">4.3. Aberración Cromática (`.base-char`)</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                  <p className="mb-4 text-muted-foreground">
                     Crea halos rojo (::before) y azul (::after) desalineados alrededor de cada carácter usando <code>data-char</code> y animaciones de "jitter".
                  </p>
                  <ul className="list-disc space-y-2 pl-5 mb-4 text-muted-foreground">
                      <li><strong>Selectores:</strong> <code>.base-char.use-aberration-red-X::before</code>, <code>...blue-X::after</code></li>
                      <li><strong>Pseudo-elementos:</strong> <code>::before</code> (rojo), <code>::after</code> (azul)</li>
                      <li><strong>Contenido:</strong> <code>attr(data-char)</code></li>
                      <li><strong>Animaciones:</strong> Cortas (0.06s), infinitas, distintas por variante (ej. <code>charAberrationRedA</code>), manipulan <code>transform</code> (translate, skew).</li>
                      <li><strong>Aleatoriedad:</strong> Clases <code>use-aberration-...</code> elegidas al azar en JS.</li>
                  </ul>

                  <p className="mb-2 mt-4"><strong>Función `wrapChars` y CSS:</strong></p>
                  {/* Layout 2 columnas */}
                  <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    {/* Columna Izquierda: Snippets Código */}
                    <div className="lg:w-2/3">
                        <p className="mb-2 text-sm font-medium">Función `wrapChars` (TypeScript):</p>
                        <CodeBlock language="typescript" code={`// app/page.tsx (Snippet - wrapChars)\nconst wrapChars = (text: string) => {\n  return text.split(\'\').map((char, index) => (\n    <span\n      key={\`\${char}-\${index}\`}\n      className=\"base-char inline-block\"\n      data-char={char === \' \' ? \'\\u00A0\' : char} // Atributo data-char\n    >\n      {char === \' \' ? \'\\u00A0\' : char}\n    </span>\n  ));\n};`} />
                        <p className="mb-2 mt-4 text-sm font-medium">CSS para Aberración:</p>
                        <CodeBlock language="css" code={`/* app/globals.css (Snippet - Aberración Cromática Conceptual) */\n.base-char::before,\n.base-char::after {\n  content: attr(data-char);\n  position: absolute;\n  /* ... (resto de estilos base before/after) ... */\n}\n\n/* Clases y Keyframes (ejemplos) */\n.base-char.use-aberration-red-a::before { color: red; animation: charAberrationRedA 0.06s linear infinite alternate; }\n.base-char.use-aberration-blue-a::after { color: blue; animation: charAberrationBlueA 0.07s linear infinite alternate-reverse; }\n\n@keyframes charAberrationRedA { /* ... */ }\n@keyframes charAberrationBlueA { /* ... */ }\n/* ... (otras variantes) ... */`} />
                    </div>
                    {/* Columna Derecha: Ejemplo Interactivo */}
                    <div className="lg:w-1/3">
                      <Alert variant="default" className="bg-blue-950/30 border-blue-500/30">
                        <Terminal className="h-4 w-4 text-blue-400" />
                        <AlertTitle className="text-blue-300">Ejemplo Aberración Cromática</AlertTitle>
                        <AlertDescription className="flex flex-col items-center justify-center py-6">
                          <ChromaticAberrationExample />
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                   {/* Fin Layout 2 columnas */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* --- Sección 5: Temporización --- */}
      <Card className="mb-8 bg-black/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">5. Temporización Resumida</CardTitle>
          <CardDescription>Flujo de eventos durante la transición de 600ms.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-3 pl-5 text-muted-foreground">
            <li>
              <strong>0ms:</strong> Clic. <code>isSwitchingLanguage = true</code>. JS aplica clases CSS (inicia todas las animaciones con delays variables).
            </li>
             <li>
              <strong>~0-100ms:</strong> Efectos de rotura y aberración visibles (por delays). Glitch principal activo.
            </li>
            <li>
              <strong>250ms:</strong> <code>setTimeout 1</code>. Cambia estado <code>language</code>. Texto en UI se actualiza.
            </li>
             <li>
              <strong>400ms:</strong> Animación <code>charBreakAnim</code> completada para la mayoría. Rotura desaparece, aberración/glitch continúan.
            </li>
            <li>
              <strong>600ms:</strong> <code>setTimeout 2</code>. <code>isSwitchingLanguage = false</code>. JS limpia todas las clases CSS y delays (detiene animaciones restantes).
            </li>
             <li>
              <strong>&gt;600ms:</strong> Todos los efectos cesan. UI estable con nuevo idioma.
            </li>
          </ol>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* --- Sección 6: Conclusión --- */}
      <Card className="mb-8 bg-black/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl">Conclusión</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este diseño combina un manejo centralizado del estado del idioma mediante React Context con una orquestación basada en clases CSS para aplicar efectos visuales complejos de forma modular. La separación de la lógica de estado, la activación de efectos (JavaScript) y la definición de las animaciones (CSS) permite una gestión clara y una futura extensibilidad del sistema, asegurando una experiencia de usuario dinámica durante las transiciones de idioma.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 