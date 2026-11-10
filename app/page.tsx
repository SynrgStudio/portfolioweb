import TopBar from "@/components/top-bar"
import Hero from "@/components/hero"
import { Does, Why, WorkIndex } from "@/components/home"
import { Contact, Method } from "@/components/sections"
import { Guides, Sheet } from "@/components/technical"

// La portada da el panorama: qué hace el estudio, todo lo publicado de un
// vistazo, cómo trabaja y por qué elegirlo. El detalle está en /work.
export default function Home() {
  return (
    <>
      <Sheet />
      <Guides />
      <TopBar />
      <main>
        <Hero />
        <Does />
        <WorkIndex />
        <Method />
        <Why />
      </main>
      <Contact />
    </>
  )
}
