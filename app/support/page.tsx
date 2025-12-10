"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { loadReportPayload } from "@/lib/reportStorage";
import { ChatMessage } from "@/types";

type Mode = "online" | "offline" | "all";
type Kind = "community" | "counseling" | "all";

interface SupportResult {
  id: string | number;
  score: number;
  name?: string;
  name_ko?: string;
  session_type?: string[];
  services?: string[];
  services_ko?: string[];
  languages?: string[];
  website?: string;
  phone?: string;
  city?: string;
  city_ko?: string;
  district?: string | null;
  district_ko?: string | null;
}

export default function SupportPage() {
  const { lang } = useLanguage();
  const [mode, setMode] = useState<Mode>("all");
  const [kind, setKind] = useState<Kind>("all");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SupportResult[]>([]);

  useEffect(() => {
    const report = loadReportPayload();
    if (report?.messages) {
      setMessages(report.messages);
    }
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/support-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, language: lang, mode, kind, topK: 3 }),
      });
      if (!res.ok) {
        throw new Error("Search failed");
      }
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    title: lang === "ko" ? "맞춤 지원 찾기" : "Find tailored support",
    desc:
      lang === "ko"
        ? "온라인/오프라인, 커뮤니티/상담을 선택하고 대화 내용을 기반으로 추천을 받아보세요."
        : "Choose online/offline, community/counseling to get recommendations based on your chat.",
    mode: lang === "ko" ? "지원 방식" : "Mode",
    kind: lang === "ko" ? "지원 유형" : "Type",
    search: lang === "ko" ? "추천 받기" : "Get recommendations",
    needReport: lang === "ko"
      ? "리포트가 없습니다. 대화 후 리포트를 생성해주세요."
      : "No report found. Please generate a report from your chat first.",
  };

  const modeOptions: { value: Mode; label: string }[] = [
    { value: "all", label: lang === "ko" ? "모두" : "All" },
    { value: "online", label: lang === "ko" ? "온라인" : "Online" },
    { value: "offline", label: lang === "ko" ? "오프라인" : "Offline" },
  ];

  const kindOptions: { value: Kind; label: string }[] = [
    { value: "all", label: lang === "ko" ? "모두" : "All" },
    { value: "community", label: lang === "ko" ? "커뮤니티" : "Community" },
    { value: "counseling", label: lang === "ko" ? "상담" : "Counseling" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-100 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1>
            <p className="text-sm text-gray-600">{labels.desc}</p>
          </div>
          <Link
            href="/report"
            className="text-sm font-semibold text-primary hover:underline"
          >
            {lang === "ko" ? "리포트로 돌아가기" : "Back to report"}
          </Link>
        </div>

        <div className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-6 space-y-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">{labels.mode}</p>
              <div className="flex gap-2">
                {modeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMode(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      mode === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-black/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-800 mb-2">{labels.kind}</p>
              <div className="flex gap-2">
                {kindOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setKind(opt.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      kind === opt.value
                        ? "bg-primary text-white border-primary"
                        : "bg-white text-gray-700 border-black/10"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || messages.length === 0}
            className="px-4 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:shadow-md transition-all disabled:opacity-60"
          >
            {loading ? "Searching..." : labels.search}
          </button>

          {messages.length === 0 && (
            <p className="text-sm text-red-500">{labels.needReport}</p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        {results.length > 0 && (
          <div className="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {lang === "ko" ? "추천 결과" : "Recommendations"}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="border border-black/5 rounded-2xl p-4 bg-white/80 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-800">
                      {item.name_ko || item.name || item.id}
                    </p>
                    <span className="text-xs text-gray-500">
                      {lang === "ko" ? "유사도" : "Score"}: {(item.score || 0).toFixed(3)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {(item.city_ko || item.city) ?? ""}{" "}
                    {(item.district_ko || item.district) ?? ""}
                  </p>
                  {item.session_type && (
                    <p className="text-xs text-gray-600">
                      {lang === "ko" ? "방식" : "Mode"}: {item.session_type.join(", ")}
                    </p>
                  )}
                  {item.services_ko && (
                    <p className="text-xs text-gray-600">
                      {lang === "ko" ? "서비스" : "Services"}: {item.services_ko.join(", ")}
                    </p>
                  )}
                  {item.languages && (
                    <p className="text-xs text-gray-600">
                      {lang === "ko" ? "언어" : "Languages"}: {item.languages.join(", ")}
                    </p>
                  )}
                  <div className="flex gap-2 text-xs text-primary">
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {lang === "ko" ? "웹사이트" : "Website"}
                      </a>
                    )}
                    {item.phone && <span>{item.phone}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
