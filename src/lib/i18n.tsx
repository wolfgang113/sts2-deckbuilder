"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { translations, type Locale, type Translations } from "./translations";

interface I18nContextType {
  locale: Locale;
  t: Translations;
  setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextType>({
  locale: "zh",
  t: translations.zh,
  setLocale: () => {},
});

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "zh";
  const saved = localStorage.getItem("sts2-locale") as Locale | null;
  return saved && (saved === "zh" || saved === "en") ? saved : "zh";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("sts2-locale", newLocale);
  }, []);

  const t = translations[locale];

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
