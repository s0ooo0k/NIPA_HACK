"use client";

import { EmotionAnalysis as EmotionAnalysisType, Emotion } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { ChartBarIcon } from "@heroicons/react/24/solid";

interface EmotionAnalysisProps {
  analysis: EmotionAnalysisType;
}

const emotionStyles: Record<Emotion, string> = {
  confusion: "bg-yellow-400",
  embarrassment: "bg-pink-400",
  frustration: "bg-orange-400",
  anger: "bg-red-500",
  sadness: "bg-sky-400",
  loneliness: "bg-purple-400",
  anxiety: "bg-gray-400",
};

export default function EmotionAnalysis({ analysis }: EmotionAnalysisProps) {
  const { t } = useLanguage();
  const hasEmotions = analysis.emotions && analysis.emotions.length > 0;
  const scores =
    analysis.emotionScores && analysis.emotionScores.length > 0
      ? analysis.emotionScores
      : hasEmotions
      ? analysis.emotions.map((emotion) => ({
          emotion,
          score: Math.round((1 / analysis.emotions.length) * 100),
        }))
      : [];
  const topScores = [...scores]
    .map((item) => ({
      emotion: item.emotion,
      score: Number(item.score) || 0,
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 3);

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary/20 p-2 rounded-xl">
          <ChartBarIcon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{t("analysis.title")}</h3>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-700 leading-relaxed">
          {t("analysis.category")}: {t(`category.${analysis.category}`)}
          {analysis.subcategory ? ` · ${analysis.subcategory}` : ""}
        </p>
        <div className="space-y-2">
          {topScores.map((item) => (
            <div key={item.emotion}>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>{t(`emotion.${item.emotion}`)}</span>
                <span>{Math.round(Math.max(0, Math.min(item.score, 100)))}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full ${emotionStyles[item.emotion] || "bg-primary/60 text-white"}`}
                  style={{ width: `${Math.min(Math.max(item.score || 0, 0), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
