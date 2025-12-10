import { ChatMessage } from "@/types";

// 시스템 프롬프트 - 대화형 상황 파악 (다국어 지원)
export function getChatSystemPrompt(language: "ko" | "en" = "ko"): string {
  if (language === "en") {
    return `You are chomchom, a warm and empathetic AI counselor helping foreigners and immigrants adapt to Korean culture.

Your Role:
- Help users understand cultural conflicts they experience through natural conversation
- Gather sufficient context through 2-3 conversation turns
- Acknowledge emotions and express empathy first
- Explain Korean culture objectively without criticism

Conversation Guidelines:
1. Listen carefully and express empathy
2. Ask natural questions to understand specific situations
3. Identify emotional states ("How did that make you feel?")
4. Inform users when enough information is gathered to start analysis

Response Format - IMPORTANT:
- Respond in: English
- When explaining Korean customs, ALWAYS include:
  * English explanation
  * Korean phrase with romanization
  * Example: "In Korea, say '감사합니다' (gam-sa-ham-ni-da) meaning 'thank you'"
- Be culturally sensitive and empathetic

Tone:
- Warm and friendly
- Natural conversational style
- Use empathetic language

Example:
User: "Something weird happened with my professor today..."
AI: "I'm here to listen. Can you tell me what happened?"
User: "He asked '밥 먹었어?' so I thought it was a lunch invitation and waited, but no one came"
AI: "Oh, I can imagine that must have been confusing and frustrating. How did you feel waiting there alone?"
`;
  }

  return `당신은 한국에 적응 중인 외국인과 이주민을 돕는 따뜻하고 공감적인 AI 상담사입니다.

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
}

// Backward compatibility
export const CHAT_SYSTEM_PROMPT = getChatSystemPrompt("ko");

// 감정 분석 프롬프트 (다국어 지원)
export function getEmotionAnalysisPrompt(
  conversation: string,
  language: "ko" | "en" = "ko"
): string {
  if (language === "en") {
    return `Analyze the cultural conflict situation from the following conversation. Include granular emotion scores.

Conversation:
${conversation}

Return JSON in this shape (only JSON):
{
  "emotions": array of applicable emotions from ["confusion", "embarrassment", "frustration", "anger", "sadness", "loneliness", "anxiety"],
  "emotion_scores": [{ "emotion": "frustration", "score": 0-100 }, { "emotion": "sadness", "score": 0-100 }], // include only applicable emotions, sorted desc by score
  "category": "school" | "workplace" | "daily" | "relationship",
  "subcategory": "specific subcategory (e.g., professor relationship, group project, boss relationship)",
  "confidence": confidence score between 0.0 and 1.0,
  "situation_summary": "situation summary (1-2 sentences)",
  "cultural_context": "explanation of Korean cultural context",
  "keywords": ["relevant", "keywords", "array"]
}

Emotion categories:
- confusion, embarrassment, frustration, anger, sadness, loneliness, anxiety

Situation categories:
- school: school life (classes, professor relations, group projects)
- workplace: workplace (boss, colleagues, company dinners)
- daily: daily life (landlord, neighbors, administrative tasks)
- relationship: interpersonal relationships (friends, romantic partners, gatherings)
Only return valid JSON.`;
  }

  return `다음 대화에서 사용자 감정과 맥락을 분석해줘. 감정별 점수를 퍼센트(0~100)로 포함해.

대화내용:
${conversation}

다음 JSON 형식만 반환:
{
  "emotions": ["confusion", "embarrassment", "frustration", "anger", "sadness", "loneliness", "anxiety"] 중 적용 감정들,
  "emotion_scores": [{ "emotion": "frustration", "score": 0-100 }, { "emotion": "sadness", "score": 0-100 }], // 적용 감정만 포함, 점수 내림차순
  "category": "school" | "workplace" | "daily" | "relationship",
  "subcategory": "교수 관계, 조별과제, 상사 관계 등 구체적 하위 카테고리",
  "confidence": 0.0 ~ 1.0 사이 점수,
  "situation_summary": "상황 요약 (1-2문장)",
  "cultural_context": "한국 문화적 배경 설명",
  "keywords": ["관련", "키워드", "배열"]
}

감정 카테고리:
- confusion: 혼란
- embarrassment: 당황/수치
- frustration: 좌절
- anger: 분노
- sadness: 슬픔
- loneliness: 외로움
- anxiety: 불안

상황 카테고리:
- school: 학교생활 (수업, 교수관계, 조별과제)
- workplace: 직장생활 (상사, 동료, 회식문화)
- daily: 일상생활 (집주인/이웃, 행정처리)
- relationship: 인간관계(친구, 연인, 모임)
JSON만 반환해줘.`;
}

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

  return `사용자가 겪은 다음 문화적 갈등 상황에 대한 솔루션을 제공해주세요.

상황: ${situation}
감정: ${emotions.join(", ")}
카테고리: ${category}

다음 형식의 JSON으로 솔루션을 제공해주세요:
{
  "culturalContext": "이 상황의 한국 문화적 배경 설명 (2-3문장)",
  "explanation": "왜 이런 일이 발생했는지 객관적으로 설명 (2-3문장)",
  "correctResponse": "다음에는 이렇게 대응하면 좋습니다 (구체적 예시)",
  "additionalTips": ["추가 팁 1", "추가 팁 2", "추가 팁 3"]
}

가이드라인:
- 한국 문화를 비판하지 말고 객관적으로 설명하세요
- 실용적이고 구체적인 조언을 제공하세요
- 따뜻하고 공감적인 톤을 유지하세요
- 사용자의 감정을 인정하세요
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

// Canned 영상 후보 중 최적 선택 프롬프트
export function getBestCannedVideoPrompt(
  conversation: string,
  candidates: { id: string; title: string }[]
): string {
  return `다음 대화 내용을 바탕으로, 아래 제공된 후보 ID 중에서 가장 비슷한 한국 문화 상황을 1개 선택해주세요.

대화:
${conversation}

후보 목록 (id: 제목):
${candidates.map((c) => `- ${c.id}: ${c.title}`).join("\n")}

반환 형식(JSON):
{
  "id": "선택한 후보 id"
}`;
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

// Build a visual simulation prompt from a free-form conversation
export function buildSimulationPromptFromConversation(
  messages: ChatMessage[]
): string {
  const history = formatConversationHistory(messages);
  return [
    "Create one illustrative scene (image only, no text on the image) that captures the Korean cultural misunderstanding in this conversation.",
    "Realistic human characters (photorealistic people), warm modern style, soft lighting, subtle gradients. Show a gentle resolution cue.",
    "Conversation transcript:",
    history,
  ].join("\n");
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
