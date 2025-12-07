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
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    generateVideoOrImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarioId]);

  const generateVideoOrImage = async () => {
    try {
      setStatus("generating");
      setVideoUrl(null);
      setImageUrl(null);
      setSource(null);

      const response = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });

      if (!response.ok) throw new Error("Generation failed");

      const data = await response.json();
      setVideoUrl(data.url || null);
      setImageUrl(data.fallbackImage || null);
      setSource(data.source || null);
      setStatus(data.status || "completed");
    } catch (error) {
      console.error("Video/image generation error:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🖼️</span>
        <h3 className="text-xl font-bold text-gray-800">
          AI Image Preview (Sora placeholder)
        </h3>
      </div>

      <p className="text-gray-600 mb-4 text-sm">
        Generating a simulation for: <strong>{scenarioTitle}</strong>
      </p>

      <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
        {status === "pending" && (
          <div className="text-white text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mx-auto mb-4"></div>
            <p>Preparing image request...</p>
          </div>
        )}

        {status === "generating" && (
          <div className="text-white text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-lg font-medium mb-2">AI is generating an image…</p>
            <p className="text-sm text-gray-400">
              This usually takes a few seconds.
            </p>
          </div>
        )}

        {status === "completed" && (videoUrl || imageUrl) && (
          <div className="w-full h-full bg-black flex items-center justify-center">
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              imageUrl && (
                <img
                  src={imageUrl}
                  alt={`AI generated illustration for ${scenarioTitle}`}
                  className="w-full h-full object-cover"
                />
              )
            )}
          </div>
        )}

        {status === "failed" && (
          <div className="text-white text-center p-8">
            <div className="text-4xl mb-4">😢</div>
            <p className="text-lg font-medium mb-2">Generation failed</p>
            <p className="text-sm text-gray-400 mb-4">
              Please try again in a moment.
            </p>
            <button
              onClick={generateVideoOrImage}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {status === "completed" && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Note:</span>{" "}
            {videoUrl
              ? "Using Together (Sora-2) video generation or canned video."
              : "Using Together free image fallback (FLUX.1)."}
            {source && (
              <>
                {" "}
                <span className="text-gray-500">Source: {source}</span>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
