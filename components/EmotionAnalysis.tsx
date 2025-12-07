"use client";

import { EmotionAnalysis as EmotionAnalysisType, Emotion } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { ChartBarIcon } from "@heroicons/react/24/solid";

interface EmotionAnalysisProps {
  analysis: EmotionAnalysisType;
}

const emotionStyles: Record<Emotion, string> = {
  confusion: "bg-yellow-100 text-yellow-800",
  embarrassment: "bg-pink-100 text-pink-800",
  frustration: "bg-orange-100 text-orange-800",
  anger: "bg-red-100 text-red-800",
  sadness: "bg-sky-100 text-sky-800",
  loneliness: "bg-purple-100 text-purple-800",
  anxiety: "bg-gray-200 text-gray-800",
};

export default function EmotionAnalysis({ analysis }: EmotionAnalysisProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-xl">
          <ChartBarIcon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{t("analysis.title")}</h3>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">
        {t("analysis.emotions")}:{" "}
        {analysis.emotions.map((emotion) => t(`emotion.${emotion}`)).join(", ")}
      </p>
      <p className="text-sm text-gray-700 leading-relaxed">
        {t("analysis.category")}: {t(`category.${analysis.category}`)}
        {analysis.subcategory ? ` · ${analysis.subcategory}` : ""}
      </p>
    </div>
  );
}
