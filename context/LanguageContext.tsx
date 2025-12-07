"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from "react";

export type Language = "ko" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  ko: {
    // Header
    "app.title": "CultureBridge",
    "app.subtitle": "한국 문화 적응 도우미",
    
    // Mode Selection
    "mode.question": "어떤 방식으로 대화하시겠어요?",
    "mode.text": "채팅으로 대화",
    "mode.text.desc": "텍스트로 타이핑하세요",
    "mode.voice": "음성으로 대화",
    "mode.voice.desc": "목소리로 자연스럽게 이야기하세요",
    "mode.footer": "언제든지 모드를 변경할 수 있어요",
    
    // Chat Interface
    "chat.placeholder": "메시지를 입력하세요...",
    "chat.send": "전송",
    "chat.analyzing": "분석 중...",
    "chat.newChat": "새로운 대화",
    
    // Voice Recorder
    "voice.start": "녹음 시작",
    "voice.stop": "녹음 중지",
    "voice.recording": "녹음 중...",
    "voice.processing": "처리 중...",
    
    // Emotion Analysis
    "analysis.title": "감정 분석",
    "analysis.category": "상황 카테고리",
    "analysis.emotions": "감지된 감정",
    "analysis.confidence": "신뢰도",
    
    // Categories
    "category.school": "학교생활",
    "category.workplace": "직장생활",
    "category.daily": "일상생활",
    "category.relationship": "대인관계",
    
    // Emotions
    "emotion.confusion": "혼란",
    "emotion.embarrassment": "당혹",
    "emotion.frustration": "좌절",
    "emotion.anger": "분노",
    "emotion.sadness": "슬픔",
    "emotion.loneliness": "외로움",
    "emotion.anxiety": "불안",
    
    // Solution Card
    "solution.title": "상세 설명",
    "solution.context": "이 상황 이해하기",
    "solution.response": "다음에 이렇게 해보세요",
    "solution.tips": "추가 팁",
    "solution.warnings": "주의사항",
    "solution.phrases": "유용한 표현",
    
    // Video Simulation
    "video.title": "상황별 영상 시뮬레이션",
    "video.loading": "영상 생성 중...",
    "video.generate": "영상 생성하기",
    "video.unavailable": "영상을 사용할 수 없습니다",
    
    // Learning Options
    "learning.title": "비슷한 상황 더 알아보기",
    "learning.learn": "학습하기",
    "learning.noOptions": "추천 학습 내용이 없습니다",
    
    // Buttons
    "button.back": "뒤로가기",
    "button.continue": "계속하기",
    "button.close": "닫기",
    "button.retry": "다시 시도",
  },
  en: {
    // Header
    "app.title": "CultureBridge",
    "app.subtitle": "Korean Culture Adaptation Assistant",
    
    // Mode Selection
    "mode.question": "How would you like to communicate?",
    "mode.text": "Chat with Text",
    "mode.text.desc": "Type your message",
    "mode.voice": "Chat with Voice",
    "mode.voice.desc": "Speak naturally with your voice",
    "mode.footer": "You can change the mode anytime",
    
    // Chat Interface
    "chat.placeholder": "Type your message...",
    "chat.send": "Send",
    "chat.analyzing": "Analyzing...",
    "chat.newChat": "New Chat",
    
    // Voice Recorder
    "voice.start": "Start Recording",
    "voice.stop": "Stop Recording",
    "voice.recording": "Recording...",
    "voice.processing": "Processing...",
    
    // Emotion Analysis
    "analysis.title": "Emotion Analysis",
    "analysis.category": "Situation Category",
    "analysis.emotions": "Detected Emotions",
    "analysis.confidence": "Confidence",
    
    // Categories
    "category.school": "School Life",
    "category.workplace": "Workplace",
    "category.daily": "Daily Life",
    "category.relationship": "Relationships",
    
    // Emotions
    "emotion.confusion": "Confusion",
    "emotion.embarrassment": "Embarrassment",
    "emotion.frustration": "Frustration",
    "emotion.anger": "Anger",
    "emotion.sadness": "Sadness",
    "emotion.loneliness": "Loneliness",
    "emotion.anxiety": "Anxiety",
    
    // Solution Card
    "solution.title": "Detailed Explanation",
    "solution.context": "Understanding This Situation",
    "solution.response": "Try This Next Time",
    "solution.tips": "Additional Tips",
    "solution.warnings": "Warnings",
    "solution.phrases": "Useful Phrases",
    
    // Video Simulation
    "video.title": "Situation Video Simulation",
    "video.loading": "Generating video...",
    "video.generate": "Generate Video",
    "video.unavailable": "Video unavailable",
    
    // Learning Options
    "learning.title": "Learn More Similar Situations",
    "learning.learn": "Learn",
    "learning.noOptions": "No learning options available",
    
    // Buttons
    "button.back": "Back",
    "button.continue": "Continue",
    "button.close": "Close",
    "button.retry": "Retry",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ko");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "ko" || savedLang === "en")) {
      setLang(savedLang);
    }
  }, []);

  // Save language to localStorage when it changes
  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
