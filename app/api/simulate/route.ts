import { NextRequest, NextResponse } from "next/server";
import { ChatMessage } from "@/types";
import { buildSimulationPromptFromConversation } from "@/lib/prompts";
import { generateTogetherImage } from "@/lib/together";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "messages are required" },
        { status: 400 }
      );
    }

    const prompt = buildSimulationPromptFromConversation(messages);
    const image = await generateTogetherImage(prompt);

    return NextResponse.json({
      status: "completed",
      fallbackImage: image,
      source: "together-image-conversation",
    });
  } catch (error) {
    console.error("Simulate API error:", error);
    return NextResponse.json(
        { error: "Simulation failed." },
        { status: 500 }
      );
  }
}
