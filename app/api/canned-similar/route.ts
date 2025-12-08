import { NextRequest, NextResponse } from "next/server";
import { analyzeWithJSON } from "@/lib/openai";
import { formatConversationHistory, getBestCannedVideoPrompt } from "@/lib/prompts";
import { ChatMessage } from "@/types";
import { cannedVideos } from "@/data/cannedVideos";
import { findScenarioById } from "@/data/scenarios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, language = "ko" } = body as {
      messages: ChatMessage[];
      language?: "ko" | "en";
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "messages are required" }, { status: 400 });
    }

    const conversation = formatConversationHistory(messages);
    const candidates = cannedVideos.map((item) => ({
      id: item.scenarioId,
      title: findScenarioById(item.scenarioId)?.korean || item.scenarioId,
    }));

    const prompt = getBestCannedVideoPrompt(conversation, candidates);
    const result = await analyzeWithJSON<{ id: string }>(prompt);
    const pickedId = result?.id || candidates[0].id;

    return NextResponse.json({ scenarioId: pickedId });
  } catch (error) {
    console.error("canned-similar error:", error);
    return NextResponse.json({ error: "Failed to pick canned video" }, { status: 500 });
  }
}
