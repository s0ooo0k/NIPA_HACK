// app/api/affect/route.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const text = (body?.text || "").toString();

    if (!text.trim()) {
      return Response.json(
        { error: "텍스트가 비어 있습니다." },
        { status: 400 }
      );
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "너는 다문화 및 외국인 유학생의 정서 상태를 분석하는 상담 도우미야. " +
            "사용자의 텍스트를 보고 스트레스, 불안, 사회적/환경적 적응도를 추정해. " +
            "항상 JSON 형식으로만 답해야 하고, 설명 문장은 summary에만 적어.",
        },
        {
          role: "user",
          content:
            "아래 텍스트를 분석해서 JSON으로만 답해줘.\n" +
            '형식: {"emotion_label":"tired|anxious|calm|neutral",' +
            '"affect_state":"짧은 한국어 설명",' +
            '"stress_level":0~1 사이 숫자,' +
            '"social_adaptation":0~1 사이 숫자,' +
            '"summary":"두세 문장짜리 한국어 요약"}\n\n' +
            `텍스트: """${text}"""`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    // 혹시 모델이 ```json ``` 같은 코드블럭을 붙이면 제거
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("JSON 파싱 실패, 원본 응답:", raw);
      return Response.json(
        {
          error: "모델 응답 파싱에 실패했습니다.",
          raw,
        },
        { status: 500 }
      );
    }

    return Response.json(data);
  } catch (err) {
    console.error("Affect API error:", err);
    return Response.json(
      {
        error: "Server error",
        message: String(err?.message || err),
      },
      { status: 500 }
    );
  }
}
