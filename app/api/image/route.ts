import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = (body?.prompt as string | undefined)?.trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required." },
        { status: 400 }
      );
    }

    const image = await generateImage(prompt);

    return NextResponse.json({
      image: image.dataUrl,
      revisedPrompt: image.revisedPrompt,
    });
  } catch (error) {
    console.error("Image generation API error:", error);
    return NextResponse.json(
      { error: "Image generation failed." },
      { status: 500 }
    );
  }
}
