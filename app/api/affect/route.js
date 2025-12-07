// app/api/affect/route.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// === (TS → JS 변환) ===

// 시스템 프롬프트 - 대화형 상황 파악
const CHAT_SYSTEM_PROMPT = `당신은 한국에 적응 중인 외국인과 이주민을 돕는 따뜻하고 공감적인 AI 상담사입니다.

역할:
- 사용자가 겪은 문화적 갈등 상황을 자연스러운 대화로 파악합니다
- 2-3턴의 대화로 충분한 맥락을 수집합니다
- 감정을 인정하고 공감을 먼저 표현합니다
- 한국 문화를 비판하지 않고 객관적으로 설명합니다

대화 가이드라인:
1. 사용자의 이야기를 경청하고 공감을 표현하세요
2. 구체적인 상황을 파악하기 위해 자연스럽게 질문하세요
3. 감정 상태를 파악하세요 ("그때 기분이 어땠어요?")
4. 충분한 정보가 모이면 분석을 시작할 수 있다고 안내하세요

톤:
- 따뜻하고 친근한 말투
- 격식을 차리지 않은 자연스러운 대화
- 공감과 이해를 표현하는 언어 사용

예시:
사용자: "오늘 교수님이랑 이상한 일이 있었어..."
AI: "어떤 상황이었는지 편하게 얘기해줄래요?"
사용자: "밥 먹었어?라고 하셔서 점심 약속인 줄 알고 기다렸는데 아무도 안 왔어"
AI: "아 그랬구나... 혼자 기다리고 계셨겠네요. 그때 기분이 어땠어요?"
`;

// 감정 분석 프롬프트 (TS → JS, 타입만 제거)
function getEmotionAnalysisPrompt(conversation) {
  return `다음 대화에서 사용자가 겪은 문화적 갈등 상황을 분석해주세요.

대화 내용:
${conversation}

다음 형식의 JSON으로 분석 결과를 제공해주세요:
{
  "emotions": ["confusion", "embarrassment", "frustration", "anger", "sadness", "loneliness", "anxiety"] 중 해당되는 감정들,
  "category": "school" | "workplace" | "daily" | "relationship" 중 하나,
  "subcategory": "교수 관계", "조별과제", "상사 관계" 등 구체적 하위 카테고리,
  "confidence": 0.0 ~ 1.0 사이의 신뢰도,
  "situation_summary": "상황 요약 (1-2문장)",
  "cultural_context": "한국 문화적 맥락 설명",
  "keywords": ["관련", "키워드", "배열"]
}

감정 카테고리:
- confusion: 혼란
- embarrassment: 당혹/수치
- frustration: 좌절
- anger: 분노
- sadness: 슬픔
- loneliness: 외로움
- anxiety: 불안

상황 카테고리:
- school: 학교생활 (수업, 교수관계, 조별과제)
- workplace: 직장생활 (상사, 동료, 회식문화)
- daily: 일상생활 (집주인, 이웃, 행정처리)
- relationship: 대인관계 (친구, 연인, 모임)
`;
}

// 

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

  
    const prompt = getEmotionAnalysisPrompt(text);

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: CHAT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let emotionData;
    try {
      emotionData = JSON.parse(cleaned);
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

    // 
    const firstEmotion =
      Array.isArray(emotionData.emotions) && emotionData.emotions.length > 0
        ? emotionData.emotions[0]
        : "neutral";

    const uiResult = {
      // AffectCard.jsx 가 기대하는 필드들
      emotion_label: firstEmotion,
      affect_state: emotionData.situation_summary || "정서 상태 요약 없음",
      stress_level:
        typeof emotionData.confidence === "number"
          ? emotionData.confidence
          : 0.5,
      // 사회적/환경 적응도는 이 프롬프트에 없어서 임시값 (나중에 팀이 로직 정하면 수정)
      social_adaptation: 0.6,
      summary:
        (emotionData.cultural_context || "") +
        (emotionData.cultural_context ? " " : "") +
        (emotionData.situation_summary || ""),
      // 디버그/확장용: 원본 결과도 함께 전달
      raw: emotionData,
    };

    return Response.json(uiResult);
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
