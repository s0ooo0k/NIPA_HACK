import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { searchPoints, qdrantConfig } from "@/lib/qdrant";
import { formatConversationHistory } from "@/lib/prompts";
import { ChatMessage } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const EMBEDDING_MODEL = "text-embedding-3-small";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY missing" }, { status: 400 });
    }
    if (!process.env.QDRANT_URL) {
      return NextResponse.json({ error: "QDRANT_URL missing" }, { status: 400 });
    }

    const body = await request.json();
    const {
      messages,
      language = "ko",
      mode = "all", // online | offline | all
      kind = "all", // community | counseling | all
      topK = 3,
    } = body as {
      messages: ChatMessage[];
      language?: "ko" | "en";
      mode?: "online" | "offline" | "all";
      kind?: "community" | "counseling" | "all";
      topK?: number;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "messages are required" }, { status: 400 });
    }

    // Build query text from conversation
    const conversation = formatConversationHistory(messages);
    const preference =
      kind === "community"
        ? language === "ko"
          ? "커뮤니티, 모임, 동료 지지"
          : "community, peer support, group meeting"
        : kind === "counseling"
        ? language === "ko"
          ? "상담, 심리 상담, 전문가 상담"
          : "counseling, therapy, professional help"
        : "";
    const modeText =
      mode === "online"
        ? language === "ko"
          ? "온라인 지원"
          : "online support"
        : mode === "offline"
        ? language === "ko"
          ? "오프라인 대면 지원"
          : "offline in-person support"
        : "";
    const queryText = [conversation, preference, modeText].filter(Boolean).join("\n");

    const embedding = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: queryText,
    });

    const vector = embedding.data[0].embedding;

    const filter: any = { must: [] as any[] };
    if (mode !== "all") {
      filter.must.push({
        key: "session_type",
        match: { value: mode },
      });
    }

    const res = await searchPoints({
      vector,
      topK,
      filter: filter.must.length ? filter : undefined,
    });

    console.log("[support-search] Qdrant raw response:", JSON.stringify(res, null, 2));

    const results =
      res?.result?.map((item: any) => ({
        id: item.id,
        score: item.score,
        ...item.payload,
      })) || [];

    console.log("[support-search] Parsed results:", JSON.stringify(results, null, 2));

    return NextResponse.json({
      collection: qdrantConfig.collection,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("support-search error:", error);
    return NextResponse.json(
      { error: error?.message || "Search failed" },
      { status: 500 }
    );
  }
}
