"use client";

import { useTranslation } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageSwitch() {
  const { locale, setLocale } = useTranslation();

  const toggle = () => {
    setLocale(locale === "zh" ? "en" : "zh");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
      title={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Globe className="h-3.5 w-3.5" />
      <span>{locale === "zh" ? "EN" : "中"}</span>
    </button>
  );
}
