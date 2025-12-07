"use client";

import { useState, useEffect } from "react";
import { VideoGenerationStatus } from "@/types";
import { VideoCameraIcon, ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";

interface VideoSimulationProps {
  scenarioId: string;
  scenarioTitle: string;
}

export default function VideoSimulation({ scenarioId, scenarioTitle }: VideoSimulationProps) {
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

  const StatusDisplay = ({ children }: { children: React.ReactNode }) => (
    <div className="text-white text-center p-8 flex flex-col items-center justify-center h-full">
      {children}
    </div>
  );

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary/20 p-2 rounded-xl">
          <VideoCameraIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">AI Simulation</h3>
          <p className="text-xs text-gray-600">
            For situation: <strong>{scenarioTitle}</strong>
          </p>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
        {status === "pending" && (
          <StatusDisplay>
            <ArrowPathIcon className="w-10 h-10 animate-spin text-gray-400 mb-3" />
            <p className="font-medium">Preparing simulation...</p>
          </StatusDisplay>
        )}

        {status === "generating" && (
          <StatusDisplay>
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mx-auto mb-3"></div>
            <p className="font-medium">AI is generating...</p>
            <p className="text-sm text-gray-400">This may take a moment.</p>
          </StatusDisplay>
        )}

        {status === "completed" && (videoUrl || imageUrl) && (
          <div className="w-full h-full bg-black">
            {videoUrl ? (
              <video src={videoUrl} controls className="w-full h-full object-cover" />
            ) : (
              imageUrl && <img src={imageUrl} alt={`AI simulation for ${scenarioTitle}`} className="w-full h-full object-cover" />
            )}
          </div>
        )}

        {status === "failed" && (
          <StatusDisplay>
            <ExclamationTriangleIcon className="w-10 h-10 text-red-400 mb-3" />
            <p className="font-medium">Generation Failed</p>
            <p className="text-sm text-gray-400 mb-4">Please try again.</p>
            <button
              onClick={generateVideoOrImage}
              className="px-4 py-2 bg-primary text-white rounded-lg transition-transform hover:scale-105"
            >
              Retry
            </button>
          </StatusDisplay>
        )}
      </div>

      {status === "completed" && (
        <div className="mt-4 p-3 bg-gray-100/70 rounded-xl text-xs text-gray-600">
          <strong>Note:</strong>{" "}
          {videoUrl ? "Using video generation." : "Using image fallback."}
          {source && <span className="text-gray-500"> (Source: {source})</span>}
        </div>
      )}
    </div>
  );
}
