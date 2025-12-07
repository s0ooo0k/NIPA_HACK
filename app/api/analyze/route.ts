import { NextRequest, NextResponse } from "next/server";
import { analyzeWithJSON } from "@/lib/openai";
import {
  formatConversationHistory,
  getEmotionAnalysisPrompt,
  getSolutionPrompt,
} from "@/lib/prompts";
import { ChatMessage, EmotionAnalysis, Solution } from "@/types";
import { allScenarios, getScenariosByKeywords } from "@/data/scenarios";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, language = "ko" } = body as {
      messages: ChatMessage[];
      language?: "ko" | "en";
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "대화 내역이 필요합니다." },
        { status: 400 }
      );
    }

    // 1. 대화 내용을 문자열로 변환
    const conversation = formatConversationHistory(messages);

    // 2. 감정 분석
    const analysisPrompt = getEmotionAnalysisPrompt(conversation, language);
    const analysisResult = await analyzeWithJSON<
      EmotionAnalysis & {
        situation_summary: string;
        cultural_context: string;
        keywords: string[];
      }
    >(analysisPrompt);

    const analysis: EmotionAnalysis = {
      emotions: analysisResult.emotions,
      category: analysisResult.category,
      subcategory: analysisResult.subcategory,
      confidence: analysisResult.confidence,
    };

    // 3. 솔루션 생성
    const solutionPrompt = getSolutionPrompt(
      analysisResult.situation_summary,
      analysisResult.emotions,
      analysisResult.category,
      language
    );

    const solution = await analyzeWithJSON<Solution>(solutionPrompt);

    // 4. 관련 시나리오 찾기
    const relatedScenarios = getScenariosByKeywords(
      analysisResult.keywords || []
    ).slice(0, 3);

    // 키워드로 못 찾으면 카테고리별로 추천
    if (relatedScenarios.length === 0) {
      const categoryScenarios = allScenarios.filter((s) => {
        // 카테고리에 따라 시나리오 그룹 선택
        if (analysis.category === "school") {
          return (
            s.id.includes("seonbae") ||
            s.id.includes("jobyul") ||
            s.id.includes("bap-meogeosseo")
          );
        } else if (analysis.category === "workplace") {
          return (
            s.id.includes("geomto") ||
            s.id.includes("hoesik") ||
            s.id.includes("soojung")
          );
        }
        return true;
      });
      relatedScenarios.push(...categoryScenarios.slice(0, 3));
    }

    return NextResponse.json({
      analysis,
      solution,
      relatedScenarios,
    });
  } catch (error) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: "분석에 실패했습니다." },
      { status: 500 }
    );
  }
}
