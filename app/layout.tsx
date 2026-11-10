import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { LanguageProvider } from "@/components/language"

// Las dos tipografías van recortadas a lo que el sitio usa: Archivo en pesos
// 400 a 700 y anchos 100 a 125, JetBrains Mono en 400 a 500, solo latín.
// Pesan 86 KB entre las dos, contra 128 KB de las versiones completas.
// Se generaron con fontTools (varLib.instancer) a partir de las de Google Fonts.
const sans = localFont({
  src: "./fonts/archivo.woff2",
  weight: "400 700",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
  variable: "--font-sans",
  display: "swap",
})
const mono = localFont({
  src: "./fonts/jetbrains-mono.woff2",
  weight: "400 500",
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SynrgStudio — software that doesn't make you wait",
  description:
    "SynrgStudio makes native tools for Windows, websites, automations, Blender add-ons and 3D models for print: Breadslicer, Seek, Jolt, Caliper and WebToMD.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body className="font-sans">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
