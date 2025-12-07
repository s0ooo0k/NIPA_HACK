"use client";

import { useLanguage, Language } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang("ko")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          lang === "ko"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-label="Switch to Korean"
      >
        🇰🇷 한국어
      </button>
      <button
        onClick={() => setLang("en")}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          lang === "en"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        aria-label="Switch to English"
      >
        🇺🇸 English
      </button>
    </div>
  );
}
