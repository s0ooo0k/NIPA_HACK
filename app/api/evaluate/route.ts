import { NextRequest, NextResponse } from "next/server";
import { analyzeWithJSON } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userAnswer,
      context = "",
      language = "ko",
    } = body as {
      userAnswer: string;
      context?: string;
      language?: "ko" | "en";
    };

    if (!userAnswer) {
      return NextResponse.json(
        { error: "userAnswer is required" },
        { status: 400 }
      );
    }

    const prompt =
      language === "ko"
        ? `다음 답변을 상황에 맞는지 평가해 주세요.

상황:
${context}

사용자 답변:
${userAnswer}

JSON 형태로 출력:
{
  "score": 0-100 점수 (적절성),
  "feedback": "짧은 피드백",
  "betterAnswer": "더 나은 예시 답변"
}`
        : `Score the user's reply for appropriateness to the situation.

Context:
${context}

User answer:
${userAnswer}

Return JSON:
{
  "score": 0-100,
  "feedback": "short feedback",
  "betterAnswer": "better example answer"
}`;

    const result = await analyzeWithJSON<{
      score: number;
      feedback: string;
      betterAnswer: string;
    }>(prompt);

    return NextResponse.json({
      score: result.score,
      feedback: result.feedback,
      betterAnswer: result.betterAnswer,
    });
  } catch (error) {
    console.error("Evaluate API error:", error);
    return NextResponse.json(
      { error: "Evaluation failed." },
      { status: 500 }
    );
  }
}
