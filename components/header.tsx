"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRef, useState, useCallback, useEffect } from "react"
import { useLanguage } from "@/contexts/LanguageContext"
import { CharWrapper } from "@/components/CharWrapper"

// Objeto con las traducciones de los items de navegación
const navLabels = {
  en: {
    home: "Home",
    projects: "Projects",
    about: "About",
    contact: "Contact",
  },
  es: {
    home: "Inicio",
    projects: "Proyectos",
    about: "Sobre mí",
    contact: "Contacto",
  },
}

// Estructura base de los items
const navItemsBase = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
]

export default function Header() {
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  const { language, isSwitchingLanguage, toggleLanguage } = useLanguage()
  
  // Referencias para los elementos de navegación y el botón de idioma
  const homeRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const langButtonRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return
    const rect = navRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  // Construir los items de navegación con la etiqueta correcta
  const navItems = navItemsBase.map(item => ({
    ...item,
    label: navLabels[language][item.key as keyof typeof navLabels.en] // Obtener label del idioma actual
  }))
  
  // Referencias en un mapa para simplificar el código
  const navRefs = {
    home: homeRef,
    projects: projectsRef,
    about: aboutRef,
    contact: contactRef
  }

  return (
    <header className="sticky top-4 z-50 mx-auto flex w-full max-w-max items-center justify-center gap-2 px-4">
      <div
        ref={navRef}
        className="relative flex h-12 items-center rounded-full border border-white/10 bg-black/40 px-1 backdrop-blur-md"
        style={{
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence>
          {isHovering && (
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-full opacity-70"
              style={{
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
                filter: "blur(8px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        <nav className="flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const ref = navRefs[item.key as keyof typeof navRefs]
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors w-[110px]",
                  isActive ? "text-white" : "text-white/60 hover:text-white",
                )}
                prefetch={true}
              >
                <div 
                  ref={ref} 
                  className="title-container relative z-10"
                >
                  {item.label}
                </div>
                
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white/10"
                    layoutId="navbar-indicator"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    style={{
                      boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.2)",
                    }}
                  />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="relative">
        <button
          onClick={toggleLanguage}
          disabled={isSwitchingLanguage}
          className={cn(
            "relative z-10 flex h-12 items-center justify-center rounded-full w-14 px-4 text-sm font-medium transition-colors",
            "border border-white/10 bg-black/40 backdrop-blur-md",
            "shadow-[0_4px_12px_rgba(0,0,0,0.25),_inset_0_1px_1px_rgba(255,255,255,0.1)]",
            isSwitchingLanguage
              ? "text-white/50 cursor-not-allowed"
              : "text-white/80 hover:text-white hover:bg-white/10"
          )}
          aria-label={language === 'en' ? "Switch language to Spanish" : "Cambiar idioma a Inglés"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={language}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.15 }}
              className="inline-block whitespace-nowrap"
            >
              <div 
                ref={langButtonRef} 
                className="title-container relative z-10"
              >
                {language === 'en' ? 'ES' : 'EN'}
              </div>
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </header>
  )
}

