import { useRef, useState } from 'react';

export function useGlitchEffect() {
  const [isGlitching, setIsGlitching] = useState(false);
  const currentGlitchVariant = useRef<string | null>(null);
  const addedAberrationClassesMap = useRef(new Map<HTMLElement, string[]>());

  // Función auxiliar para calcular parámetros de escala basados en el tamaño del texto
  const getFontSizeScaleFactors = (element: HTMLElement) => {
    // Obtener el tamaño de fuente computado
    const computedStyle = window.getComputedStyle(element);
    const fontSizeStr = computedStyle.fontSize;
    const fontSize = parseFloat(fontSizeStr);
    
    // Título grande (>= 40px) - valores base sin ajuste
    if (fontSize >= 40) {
      return {
        glitchScale: 1,       // Factor para desplazamientos en glitch principal
        aberrationScale: 1,   // Factor para desplazamientos en aberraciones
        delayRange: 0.1       // Rango máximo para el retraso aleatorio
      };
    } 
    // Textos medianos (24-40px)
    else if (fontSize >= 24) {
      return {
        glitchScale: 0.75,    // Reduce amplitud del efecto glitch
        aberrationScale: 0.8,
        delayRange: 0.08
      };
    } 
    // Textos pequeños (<24px)
    else {
      return {
        glitchScale: 0.5,     // Reduce significativamente la intensidad
        aberrationScale: 0.6,
        delayRange: 0.05
      };
    }
  };

  // Aplicar clases personalizadas basadas en el tamaño
  const applyFontSizeBasedVariants = (element: HTMLElement, variantName: string) => {
    const computedStyle = window.getComputedStyle(element);
    const fontSize = parseFloat(computedStyle.fontSize);
    
    if (fontSize >= 40) {
      element.classList.add(`${variantName}-large`);
    } else if (fontSize >= 24) {
      element.classList.add(`${variantName}-medium`);
    } else {
      element.classList.add(`${variantName}-small`);
    }
  };

  // Aceptar específicamente RefObject<HTMLDivElement> o cualquier HTMLElement
  const applyGlitchEffect = (elementRef: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    if (!elementRef.current) return;
    
    const container = elementRef.current;
    const chars = container.querySelectorAll('.base-char');
    
    // 1. Elegir y aplicar variante del glitch principal
    const variants = ['a', 'b', 'c', 'd', 'e'];
    const randomIndex = Math.floor(Math.random() * variants.length);
    const chosenVariant = `glitch-variant-${variants[randomIndex]}`;
    currentGlitchVariant.current = chosenVariant;
    container.classList.add('glitch-active', chosenVariant);
    
    // Determinar escala adecuada para el tamaño de texto
    const { glitchScale, aberrationScale, delayRange } = getFontSizeScaleFactors(container);
    
    // Aplicar clase de escala al contenedor principal
    if (glitchScale !== 1) {
      container.style.setProperty('--glitch-scale', glitchScale.toString());
    }
    
    // 2. Aplicar rotura y aberración a caracteres
    const redAberrationClasses = ['use-aberration-red-a', 'use-aberration-red-b', 'use-aberration-red-c'];
    const blueAberrationClasses = ['use-aberration-blue-a', 'use-aberration-blue-b', 'use-aberration-blue-c'];
    addedAberrationClassesMap.current.clear();
    
    chars.forEach(char => {
      const element = char as HTMLElement;
      const classesToAdd: string[] = ['char-breaking'];
      
      // Añadir clase específica basada en el tamaño de la fuente
      applyFontSizeBasedVariants(element, 'char-breaking');
      
      // Aberración roja aleatoria
      const randomRedIndex = Math.floor(Math.random() * redAberrationClasses.length);
      const chosenRedClass = redAberrationClasses[randomRedIndex];
      classesToAdd.push(chosenRedClass);
      
      // Aberración azul aleatoria
      const randomBlueIndex = Math.floor(Math.random() * blueAberrationClasses.length);
      const chosenBlueClass = blueAberrationClasses[randomBlueIndex];
      classesToAdd.push(chosenBlueClass);
      
      element.classList.add(...classesToAdd);
      
      // Aplicar escala de aberración si no es 1
      if (aberrationScale !== 1) {
        element.style.setProperty('--aberration-scale', aberrationScale.toString());
      }
      
      addedAberrationClassesMap.current.set(element, classesToAdd);
      element.style.animationDelay = `${Math.random() * delayRange}s`;
    });
    
    setIsGlitching(true);
  };
  
  const cleanupGlitchEffect = (elementRef: React.RefObject<HTMLElement | HTMLDivElement | null>) => {
    if (!elementRef.current) return;
    const container = elementRef.current;
    
    // 1. Limpiar glitch principal
    if (currentGlitchVariant.current) {
      container.classList.remove('glitch-active', currentGlitchVariant.current);
      currentGlitchVariant.current = null;
    }
    
    // Limpiar propiedades CSS personalizadas
    container.style.removeProperty('--glitch-scale');
    
    // 2. Limpiar caracteres
    addedAberrationClassesMap.current.forEach((classesToRemove, element) => {
      element.classList.remove(...classesToRemove);
      element.style.animationDelay = '';
      element.style.removeProperty('--aberration-scale');
      
      // Limpiar clases específicas de tamaño
      element.classList.remove('char-breaking-small', 'char-breaking-medium', 'char-breaking-large');
    });
    addedAberrationClassesMap.current.clear();
    
    setIsGlitching(false);
  };
  
  return {
    isGlitching,
    applyGlitchEffect,
    cleanupGlitchEffect
  };
} 