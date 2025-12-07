import { ChatMessage } from "@/types";

// 시스템 프롬프트 - 대화형 상황 파악
export const CHAT_SYSTEM_PROMPT = `당신은 한국에 적응 중인 외국인과 이주민을 돕는 따뜻하고 공감적인 AI 상담사입니다.

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

// 감정 분석 프롬프트
export function getEmotionAnalysisPrompt(conversation: string): string {
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

// 솔루션 생성 프롬프트
export function getSolutionPrompt(
  situation: string,
  emotions: string[],
  category: string
): string {
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
