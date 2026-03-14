import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { translations } from "../i18n/translations";

type Lang = "ko" | "en";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("dashboard-lang") as Lang) || "ko";
  });

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("dashboard-lang", l);
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>) => {
    const entry = translations[key];
    if (!entry) return key;
    let text = entry[lang];
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
