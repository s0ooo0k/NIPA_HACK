"use client";

import { useState, useRef, useEffect } from "react";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isLoading: boolean;
}

export default function VoiceRecorder({
  onTranscript,
  isLoading,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await transcribeAudio(audioBlob);

        // 스트림 정리
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("마이크 접근 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Transcription failed");

      const data = await response.json();
      onTranscript(data.text);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      alert("음성 인식에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isLoading || isProcessing}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:scale-110"
        }`}
      >
        {isProcessing ? (
          <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <div className="text-3xl">{isRecording ? "⏹️" : "🎤"}</div>
        )}
      </button>

      <div className="text-center">
        {isRecording && (
          <p className="text-red-500 font-medium animate-pulse">녹음 중...</p>
        )}
        {isProcessing && (
          <p className="text-purple-600 font-medium">음성 인식 중...</p>
        )}
        {!isRecording && !isProcessing && (
          <p className="text-gray-600 text-sm">
            마이크 버튼을 눌러 말씀해주세요
          </p>
        )}
      </div>
    </div>
  );
}
