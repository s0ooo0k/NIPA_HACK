// 감정 타입
export type Emotion =
  | "confusion" // 혼란
  | "embarrassment" // 당혹/수치
  | "frustration" // 좌절
  | "anger" // 분노
  | "sadness" // 슬픔
  | "loneliness" // 외로움
  | "anxiety"; // 불안

// 상황 카테고리
export type Category =
  | "school" // 학교생활
  | "workplace" // 직장생활
  | "daily" // 일상생활
  | "relationship"; // 대인관계

// 시나리오 타입
export interface Scenario {
  id: string;
  korean: string;
  literal?: string;
  actual?: string;
  context: string;
  correctResponse?: string;
  realPromise?: string;
  signs?: string[];
  politeRefusal?: string[];
  tips?: string[];
  videoPrompt: string;
}

// 채팅 메시지 타입
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// 감정 분석 결과
export interface EmotionAnalysis {
  emotions: Emotion[];
  category: Category;
  subcategory?: string;
  confidence: number;
}

// 솔루션 타입
export interface Solution {
  culturalContext: string;
  explanation: string;
  correctResponse: string;
  additionalTips?: string[];
}

// 대화 세션 타입
export interface ConversationSession {
  id: string;
  messages: ChatMessage[];
  analysis?: EmotionAnalysis;
  solution?: Solution;
  relatedScenarios?: Scenario[];
  createdAt: Date;
  updatedAt: Date;
}

// 영상 생성 상태
export type VideoGenerationStatus = "pending" | "generating" | "completed" | "failed";

// 영상 타입
export interface GeneratedVideo {
  id: string;
  scenarioId: string;
  url?: string;
  status: VideoGenerationStatus;
  prompt: string;
  createdAt: Date;
}

// API 응답 타입
export interface ChatResponse {
  message: string;
  needsMoreInfo: boolean;
  analysis?: EmotionAnalysis;
  solution?: Solution;
}

export interface AnalyzeResponse {
  analysis: EmotionAnalysis;
  solution: Solution;
  relatedScenarios: Scenario[];
}

export interface VideoResponse {
  videoId: string;
  status: VideoGenerationStatus;
  url?: string;
}
