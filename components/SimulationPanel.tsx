"use client";

import { useLanguage } from "@/context/LanguageContext";
import {
  VideoCameraIcon,
  PhotoIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

interface SimulationPanelProps {
  result?: { url?: string; image?: string; source?: string | null } | null;
  loading?: boolean;
}

export default function SimulationPanel({ result, loading }: SimulationPanelProps) {
  const { lang } = useLanguage();
  const title = lang === "ko" ? "이 상황 이해하기" : "Understand this situation";
  const subtitle = lang === "ko" ? "영상·이미지 시뮬레이션" : "Video / image simulation";

  const hasMedia = Boolean(result?.url || result?.image);
  const isVideo =
    result?.url &&
    (result.url.startsWith("data:video") ||
      /\.(mp4|mov|webm)$/i.test(result.url.toLowerCase()));
  const imageSrc = !isVideo ? result?.image || result?.url : undefined;

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-xl">
            <VideoCameraIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {result?.source && (
          <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-gray-100 rounded-full px-3 py-1">
            {result.source}
          </span>
        )}
      </div>

      <div className="rounded-2xl bg-gray-900 text-white aspect-video overflow-hidden flex items-center justify-center relative">
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <ArrowPathIcon className="w-10 h-10 animate-spin text-gray-300" />
            <p className="text-sm text-gray-200">
              {lang === "ko" ? "생성 중..." : "Generating..."}
            </p>
          </div>
        )}

        {!loading && hasMedia && (
          <>
            {isVideo ? (
              <video src={result?.url} controls className="w-full h-full object-cover" />
            ) : (
              imageSrc && (
                <img
                  src={imageSrc}
                  alt={lang === "ko" ? "시뮬레이션 이미지" : "Simulation image"}
                  className="w-full h-full object-cover"
                />
              )
            )}
          </>
        )}

        {!loading && !hasMedia && (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <PhotoIcon className="w-10 h-10 text-gray-400" />
            <p className="text-sm text-gray-200">
              {lang === "ko"
                ? "시뮬레이션을 실행하면 여기서 바로 볼 수 있어요."
                : "Run a simulation to preview it here."}
            </p>
          </div>
        )}
      </div>

      {result?.source === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <ExclamationTriangleIcon className="w-4 h-4" />
          <span>
            {lang === "ko" ? "생성에 실패했어요. 다시 시도해 주세요." : "Generation failed. Please try again."}
          </span>
        </div>
      )}
    </div>
  );
}
