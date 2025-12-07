"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ModeSelector from "@/components/ModeSelector";
import EmotionAnalysis from "@/components/EmotionAnalysis";
import SolutionCard from "@/components/SolutionCard";
import LearningOptions from "@/components/LearningOptions";
import VideoSimulation from "@/components/VideoSimulation";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/context/LanguageContext";
import {
  ChatMessage,
  EmotionAnalysis as EmotionAnalysisType,
  Solution,
  Scenario,
} from "@/types";

export default function Home() {
  const { lang, t } = useLanguage();
  const [mode, setMode] = useState<"text" | "voice" | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EmotionAnalysisType | null>(null);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [relatedScenarios, setRelatedScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [assistantTurns, setAssistantTurns] = useState(0);
  const [ctaStage, setCtaStage] = useState<"none" | "offer" | "post-analysis">(
    "none"
  );
  const [simulationResult, setSimulationResult] = useState<{
    url?: string;
    image?: string;
    source?: string;
  } | null>(null);
  const [isSimLoading, setIsSimLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 1. 채팅 API 호출
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages,
          language: lang,
        }),
      });

      if (!chatResponse.ok) throw new Error("Chat failed");

      const chatData = await chatResponse.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: chatData.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setAssistantTurns((prev) => {
        const next = prev + 1;
        if (next >= 3 && ctaStage === "none") {
          setCtaStage("offer");
        }
        return next;
      });

      // 분석은 CTA 버튼을 통해 수동으로 진행
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeConversation = async (conversationMessages: ChatMessage[]) => {
    try {
      setIsLoading(true);

      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversationMessages,
          language: lang,
        }),
      });

      if (!analyzeResponse.ok) throw new Error("Analysis failed");

      const analyzeData = await analyzeResponse.json();

      setAnalysis(analyzeData.analysis);
      setSolution(analyzeData.solution);
      setRelatedScenarios(analyzeData.relatedScenarios || []);
      setShowAnalysis(true);

      // 분석 완료 메시지
      const analysisCompleteMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "상황을 분석했어요! 아래에서 감정 분석 결과와 해결 방법을 확인해보세요.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, analysisCompleteMessage]);
    } catch (error) {
      console.error("Error analyzing conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (scenarioId: string) => {
    const scenario = relatedScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setAnalysis(null);
    setSolution(null);
    setRelatedScenarios([]);
    setSelectedScenario(null);
    setShowAnalysis(false);
    setMode(null); // 모드 선택 화면으로 돌아감
    setAssistantTurns(0);
    setCtaStage("none");
    setSimulationResult(null);
  };

  const handleSelectMode = (selectedMode: "text" | "voice") => {
    setMode(selectedMode);
  };

  const handleChangeMode = () => {
    setMode(mode === "text" ? "voice" : "text");
  };

  const handleContinueCTA = () => {
    setCtaStage("none");
    setAssistantTurns(0);
  };

  const handleAnalyzeCTA = async () => {
    await analyzeConversation(messages);
    setCtaStage("post-analysis");
    setAssistantTurns(0);
  };

  const handleSimulateCurrent = async () => {
    try {
      setIsSimLoading(true);
      setSimulationResult(null);

      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();
      setSimulationResult({
        image: data.fallbackImage,
        url: data.url,
        source: data.source,
      });
    } catch (error) {
      console.error("Simulation error:", error);
      setSimulationResult({
        image: undefined,
        url: undefined,
        source: "error",
      });
    } finally {
      setIsSimLoading(false);
    }
  };

  const handleSimulateSimilar = () => {
    if (relatedScenarios.length > 0) {
      setSelectedScenario(relatedScenarios[0]);
      setShowAnalysis(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100">
      {/* 헤더 */}
      <header className="bg-white/80 backdrop-blur border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🌉</div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                  {t("app.title")}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  {t("app.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {showAnalysis && (
                <button
                  onClick={handleNewConversation}
                  className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-full hover:shadow-lg transition-all text-sm font-medium"
                >
                  {t("chat.newChat")}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {mode === null ? (
          // 모드 선택 화면
          <div className="h-[calc(100vh-12rem)]">
            <ModeSelector onSelectMode={handleSelectMode} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 왼쪽: 채팅 인터페이스 */}
            <div className="lg:sticky lg:top-6 h-[calc(100vh-12rem)]">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                mode={mode}
                onChangeMode={handleChangeMode}
                ctaStage={ctaStage}
                onContinueCTA={handleContinueCTA}
                onAnalyzeCTA={handleAnalyzeCTA}
                onSimulateCurrent={handleSimulateCurrent}
                onSimulateSimilar={handleSimulateSimilar}
                simulationResult={simulationResult}
                simulationLoading={isSimLoading}
              />
            </div>

            {/* 오른쪽: 분석 결과 및 솔루션 */}
            <div className="space-y-6">
              {!showAnalysis && (
                <div className="bg-white/85 backdrop-blur rounded-2xl shadow-xl p-8 text-center border border-amber-100">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {lang === "ko"
                      ? "어떤 이야기를 나눠볼까요?"
                      : "What would you like to talk about?"}
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {lang === "ko"
                      ? "한국에서 겪은 문화적 갈등이나 이해하기 어려웠던 상황을 편하게 이야기해주세요. AI가 함께 이해하고 해결 방법을 찾아드립니다."
                      : "Share your cultural conflicts or confusing situations you've experienced in Korea. Our AI will help you understand and find solutions together."}
                  </p>
                </div>
              )}

              {showAnalysis && analysis && (
                <>
                  <EmotionAnalysis analysis={analysis} />

                  {solution && <SolutionCard solution={solution} />}

                  {selectedScenario && (
                    <VideoSimulation
                      scenarioId={selectedScenario.id}
                      scenarioTitle={selectedScenario.korean}
                    />
                  )}

                  {relatedScenarios.length > 0 && (
                    <LearningOptions
                      scenarios={relatedScenarios}
                      onSelectScenario={handleSelectScenario}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="bg-white/80 backdrop-blur border-t border-amber-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 CultureBridge. 이주민의 한국 문화 적응을 돕습니다.</p>
            <p className="mt-2 text-xs text-gray-500">
              Powered by Google Gemini AI & Claude API
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
