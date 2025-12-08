"use client";

import { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, StopIcon } from "@heroicons/react/24/solid";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  isLoading?: boolean;
  onBeforeRecord?: () => void;
  idleText?: string;
  recordingText?: string;
  processingText?: string;
}

export default function VoiceRecorder({
  onTranscript,
  isLoading,
  onBeforeRecord,
  idleText,
  recordingText,
  processingText,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      if (onBeforeRecord) {
        onBeforeRecord();
      }
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
        setIsRecording(false);
        await transcribeAudio(audioBlob);

        // Clean up the stream
        stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Microphone access is required.");
    }
  };

  const stopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || isProcessing) return;
    setIsRecording(false);
    recorder.stop();
    mediaRecorderRef.current = null;
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
      alert("Failed to transcribe audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-primary hover:scale-110"
        }`}
      >
        {isProcessing ? (
          <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          isRecording ? <StopIcon className="w-8 h-8 text-white" /> : <MicrophoneIcon className="w-9 h-9 text-white" />
        )}
      </button>

      <div className="text-center h-5">
        {isRecording && (
          <p className="text-red-500 font-medium animate-pulse text-sm">
            {recordingText ?? "Recording..."}
          </p>
        )}
        {isProcessing && (
          <p className="text-primary font-medium text-sm">
            {processingText ?? "Processing audio..."}
          </p>
        )}
        {!isRecording && !isProcessing && (idleText ?? "Press the mic to talk") && (
          <p className="text-gray-500 text-sm">{idleText ?? "Press the mic to talk"}</p>
        )}
      </div>
    </div>
  );
}
