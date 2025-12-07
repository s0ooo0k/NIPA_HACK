"use client";

import { useState, useEffect } from "react";
import { VideoGenerationStatus } from "@/types";

interface VideoSimulationProps {
  scenarioId: string;
  scenarioTitle: string;
}

export default function VideoSimulation({
  scenarioId,
  scenarioTitle,
}: VideoSimulationProps) {
  const [status, setStatus] = useState<VideoGenerationStatus>("pending");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    generateVideo();
  }, [scenarioId]);

  const generateVideo = async () => {
    try {
      setStatus("generating");

      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });

      if (!response.ok) throw new Error("Video generation failed");

      const data = await response.json();
      setVideoId(data.videoId);

      // TODO: 실제 Sora API 연동 시 폴링 구현
      // 현재는 mock 처리
      setTimeout(() => {
        setStatus("completed");
        // Mock video URL - 실제로는 API에서 받아온 URL 사용
        setVideoUrl("https://via.placeholder.com/640x360?text=Video+Preview");
      }, 2000);
    } catch (error) {
      console.error("Video generation error:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎬</span>
        <h3 className="text-xl font-bold text-gray-800">AI 영상 시뮬레이션</h3>
      </div>

      <p className="text-gray-600 mb-4 text-sm">
        {scenarioTitle} 상황을 영상으로 확인해보세요
      </p>

      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        {status === "pending" && (
          <div className="text-white text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p>영상 준비 중...</p>
          </div>
        )}

        {status === "generating" && (
          <div className="text-white text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">AI 영상 생성 중...</p>
            <p className="text-sm text-gray-400">
              잠시만 기다려주세요 (약 30초 소요)
            </p>
          </div>
        )}

        {status === "completed" && videoUrl && (
          <div className="w-full h-full">
            {/* 실제 비디오 플레이어 */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-lg">영상 미리보기</p>
                <p className="text-sm text-gray-300 mt-2">
                  OpenAI Sora API 연동 후 실제 영상이 표시됩니다
                </p>
              </div>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="text-white text-center p-8">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-lg font-medium mb-2">영상 생성 실패</p>
            <p className="text-sm text-gray-400 mb-4">
              영상을 생성하는 중 문제가 발생했습니다
            </p>
            <button
              onClick={generateVideo}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>

      {status === "completed" && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">💡 참고:</span> 실제 상황에서는 표정,
            톤, 제스처도 함께 고려해야 합니다.
          </p>
        </div>
      )}
    </div>
  );
}
