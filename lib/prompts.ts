import { ChatMessage } from "@/types";

// 시스템 프롬프트 - 대화형 상황 파악 (다국어 지원)
export function getChatSystemPrompt(language: "ko" | "en" = "ko"): string {
  if (language === "en") {
<<<<<<< Updated upstream
    return `You are CultureBridge, a warm and empathetic AI counselor helping foreigners and immigrants adapt to Korean culture.
=======
    return `You are chomchom, an AI counselor helping foreigners adapt to Korean culture.
>>>>>>> Stashed changes

Role:
- Understand cultural conflicts through 2-3 conversation turns
- Express empathy with simple questions
- Explain Korean culture objectively

Response Style - IMPORTANT:
- Keep responses to 2-3 sentences maximum
- Be concise and direct
- Avoid repetition
- Always include Korean phrases with romanization when relevant
- Example: "That's '눈치' (nun-chi) - Korean social awareness"

Tone: Warm, friendly, brief

Example:
User: "Professor asked '밥 먹었어?' and I waited for lunch but he didn't come"
AI: "That must have been confusing! How did you feel waiting there?"
`;
  }

  return `당신은 chomchom, 한국 문화 적응을 돕는 AI 상담사입니다.

역할:
- 문화적 갈등 상황을 2-3턴 대화로 파악
- 공감과 간단한 질문으로 상황 이해
- 한국 문화를 객관적으로 설명

응답 스타일 - 중요:
- 2-3문장으로 짧고 간결하게 답변
- 핵심만 전달
- 불필요한 반복 금지
- 친근하고 따뜻한 톤 유지

예시:
사용자: "교수님이 밥 먹었어?라고 물어봐서 점심 약속인 줄 알고 기다렸는데 안 왔어요"
AI: "아 그랬구나, 혼자 기다리셨겠네요. 그때 기분이 어땠어요?"
`;
}

// Backward compatibility
export const CHAT_SYSTEM_PROMPT = getChatSystemPrompt("ko");

// 감정 분석 프롬프트 (다국어 지원)
export function getEmotionAnalysisPrompt(
  conversation: string,
  language: "ko" | "en" = "ko"
): string {
  if (language === "en") {
    return `Analyze the cultural conflict situation from the following conversation.

Conversation:
${conversation}

Provide analysis in the following JSON format:
{
  "emotions": array of applicable emotions from ["confusion", "embarrassment", "frustration", "anger", "sadness", "loneliness", "anxiety"],
  "category": one of "school" | "workplace" | "daily" | "relationship",
  "subcategory": specific subcategory (e.g., "professor relationship", "group project", "boss relationship"),
  "confidence": confidence score between 0.0 and 1.0,
  "situation_summary": "situation summary (1-2 sentences)",
  "cultural_context": "explanation of Korean cultural context",
  "keywords": ["relevant", "keywords", "array"]
}

Emotion categories:
- confusion: confusion
- embarrassment: embarrassment/shame
- frustration: frustration
- anger: anger
- sadness: sadness
- loneliness: loneliness
- anxiety: anxiety

Situation categories:
- school: school life (classes, professor relations, group projects)
- workplace: workplace (boss, colleagues, company dinners)
- daily: daily life (landlord, neighbors, administrative tasks)
- relationship: interpersonal relationships (friends, romantic partners, gatherings)
`;
  }

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

// 솔루션 생성 프롬프트 (다국어 지원)
export function getSolutionPrompt(
  situation: string,
  emotions: string[],
  category: string,
  language: "ko" | "en" = "ko"
): string {
  if (language === "en") {
    return `Provide a solution for the following cultural conflict situation the user experienced.

Situation: ${situation}
Emotions: ${emotions.join(", ")}
Category: ${category}

Provide the solution in the following JSON format:
{
  "culturalContext": "Explanation of Korean cultural background of this situation (2-3 sentences). Include Korean phrases with romanization when relevant.",
  "explanation": "Objective explanation of why this happened (2-3 sentences)",
  "correctResponse": "How to respond next time (specific example with Korean phrases and romanization)",
  "additionalTips": ["Additional tip 1 (include Korean phrases with romanization)", "Additional tip 2", "Additional tip 3"]
}

Guidelines:
- Explain Korean culture objectively without criticism
- Provide practical and specific advice
- Maintain a warm and empathetic tone
- Acknowledge the user's emotions
- ALWAYS include Korean phrases with romanization (e.g., "Say '감사합니다' (gam-sa-ham-ni-da)")
- Example format: "Korean phrase: '안녕하세요' (an-nyeong-ha-se-yo) meaning 'hello'"
`;
  }

  return `다음 문화적 갈등 상황에 대한 솔루션을 제공해주세요.

상황: ${situation}
감정: ${emotions.join(", ")}
카테고리: ${category}

JSON 형식:
{
  "culturalContext": "한국 문화적 배경 (2문장)",
  "explanation": "왜 이런 일이 발생했는지 (2문장으로 자세히)",
  "correctResponse": "다음 대응 방법 (1-2문장, 구체적 예시 포함)",
  "additionalTips": ["팁 1 (1문장)", "팁 2 (1문장)", "팁 3 (1문장)"]
}

중요 규칙:
- culturalContext, explanation, correctResponse는 충분한 설명 제공
- 마크다운 서식 절대 사용 금지 (**, *, #, - 등)
- 평문으로만 작성
- 핵심 내용을 명확하게 전달
`;
}

// 관련 시나리오 찾기 프롬프트
export function getRelatedScenariosPrompt(
  situation: string,
  keywords: string[]
): string {
  return `다음 상황과 관련된 한국 문화 표현이나 상황을 3가지 추천해주세요.

현재 상황: ${situation}
키워드: ${keywords.join(", ")}

추천 기준:
1. 비슷한 문화적 맥락
2. 사용자가 혼란스러워할 수 있는 다른 표현
3. 관련된 사회적 상황

다음 형식의 JSON 배열로 제공해주세요:
[
  {
    "title": "표현이나 상황 제목",
    "description": "간단한 설명 (1-2문장)",
    "reason": "왜 이것을 추천하는지 (1문장)"
  }
]

최대 3개까지만 추천해주세요.
`;
}

// 대화 히스토리를 문자열로 변환
export function formatConversationHistory(messages: ChatMessage[]): string {
  return messages
    .map((msg) => {
      const role = msg.role === "user" ? "사용자" : "AI";
      return `${role}: ${msg.content}`;
    })
    .join("\n");
}

// 비디오 프롬프트 생성
export function generateVideoPrompt(
  scenario: {
    korean: string;
    correctResponse?: string;
    context: string;
  },
  sceneType: "wrong" | "correct" | "comparison" = "correct"
): string {
  const basePrompt = `한국 문화 상황 시뮬레이션 영상`;

  switch (sceneType) {
    case "wrong":
      return `${basePrompt}: "${scenario.korean}" 표현을 잘못 이해하여 어색한 상황이 발생하는 장면. 맥락: ${scenario.context}. 8초 분량. 자연스러운 한국어 대화와 ambient 소리 포함.`;

    case "correct":
      return `${basePrompt}: "${scenario.korean}" 표현에 올바르게 대응하는 장면. ${scenario.correctResponse ? `올바른 응답: "${scenario.correctResponse}". ` : ""}맥락: ${scenario.context}. 8초 분량. 밝고 긍정적인 분위기. 자연스러운 한국어 대화와 ambient 소리 포함.`;

    case "comparison":
      return `${basePrompt}: "${scenario.korean}" 표현의 잘못된 이해와 올바른 이해를 비교하는 장면. 먼저 잘못 이해한 경우를 보여주고, 다음으로 올바르게 대응하는 모습을 보여줌. 맥락: ${scenario.context}. 10초 분량. 자연스러운 한국어 대화와 ambient 소리 포함.`;
  }
}

// 추가 학습 제안 프롬프트
export function getLearningOptionsPrompt(currentScenario: string): string {
  return `사용자가 방금 "${currentScenario}" 상황에 대해 학습했습니다.

비슷하게 헷갈릴 수 있는 한국 문화 표현이나 상황 3가지를 추천해주세요.

다음 형식으로 제공해주세요:
[
  {
    "number": 1,
    "korean": "한국어 표현",
    "question": "이것의 의미는?",
    "preview": "짧은 설명 (1문장)"
  }
]

예시:
[
  {
    "number": 1,
    "korean": "다음에 보자",
    "question": "진짜 약속일까?",
    "preview": "헤어질 때 하는 인사로, 구체적 약속이 아닙니다"
  }
]
`;
}
