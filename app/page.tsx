"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FeaturedProjects from "@/components/featured-projects"
import { Suspense, useRef, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { CharWrapper } from "@/components/CharWrapper"
import { useGlitchEffect } from "@/hooks/useGlitchEffect"

// Optimized animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Reduced from 0.2
      when: "beforeChildren",
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 }, // Reduced from y: 20
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5, // Reduced from 0.8
      ease: "easeOut",
    },
  },
}

export default function Home() {
  // Usar contexto en lugar de estado local
  const { language, isSwitchingLanguage } = useLanguage();
  
  // Referencias para los elementos que tendrán glitch
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLDivElement>(null);
  const contactButtonRef = useRef<HTMLDivElement>(null); // Nueva referencia para el botón contacto
  
  // Uso del hook para los elementos
  const titleGlitchEffect = useGlitchEffect();
  const subtitleGlitchEffect = useGlitchEffect();
  const buttonTextRef1GlitchEffect = useGlitchEffect();
  const buttonTextRef2GlitchEffect = useGlitchEffect(); // Nuevo hook para el botón contacto

  // Objeto con todos los textos internacionalizados
  const texts = {
    en: {
      title1: "Creative Developer",
      title2: "Designer",
      subtitle: "Crafting high-performance digital experiences with a focus on minimalist design and subtle interactive elements.",
      viewProjectsBtn: "View Projects",
      getInTouchBtn: "Get in Touch",
      featuredProjectsTitle: "Featured Projects",
    },
    es: {
      title1: "Desarrollador Creativo",
      title2: "Diseñador",
      subtitle: "Creando experiencias digitales de alto rendimiento con un enfoque en diseño minimalista y elementos interactivos sutiles.",
      viewProjectsBtn: "Ver Proyectos",
      getInTouchBtn: "Contacto",
      featuredProjectsTitle: "Proyectos Destacados",
    }
  };

  // useEffect para aplicar/limpiar efectos visuales
  useEffect(() => {
    if (isSwitchingLanguage) {
      // Aplicar todos los efectos simultáneamente
      titleGlitchEffect.applyGlitchEffect(titleRef);
      subtitleGlitchEffect.applyGlitchEffect(subtitleRef);
      buttonTextRef1GlitchEffect.applyGlitchEffect(buttonTextRef);
      buttonTextRef2GlitchEffect.applyGlitchEffect(contactButtonRef); // Aplicar al nuevo botón
    } else {
      // Limpiar efectos
      titleGlitchEffect.cleanupGlitchEffect(titleRef);
      subtitleGlitchEffect.cleanupGlitchEffect(subtitleRef);
      buttonTextRef1GlitchEffect.cleanupGlitchEffect(buttonTextRef);
      buttonTextRef2GlitchEffect.cleanupGlitchEffect(contactButtonRef); // Limpiar al nuevo botón
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSwitchingLanguage]); // Ejecutar cuando cambie isSwitchingLanguage
  
  // Texto para data-text (sin & y con espacio como separador)
  const currentTitleText = `${texts[language].title1} ${texts[language].title2}`;
  const currentSubtitleText = texts[language].subtitle;
  
  // Texto para caracteres base
  const titlePart1 = texts[language].title1;
  const titlePart2 = texts[language].title2;

  return (
    <>
      <style jsx global>{`
        .creative-text-char {
          display: inline-block;
          position: relative;
          transition: color 0.15s ease-out, text-shadow 0.3s ease-out;
        }
        
        /* Estos estilos pueden estar sobrescribiendo los estilos globales */
        /* Eliminar o modificar estos estilos específicos para title-container */
        /* para que no sobrescriban los globales definidos en globals.css */
        
        .force-field {
          position: absolute;
          pointer-events: none;
          z-index: 5;
          border-radius: 50%;
          background: radial-gradient(circle at center, 
            rgba(147, 51, 234, 0.08) 0%, 
            rgba(221, 81, 247, 0.05) 50%, 
            transparent 80%);
          opacity: 0;
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1), transform 1s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform: scale(0.8);
          filter: blur(15px);
          box-shadow: inset 0 0 30px rgba(147, 51, 234, 0.2),
                      0 0 50px rgba(147, 51, 234, 0.1);
        }
        
        .energy-line {
          position: absolute;
          pointer-events: none;
          transform-origin: left center;
          opacity: 0;
          height: 1px;
          background: linear-gradient(90deg, 
            rgba(147, 51, 234, 0.5) 0%, 
            rgba(219, 39, 119, 0.7) 50%, 
            rgba(139, 92, 246, 0.5) 100%);
          box-shadow: 0 0 6px rgba(147, 51, 234, 0.3),
                      0 0 12px rgba(139, 92, 246, 0.2);
          transition: opacity 0.5s ease-out;
          animation: energyPulse 3s infinite alternate ease-in-out;
          filter: blur(0.8px);
        }
        
        @keyframes energyPulse {
          0% {
            opacity: var(--base-opacity, 0.7);
            box-shadow: 0 0 6px rgba(147, 51, 234, 0.3),
                        0 0 12px rgba(139, 92, 246, 0.2);
          }
          100% {
            opacity: var(--pulse-opacity, 0.9);
            box-shadow: 0 0 8px rgba(147, 51, 234, 0.4),
                        0 0 16px rgba(139, 92, 246, 0.3),
                        0 0 24px rgba(221, 81, 247, 0.2);
          }
        }
        
        @keyframes glowPulse {
          0% {
            text-shadow: 0 0 2px rgba(147, 51, 234, 0.3),
                         0 0 4px rgba(139, 92, 246, 0.2);
          }
          100% {
            text-shadow: 0 0 4px rgba(147, 51, 234, 0.5),
                         0 0 8px rgba(139, 92, 246, 0.3),
                         0 0 12px rgba(221, 81, 247, 0.2);
          }
        }
        
        .energized {
          animation: glowPulse 3s infinite alternate ease-in-out;
        }
        
        .energy-field-active .creative-text-char {
          transition: color 0.15s ease-out, text-shadow 0.3s ease-out;
        }

        .glitch-active .glitch-layer {
           opacity: 1;
           /* animation: glitchAnim 0.8s steps(2, end) infinite; */ /* Desactivado para probar */
        }
        .glitch-layer {
           position: absolute;
           top: 0;
           left: 0;
           width: 100%;
           height: 100%;
           pointer-events: none;
           opacity: 0; /* Oculto por defecto */
           will-change: transform, opacity;
        }
        .glitch-layer.layer-base {
          position: relative;
          opacity: 1;
        }

        /* Reglas activas: aplicar estilos base y animaciones de transform */
        .glitch-active .layer-1 {
          opacity: 0.7 !important; /* Hacer visible FORZADO */
          color: #F0F; /* Magenta */
          text-shadow: -1px 0 #0FF; /* Cian */
          /* animation: glitchTransform1 0.8s steps(4, end); */ /* Animación comentada */
          /* Añadir un pequeño transform estático para ver si se mueve */
          transform: translate(-1px, -1px);
        }
        .glitch-active .layer-2 {
          opacity: 0.7 !important; /* Hacer visible FORZADO */
          color: #0FF; /* Cian */
          text-shadow: 1px 0 #F0F; /* Magenta */
          /* animation: glitchTransform2 0.8s steps(4, end) .05s; */ /* Animación comentada */
          /* Añadir un pequeño transform estático para ver si se mueve */
           transform: translate(1px, 1px);
        }
        .glitch-active .layer-base {
           /* animation: glitchBaseFlicker 0.8s steps(2, end); */ /* Animación comentada */
           /* Mantener opacidad normal para la base */
           opacity: 1;
        }

        /* Animaciones SOLO para transform */
        @keyframes glitchTransform1 {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2px, 1px); }
          20% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 1px); }
          60% { transform: translate(1px, -1px); }
          70% { transform: translate(-1px, 2px); }
          80% { transform: translate(2px, -2px); }
          90% { transform: translate(0, 0); }
        }
        @keyframes glitchTransform2 {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(2px, -1px); }
          20% { transform: translate(-1px, 1px); }
          30% { transform: translate(1px, -2px); }
          40% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -1px); }
          60% { transform: translate(-1px, 1px); }
          70% { transform: translate(1px, -2px); }
          80% { transform: translate(-2px, 2px); }
          90% { transform: translate(0, 0); }
        }
        
         /* Animación más sutil para la base */
         @keyframes glitchBaseFlicker {
          0%, 100% { opacity: 1; }
          10% { opacity: 0.9; }
          30% { opacity: 0.85; }
          50% { opacity: 0.95; }
          70% { opacity: 0.9; }
          90% { opacity: 0.95; }
        }

        .title-container.glitch-active {
          /* Aplicar Flicker al contenedor */
          animation: glitchFlicker 0.15s infinite steps(1, end);
        }
        
        .title-container.glitch-active::before,
        .title-container.glitch-active::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: transparent;
          clip: rect(auto, auto, auto, auto);
          pointer-events: none;
          opacity: 1; 
        }

        .title-container.glitch-active::before {
          left: -2px; /* Aumentar separación */
          text-shadow: 2px 0 #0FF, -1px 0 red; /* Añadir rojo sutil */
          color: #F0F; 
          animation: glitchPseudoBefore 0.06s linear infinite alternate-reverse both;
          z-index: 12; 
        }

        .title-container.glitch-active::after {
          left: 2px; /* Aumentar separación */
          text-shadow: -2px 0 #F0F, 1px 0 blue; /* Añadir azul sutil */
          color: #0FF; 
          animation: glitchPseudoAfter 0.04s linear infinite alternate-reverse both;
          z-index: 11; 
        }

        /* Keyframe de Flicker */
        @keyframes glitchFlicker {
          0%, 100% { opacity: 1; }
          30% { opacity: 0.8; }
          50% { opacity: 0.6; }
          70% { opacity: 0.9; }
        }
        
        /* Keyframes más agresivos y separados */
        @keyframes glitchPseudoBefore {
          0% { transform: translate(0); clip-path: inset(10% 0 80% 0); }
          25% { transform: translate(-5px, 2px); clip-path: inset(45% 0 30% 0); }
          50% { transform: translate(3px, -1px); clip-path: inset(90% 0 2% 0); }
          75% { transform: translate(-2px, 4px); clip-path: inset(20% 0 65% 0); }
          100% { transform: translate(4px, -3px); clip-path: inset(70% 0 15% 0); }
        }

        @keyframes glitchPseudoAfter {
          0% { transform: translate(0); clip-path: inset(75% 0 5% 0); }
          25% { transform: translate(4px, -3px); clip-path: inset(15% 0 70% 0); }
          50% { transform: translate(-2px, 1px); clip-path: inset(60% 0 25% 0); }
          75% { transform: translate(5px, 3px); clip-path: inset(5% 0 90% 0); }
          100% { transform: translate(-3px, -2px); clip-path: inset(40% 0 50% 0); }
        }
        
        /* Estilos anteriores que ya no se usan (layers, etc) */
        .glitch-layer { display: none; } 

        /* --- BASE COMÚN PARA VARIANTES A-E - AÑADIR OPACIDAD --- */
        .title-container.glitch-active[class*="glitch-variant-"]::before,
        .title-container.glitch-active[class*="glitch-variant-"]::after {
           content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%;
           background: transparent; clip: rect(auto, auto, auto, auto); pointer-events: none; 
           /* Añadir Opacidad para ver capas inferiores */
           opacity: 0.75; 
           color: #F0F; 
           text-shadow: 2px 0 #0FF; 
        }
        .title-container.glitch-active[class*="glitch-variant-"]::after {
           color: #0FF; 
           text-shadow: -2px 0 #F0F; 
           /* Opacidad heredada o también 0.75 */
           opacity: 0.75;
        }

        /* === VARIANTE A: Original Rápido y Cortado - MÁS INTENSO === */
        .title-container.glitch-active.glitch-variant-a { animation: glitchFlicker_A_NoOpacity 0.08s infinite steps(1, end); }
        .title-container.glitch-active.glitch-variant-a::before { left: -3px; animation: glitchPseudoBefore_A 0.05s linear infinite alternate-reverse both; z-index: 12; }
        .title-container.glitch-active.glitch-variant-a::after { left: 3px; animation: glitchPseudoAfter_A 0.03s linear infinite alternate-reverse both; z-index: 11; }
        @keyframes glitchFlicker_A_NoOpacity { 
            0%, 100% { transform: translate(0); /* Solo ejemplo, mantener transform si lo tiene */ }
            30% { transform: translate(-1px, 1px); }
            60% { transform: translate(1px, 0); }
         }
        @keyframes glitchPseudoBefore_A { 0% { transform: translate(0); clip-path: inset(10% 0 85% 0); } 25% { transform: translate(-8px, 3px); clip-path: inset(40% 0 40% 0); } 50% { transform: translate(5px, -2px); clip-path: inset(90% 0 1% 0); } 75% { transform: translate(-4px, 6px); clip-path: inset(25% 0 70% 0); } 100% { transform: translate(7px, -5px); clip-path: inset(65% 0 20% 0); } }
        @keyframes glitchPseudoAfter_A { 0% { transform: translate(0); clip-path: inset(80% 0 5% 0); } 25% { transform: translate(6px, -4px); clip-path: inset(20% 0 60% 0); } 50% { transform: translate(-3px, 2px); clip-path: inset(55% 0 35% 0); } 75% { transform: translate(7px, 5px); clip-path: inset(5% 0 92% 0); } 100% { transform: translate(-5px, -3px); clip-path: inset(30% 0 50% 0); } }

        /* === VARIANTE B: Énfasis Vertical - MÁS INTENSO === */
        .title-container.glitch-active.glitch-variant-b { animation: glitchFlicker_A_NoOpacity 0.1s infinite steps(1, end); }
        .title-container.glitch-active.glitch-variant-b::before { left: -2px; animation: glitchPseudoBefore_B 0.06s linear infinite alternate-reverse both; z-index: 12; }
        .title-container.glitch-active.glitch-variant-b::after { left: 2px; animation: glitchPseudoAfter_B 0.07s linear infinite alternate-reverse both; z-index: 11; }
        @keyframes glitchPseudoBefore_B { 0% { transform: translate(0, 0); clip-path: inset(5% 0 90% 0); } 25% { transform: translate(-2px, 10px); clip-path: inset(30% 0 65% 0); } 50% { transform: translate(1px, -8px); clip-path: inset(70% 0 20% 0); } 75% { transform: translate(0px, 12px); clip-path: inset(50% 0 45% 0); } 100% { transform: translate(-1px, -10px); clip-path: inset(85% 0 5% 0); } }
        @keyframes glitchPseudoAfter_B { 0% { transform: translate(0, 0); clip-path: inset(92% 0 2% 0); } 25% { transform: translate(2px, -9px); clip-path: inset(60% 0 30% 0); } 50% { transform: translate(-1px, 7px); clip-path: inset(25% 0 70% 0); } 75% { transform: translate(1px, -11px); clip-path: inset(40% 0 55% 0); } 100% { transform: translate(0px, 9px); clip-path: inset(10% 0 80% 0); } }

        /* === VARIANTE C: Énfasis Horizontal - MÁS INTENSO === */
        .title-container.glitch-active.glitch-variant-c { animation: glitchFlicker_A_NoOpacity 0.07s infinite steps(1, end); }
        .title-container.glitch-active.glitch-variant-c::before { left: -4px; animation: glitchPseudoBefore_C 0.04s linear infinite alternate-reverse both; z-index: 12; }
        .title-container.glitch-active.glitch-variant-c::after { left: 4px; animation: glitchPseudoAfter_C 0.05s linear infinite alternate-reverse both; z-index: 11; }
        @keyframes glitchPseudoBefore_C { 0% { transform: translate(0, 0); clip-path: inset(5% 90% 5% 0); } 25% { transform: translate(-12px, 1px); clip-path: inset(30% 60% 30% 0); } 50% { transform: translate(10px, -1px); clip-path: inset(70% 20% 10% 0); } 75% { transform: translate(-15px, 0px); clip-path: inset(10% 70% 50% 0); } 100% { transform: translate(11px, 1px); clip-path: inset(40% 50% 40% 0); } }
        @keyframes glitchPseudoAfter_C { 0% { transform: translate(0, 0); clip-path: inset(2% 0 92% 5%); } 25% { transform: translate(13px, -1px); clip-path: inset(35% 0 60% 30%); } 50% { transform: translate(-9px, 1px); clip-path: inset(65% 0 25% 15%); } 75% { transform: translate(16px, 0px); clip-path: inset(55% 0 40% 5%); } 100% { transform: translate(-10px, -1px); clip-path: inset(80% 0 10% 10%); } }

        /* === VARIANTE D: Saltos Grandes - MÁS INTENSO === */
        .title-container.glitch-active.glitch-variant-d { animation: glitchFlicker_A_NoOpacity 0.06s infinite steps(1, end); }
        .title-container.glitch-active.glitch-variant-d::before { left: -5px; animation: glitchPseudoBefore_D 0.04s linear infinite alternate-reverse both; z-index: 12; }
        .title-container.glitch-active.glitch-variant-d::after { left: 5px; animation: glitchPseudoAfter_D 0.045s linear infinite alternate-reverse both; z-index: 11; }
        @keyframes glitchPseudoBefore_D { 0% { transform: translate(0, 0); clip-path: inset(20% 0 70% 0); } 25% { transform: translate(-18px, 8px); clip-path: inset(50% 0 45% 0); } 50% { transform: translate(15px, -10px); clip-path: inset(85% 0 2% 0); } 75% { transform: translate(-10px, 12px); clip-path: inset(30% 0 60% 0); } 100% { transform: translate(16px, -6px); clip-path: inset(60% 0 30% 0); } }
        @keyframes glitchPseudoAfter_D { 0% { transform: translate(0, 0); clip-path: inset(75% 0 15% 0); } 25% { transform: translate(17px, -9px); clip-path: inset(25% 0 65% 0); } 50% { transform: translate(-14px, 11px); clip-path: inset(55% 0 35% 0); } 75% { transform: translate(12px, -13px); clip-path: inset(5% 0 90% 0); } 100% { transform: translate(-15px, 7px); clip-path: inset(40% 0 50% 0); } }

        /* === VARIANTE E: Micro-Jitter - MÁS INTENSO === */
        .title-container.glitch-active.glitch-variant-e { animation: glitchFlicker_A_NoOpacity 0.05s infinite steps(1, end); }
        .title-container.glitch-active.glitch-variant-e::before { left: -1px; animation: glitchPseudoBefore_E 0.02s linear infinite alternate-reverse both; z-index: 12; }
        .title-container.glitch-active.glitch-variant-e::after { left: 1px; animation: glitchPseudoAfter_E 0.025s linear infinite alternate-reverse both; z-index: 11; }
        @keyframes glitchPseudoBefore_E { 0% { transform: translate(0); clip-path: inset(30% 0 68% 0); } 25% { transform: translate(-2px, 1px); clip-path: inset(65% 0 33% 0); } 50% { transform: translate(1px, -1px); clip-path: inset(36% 0 62% 0); } 75% { transform: translate(-1px, 2px); clip-path: inset(58% 0 40% 0); } 100% { transform: translate(2px, -1px); clip-path: inset(43% 0 55% 0); } }
        @keyframes glitchPseudoAfter_E { 0% { transform: translate(0); clip-path: inset(66% 0 30% 0); } 25% { transform: translate(2px, -1px); clip-path: inset(31% 0 67% 0); } 50% { transform: translate(-1px, 1px); clip-path: inset(60% 0 38% 0); } 75% { transform: translate(1px, -2px); clip-path: inset(41% 0 57% 0); } 100% { transform: translate(-2px, 1px); clip-path: inset(53% 0 45% 0); } }

        /* --- ESTILOS PARA LA ROTURA (BASE CHAR) - CAOS MÁXIMO --- */
        .base-char { position: relative; z-index: 1; will-change: transform, opacity, clip-path; }
        .base-char.char-breaking {
          animation-name: charBreakAnim;
          animation-duration: 0.2s; /* VELOCIDAD VÉRTIGO */
          animation-timing-function: steps(12, end); /* MÁS SALTOS AÚN */
          animation-iteration-count: 1; 
          animation-fill-mode: backwards; 
        }
        
        @keyframes charBreakAnim {
          /* Mezcla de explosión de fragmentos Y desplazamiento de tiras */
          0%   { transform: translate(0, 0); opacity: 1; clip-path: inset(0 0 0 0); }
          8%   { 
            /* Tira superior, shift izq */
            transform: translate(-30px, 2px); 
            opacity: 0.7; 
            clip-path: inset(0 0 75% 0); 
          }
          16%  { 
            /* Fragmento pequeño, arriba der */
            transform: translate(35px, -25px); 
            opacity: 0.4; 
            clip-path: inset(10% 70% 70% 10%); 
          }
          25%  { 
            /* Tira media, shift der */
            transform: translate(30px, 0); 
            opacity: 0.6; 
            clip-path: inset(25% 0 45% 0); 
          }
          33%  { 
             /* Desaparece */
            transform: translate(30px, 0); 
            opacity: 0; 
            clip-path: inset(25% 0 45% 0); 
          }
          41%  { 
            /* Fragmento, abajo izq */
            transform: translate(-25px, 28px); 
            opacity: 0.8; 
            clip-path: inset(70% 55% 5% 20%); 
          }
          50%  { 
            /* Tira inferior, shift izq rápido */
            transform: translate(-45px, -3px); 
            opacity: 0.5; 
            clip-path: inset(70% 0 0 0); 
          }
          58%  { 
            /* Otro fragmento, arriba izq */
            transform: translate(-20px, -30px); 
            opacity: 0.7;
            clip-path: inset(5% 50% 75% 5%); 
          }
          66%  { 
             /* Desaparece */
            transform: translate(-20px, -30px); 
            opacity: 0; 
            clip-path: inset(5% 50% 75% 5%); 
          }
          75%  { 
            /* Tira central, shift der */
            transform: translate(38px, 2px); 
            opacity: 0.9; 
            clip-path: inset(40% 0 40% 0); 
          }
          83%  { 
            /* Fragmento final, abajo der */
            transform: translate(25px, 30px); 
            opacity: 0.6;
            clip-path: inset(65% 10% 10% 60%); 
          }
          91%  { 
            /* Desaparece antes de volver */
            transform: translate(0, 0); 
            opacity: 0; 
            clip-path: inset(0 0 0 0); 
          }
          100% { transform: translate(0, 0); opacity: 1; clip-path: inset(0 0 0 0); }
        }

        /* --- ESTILOS BASE PARA ABERRACIÓN/BEND (...) - VELOCIDAD MÁXIMA --- */
        .base-char.char-breaking::before,
        .base-char.char-breaking::after {
          content: attr(data-char);
          position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; opacity: 0.55;
          will-change: transform, opacity;
          /* Propiedades comunes de animación - animation-name se define por clase */
          animation-duration: 0.04s; /* VELOCIDAD MÁXIMA */
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-direction: alternate;
          animation-name: none; 
        }

        .base-char.char-breaking::before {
          color: rgba(255, 0, 0, 0.6); 
          z-index: 3; 
        }

        .base-char.char-breaking::after {
          color: rgba(0, 0, 255, 0.6); 
          z-index: 2; 
          /* Hereda el delay del padre .base-char */
        }

        /* === ASIGNACIÓN DE ANIMACIÓN ROJA POR CLASE (::before) === */
        .base-char.use-aberration-red-a::before { animation-name: charAberrationRed_A; }
        .base-char.use-aberration-red-b::before { animation-name: charAberrationRed_B; }
        .base-char.use-aberration-red-c::before { animation-name: charAberrationRed_C; }

        /* === ASIGNACIÓN DE ANIMACIÓN AZUL POR CLASE (::after) === */
        .base-char.use-aberration-blue-a::after { animation-name: charAberrationBlue_A; }
        .base-char.use-aberration-blue-b::after { animation-name: charAberrationBlue_B; }
        .base-char.use-aberration-blue-c::after { animation-name: charAberrationBlue_C; }

        /* === VARIANTES DE ANIMACIÓN ROJA (Keyframes sin cambios) === */
        @keyframes charAberrationRed_A { 0%{...} 100%{...} }
        @keyframes charAberrationRed_B { 0%{...} 100%{...} }
        @keyframes charAberrationRed_C { 0%{...} 100%{...} }
        /* Definiciones completas de los keyframes anteriores */
        @keyframes charAberrationRed_A {0% { transform: translate(0) scale(1) skew(0); opacity: 0.5; } 100% { transform: translate(-12px, 6px) scale(1.05, 1.25) skew(-10deg); opacity: 0.4; } }
        @keyframes charAberrationRed_B {0% { transform: translate(0) scale(1) skew(0); opacity: 0.5; } 100% { transform: translate(10px, -8px) scale(1.15, 1.05) skew(18deg); opacity: 0.45; } }
        @keyframes charAberrationRed_C {0% { transform: translate(0) scale(1) skew(0); opacity: 0.5; } 100% { transform: translate(-16px, -10px) scale(1.1, 1.1) skew(-5deg); opacity: 0.4; } }

        /* === VARIANTES DE ANIMACIÓN AZUL (Keyframes sin cambios) === */
        @keyframes charAberrationBlue_A { 0%{...} 100%{...} }
        @keyframes charAberrationBlue_B { 0%{...} 100%{...} }
        @keyframes charAberrationBlue_C { 0%{...} 100%{...} }
        /* Definiciones completas de los keyframes anteriores */
        @keyframes charAberrationBlue_A {0% { transform: translate(0) scale(1) skew(0); opacity: 0.55; } 100% { transform: translate(13px, -7px) scale(1.25, 1.05) skew(8deg); opacity: 0.45; } }
        @keyframes charAberrationBlue_B {0% { transform: translate(0) scale(1) skew(0); opacity: 0.55; } 100% { transform: translate(-9px, 11px) scale(1.05, 1.15) skew(0, -15deg); opacity: 0.5; } }
        @keyframes charAberrationBlue_C {0% { transform: translate(0) scale(1) skew(0); opacity: 0.55; } 100% { transform: translate(14px, 12px) scale(1.1, 1.1) skew(6deg); opacity: 0.45; } }

        /* ... (Estilos base char - sin cambios) ... */
        .base-char { position: relative; display: inline-block; z-index: 1; }

        /* --- FIN ESTILOS --- */
      `}</style>

      {/* Hero Section */}
      <motion.section 
        className="relative flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Contenedor del Título con Ref y Data-Text */}
        <div ref={titleRef} data-text={currentTitleText} className="title-container z-10">
          {/* Título H1 */}
          <motion.h1 
            className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            variants={item}
          >
            {/* Usar CharWrapper para aplicar efectos */}
            <CharWrapper text={titlePart1} />
            <br />
            <CharWrapper text={titlePart2} />
          </motion.h1>
        </div>

        {/* Subtítulo con efecto glitch */}
        <motion.div 
          ref={subtitleRef}
          data-text={currentSubtitleText}
          className="title-container mt-6 max-w-2xl text-lg text-gray-300 md:text-xl z-10"
          variants={item}
        >
          <CharWrapper text={currentSubtitleText} />
        </motion.div>

        {/* Botones */}
        <motion.div 
          className="mt-10 flex flex-wrap justify-center gap-4 z-10"
          variants={item}
        >
          <Button asChild variant="default" size="lg" className="frosted-glass-hover">
            <Link href="/projects" className="flex items-center text-white">
              <div 
                ref={buttonTextRef} 
                data-text={texts[language].viewProjectsBtn} 
                className="title-container"
              >
                <CharWrapper text={texts[language].viewProjectsBtn} />
              </div>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="frosted-glass-hover">
            <Link href="/contact">
              <div 
                ref={contactButtonRef} 
                data-text={texts[language].getInTouchBtn} 
                className="title-container"
              >
                <CharWrapper text={texts[language].getInTouchBtn} />
              </div>
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* Featured Projects Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {texts[language].featuredProjectsTitle} {/* Texto internacionalizado */}
          </h2>
          {/* El componente FeaturedProjects necesitará su propia internacionalización si contiene texto */}
          <Suspense fallback={<div className="text-center text-gray-400">Loading projects...</div>}>
            <FeaturedProjects />
          </Suspense>
        </div>
      </section>
    </>
  )
}

