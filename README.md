# CultureBridge - 이주민 문화적응 & 정서지원 AI

한국에 적응 중인 외국인/이주민을 위한 AI 기반 문화 갈등 해결 및 정서 지원 서비스입니다.

## 주요 기능

- **대화형 상황 파악**: 자연스러운 대화로 문화적 갈등 상황 수집
- **감정 분석**: AI 기반 감정 분석 및 카테고리 분류
- **솔루션 제시**: 문화적 맥락 설명과 구체적 대응 방법 제공
- **AI 영상 시뮬레이션**: 상황별 영상으로 올바른 대응 방법 시연 (OpenAI Sora)
- **추가 학습 제안**: 비슷한 문화 차이 상황 추천

## 기술 스택

- **Frontend**: React, Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o & GPT-4o-mini, Sora (영상)
- **Language**: TypeScript

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 API 키를 설정하세요:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

OpenAI API 키는 [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
culturebridge/
├── app/
│   ├── page.tsx                 # 메인 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── globals.css             # 전역 스타일
│   └── api/
│       ├── chat/route.ts       # 대화 처리 API
│       ├── analyze/route.ts    # 감성 분석 API
│       └── video/route.ts      # 영상 생성 API
├── components/
│   ├── ChatInterface.tsx       # 채팅 UI
│   ├── EmotionAnalysis.tsx     # 감정 분석 표시
│   ├── SolutionCard.tsx        # 솔루션 카드
│   ├── VideoSimulation.tsx     # 영상 플레이어
│   └── LearningOptions.tsx     # 추가 학습 선택지
├── lib/
│   ├── openai.ts              # OpenAI API 클라이언트
│   └── prompts.ts             # AI 프롬프트 템플릿
├── data/
│   └── scenarios.ts           # 문화 차이 시나리오
└── types/
    └── index.ts               # TypeScript 타입 정의
```

## 반응형 디자인

모바일, 태블릿, 데스크톱 모든 환경에서 최적화된 UI를 제공합니다:

- 모바일: 세로 스크롤 레이아웃
- 태블릿: 적응형 그리드
- 데스크톱: 2단 레이아웃 (채팅 + 분석 결과)

## 배포

### Vercel 배포

```bash
npm install -g vercel
vercel
```

### 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

- `OPENAI_API_KEY`

## 라이센스

MIT

## NIPA HACKATHON

이 프로젝트는 NIPA 해커톤을 위해 개발되었습니다.
