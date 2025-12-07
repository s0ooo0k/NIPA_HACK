import OpenAI from "openai";

// OpenAI 클라이언트 초기화
const apiKey = process.env.OPENAI_API_KEY || "";
const openai = new OpenAI({
  apiKey,
});

// 채팅 모델
const CHAT_MODEL = "gpt-4o-mini"; // 빠르고 저렴한 모델
const ANALYSIS_MODEL = "gpt-4o"; // 분석용 고성능 모델

// 채팅 메시지 전송
export async function sendChatMessage(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  systemPrompt: string
) {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content || "";
  } catch (error) {
    console.error("OpenAI chat error:", error);
    throw new Error("AI 응답 생성에 실패했습니다.");
  }
}

// JSON 형식으로 분석 결과 받기
export async function analyzeWithJSON<T>(prompt: string): Promise<T> {
  try {
    const completion = await openai.chat.completions.create({
      model: ANALYSIS_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that responds in JSON format. Always return valid JSON.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0].message.content || "{}";
    return JSON.parse(text) as T;
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("분석에 실패했습니다.");
  }
}

export async function generateVideo(prompt: string): Promise<{
  videoId: string;
  status: string;
}> {
  console.log("Sora video generation prompt:", prompt);

  // TODO: 영상 적용
  return {
    videoId: `sora_video_${Date.now()}`,
    status: "pending",
  };
}

// 비디오 생성 상태 확인
export async function checkVideoStatus(videoId: string): Promise<{
  status: string;
  url?: string;
}> {
  return {
    status: "generating",
  };
  /* 영상 미적용*/
}

// 스트리밍 채팅
export async function* streamChatMessage(
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = [],
  systemPrompt: string
) {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
    { role: "user", content: message },
  ];

  const stream = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    temperature: 0.8,
    max_tokens: 1000,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      yield content;
    }
  }
}
