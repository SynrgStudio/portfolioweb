import type { Metadata } from "next"
import TopBar from "@/components/top-bar"
import Ecosystem from "@/components/ecosystem"
import { Contact } from "@/components/sections"
import { copy } from "@/lib/ecosystem/copy"

export const metadata: Metadata = {
  title: copy.en.meta.title,
  description: copy.en.meta.description,
  alternates: { canonical: "/ecosystem/" },
}

// Cómo se conectan Caliper, .bread y Breadslicer, contado bajando (components/ecosystem.tsx).
export default function EcosystemPage() {
  return (
    <>
      <TopBar />
      <main className="relative">
        <Ecosystem />
      </main>
      <div className="relative z-10 bg-[#111214]">
        <Contact />
      </div>
    </>
  )
}
