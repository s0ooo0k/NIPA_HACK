"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ModeSelector from "@/components/ModeSelector";
import EmotionAnalysis from "@/components/EmotionAnalysis";
import SolutionCard from "@/components/SolutionCard";
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
          content: `점수: ${data.score}/100\n피드백: ${data.feedback}\n더 나은 답: ${data.betterAnswer}`,
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
      const chatResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: [...messages, userMessage],
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
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          lang === "ko"
            ? "메시지를 보내는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요."
            : "Something went wrong while sending. Please try again.",
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

      const analysisCompleteMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          lang === "ko"
            ? "대화 분석이 끝났어요. 오른쪽에서 감정 분석과 제안 카드를 확인해보세요."
            : "Analysis is ready. Check the right panel for insights and guidance.",
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
    setMode(null);
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
      const isVideo =
        data.url && typeof data.url === "string"
          ? data.url.toLowerCase().includes(".mp4")
          : false;
      setSimulationResult({
        image: data.fallbackImage,
        url: data.url,
        source: data.source,
      });
      const simMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          lang === "ko"
            ? "시뮬레이션 결과예요. 영상이나 이미지를 확인해보세요."
            : "Here’s the simulation—check the video or image below.",
        imageUrl: isVideo ? undefined : data.fallbackImage || data.url,
        videoUrl: isVideo ? data.url : undefined,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, simMessage]);
      setEvaluationPending(true);
      setEvaluationContext(
        lang === "ko" ? "현재 상황 시뮬레이션" : "Current scenario simulation"
      );
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
          const isVideo =
            data.url && typeof data.url === "string"
              ? data.url.toLowerCase().includes(".mp4")
              : false;
          const simMsg: ChatMessage = {
            id: Date.now().toString(),
            role: "assistant",
            content:
              lang === "ko"
                ? "비슷한 상황 시뮬레이션입니다. 영상이나 이미지를 확인해보세요."
                : "Here’s a similar scenario simulation—check the media below.",
            imageUrl: isVideo ? undefined : data.fallbackImage || data.url,
            videoUrl: isVideo ? data.url : undefined,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, simMsg]);
          setEvaluationPending(true);
          setEvaluationContext(
            lang === "ko"
              ? `비슷한 상황: ${scenario.korean}`
              : `Similar scenario: ${scenario.korean}`
          );
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-10 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-25 animate-pulse" />
        <div className="absolute top-10 right-0 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 animate-[pulse_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-25 animate-[pulse_7s_ease-in-out_infinite]" />
      </div>
      {/* Header */}
      <header className="relative z-10 w-full bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                CultureBridge
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <LanguageSelector />
              {mode !== null && (
                <button
                  onClick={handleNewConversation}
                  className="px-4 py-2 bg-gray-900 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold"
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
                      ? "요즘 어떤 대화가 마음에 걸리세요?"
                      : "What conversation is on your mind?"}
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {lang === "ko"
                      ? "한국에서 겪은 어려운 대화나 상황을 편하게 들려주세요. 감정과 맥락을 분석해서 더 나은 표현을 함께 찾아드릴게요."
                      : "Tell us about a difficult conversation or situation you've faced in Korea. We'll analyze the context and suggest better ways to communicate."}
                  </p>
                </div>
              )}

              {showAnalysis && analysis && (
                <>
                  <EmotionAnalysis analysis={analysis} />
                  {solution && <SolutionCard solution={solution} />}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
