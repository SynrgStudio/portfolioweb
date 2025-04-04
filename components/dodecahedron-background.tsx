"use client"

import React, { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

// Coordenadas de los vértices de un dodecaedro con más puntos adicionales
const vertices = [
  // Vértices originales del dodecaedro
  [0, 0.618, 1], [0, 0.618, -1], [0, -0.618, 1], [0, -0.618, -1],
  [1, 0, 0.618], [1, 0, -0.618], [-1, 0, 0.618], [-1, 0, -0.618],
  [0.618, 1, 0], [0.618, -1, 0], [-0.618, 1, 0], [-0.618, -1, 0],
  [1.618, 0.618, 0], [1.618, -0.618, 0], [-1.618, 0.618, 0], [-1.618, -0.618, 0],
  [1, 1.618, 0], [1, -1.618, 0], [-1, 1.618, 0], [-1, -1.618, 0],
  // Puntos adicionales para hacer el dodecaedro más complejo y asimétrico
  [0.8, 0.8, 0.8], [-0.8, 0.8, 0.8], [0.8, -0.8, 0.8], [-0.8, -0.8, 0.8],
  [0.8, 0.8, -0.8], [-0.8, 0.8, -0.8], [0.8, -0.8, -0.8], [-0.8, -0.8, -0.8],
  [1.2, 0.4, 0.4], [-1.3, 0.5, 0.3], [1.1, -0.45, 0.35], [-1.15, -0.35, 0.42],
  [1.18, 0.45, -0.38], [-1.25, 0.38, -0.42], [1.22, -0.36, -0.41], [-1.24, -0.43, -0.39],
  [0.45, 1.15, 0.42], [-0.37, 1.25, 0.38], [0.42, -1.18, 0.36], [-0.39, -1.23, 0.42],
  [0.38, 1.24, -0.45], [-0.43, 1.19, -0.37], [0.44, -1.17, -0.39], [-0.36, -1.21, -0.43],
  [0.39, 0.37, 1.22], [-0.41, 0.43, 1.18], [0.44, -0.38, 1.23], [-0.42, -0.41, 1.19],
  [0.37, 0.41, -1.21], [-0.45, 0.38, -1.24], [0.42, -0.36, -1.18], [-0.39, -0.43, -1.15]
].map(([x, y, z]) => [x * 510, y * 510, z * 408]); // 70% más grande (300 * 1.7 = 510)

// Vértices para el dodecaedro del fondo (más simple y grande, con asimetría)
const backgroundVertices = [
  // 12 vértices del dodecaedro con ligeras asimetrías
  [0.05, 0.62, 1.62], [-0.04, 0.615, -1.61], [0.03, -0.625, 1.63], [-0.05, -0.61, -1.59],
  [1.63, 0.02, 0.615], [1.61, -0.03, -0.62], [-1.62, 0.04, 0.625], [-1.59, -0.05, -0.61],
  [0.625, 1.63, 0.02], [0.61, -1.59, -0.03], [-0.615, 1.61, 0.05], [-0.62, -1.62, -0.04]
].map(([x, y, z]) => [x * 700, y * 700, z * 700]); // Más grande que el dodecaedro principal

// Aristas para el dodecaedro del fondo
const backgroundEdges = [
  [0, 2], [0, 4], [0, 6], [1, 3], [1, 5], [1, 7],
  [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [0, 8],
  [0, 10], [1, 8], [1, 10], [2, 9], [2, 11], [3, 9],
  [3, 11], [4, 8], [5, 8], [6, 10], [7, 10], [4, 9],
  [5, 9], [6, 11], [7, 11]
];

// Aristas principales del dodecaedro
const edges = [
  [0, 2], [0, 4], [0, 6], [1, 3], [1, 5], [1, 7],
  [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13],
  [14, 15], [16, 17], [18, 19], [0, 8], [0, 10], [1, 8],
  [1, 10], [2, 9], [2, 11], [3, 9], [3, 11], [4, 12],
  [4, 16], [5, 12], [5, 16], [6, 14], [6, 18], [7, 14],
  [7, 18], [8, 16], [9, 17], [10, 18], [11, 19], [12, 17],
  [13, 17], [14, 19], [15, 19]
];

// Aristas adicionales para los nuevos vértices (conexiones selectivas para no saturar)
const additionalEdges = [
  [20, 21], [22, 23], [24, 25], [26, 27], [28, 29], [30, 31],
  [32, 33], [34, 35], [36, 37], [38, 39], [40, 41], [42, 43],
  [44, 45], [46, 47], [48, 49], [50, 51], [0, 20], [1, 24],
  [4, 28], [5, 32], [8, 36], [9, 38], [13, 34], [17, 42],
  [19, 43], [21, 45], [23, 47], [25, 49], [27, 51], [29, 46],
  [31, 44], [33, 48], [35, 50]
];

// Combinamos todas las aristas
const allEdges = [...edges, ...additionalEdges];

// Función para proyectar 3D a 2D
function project(x: number, y: number, z: number) {
  // Valor de z más grande = más cercano = más grande
  const scale = 2040 / (2040 - z); // Aumentado para manejar objetos más grandes
  return {
    x: x * scale,
    y: y * scale,
    z
  };
}

function rotate(point: number[], angleX: number, angleY: number) {
  let [x, y, z] = point;
  
  // Rotación X
  const cosX = Math.cos(angleX);
  const sinX = Math.sin(angleX);
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;
  
  // Rotación Y
  const cosY = Math.cos(angleY);
  const sinY = Math.sin(angleY);
  const x1 = x * cosY + z1 * sinY;
  const z2 = -x * sinY + z1 * cosY;
  
  return [x1, y1, z2];
}

// Definición de las formas orgánicas
const organicShapes = [
  { 
    baseSize: 45, 
    posX: 0, 
    posY: 0, 
    speedX: 0.002, 
    speedY: 0.003, 
    pulseSpeed: 0.9, 
    color1: 'rgba(147, 51, 234, 0.6)', 
    color2: 'rgba(139, 92, 246, 0.45)'
  },
  { 
    baseSize: 40, 
    posX: 15, 
    posY: -10, 
    speedX: -0.0015, 
    speedY: 0.002, 
    pulseSpeed: 0.8, 
    color1: 'rgba(219, 39, 119, 0.5)', 
    color2: 'rgba(147, 51, 234, 0.4)'
  },
  { 
    baseSize: 30, 
    posX: -20, 
    posY: 15, 
    speedX: 0.0015, 
    speedY: -0.001, 
    pulseSpeed: 0.7, 
    color1: 'rgba(124, 58, 237, 0.45)', 
    color2: 'rgba(79, 70, 229, 0.4)'
  },
  { 
    baseSize: 35, 
    posX: 12, 
    posY: 18, 
    speedX: -0.0018, 
    speedY: -0.0012, 
    pulseSpeed: 0.75, 
    color1: 'rgba(67, 56, 202, 0.4)', 
    color2: 'rgba(139, 92, 246, 0.5)' 
  },
  // Nueva forma azulada en esquina superior izquierda
  { 
    baseSize: 50, 
    posX: -70, 
    posY: -40, 
    speedX: 0.001, 
    speedY: 0.0015, 
    pulseSpeed: 0.65, 
    color1: 'rgba(59, 130, 246, 0.65)', // Azul más intenso
    color2: 'rgba(37, 99, 235, 0.5)' // Azul oscuro
  },
  // Segunda forma azulada más pequeña para acompañar
  { 
    baseSize: 25, 
    posX: -80, 
    posY: -20, 
    speedX: 0.002, 
    speedY: -0.001, 
    pulseSpeed: 0.8, 
    color1: 'rgba(96, 165, 250, 0.5)', // Azul claro
    color2: 'rgba(30, 64, 175, 0.4)' // Azul índigo
  },
  // Tercera forma azulada mediana para completar el conjunto
  { 
    baseSize: 38, 
    posX: -65, 
    posY: -35, 
    speedX: -0.0015, 
    speedY: 0.001, 
    pulseSpeed: 0.75, 
    color1: 'rgba(14, 165, 233, 0.5)', // Azul cielo
    color2: 'rgba(3, 105, 161, 0.4)' // Azul oscuro
  },
  // Nuevas formas azuladas que se mueven por la pantalla
  { 
    baseSize: 42, 
    posX: 30, 
    posY: -50, 
    speedX: 0.0005, 
    speedY: 0.001, 
    pulseSpeed: 0.55, 
    color1: 'rgba(56, 189, 248, 0.45)', // Azul celeste
    color2: 'rgba(2, 132, 199, 0.35)' // Azul medio
  },
  { 
    baseSize: 36, 
    posX: 60, 
    posY: 30, 
    speedX: -0.0008, 
    speedY: -0.0005, 
    pulseSpeed: 0.6, 
    color1: 'rgba(6, 182, 212, 0.4)', // Cian
    color2: 'rgba(8, 145, 178, 0.3)' // Cian oscuro
  },
  { 
    baseSize: 28, 
    posX: -40, 
    posY: 50, 
    speedX: 0.0007, 
    speedY: -0.0012, 
    pulseSpeed: 0.7, 
    color1: 'rgba(14, 116, 144, 0.35)', // Azul verdoso
    color2: 'rgba(22, 78, 99, 0.25)' // Azul verdoso oscuro
  },
  { 
    baseSize: 33, 
    posX: -80, 
    posY: 40, 
    speedX: 0.001, 
    speedY: 0.0008, 
    pulseSpeed: 0.65, 
    color1: 'rgba(125, 211, 252, 0.4)', // Azul claro
    color2: 'rgba(14, 116, 144, 0.3)' // Azul verdoso
  }
];

// Un componente de fondo con dodecaedro interactivo
export default function DodecahedronBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rotationX, setRotationX] = useState(Math.random() * Math.PI * 2); // Rotación X inicial aleatoria
  const [rotationY, setRotationY] = useState(Math.random() * Math.PI * 2); // Rotación Y inicial aleatoria
  const [bgRotationX, setBgRotationX] = useState(Math.random() * Math.PI * 2); // Rotación X inicial aleatoria para el fondo
  const [bgRotationY, setBgRotationY] = useState(Math.random() * Math.PI * 2); // Rotación Y inicial aleatoria para el fondo
  const [projectedVertices, setProjectedVertices] = useState<{x: number, y: number, z: number}[]>([]);
  const [projectedBgVertices, setProjectedBgVertices] = useState<{x: number, y: number, z: number}[]>([]);
  const [pulsePhase, setPulsePhase] = useState(Math.random() * Math.PI * 2); // Fase inicial aleatoria
  const [organicShapeStates, setOrganicShapeStates] = useState(
    organicShapes.map(shape => ({
      posX: shape.posX + (Math.random() * 10 - 5), // Posición inicial ligeramente aleatoria
      posY: shape.posY + (Math.random() * 10 - 5), // Posición inicial ligeramente aleatoria
      size: shape.baseSize * (0.9 + Math.random() * 0.2), // Tamaño inicial aleatorio
      phase: Math.random() * Math.PI * 2
    }))
  );
  
  // Usar refs para mantener los valores actuales sin provocar re-renderizados
  const rotationXRef = useRef(rotationX);
  const rotationYRef = useRef(rotationY);
  const bgRotationXRef = useRef(bgRotationX);
  const bgRotationYRef = useRef(bgRotationY);
  const pulsePhaseRef = useRef(pulsePhase);
  const organicShapeStatesRef = useRef(organicShapeStates);
  const lastTimeRef = useRef(0);
  
  const animationRef = useRef<number>(0);
  const pathname = usePathname(); // Obtener la ruta actual
  
  // Rango de detección del mouse (300% más grande)
  const mouseDetectionRange = 900; // 300 * 3
  
  // Sincronizar los refs con los estados cuando cambian
  useEffect(() => {
    rotationXRef.current = rotationX;
    rotationYRef.current = rotationY;
    bgRotationXRef.current = bgRotationX;
    bgRotationYRef.current = bgRotationY;
    pulsePhaseRef.current = pulsePhase;
    organicShapeStatesRef.current = organicShapeStates;
  }, [rotationX, rotationY, bgRotationX, bgRotationY, pulsePhase, organicShapeStates]);
  
  // Manejar rotación continua y seguimiento del mouse
  useEffect(() => {
    // Manejar el movimiento del mouse
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    };
    
    const animate = (time: number) => {
      const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = time;
      
      // Actualizar las referencias directamente - ahora permitimos que esto ocurra en todas las páginas, incluida glitch-documentation
      rotationXRef.current += 0.05 * deltaTime;
      rotationYRef.current += 0.08 * deltaTime;
      bgRotationXRef.current -= 0.03 * deltaTime;
      bgRotationYRef.current -= 0.04 * deltaTime;
      pulsePhaseRef.current = (pulsePhaseRef.current + deltaTime * 0.8) % (Math.PI * 2);
      
      // Actualizar las formas orgánicas
      const newOrganicShapeStates = organicShapeStatesRef.current.map((state, index) => {
        const shape = organicShapes[index];
        const timeOffset = time * 0.0002;
        const moveX = 
          Math.sin(timeOffset + index * 0.7) * 15 + 
          Math.sin(timeOffset * 1.5 + index * 1.3) * 8;
        const moveY = 
          Math.cos(timeOffset * 0.8 + index * 0.9) * 12 + 
          Math.cos(timeOffset * 1.7 + index * 0.5) * 10;
        
        const sizePhase = timeOffset * shape.pulseSpeed + state.phase;
        const sizeFactor = 0.85 + 0.20 * Math.sin(sizePhase);
        
        return {
          posX: shape.posX + moveX,
          posY: shape.posY + moveY,
          size: shape.baseSize * sizeFactor,
          phase: state.phase + deltaTime * 0.05
        };
      });
      
      // Proyectar vértices
      const projected = vertices.map(vertex => {
        const rotated = rotate(vertex, rotationXRef.current, rotationYRef.current);
        return project(rotated[0], rotated[1], rotated[2]);
      });
      
      const projectedBg = backgroundVertices.map(vertex => {
        const rotated = rotate(vertex, bgRotationXRef.current, bgRotationYRef.current);
        return project(rotated[0], rotated[1], rotated[2]);
      });
      
      // Usaremos una frecuencia de actualización constante para todas las páginas
      const updateFrequency = 3;
      
      // Actualizar los estados con los nuevos valores (esto provocará un re-renderizado)
      setRotationX(rotationXRef.current);
      setRotationY(rotationYRef.current);
      setBgRotationX(bgRotationXRef.current);
      setBgRotationY(bgRotationYRef.current);
      setPulsePhase(pulsePhaseRef.current);
      setOrganicShapeStates(newOrganicShapeStates);
      setProjectedVertices(projected);
      setProjectedBgVertices(projectedBg);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [pathname]);

  return (
    <div className="fixed inset-0 -z-10 bg-black" ref={containerRef}>
      {/* Fondo con formas orgánicas */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {organicShapeStates.map((state, index) => {
          const shape = organicShapes[index];
          
          // Calcular rotación basada en la rotación del dodecaedro para sensación de interacción
          const rotationInfluence = rotationX * 15 + rotationY * 20;
          const customRotation = pulsePhase * 20 + index * 45 + rotationInfluence;
          
          // Calcular punto focal dinámico para el gradiente basado en la rotación del dodecaedro
          const focalX = 50 + Math.sin(pulsePhase + rotationX + index * 0.2) * 30;
          const focalY = 50 + Math.cos(pulsePhase + rotationY + index * 0.5) * 30;
          
          // Determinar qué clase de animación usar basado en el índice para evitar sincronización
          let animationClass = "";
          if (index % 3 === 0) {
            animationClass = "animate-morph";
          } else if (index % 3 === 1) {
            animationClass = "animate-morph-alt1";
          } else {
            animationClass = "animate-morph-alt2";
          }

          return (
            <div 
              key={`organic-shape-${index}`}
              className={`absolute ${animationClass} will-change-transform`}
              style={{
                width: `${state.size}vw`,
                height: `${state.size}vw`,
                left: `calc(50% + ${state.posX}vw)`,
                top: `calc(50% + ${state.posY}vw)`,
                transform: `translate(-50%, -50%) rotate(${customRotation * 0.05}deg)`, // Reducido de 0.1 a 0.05
                background: `radial-gradient(circle at ${focalX}% ${focalY}%, ${shape.color1}, ${shape.color2})`,
                opacity: 0.35,
                filter: `blur(${state.size / 7}vw)`,
                zIndex: -2,
                transition: 'transform 0.5s linear, background 0.5s linear, filter 0.5s linear' // Transición más lenta y lineal
              }}
            />
          );
        })}
      </div>
      
      {/* Dodecaedro de fondo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full">
          {/* Aristas del dodecaedro de fondo */}
          {projectedBgVertices.length === backgroundVertices.length && backgroundEdges.map((edge, i) => {
            const start = projectedBgVertices[edge[0]];
            const end = projectedBgVertices[edge[1]];
            
            // Calcular el centro del segmento para el gradiente
            const centerX = (start.x + end.x) / 2;
            const centerY = (start.y + end.y) / 2;
            const pulseOffset = i % 3; // Diferentes offset para cada tercio de aristas

  return (
              <div 
                key={`bg-edge-${i}`}
                className="absolute will-change-transform"
                style={{
                  width: `${Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))}px`,
                  height: '3px',
                  transformOrigin: '0 0',
                  transform: `translate(${start.x + window.innerWidth/2}px, ${start.y + window.innerHeight/2}px) rotate(${Math.atan2(end.y - start.y, end.x - start.x)}rad)`,
                  background: `linear-gradient(90deg, 
                              rgba(139, 92, 246, ${0.07 * (0.5 + 0.5 * Math.sin(pulsePhase + pulseOffset))}) 0%, 
                              rgba(147, 51, 234, ${0.12 * (0.5 + 0.5 * Math.sin(pulsePhase + pulseOffset + Math.PI/4))}) 50%, 
                              rgba(139, 92, 246, ${0.07 * (0.5 + 0.5 * Math.sin(pulsePhase + pulseOffset))}) 100%)`,
                  boxShadow: `0 0 10px rgba(147, 51, 234, ${0.05 * (0.5 + 0.5 * Math.sin(pulsePhase + pulseOffset))})`,
                  zIndex: -1,
                  filter: 'blur(2px)',
                  transition: 'transform 0.3s linear, background 0.3s linear' // Añadida transición
                }}
              />
            );
          })}
        </div>
      </div>
      
      {/* Dodecaedro principal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-full h-full">
          {/* Aristas */}
          {allEdges.map((edge, i) => {
            if (projectedVertices.length < vertices.length) return null;
            
            const startIndex = edge[0];
            const endIndex = edge[1];
            const start = projectedVertices[startIndex];
            const end = projectedVertices[endIndex];

            // Calcular distancia total y ángulo
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx); 

            if (dist === 0) return null; 
            
            // Calcular una longitud ligeramente mayor
            const edgeWidth = dist + 2; // Añadir 2px extra

            // Calcular un z-index seguro (debajo de ambos vértices)
            const edgeZIndex = Math.floor(Math.min(start.z, end.z)) - 1;

            return (
              <div 
                key={`edge-${i}`}
                className="absolute bg-gray-700/30 will-change-transform"
                style={{
                  // Usar la longitud ligeramente mayor
                  width: `${edgeWidth}px`,
                  height: '1px',
                  transformOrigin: '0 0',
                  // Posicionar la esquina en el centro del vértice inicial y rotar
                  transform: `translate(${start.x + window.innerWidth/2}px, ${start.y + window.innerHeight/2}px) rotate(${angle}rad)`,
                  // Usar el z-index calculado para asegurar que esté debajo
                  zIndex: edgeZIndex,
                }}
              />
            );
          })}
          
          {/* Vértices */}
          {projectedVertices.map((vertex, i) => {
            // Calcular distancia al mouse de manera precisa
            const dist = Math.sqrt(Math.pow(mousePos.x - vertex.x, 2) + Math.pow(mousePos.y - vertex.y, 2));
            // Determinar si el mouse está cerca
            const isClose = dist < mouseDetectionRange;

            // Tamaño de vértice basado en si es original o añadido
            const vertexSize = i < 20 ? 8 : 5; // Vértices ligeramente más grandes

            // Determinar si se deben mostrar las líneas interactivas (solo si está cerca Y no es la página de docs)
            const showInteractiveLine = isClose && pathname !== '/glitch-documentation';

  return (
              <React.Fragment key={`vertex-${i}`}>
                <div
                  className="absolute rounded-full bg-white/70 will-change-transform"
                  style={{
                    width: `${vertexSize}px`,
                    height: `${vertexSize}px`,
                    // Usar left/top para la posición central
                    left: `${vertex.x + window.innerWidth/2}px`,
                    top: `${vertex.y + window.innerHeight/2}px`,
                    // Centrar el elemento en ese punto
                    transform: `translate(-50%, -50%)`,
                    zIndex: Math.floor(vertex.z),
                    opacity: showInteractiveLine ? 0.9 : 0.7,
                  }}
                />

                {/* Línea "simbiótica" al mouse */}
                {showInteractiveLine && (
                  <div
                    className="absolute will-change-transform"
                    style={{
                      width: `${dist}px`,
                      height: '2px',
                      // Usar left/top para posicionar origen de línea
                      left: `${vertex.x + window.innerWidth/2}px`,
                      top: `${vertex.y + window.innerHeight/2}px`,
                      // Rotar desde centro-izquierdo y ajustar altura
                      transformOrigin: '0% 50%', 
                      transform: `rotate(${Math.atan2(mousePos.y - vertex.y, mousePos.x - vertex.x)}rad) translateY(-1px)`,
                      zIndex: Math.floor(vertex.z),
                      background: `linear-gradient(90deg,
                                  rgba(147, 51, 234, ${(1 - dist/mouseDetectionRange) * 0.95}) 0%,
                                  rgba(219, 39, 119, ${(1 - dist/mouseDetectionRange) * 0.9}) 50%,
                                  rgba(139, 92, 246, ${(1 - dist/mouseDetectionRange) * 0.85}) 100%)`,
                      boxShadow: `0 0 8px rgba(147, 51, 234, ${(1 - dist/mouseDetectionRange) * 0.8}),
                                  0 0 15px rgba(139, 92, 246, ${(1 - dist/mouseDetectionRange) * 0.7}),
                                  0 0 20px rgba(221, 81, 247, ${(1 - dist/mouseDetectionRange) * 0.6})`,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

