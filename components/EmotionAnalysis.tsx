"use client";

import { EmotionAnalysis as EmotionAnalysisType, Emotion } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface EmotionAnalysisProps {
  analysis: EmotionAnalysisType;
}

const emotionColors: Record<Emotion, string> = {
  confusion: "bg-yellow-100 text-yellow-800 border-yellow-300",
  embarrassment: "bg-pink-100 text-pink-800 border-pink-300",
  frustration: "bg-orange-100 text-orange-800 border-orange-300",
  anger: "bg-red-100 text-red-800 border-red-300",
  sadness: "bg-blue-100 text-blue-800 border-blue-300",
  loneliness: "bg-purple-100 text-purple-800 border-purple-300",
  anxiety: "bg-gray-100 text-gray-800 border-gray-300",
};

export default function EmotionAnalysis({ analysis }: EmotionAnalysisProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* 제목 */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-gray-800">{t("analysis.title")}</h3>
      </div>

      {/* 감정 태그들 */}
      <div>
        <p className="text-sm text-gray-600 mb-3">{t("analysis.emotions")}</p>
        <div className="flex flex-wrap gap-2">
          {analysis.emotions.map((emotion) => (
            <span
              key={emotion}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${emotionColors[emotion]}`}
            >
              {t(`emotion.${emotion}`)}
            </span>
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div>
        <p className="text-sm text-gray-600 mb-2">{t("analysis.category")}</p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-medium">
            {t(`category.${analysis.category}`)}
          </span>
          {analysis.subcategory && (
            <>
              <span className="text-gray-400">›</span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                {analysis.subcategory}
              </span>
            </>
          )}
        </div>
      </div>

      {/* 신뢰도 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600">{t("analysis.confidence")}</p>
          <p className="text-sm font-medium text-gray-700">
            {Math.round(analysis.confidence * 100)}%
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${analysis.confidence * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
