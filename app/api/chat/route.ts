import { NextRequest, NextResponse } from "next/server";
import { streamGeminiChat, Message } from "@/lib/gemini";
import { getChatSystemPrompt } from "@/lib/prompts";
import { ChatMessage } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], language = "ko" } = body as {
      message: string;
      history: ChatMessage[];
      language?: "ko" | "en";
    };

    if (!message) {
      return NextResponse.json(
        { error: "메시지가 필요합니다." },
        { status: 400 }
      );
    }

    // 언어에 맞는 시스템 프롬프트 생성
    const systemPrompt = getChatSystemPrompt(language);

    // 히스토리를 Gemini 형식으로 변환
    const messages: Message[] = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: message }
    ];

    // Gemini로 AI 응답 생성 (스트리밍)
    let fullResponse = "";
    await streamGeminiChat(messages, (chunk) => {
      fullResponse += chunk;
    });

    // 대화가 충분한지 판단 (간단한 휴리스틱)
    const totalMessages = history.length + 1;
    const needsMoreInfo = totalMessages < 4; // 최소 2-3턴 대화

    return NextResponse.json({
      message: fullResponse,
      needsMoreInfo,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "AI 응답 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
