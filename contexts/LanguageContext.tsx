"use client";

import React, { createContext, useState, useContext, useCallback, ReactNode, useRef, useEffect } from 'react';

type Language = 'en' | 'es';

interface LanguageContextProps {
  language: Language;
  isSwitchingLanguage: boolean;
  initialLanguageDuringSwitch: Language | null;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isSwitchingLanguage, setIsSwitchingLanguage] = useState(false);
  // Usaremos estado en lugar de ref aquí para que el contexto se actualice correctamente
  const [initialLanguageDuringSwitch, setInitialLanguageDuringSwitch] = useState<Language | null>(null);

  // Refs para los timeouts para poder limpiarlos si el componente se desmonta
  const langChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const effectEndTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleLanguage = useCallback(() => {
    // Prevenir doble clic o activación si ya está cambiando
    if (isSwitchingLanguage) {
      console.warn("Language switch already in progress.");
      return;
    }

    // Limpiar timeouts anteriores por si acaso
    if (langChangeTimeoutRef.current) clearTimeout(langChangeTimeoutRef.current);
    if (effectEndTimeoutRef.current) clearTimeout(effectEndTimeoutRef.current);

    // Iniciar la transición
    setInitialLanguageDuringSwitch(language); // Guardar idioma inicial en estado
    setIsSwitchingLanguage(true);

    const languageChangeDelay = 250;
    const visualEffectDuration = 600;

    // Timeout para cambiar el idioma
    langChangeTimeoutRef.current = setTimeout(() => {
      setLanguage(prevLang => (prevLang === 'en' ? 'es' : 'en'));
    }, languageChangeDelay);

    // Timeout para finalizar el efecto visual y limpiar
    effectEndTimeoutRef.current = setTimeout(() => {
      setIsSwitchingLanguage(false);
      setInitialLanguageDuringSwitch(null); // Limpiar idioma inicial
      langChangeTimeoutRef.current = null; // Limpiar ref de timeout
      effectEndTimeoutRef.current = null; // Limpiar ref de timeout
    }, visualEffectDuration);

  }, [language, isSwitchingLanguage]); // Dependencias del useCallback

  // Limpiar timeouts si el provider se desmonta durante la transición
  useEffect(() => {
    return () => {
      if (langChangeTimeoutRef.current) clearTimeout(langChangeTimeoutRef.current);
      if (effectEndTimeoutRef.current) clearTimeout(effectEndTimeoutRef.current);
    };
  }, []);

  const value = {
    language,
    isSwitchingLanguage,
    initialLanguageDuringSwitch,
    toggleLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 