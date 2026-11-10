import type { Metadata } from "next"
import TopBar from "@/components/top-bar"
import { WorkHead } from "@/components/home"
import { Contact, Software, ThreeD, Web } from "@/components/sections"
import { Guides, Sheet } from "@/components/technical"

export const metadata: Metadata = {
  title: "Work — SynrgStudio",
  description: "Software, websites and 3D made by SynrgStudio, each with its screenshots and its measured numbers.",
}

// Todo el trabajo en detalle: una lámina por pieza.
export default function Work() {
  return (
    <>
      <Sheet />
      <Guides />
      <TopBar />
      <main>
        <WorkHead />
        <Software />
        <Web />
        <ThreeD />
      </main>
      <Contact sheet="D" />
    </>
  )
}
