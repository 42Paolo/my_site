"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import it from "@/messages/it.json";
import en from "@/messages/en.json";

type Lang = "it" | "en";
type Messages = typeof it;

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: Messages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const messages: Record<Lang, Messages> = { it, en };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("it");

  useEffect(() => {
    const saved = localStorage.getItem("pabrogi-lang") as Lang | null;
    if (saved === "it" || saved === "en") setLang(saved);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "it" ? "en" : "it";
    setLang(next);
    localStorage.setItem("pabrogi-lang", next);
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: messages[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be inside LanguageProvider");
  return ctx;
}
