"use client"

import React from 'react';

const AnimatedNdLogo = () => {
  const size = 45;
  const center = size / 2;
  // Calcular radio original y luego aumentarlo 20%
  const originalRadius = center - 3;
  const radius = originalRadius * 1.2; 
  const strokeWidthCircle = 1.5; // Grosor del círculo ligeramente reducido
  const strokeWidthLetters = 1.8; // Letras más finas

  // Coordenadas reescaladas y ajustadas para proporción
  // N: (x1 y1) L (x1 y2) L (x2 y1) L (x2 y2)
  const n_x1 = size * 0.28; // Ajustado para proporción
  const n_x2 = size * 0.52; // Ajustado para proporción
  const n_y1 = size * 0.70; // Menos altas
  const n_y2 = size * 0.30; // Menos altas
  const d_n = `M ${n_x1} ${n_y1} L ${n_x1} ${n_y2} L ${n_x2} ${n_y1} L ${n_x2} ${n_y2}`;

  // D: M (x1 y2) L (x1 y1) C (x2 y1) (x2 y2) (x1 y2) Z
  const d_x1 = size * 0.60; // Inicio de la D
  const d_y1 = n_y1; // Misma altura que N
  const d_y2 = n_y2;
  const d_cx = size * 0.88; // Control de curva más ancho
  const d_d = `M ${d_x1} ${d_y2} L ${d_x1} ${d_y1} C ${d_cx} ${d_y1} ${d_cx} ${d_y2} ${d_x1} ${d_y2} Z`;

  return (
    <div 
      className="fixed /* bottom-4 left-4 */ top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
      title="Status Indicator"
    >
      <svg 
        width={size}
        height={size} 
        viewBox={`-2 -2 ${size + 4} ${size + 4}`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Círculo exterior con nuevo tamaño y color */}
        <circle 
          cx={center}
          cy={center} 
          r={radius}
          stroke="hsl(var(--border))" /* Color gris medio del tema */
          strokeWidth={strokeWidthCircle} 
          fill="transparent" 
        />

        {/* Letra N animada con trazo más fino */}
        <path 
          d={d_n}
          stroke="hsl(var(--foreground))" 
          strokeWidth={strokeWidthLetters} 
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="animate-draw-n"
        />

        {/* Letra D animada con trazo más fino */}
        <path 
          d={d_d}
          stroke="hsl(var(--foreground))" 
          strokeWidth={strokeWidthLetters}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="animate-draw-d"
        />
      </svg>

      {/* Estilos y Animaciones */}
      <style jsx>{`
        .animate-draw-n,
        .animate-draw-d {
          stroke-dasharray: 150;
          stroke-dashoffset: 150;
          opacity: 0; /* Empezar invisible */
          animation-iteration-count: infinite;
          /* Usar la curva de bezier solo para el trazado */
          /* La opacidad usará la curva por defecto (ease) o la especificada en keyframes */
        }

        .animate-draw-n {
          animation-name: drawAndFadeN;
          animation-duration: 2s;
          animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
          animation-delay: 0s; 
        }

        .animate-draw-d {
          animation-name: drawAndFadeD;
          animation-duration: 2s;
          animation-timing-function: cubic-bezier(0.42, 0, 0.58, 1);
          /* El retraso se maneja dentro de los keyframes de drawAndFadeD */
        }

        /* Keyframes para N */
        @keyframes drawAndFadeN {
          0% { 
            stroke-dashoffset: 150;
            opacity: 0; 
          }
          10% { 
            stroke-dashoffset: 150; /* Aún no empieza a dibujar */
            opacity: 1; /* Pero ya es visible */
          }
          40% { 
            stroke-dashoffset: 0; /* Dibujo completado */
            opacity: 1; 
          }
          80% { 
            stroke-dashoffset: 0; /* Mantenido */
            opacity: 1; 
          }
          100% { 
            stroke-dashoffset: 0; /* Mantenido mientras se desvanece */
            opacity: 0; /* Desvanecido */
          }
        }

        /* Keyframes para D (retraso incorporado) */
        @keyframes drawAndFadeD {
          0%, 20% { /* 0.4s de retraso (20% de 2s) */
            stroke-dashoffset: 150;
            opacity: 0; 
          }
          30% { /* Empieza a ser visible */
            stroke-dashoffset: 150;
            opacity: 1; 
          }
          60% { /* Dibujo completado (más tarde que N) */
            stroke-dashoffset: 0;
            opacity: 1; 
          }
          80% { /* Mantenido (sincronizado con N) */
            stroke-dashoffset: 0; 
            opacity: 1; 
          }
          100% { /* Desvanecido (sincronizado con N) */
            stroke-dashoffset: 0; 
            opacity: 0; 
          }
        }
        
        /* Pequeño pulso sutil después de dibujar */
        svg:hover path {
          animation: subtlePulse 2s infinite alternate ease-in-out;
        }

        @keyframes subtlePulse {
          from {
            stroke: hsl(var(--foreground));
          }
          to {
            stroke: hsl(262, 83%, 80%); /* Lila sutil */
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedNdLogo; 