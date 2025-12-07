import { NextRequest, NextResponse } from "next/server";
import { generateVideo, checkVideoStatus } from "@/lib/openai";
import { findScenarioById } from "@/data/scenarios";
import { generateVideoPrompt } from "@/lib/prompts";

// 비디오 생성 요청
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, sceneType = "correct" } = body as {
      scenarioId: string;
      sceneType?: "wrong" | "correct" | "comparison";
    };

    if (!scenarioId) {
      return NextResponse.json(
        { error: "시나리오 ID가 필요합니다." },
        { status: 400 }
      );
    }

    // 시나리오 찾기
    const scenario = findScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: "시나리오를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // 비디오 프롬프트 생성
    let videoPrompt = scenario.videoPrompt;

    // 커스텀 프롬프트가 필요한 경우
    if (sceneType !== "correct") {
      videoPrompt = generateVideoPrompt(scenario, sceneType);
    }

    // 비디오 생성 요청
    const result = await generateVideo(videoPrompt);

    return NextResponse.json({
      videoId: result.videoId,
      status: result.status,
      scenarioId,
    });
  } catch (error) {
    console.error("Video generation API error:", error);
    return NextResponse.json(
      { error: "비디오 생성 요청에 실패했습니다." },
      { status: 500 }
    );
  }
}

// 비디오 생성 상태 확인
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId");

    if (!videoId) {
      return NextResponse.json(
        { error: "비디오 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const status = await checkVideoStatus(videoId);

    return NextResponse.json({
      videoId,
      status: status.status,
      url: status.url,
    });
  } catch (error) {
    console.error("Video status API error:", error);
    return NextResponse.json(
      { error: "비디오 상태 확인에 실패했습니다." },
      { status: 500 }
    );
  }
}
