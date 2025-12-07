import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    // OpenAI TTS API로 텍스트를 음성으로 변환
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // 자연스럽고 따뜻한 목소리
      input: text,
      speed: 1.0,
    });

    // ArrayBuffer를 Buffer로 변환
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // MP3 파일을 직접 반환
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return NextResponse.json(
      { error: "Failed to generate speech" },
      { status: 500 }
    );
  }
}
