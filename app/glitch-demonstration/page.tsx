'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Lorem Ipsum Generator ---
const generateLoremIpsum = (numLines: number = 50): string => {
  const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.";
  const words = lorem.split(' ');
  let lines = [];
  for (let i = 0; i < numLines; i++) {
    const lineLength = Math.floor(Math.random() * 10) + 8; // Random line length (8-17 words)
    const startIndex = Math.floor(Math.random() * (words.length - lineLength));
    lines.push(words.slice(startIndex, startIndex + lineLength).join(' ') + '.');
  }
  return lines.join('\n');
}

const defaultLorem = generateLoremIpsum(10); // Cambiado a 10 líneas

// --- Utilidad para envolver caracteres --- 
// Añadimos la variable CSS --char-index para posibles delays internos
const wrapChars = (text: string, lineIndex: number) => {
  return text.split('').map((char, charIndex) => (
    <span
      key={`L${lineIndex}-C${charIndex}`}
      className="base-char inline-block" 
      data-char={char === ' ' ? '\u00A0' : char}
      style={{ '--char-index': charIndex } as React.CSSProperties}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};

export default function GlitchDemonstrationPage() {
  const [displayText, setDisplayText] = useState<string>(defaultLorem);
  const [customText, setCustomText] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const scanTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  // Ref para guardar las clases aplicadas a cada caracter por línea
  const lineCharacterClassesRef = useRef<Map<number, Map<HTMLElement, string[]>>>(new Map());

  const handleUseCustomText = () => {
    scanTimeoutsRef.current.forEach(clearTimeout);
    scanTimeoutsRef.current = [];
    lineCharacterClassesRef.current.clear(); // Limpiar clases guardadas
    setIsScanning(false); 
    setDisplayText(customText || defaultLorem);
  };

  const handleUseLoremIpsum = () => {
    scanTimeoutsRef.current.forEach(clearTimeout);
    scanTimeoutsRef.current = [];
    lineCharacterClassesRef.current.clear(); // Limpiar clases guardadas
    setIsScanning(false);
    setCustomText('');
    setDisplayText(defaultLorem);
  };

  const handleTestGlitch = useCallback(() => {
    if (isScanning) return;
    
    // Limpiar timeouts y cualquier clase residual
    scanTimeoutsRef.current.forEach(clearTimeout);
    scanTimeoutsRef.current = [];
    // Limpiar clases de línea y de caracter
    document.querySelectorAll('.line-glitching-main').forEach(el => el.classList.remove('line-glitching-main'));
    document.querySelectorAll('.char-breaking, [class*="use-aberration-"]').forEach(el => {
      el.classList.remove('char-breaking');
      el.className.split(' ').forEach(cls => {
        if (cls.startsWith('use-aberration-')) {
          el.classList.remove(cls);
        }
      });
      (el as HTMLElement).style.animationDelay = '';
    });
    lineCharacterClassesRef.current.clear();
    
    setIsScanning(true);

    const lines = displayText.split('\n');
    const activationDelay = 200; 
    const fullEffectDuration = 600;
    const newTimeouts: NodeJS.Timeout[] = [];
    
    const redAberrationClasses = ['use-aberration-red-a', 'use-aberration-red-b', 'use-aberration-red-c'];
    const blueAberrationClasses = ['use-aberration-blue-a', 'use-aberration-blue-b', 'use-aberration-blue-c'];

    lines.forEach((_, lineIndex) => {
      const activationTimeoutId = setTimeout(() => {
        const lineElement = document.getElementById(`line-${lineIndex}`);
        if (!lineElement) return;
        
        // --- Aplicar efecto a la línea --- 
        lineElement.classList.add('line-glitching-main'); 
        
        const chars = lineElement.querySelectorAll('.base-char');
        const charsMapForLine = new Map<HTMLElement, string[]>();
        lineCharacterClassesRef.current.set(lineIndex, charsMapForLine);

        chars.forEach(char => {
          const element = char as HTMLElement;
          const classesToAdd: string[] = ['char-breaking'];

          // Aberración roja aleatoria
          const randomRedIndex = Math.floor(Math.random() * redAberrationClasses.length);
          classesToAdd.push(redAberrationClasses[randomRedIndex]);

          // Aberración azul aleatoria
          const randomBlueIndex = Math.floor(Math.random() * blueAberrationClasses.length);
          classesToAdd.push(blueAberrationClasses[randomBlueIndex]);

          element.classList.add(...classesToAdd);
          charsMapForLine.set(element, classesToAdd);

          // Delay aleatorio para charBreakAnim
          element.style.animationDelay = `${Math.random() * 0.1}s`;
        });

        // --- Timeout para limpiar esta línea (ambos efectos) --- 
        const cleanupTimeoutId = setTimeout(() => {
          // Limpiar efecto de línea
          lineElement.classList.remove('line-glitching-main'); 
          
          // Limpiar efectos de caracteres
          const mapForCleanup = lineCharacterClassesRef.current.get(lineIndex);
          if (mapForCleanup) {
            mapForCleanup.forEach((classesToRemove, element) => {
              element.classList.remove(...classesToRemove);
              element.style.animationDelay = '';
            });
            mapForCleanup.clear();
          }
        }, fullEffectDuration);

        newTimeouts.push(cleanupTimeoutId);

      }, lineIndex * activationDelay);
      
      newTimeouts.push(activationTimeoutId);
    });

    // Timeout final para resetear el estado isScanning
    const totalDuration = (lines.length > 0 ? (lines.length - 1) * activationDelay : 0) + fullEffectDuration + 100;
    const endScanTimeoutId = setTimeout(() => {
      setIsScanning(false);
      lineCharacterClassesRef.current.clear();
      // Asegurar que la clase de línea también se quite al final
      document.querySelectorAll('.line-glitching-main').forEach(el => el.classList.remove('line-glitching-main')); 
    }, totalDuration);
    newTimeouts.push(endScanTimeoutId);

    scanTimeoutsRef.current = newTimeouts;
  }, [displayText, isScanning]);

  // Limpieza de timeouts y clases al desmontar
  useEffect(() => {
    const timeouts = scanTimeoutsRef.current;
    // La función de retorno del useEffect DEBE ser una función
    return () => {
      timeouts.forEach(clearTimeout);
      // Limpiar ambas clases residuales
      try { // Envolver en try-catch por si el DOM no está listo
        document.querySelectorAll('.line-glitching-main').forEach(el => {
          if (el) { // Verificar que el elemento existe
             el.classList.remove('line-glitching-main');
          }
        });
        document.querySelectorAll('.char-breaking, [class*="use-aberration-"]').forEach(el => {
          if (el) { // Verificar que el elemento existe
             el.classList.remove('char-breaking');
             // Corregir lógica de limpieza de clases de aberración
             const classesToRemove: string[] = [];
             el.classList.forEach(cls => {
               if (cls.startsWith('use-aberration-')) {
                 classesToRemove.push(cls);
               }
             });
             if (classesToRemove.length > 0) {
                el.classList.remove(...classesToRemove);
             }
            // Limpiar estilo inline
            if (el instanceof HTMLElement) { 
               el.style.animationDelay = '';
            }
          }
        });
      } catch (error) {
         console.error("Error during effect cleanup:", error);
      }
    };
    // La dependencia vacía es correcta aquí, solo queremos la limpieza al desmontar
  }, []);

  // --- JSX Simplificado --- 
  return (
    <div className="container mx-auto max-w-7xl py-12 px-4 text-white"> {/* Añadido text-white para visibilidad */}
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
        Demostración: Efecto Glitch Scanline
      </h1>
      <p className="text-gray-400 mb-8 text-lg"> 
        Esta página demuestra un efecto visual inspirado en las líneas de escaneo (scanlines).
        Al pulsar "Test Glitch", una combinación de efectos de **rotura de caracteres** y 
        **aberración cromática** recorrerá el texto línea por línea de forma secuencial. 
        El efecto completo dura 600ms en cada línea, mientras la activación avanza a la siguiente cada 200ms. 
        Puedes usar el texto Lorem Ipsum predefinido o introducir tu propio texto.
      </p>

      {/* Sección de Input (Simplificada) */}
      <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h2 className="text-2xl font-semibold mb-2">Introduce tu Texto</h2>
        <p className="text-gray-400 mb-4 text-sm">
          Escribe o pega aquí el texto que quieras usar...
        </p>
        <textarea
          placeholder="Escribe tu texto aquí..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          rows={5}
          className="w-full p-2 rounded mb-4 bg-black/50 border border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white"
        />
        <div className="flex gap-4">
          {/* Botones HTML básicos */}
          <button onClick={handleUseCustomText} className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500">Usar Mi Texto</button>
          <button onClick={handleUseLoremIpsum} className="px-4 py-2 rounded border border-gray-500 hover:bg-gray-700">Usar Lorem Ipsum</button>
        </div>
      </div>

      {/* Sección de Demostración (Simplificada) */}
      <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
        <h2 className="text-2xl font-semibold mb-4">Área de Demostración</h2>
        <div 
          className="text-xl font-mono whitespace-pre-wrap overflow-hidden p-4 bg-black/60 rounded-md border border-gray-600 leading-relaxed text-gray-300"
          style={{ minHeight: '150px' }}
          id="scanline-text-area" 
        >
          {displayText.split('\n').map((line, lineIndex) => (
            <div 
              key={lineIndex} 
              id={`line-${lineIndex}`} 
              className="line-container"
              style={{ minHeight: '1.8em' }}
            >
              {wrapChars(line, lineIndex)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Botón de Test (HTML básico) */}
      <div className="text-center">
        <button 
          onClick={handleTestGlitch} 
          disabled={isScanning}
          className={`px-6 py-3 rounded text-lg font-bold text-white ${isScanning ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
        >
          {isScanning ? "Escaneando..." : "Test Glitch"}
        </button>
      </div>

    </div>
  );
} 