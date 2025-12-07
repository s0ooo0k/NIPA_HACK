"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types";
import VoiceRecorder from "./VoiceRecorder";
import { useLanguage } from "@/context/LanguageContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

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

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
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
      stopAudio();
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const suggestionChips = [
    {
      ko: "교수님이 '밥 먹었어?'라고 해서 약속인 줄 알았어요",
      en: "Professor said 'Did you eat?' and I thought it was an invite",
      msg: "교수님이 '밥 먹었어?'라고 해서 약속인 줄 알았어요",
    },
    {
      ko: "회식에서 술 권유가 부담돼요",
      en: "Drinking pressure at company dinners",
      msg: "회식에서 술 권유가 부담돼요",
    },
    {
      ko: "조별과제가 처음이라 걱정돼요",
      en: "First group project makes me nervous",
      msg: "조별과제가 처음이라 걱정돼요",
    },
    {
      ko: "일상 대화가 어색해요",
      en: "Small talk feels awkward",
      msg: "일상 대화가 어색해요",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-black/5">
        <div className="flex items-center justify-between">
          <div className="pl-2">
            <h2 className="text-lg font-bold text-gray-800">{t("app.title")} AI</h2>
            <p className="text-xs text-gray-500">{t("app.subtitle")}</p>
          </div>
          <button
            onClick={() => {
              stopAudio();
              onChangeMode();
            }}
            className="px-3 py-1.5 bg-white/70 hover:bg-white text-xs font-semibold flex items-center gap-2 rounded-full shadow-sm transition-all border border-black/5"
          >
            {mode === "text"
              ? lang === "ko"
                ? "🎙️ 음성으로"
                : "🎙️ To voice"
              : lang === "ko"
              ? "⌨️ 텍스트로"
              : "⌨️ To text"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 my-8">
            <p className="font-semibold mb-4">
              {lang === "ko"
                ? "어떤 상황을 이야기해볼까요?"
                : "What situation would you like to talk about?"}
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-sm">
              {suggestionChips.map((item) => (
                <button
                  key={item.ko}
                  onClick={() => onSendMessage(lang === "ko" ? item.msg : item.en)}
                  className="p-3 bg-white shadow-md rounded-full hover:bg-gray-50 hover:shadow-lg transition-all"
                >
                  {lang === "ko" ? item.ko : item.en}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-5 py-3 shadow-md ${
                msg.role === "user"
                  ? "bg-primary text-white rounded-br-lg"
                  : "bg-white text-gray-800 rounded-bl-lg"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.videoUrl && (
                <div className="mt-2.5 overflow-hidden rounded-xl bg-black">
                  <video src={msg.videoUrl} controls className="w-full h-full object-cover" />
                </div>
              )}
              {!msg.videoUrl && msg.imageUrl && (
                <div className="mt-2.5 overflow-hidden rounded-xl">
                  <img src={msg.imageUrl} alt="Simulation" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-1">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-3xl rounded-bl-lg px-4 py-3 shadow-md">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        {ctaStage === "offer" && (
          <div className="bg-white/80 backdrop-blur border border-black/5 rounded-2xl px-4 py-3 shadow-sm max-w-sm">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {lang === "ko" ? "다음 단계를 골라보세요" : "Choose the next step"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  stopAudio();
                  onAnalyzeCTA();
                }}
                className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium hover:scale-105 transition-transform"
              >
                {lang === "ko" ? "대화 분석" : "Analyze conversation"}
              </button>
              <button
                onClick={() => {
                  stopAudio();
                  onContinueCTA();
                }}
                className="px-4 py-1.5 rounded-full bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors border border-black/10"
              >
                {lang === "ko" ? "계속 대화" : "Continue chat"}
              </button>
            </div>
          </div>
        )}

        {ctaStage === "post-analysis" && (
          <div className="bg-white/80 backdrop-blur border border-black/5 rounded-2xl px-4 py-3 shadow-sm max-w-sm">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              {lang === "ko" ? "어떤 시뮬레이션을 볼까요?" : "Which simulation would you like?"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  stopAudio();
                  onSimulateCurrent();
                }}
                className="px-4 py-1.5 rounded-full bg-primary text-white text-sm font-medium hover:scale-105 transition-transform disabled:opacity-60"
                disabled={simulationLoading}
              >
                {simulationLoading ? "생성 중..." : lang === "ko" ? "현재 상황" : "Current scenario"}
              </button>
              <button
                onClick={() => {
                  stopAudio();
                  onSimulateSimilar();
                }}
                className="px-4 py-1.5 rounded-full bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors border border-black/10"
              >
                {lang === "ko" ? "비슷한 상황" : "Similar scenario"}
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/60 border-t border-black/5">
        {mode === "voice" ? (
          <div className="flex flex-col items-center justify-center h-24">
            <VoiceRecorder onTranscript={(text) => onSendMessage(text)} isLoading={isLoading || isPlayingAudio} />
            {isPlayingAudio && (
              <p className="text-primary text-xs mt-3 font-medium">
                {lang === "ko" ? "AI 응답을 재생 중..." : "Playing AI response..."}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chat.placeholder")}
              disabled={isLoading}
              className="flex-1 w-full px-5 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center hover:scale-110 disabled:scale-100 disabled:bg-gray-300 transition-all"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
