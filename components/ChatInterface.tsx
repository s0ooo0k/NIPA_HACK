"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import VoiceRecorder from "./VoiceRecorder";
import { useLanguage } from "@/context/LanguageContext";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  mode: "text" | "voice";
  onChangeMode: () => void;
  ctaStage: "none" | "offer" | "post-analysis";
  onContinueCTA: () => void;
  onAnalyzeCTA: () => void;
  onSimulateCurrent: () => void;
  onSimulateSimilar: () => void;
  simulationResult?: { url?: string; image?: string; source?: string } | null;
  simulationLoading?: boolean;
  evaluationPending?: boolean;
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  mode,
  onChangeMode,
  ctaStage,
  onContinueCTA,
  onAnalyzeCTA,
  onSimulateCurrent,
  onSimulateSimilar,
  simulationResult,
  simulationLoading,
  evaluationPending,
}: ChatInterfaceProps) {
  const { t, lang } = useLanguage();
  const [input, setInput] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, ctaStage, simulationResult]);

  useEffect(() => {
    if (mode === "voice" && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "assistant" && !isLoading) {
        playAudioResponse(lastMessage.content);
      }
    }
  }, [messages, mode, isLoading]);

  const playAudioResponse = async (text: string) => {
    try {
      setIsPlayingAudio(true);

      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("TTS failed");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlayingAudio(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-white/40">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{t("app.title")} AI</h2>
            <p className="text-sm sm:text-base opacity-90 mt-1">
              {t("app.subtitle")}
            </p>
          </div>
          <button
            onClick={onChangeMode}
            className="px-4 py-2 bg-white/70 hover:bg-white text-sm font-medium flex items-center gap-2 rounded-full shadow-sm transition-all"
          >
            {mode === "text"
              ? `🗣 ${lang === "ko" ? "음성으로 전환" : "Switch to Voice"}`
              : `💬 ${lang === "ko" ? "채팅으로 전환" : "Switch to Text"}`}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-br from-yellow-50 via-white to-amber-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            <p className="text-lg mb-4">
              {lang === "ko" ? "안녕하세요!" : "Hello!"}
            </p>
            <p className="text-sm sm:text-base">
              {lang === "ko"
                ? "한국에서 겪은 문화적 갈등이나 헷갈렸던 상황을 들려주세요."
                : "Share any cultural conflicts or confusing situations you've experienced in Korea."}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "교수님이 '밥 먹었어?'라고 하셨어요"
                      : "My professor asked me if I ate"
                  )
                }
                className="p-3 bg-amber-100 rounded-lg text-sm text-left hover:bg-amber-200 transition-colors"
              >
                {lang === "ko" ? "교수님 인사가 헷갈려요" : "Confused by professor's greeting"}
              </button>
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "회식 문화가 어려워요"
                      : "Company dinner culture is difficult"
                  )
                }
                className="p-3 bg-amber-100 rounded-lg text-sm text-left hover:bg-amber-200 transition-colors"
              >
                {lang === "ko" ? "회식 문화가 어려워요" : "Struggling with company dinners"}
              </button>
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "조별과제 역할 분담이 처음이에요"
                      : "First time doing group projects"
                  )
                }
                className="p-3 bg-amber-100 rounded-lg text-sm text-left hover:bg-amber-200 transition-colors"
              >
                {lang === "ko" ? "조별과제가 처음이에요" : "New to group projects"}
              </button>
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "이웃이 어디 가냐고 물어봐서 놀랐어요"
                      : "Neighbor asked where I'm going"
                  )
                }
                className="p-3 bg-amber-100 rounded-lg text-sm text-left hover:bg-amber-200 transition-colors"
              >
                {lang === "ko" ? "일상 대화가 헷갈려요" : "Daily conversations are confusing"}
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "bg-amber-500 text-gray-900 rounded-br-sm shadow-md"
                  : "bg-white/80 backdrop-blur text-gray-800 rounded-bl-sm border border-amber-100 shadow-sm"
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap">
                {msg.content}
              </p>
              {msg.imageUrl && (
                <div className="mt-3 overflow-hidden rounded-xl border border-amber-100">
                  <img
                    src={msg.imageUrl}
                    alt="Simulation"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <p
                className={`text-xs mt-1 ${msg.role === "user" ? "text-amber-100" : "text-gray-500"}`}
              >
                {new Date(msg.timestamp).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/80 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-amber-100">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {ctaStage === "offer" && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur border border-amber-100 rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {lang === "ko" ? "다음 단계 선택" : "Choose next step"}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onContinueCTA}
                  className="px-3 py-2 rounded-full bg-amber-500 text-gray-900 text-sm font-medium hover:bg-amber-400 transition-all"
                >
                  {lang === "ko" ? "계속 채팅하기" : "Continue chat"}
                </button>
                <button
                  onClick={onAnalyzeCTA}
                  className="px-3 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all"
                >
                  {lang === "ko" ? "대화 분석·시뮬레이션" : "Analyze & simulate"}
                </button>
              </div>
            </div>
          </div>
        )}

        {ctaStage === "post-analysis" && (
          <div className="flex justify-start">
            <div className="bg-white/80 backdrop-blur border border-amber-100 rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {lang === "ko"
                  ? "어떤 시뮬레이션을 볼까요?"
                  : "Pick a simulation option"}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onSimulateCurrent}
                  className="px-3 py-2 rounded-full bg-amber-500 text-gray-900 text-sm font-medium hover:bg-amber-400 transition-all disabled:opacity-60"
                  disabled={simulationLoading}
                >
                  {simulationLoading ? "생성 중..." : "현재 상황 시뮬레이션"}
                </button>
                <button
                  onClick={onSimulateSimilar}
                  className="px-3 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all"
                >
                  비슷한 상황 시뮬레이션
                </button>
                {evaluationPending && (
                  <span className="text-xs text-amber-700">
                    답변을 입력하면 점수와 피드백을 드릴게요.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-white/70 backdrop-blur">
        {mode === "voice" ? (
          <div className="flex flex-col items-center">
            <VoiceRecorder
              onTranscript={(text) => {
                onSendMessage(text);
              }}
              isLoading={isLoading || isPlayingAudio}
            />
            {isPlayingAudio && (
              <p className="text-amber-600 text-sm mt-4 font-medium">
                {lang === "ko" ? "▶ AI 답변 재생 중..." : "▶ Playing AI response..."}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("chat.placeholder")}
                disabled={isLoading}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base shadow-sm"
              >
                {t("chat.send")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
