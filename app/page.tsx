"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ModeSelector from "@/components/ModeSelector";
import EmotionAnalysis from "@/components/EmotionAnalysis";
import SolutionCard from "@/components/SolutionCard";
import LearningOptions from "@/components/LearningOptions";
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
  const [evaluationPending, setEvaluationPending] = useState(false);
  const [evaluationContext, setEvaluationContext] = useState("");

  const handleSendMessage = async (content: string) => {
    // If waiting for evaluation response, evaluate instead of normal chat
    if (evaluationPending) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        setIsLoading(true);
        const res = await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAnswer: content,
            context: evaluationContext,
            language: lang,
          }),
        });
        if (!res.ok) throw new Error("Evaluation failed");
        const data = await res.json();
        const feedbackMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `점수: ${data.score}/100\n피드백: ${data.feedback}\n더 나은 답변 예시: ${data.betterAnswer}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, feedbackMessage]);
      } catch (error) {
        console.error("Error evaluating answer:", error);
      } finally {
        setIsLoading(false);
        setEvaluationPending(false);
        setEvaluationContext("");
      }
      return;
    }

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

  const handleNewConversation = () => {
    setMessages([]);
    setAnalysis(null);
    setSolution(null);
    setRelatedScenarios([]);
    setShowAnalysis(false);
    setMode(null); // 모드 선택 화면으로 돌아감
    setAssistantTurns(0);
    setCtaStage("none");
    setSimulationResult(null);
    setEvaluationPending(false);
    setEvaluationContext("");
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
      const isVideo = data.url && data.url.endsWith(".mp4");
      setSimulationResult({
        image: data.fallbackImage,
        url: data.url,
        source: data.source,
      });
      // Push media as chat message
      const simMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "시뮬레이션 결과입니다. 이 상황에서 어떻게 대답할까요?",
        imageUrl: isVideo ? undefined : data.fallbackImage || data.url,
        videoUrl: isVideo ? data.url : undefined,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, simMessage]);
      setEvaluationPending(true);
      setEvaluationContext("대화 기반 시뮬레이션 상황");
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
      const scenario = relatedScenarios[0];
      setShowAnalysis(true);
      fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Similar simulation failed");
          const data = await res.json();
          const isVideo = data.url && data.url.endsWith(".mp4");
          const simMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content: `비슷한 상황 시뮬레이션입니다. 이럴 때 뭐라고 답할까요?`,
            imageUrl: isVideo ? undefined : data.fallbackImage || data.url,
            videoUrl: isVideo ? data.url : undefined,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, simMsg]);
          setEvaluationPending(true);
          setEvaluationContext(`비슷한 상황: ${scenario.korean}`);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleSelectScenario = async (scenarioId: string) => {
    const scenario = relatedScenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;
    try {
      const res = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id }),
      });
      if (!res.ok) throw new Error("Simulation failed");
      const data = await res.json();
      const isVideo = data.url && data.url.endsWith(".mp4");
      const simMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `${scenario.korean} 시뮬레이션입니다. 이럴 때 뭐라고 답할까요?`,
        imageUrl: isVideo ? undefined : data.fallbackImage || data.url,
        videoUrl: isVideo ? data.url : undefined,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, simMsg]);
      setEvaluationPending(true);
      setEvaluationContext(`추천 시나리오: ${scenario.korean}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--app-bg)]">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🌉</div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {t("app.title")}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {t("app.subtitle")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {mode !== null && (
                <button
                  onClick={handleNewConversation}
                  className="px-4 py-2 bg-primary text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
                >
                  {t("chat.newChat")}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === null ? (
          // Mode Selection Screen
          <div className="flex items-center justify-center h-[calc(100vh-15rem)]">
            <ModeSelector onSelectMode={handleSelectMode} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Chat Interface */}
            <div className="h-[calc(100vh-12rem)]">
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
                evaluationPending={evaluationPending}
              />
            </div>

            {/* Right: Analysis & Solution */}
            <div className="space-y-6">
              {!showAnalysis && (
                <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
                  <div className="text-6xl mb-4 animate-bounce">💬</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {lang === "ko"
                      ? "어떤 대화가 고민인가요?"
                      : "What conversation is on your mind?"}
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {lang === "ko"
                      ? "한국에서 겪은 어려운 대화나 상황을 이야기해주세요. AI가 분석하고 더 나은 소통 방법을 제안해 드립니다."
                      : "Tell us about a difficult conversation or situation you've faced in Korea. Our AI will analyze it and suggest better ways to communicate."}
                  </p>
                </div>
              )}

              {showAnalysis && analysis && (
                <>
                  <EmotionAnalysis analysis={analysis} />
                  {solution && <SolutionCard solution={solution} />}
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

      {/* Footer */}
      <footer className="w-full bg-white/50 backdrop-blur-md mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="text-center text-sm text-gray-500">
            <p>© 2024 CultureBridge. Helping you connect with Korean culture.</p>
            <p className="mt-1 text-xs text-gray-400">
              Powered by Google Gemini &amp; Claude
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
