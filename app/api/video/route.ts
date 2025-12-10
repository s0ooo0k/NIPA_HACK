import { NextRequest, NextResponse } from "next/server";
import { findScenarioById } from "@/data/scenarios";
import { generateVideoPrompt } from "@/lib/prompts";
import { generateVideoWithFallback } from "@/lib/together";
import { findCannedVideo } from "@/data/cannedVideos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { scenarioId, sceneType = "correct" } = body as {
      scenarioId: string;
      sceneType?: "wrong" | "correct" | "comparison";
    };

    if (!scenarioId) {
      return NextResponse.json(
        { error: "scenarioId is required" },
        { status: 400 }
      );
    }

    const scenario = findScenarioById(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: "Scenario not found" },
        { status: 404 }
      );
    }

    // Use canned/pre-generated video if available
    const cannedUrl = findCannedVideo(scenarioId);
    if (cannedUrl) {
      return NextResponse.json({
        scenarioId,
        status: "completed",
        url: cannedUrl,
        source: "canned",
      });
    }

    // Build prompt
    let videoPrompt = scenario.videoPrompt;
    if (sceneType !== "correct") {
      videoPrompt = generateVideoPrompt(scenario, sceneType);
    }

    const result = await generateVideoWithFallback(videoPrompt);

    return NextResponse.json({
      scenarioId,
      status: result.status,
      url: result.url,
      videoId: result.videoId,
      fallbackImage: result.fallbackImage,
      error: result.error,
      source: result.url
        ? "together-video"
        : result.fallbackImage
        ? "together-image"
        : "unknown",
    });
  } catch (error) {
    console.error("Video generation API error:", error);
    return NextResponse.json(
      { error: "Video generation failed." },
      { status: 500 }
    );
  }
}

// Optional status polling if needed in the future
export async function GET() {
  return NextResponse.json(
    { error: "Polling not implemented. Use POST to generate." },
    { status: 400 }
  );
}
