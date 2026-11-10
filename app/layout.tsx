import type { Metadata } from "next"
import { Archivo, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/components/language"

const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans" })
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: "SynrgStudio — software that doesn't make you wait",
  description:
    "SynrgStudio makes native tools for Windows, Blender add-ons and 3D models for print: Breadslicer, Seek, Jolt, Caliper and WebToMD.",
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
