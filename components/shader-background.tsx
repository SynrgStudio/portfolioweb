"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type * as THREE from "three"

// Shader code
const fragmentShader = `
  uniform float u_time;
  varying vec2 vUv;
  
  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Create subtle movement
    float time = u_time * 0.05;
    
    // Generate noise at different frequencies and amplitudes
    float noise1 = snoise(uv * 3.0 + time) * 0.5;
    float noise2 = snoise(uv * 6.0 - time * 0.3) * 0.25;
    float noise3 = snoise(uv * 12.0 + time * 0.5) * 0.125;
    
    float finalNoise = (noise1 + noise2 + noise3) * 0.15; // Keep it subtle
    
    // Create a gradient from bottom to top
    float gradient = 1.0 - uv.y * 0.7;
    
    // Primary color (blue) with very subtle variation
    vec3 color = vec3(0.05, 0.1, 0.2) + finalNoise * vec3(0.0, 0.05, 0.1);
    
    // Add vignette effect
    float vignette = smoothstep(1.0, 0.3, length(uv - 0.5) * 1.5);
    color = mix(color * 0.5, color, vignette);
    
    // Apply gradient
    color = mix(color * 0.5, color, gradient);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={{
          u_time: { value: 0.0 },
        }}
      />
    </mesh>
  )
}

export default function ShaderBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <ShaderPlane />
      </Canvas>
    </div>
  )
}

