import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/sonner"
import { DynamicBackground } from "@/components/dynamic-background"
import AnimatedNdLogo from "@/components/animated-nd-logo"
import { LanguageProvider } from "@/contexts/LanguageContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Portfolio | Creative Developer",
  description: "Personal portfolio showcasing creative development work",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} overflow-visible`} style={{overflow: 'visible'}}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <LanguageProvider>
            <DynamicBackground />
            <div className="min-h-screen flex flex-col overflow-visible" style={{overflow: 'visible'}}>
              <Header />
              <main className="flex-grow overflow-visible" style={{overflow: 'visible'}}>{children}</main>
              <Footer />
            </div>
            <Toaster />
            <AnimatedNdLogo />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'