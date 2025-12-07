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
}

export default function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  mode,
  onChangeMode,
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
  }, [messages]);

  // 음성 모드일 때 AI 응답을 자동으로 재생
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

      // 기존 오디오가 있다면 정리
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
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* 채팅 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">{t("app.title")} AI</h2>
            <p className="text-sm sm:text-base opacity-90 mt-1">
              {t("app.subtitle")}
            </p>
          </div>
          <button
            onClick={onChangeMode}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors text-sm font-medium flex items-center gap-2"
          >
            {mode === "text" ? `🎤 ${lang === "ko" ? "음성으로 전환" : "Switch to Voice"}` : `💬 ${lang === "ko" ? "채팅으로 전환" : "Switch to Text"}`}
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-lg mb-4">
              {lang === "ko" ? "안녕하세요!" : "Hello!"}
            </p>
            <p className="text-sm sm:text-base">
              {lang === "ko"
                ? "한국에서 겪은 문화적 갈등이나 어려운 상황을 편하게 이야기해주세요."
                : "Share your cultural conflicts or confusing situations you've experienced in Korea."}
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "교수님이 밥 먹었냐고 물어보셨어요"
                      : "My professor asked me if I ate"
                  )
                }
                className="p-3 bg-blue-50 rounded-lg text-sm text-left hover:bg-blue-100 transition-colors"
              >
                {lang === "ko"
                  ? "교수님과의 대화가 헷갈려요"
                  : "Confused by professor's greeting"}
              </button>
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "회식 문화가 어려워요"
                      : "Company dinner culture is difficult"
                  )
                }
                className="p-3 bg-purple-50 rounded-lg text-sm text-left hover:bg-purple-100 transition-colors"
              >
                {lang === "ko"
                  ? "회식 문화가 어려워요"
                  : "Struggling with company dinners"}
              </button>
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "조별과제가 처음이에요"
                      : "First time doing group projects"
                  )
                }
                className="p-3 bg-green-50 rounded-lg text-sm text-left hover:bg-green-100 transition-colors"
              >
                {lang === "ko"
                  ? "조별과제가 처음이에요"
                  : "New to group projects"}
              </button>
              <button
                onClick={() =>
                  onSendMessage(
                    lang === "ko"
                      ? "이웃이 어디 가냐고 물어봐서 당황했어요"
                      : "Neighbor asked where I'm going"
                  )
                }
                className="p-3 bg-yellow-50 rounded-lg text-sm text-left hover:bg-yellow-100 transition-colors"
              >
                {lang === "ko"
                  ? "일상 대화가 헷갈려요"
                  : "Daily conversations are confusing"}
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
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              <p className="text-sm sm:text-base whitespace-pre-wrap">
                {msg.content}
              </p>
              <p
                className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-100" : "text-gray-500"}`}
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
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
        {mode === "voice" ? (
          <div className="flex flex-col items-center">
            <VoiceRecorder
              onTranscript={(text) => {
                onSendMessage(text);
              }}
              isLoading={isLoading || isPlayingAudio}
            />
            {isPlayingAudio && (
              <p className="text-purple-600 text-sm mt-4 font-medium">
                {lang === "ko" ? "🔊 AI 응답 재생 중..." : "🔊 Playing AI response..."}
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
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
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
