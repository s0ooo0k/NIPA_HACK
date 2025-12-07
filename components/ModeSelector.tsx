"use client";

import { useLanguage } from "@/context/LanguageContext";

interface ModeSelectorProps {
  onSelectMode: (mode: "text" | "voice") => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {t("app.title")}
        </h2>
        <p className="text-gray-500 text-lg">{t("mode.question")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        {/* Text Mode */}
        <button
          onClick={() => onSelectMode("text")}
          className="group bg-white rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-primary border-4 border-transparent"
        >
          <div className="text-7xl mb-5 transition-transform duration-300 group-hover:scale-110">
            💬
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {t("mode.text")}
          </h3>
          <p className="text-gray-500 text-sm">{t("mode.text.desc")}</p>
        </button>

        {/* Voice Mode */}
        <button
          onClick={() => onSelectMode("voice")}
          className="group bg-white rounded-3xl p-8 text-center transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-primary border-4 border-transparent"
        >
          <div className="text-7xl mb-5 transition-transform duration-300 group-hover:scale-110">
            🎤
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            {t("mode.voice")}
          </h3>
          <p className="text-gray-500 text-sm">{t("mode.voice.desc")}</p>
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-10 text-center max-w-md">
        {t("mode.footer")}
      </p>
    </div>
  );
}
