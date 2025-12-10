"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import horang from "@/assets/horang.png";

interface ModeSelectorProps {
  onSelectMode: (mode: "text" | "voice") => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  const { t, lang } = useLanguage();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-10">
      <div className="w-full lg:w-3/5 bg-white/30 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/40">
        <div className="space-y-3 mb-6">
          <p className="text-sm font-semibold text-amber-700">chomchom</p>
          <h2 className="text-3xl font-bold text-gray-900 leading-tight">
            {lang === "ko"
              ? "문화 갈등을 함께 풀어주는 따뜻한 AI 코치"
              : "A warm AI coach for smoother cross-cultural chats"}
          </h2>
          <p className="text-gray-700">
            {lang === "ko"
              ? "텍스트나 음성 중 편한 방식으로 바로 시작해보세요."
              : "Start with text or voice—whatever feels easiest."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => onSelectMode("text")}
            className="flex-1 group bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-amber-200 hover:border-amber-300"
          >
            <div className="text-4xl mb-2">⌨️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {t("mode.text")}
            </h3>
            <p className="text-gray-500 text-sm">{t("mode.text.desc")}</p>
          </button>
          <button
            onClick={() => onSelectMode("voice")}
            className="flex-1 group bg-white rounded-2xl p-5 text-left transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-amber-200 hover:border-amber-300"
          >
            <div className="text-4xl mb-2">🎙️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {t("mode.voice")}
            </h3>
            <p className="text-gray-500 text-sm">{t("mode.voice.desc")}</p>
          </button>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex justify-center">
        <Image
          src={horang}
          alt="Horang mascot"
          width={800}
          height={800}
          className="object-contain drop-shadow-xl opacity-90"
          priority
        />
      </div>
    </div>
  );
}
