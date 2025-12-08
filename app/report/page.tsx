"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import EmotionAnalysis from "@/components/EmotionAnalysis";
import { useLanguage } from "@/context/LanguageContext";
import { ReportPayload, loadReportPayload } from "@/lib/reportStorage";
import { ChatMessage } from "@/types";
import Link from "next/link";

export default function ReportPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [report, setReport] = useState<ReportPayload | null>(null);

  useEffect(() => {
    setReport(loadReportPayload());
  }, []);

  if (!report) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-8 max-w-lg text-center space-y-4">
          <p className="text-lg font-semibold text-gray-800">
            {lang === "ko" ? "최근 리포트가 없어요." : "No report available."}
          </p>
          <p className="text-sm text-gray-600">
            {lang === "ko"
              ? "메인 화면에서 감정 분석 리포트를 생성해 주세요."
              : "Please run an emotion analysis from the main chat first."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:shadow-md transition-all"
          >
            {lang === "ko" ? "채팅으로 돌아가기" : "Back to chat"}
          </button>
        </div>
      </main>
    );
  }

  const recentMessages: ChatMessage[] = report.messages.slice(-6);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-sm text-sm font-semibold hover:shadow-lg transition-all"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              {lang === "ko" ? "채팅으로" : "Back"}
            </button>
            <div className="flex items-center gap-2 text-gray-700">
              <DocumentTextIcon className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {lang === "ko" ? "감정 분석 리포트" : "Emotion Analysis Report"}
                </h1>
                <p className="text-xs text-gray-500">
                  {lang === "ko" ? "대화 기반 종합 결과" : "Conversation-based insights"}
                </p>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {lang === "ko" ? "생성 시각" : "Generated"}:{" "}
            {new Date(report.generatedAt).toLocaleString()}
          </div>
        </header>

        <EmotionAnalysis analysis={report.analysis} />

        <div className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {lang === "ko" ? "대화 기록" : "Conversation history"}
          </h2>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {recentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${
                  msg.role === "assistant" ? "text-gray-800" : "text-primary"
                }`}
              >
                <span className="text-xs font-semibold">
                  {msg.role === "assistant"
                    ? lang === "ko"
                      ? "AI"
                      : "AI"
                    : lang === "ko"
                    ? "사용자"
                    : "User"}
                  :
                </span>
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {lang === "ko" ? "맞춤 지원 찾기" : "Find tailored support"}
            </h3>
            <p className="text-xs text-gray-600">
              {lang === "ko"
                ? "온라인/오프라인, 커뮤니티/상담 중 선택해서 추천을 받아보세요."
                : "Choose online/offline and community/counseling to get recommendations."}
            </p>
          </div>
          <Link
            href="/support"
            className="px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:shadow-md transition-all"
          >
            {lang === "ko" ? "지원 검색으로" : "Go to support search"}
          </Link>
        </div>
      </div>
    </main>
  );
}
