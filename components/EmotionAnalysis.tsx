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
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 space-y-5">
      {/* Title */}
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-xl">
          <ChartBarIcon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{t("analysis.title")}</h3>
      </div>

      {/* Emotion Tags */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">{t("analysis.emotions")}</p>
        <div className="flex flex-wrap gap-2">
          {analysis.emotions.map((emotion) => (
            <span
              key={emotion}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold ${emotionStyles[emotion]}`}
            >
              {t(`emotion.${emotion}`)}
            </span>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-2">{t("analysis.category")}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-4 py-1.5 bg-primary text-white rounded-full text-sm font-bold">
            {t(`category.${analysis.category}`)}
          </span>
          {analysis.subcategory && (
            <>
              <span className="text-gray-400 text-xl">·</span>
              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold">
                {analysis.subcategory}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Confidence */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium text-gray-600">{t("analysis.confidence")}</p>
          <p className="text-sm font-bold text-primary">
            {Math.round(analysis.confidence * 100)}%
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${analysis.confidence * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
