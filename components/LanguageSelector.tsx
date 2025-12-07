"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative flex items-center p-1 bg-amber-100/80 border border-amber-200 rounded-full">
      <button
        onClick={() => setLang("ko")}
        className={`w-1/2 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
          lang === "ko" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Switch to Korean"
      >
        한국어
      </button>
      <button
        onClick={() => setLang("en")}
        className={`w-1/2 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
          lang === "en" ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
        }`}
        aria-label="Switch to English"
      >
        English
      </button>
      <div
        className={`absolute top-1 left-1 w-1/2 h-[calc(100%-0.5rem)] bg-white rounded-full shadow-md transition-transform duration-300 ease-in-out ${
          lang === "en" ? "translate-x-full" : ""
        }`}
        style={{
          transform:
            lang === "en" ? "translateX(calc(100% - 0.5rem))" : "translateX(0%)",
        }}
      />
    </div>
  );
}
