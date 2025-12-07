import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";
const openai = new OpenAI({ apiKey });

const CHAT_MODEL = "gpt-4o-mini"; // Faster, cheaper chat
const ANALYSIS_MODEL = "gpt-4o"; // Higher quality for analysis
const IMAGE_MODEL = "gpt-image-1";
const IMAGE_FALLBACK_MODEL = "dall-e-3";

// Chat completion helper
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
    throw new Error("AI response failed.");
  }
}

// Structured JSON analysis helper
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
    throw new Error("Analysis failed.");
  }
}

export async function generateImage(prompt: string): Promise<{
  dataUrl: string;
  revisedPrompt?: string | null;
}> {
  const createWithModel = async (model: string) => {
    return openai.images.generate({
      model,
      prompt,
      size: "1024x1024",
    });
  };

  try {
    let response = await createWithModel(IMAGE_MODEL);
    // Fallback to DALL·E 3 if the primary model is unavailable/unauthorized
    if (!response.data?.[0] && IMAGE_FALLBACK_MODEL) {
      response = await createWithModel(IMAGE_FALLBACK_MODEL);
    }

    const result = response.data?.[0];
    const b64 = result?.b64_json;
    const url = result?.url;
    const dataUrl = b64 ? `data:image/png;base64,${b64}` : url;

    if (!dataUrl) {
      throw new Error("No image returned from OpenAI.");
    }

    return {
      dataUrl,
      revisedPrompt: result?.revised_prompt ?? null,
    };
  } catch (error) {
    const err = error as any;
    console.error("OpenAI image error:", {
      status: err?.status,
      code: err?.code,
      param: err?.param,
      message: err?.message,
      response: err?.response?.data,
    });
    throw new Error("Image generation failed.");
  }
}

export async function generateVideo(prompt: string): Promise<{
  videoId: string;
  status: string;
}> {
  console.log("Sora video generation prompt:", prompt);

  // TODO: Wire actual video generation when available
  return {
    videoId: `sora_video_${Date.now()}`,
    status: "pending",
  };
}

// Placeholder for polling video status
export async function checkVideoStatus(videoId: string): Promise<{
  status: string;
  url?: string;
}> {
  return {
    status: "generating",
  };
}

// Streaming chat helper
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
