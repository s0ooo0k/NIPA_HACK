import { NextRequest, NextResponse } from "next/server";
import { findScenarioById } from "@/data/scenarios";
import { generateVideoPrompt } from "@/lib/prompts";
import { generateTogetherImage } from "@/lib/together";

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

    // Build prompt
    let videoPrompt = scenario.videoPrompt;
    if (sceneType !== "correct") {
      videoPrompt = generateVideoPrompt(scenario, sceneType);
    }

    // Image-only test: generate a still image via Together and return as fallbackImage
    const image = await generateTogetherImage(videoPrompt);

    return NextResponse.json({
      scenarioId,
      status: "completed",
      fallbackImage: image,
      source: "together-image-only",
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
