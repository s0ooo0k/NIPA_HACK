import { ChatMessage, EmotionAnalysis, Scenario, Solution } from "@/types";

export const REPORT_STORAGE_KEY = "cb_report_payload";

export type ReportPayload = {
  analysis: EmotionAnalysis;
  solution: Solution;
  relatedScenarios: Scenario[];
  messages: ChatMessage[];
  lang: "ko" | "en";
  generatedAt: string;
};

export function saveReportPayload(payload: ReportPayload) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(payload));
}

export function loadReportPayload(): ReportPayload | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(REPORT_STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ReportPayload;
  } catch (error) {
    console.error("Failed to parse report payload:", error);
    return null;
  }
}
