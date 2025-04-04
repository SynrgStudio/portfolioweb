"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Importa dinámicamente el fondo para evitar que bloquee la carga inicial de la página
// Usamos noSSR para asegurarnos que sólo se renderice en el cliente
const DodecahedronBackground = dynamic(() => import("@/components/dodecahedron-background"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-black" />,
})

export function DynamicBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-black">
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-black" />}>
        <DodecahedronBackground />
      </Suspense>
    </div>
  )
} 