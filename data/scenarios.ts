import { Scenario } from "@/types";

export const scenarios = {
  greetings: [
    {
      id: "bap-meogeosseo",
      korean: "밥 먹었어?",
      literal: "Did you eat?",
      actual: "How are you? / Hello",
      context: "한국에서 안부 인사로 자주 사용됩니다. 실제로 식사 여부를 묻는 것이 아니라 '잘 지내?'라는 의미의 가벼운 인사입니다.",
      correctResponse: "네~ 먹었어요! OO님은요?",
      videoPrompt: `한국 대학교 복도에서 중년 남성 교수님이 외국인 학생에게 '밥 먹었어?'라고 친근하게 인사하는 장면. 학생이 자연스럽게 '네, 먹었어요! 교수님은요?'라고 미소 지으며 대답한다. 배경: 밝은 대학교 복도, 자연광. 오디오: 자연스러운 한국어 대화, 복도 ambient 소리`,
    },
    {
      id: "daeume-boja",
      korean: "다음에 보자",
      literal: "Let's meet next time",
      actual: "Goodbye (not a real promise)",
      context: "헤어질 때 하는 인사로, 구체적인 약속이 아닙니다. 서양의 'See you later'와 비슷한 표현입니다.",
      realPromise: "이번 주 토요일 어때? / 언제 시간 돼?",
      videoPrompt: `카페에서 친구들이 헤어지며 '다음에 보자~' 하고 손 흔드는 장면. 자연스럽고 가벼운 분위기. 배경: 카페 출입구, 낮 시간. 오디오: 가벼운 배경음악, 자연스러운 한국어 대화`,
    },
    {
      id: "eodi-ga",
      korean: "어디 가?",
      literal: "Where are you going?",
      actual: "Hello / Just checking in",
      context: "길에서 마주쳤을 때 하는 가벼운 인사입니다. 구체적인 목적지를 정말로 궁금해하는 것이 아닙니다.",
      correctResponse: "아 그냥 잠깐요~ / 밥 먹으러요~",
      videoPrompt: `아파트 엘리베이터에서 이웃이 '어디 가?' 하고 가볍게 묻는 장면. 상대방이 '아 그냥 잠깐요~' 하고 미소로 답한다. 배경: 아파트 엘리베이터. 오디오: 엘리베이터 배경음, 자연스러운 한국어 대화`,
    },
    {
      id: "gwenchanayo",
      korean: "괜찮아요",
      literal: "It's okay / I'm fine",
      actual: "Might not be okay (context-dependent)",
      context: "맥락에 따라 진짜 괜찮다는 의미일 수도, 거절의 의미일 수도 있습니다. 표정과 톤을 함께 봐야 합니다.",
      videoPrompt: `식당에서 친구가 '더 먹을래?' 하고 물을 때 손을 저으며 '괜찮아요~'(거절). 다른 장면: 넘어진 사람에게 '괜찮아요?'라고 물을 때 '네 괜찮아요'(진짜 괜찮음). 배경: 식당, 거리. 오디오: 자연스러운 한국어 대화`,
    },
    {
      id: "oneul-jom-bappeune",
      korean: "오늘 좀 바쁘네...",
      literal: "I'm a bit busy today...",
      actual: "간접적으로 도움을 기대하거나 야근을 암시",
      context:
        "한국 직장에서 상사가 '오늘 좀 바쁘네…'라고 말하면 직접적으로 요청하지 않아도 주변에서 눈치껏 남아 도와주길 기대하는 경우가 많습니다. 외국인 직원은 단순한 상태 표현으로 받아들여 퇴근하려다가 어색해질 수 있습니다.",
      signs: [
        "퇴근 시간 무렵에 바쁨을 강조",
        "서류나 업무를 보며 한숨",
        "주변 동료들이 조용히 자리 지키는 분위기",
      ],
      videoPrompt: `Korean office at 6 PM. A Korean manager sighs and says "오늘 좀 바쁘네..." while looking at documents. A foreign employee nearby starts packing their bag to leave, not understanding the implied request for help. Korean coworkers exchange knowing glances. 8 seconds, realistic, warm office lighting.`,
    },
  ] as Scenario[],

  workplace: [
    {
      id: "geomto-halgeyo",
      korean: "검토해볼게요",
      literal: "I'll review it",
      actual: "Probably no / Soft rejection",
      context: "직장에서 완곡하게 거절할 때 사용하는 표현입니다. 실제로 검토할 의향이 없거나 부정적인 경우가 많습니다.",
      signs: ["구체적 피드백 없음", "후속 연락 없음", "일정 제시 없음"],
      videoPrompt: `회의실에서 상사가 직원의 제안서를 보며 '음... 검토해볼게요'라고 애매하게 답하는 장면. 표정은 무표정하거나 약간 난처한 듯. 배경: 회의실. 오디오: 서류 넘기는 소리, 어색한 침묵, 한국어 대화`,
    },
    {
      id: "hoesik-sul",
      korean: "한 잔만 해요",
      literal: "Just one drink",
      actual: "Social pressure to drink",
      context: "회식에서 술을 권유할 때 사용하는 표현입니다. '한 잔'이라고 하지만 실제로는 여러 잔을 권하는 경우가 많습니다.",
      politeRefusal: [
        "건강/약 때문에 못 마셔요",
        "오늘 운전해야 해서요",
        "술을 잘 못해서요",
      ],
      videoPrompt: `회식 자리에서 선배가 후배에게 술잔을 들며 '한 잔만 해~' 권하는 장면. 후배가 정중하게 '죄송한데 오늘 운전해야 해서요'라고 거절. 선배가 이해하며 고개를 끄덕인다. 배경: 한식당 회식 자리. 오디오: 회식 분위기, 한국어 대화`,
    },
    {
      id: "soojung-many",
      korean: "수고하세요",
      literal: "Work hard / Good job",
      actual: "Goodbye / Well done",
      context: "퇴근하거나 헤어질 때, 또는 일을 마쳤을 때 하는 인사입니다.",
      correctResponse: "네, 수고하셨어요!",
      videoPrompt: `사무실에서 먼저 퇴근하는 직원에게 '수고하세요~' 하고 인사하는 장면. 배경: 사무실. 오디오: 키보드 소리, 한국어 인사`,
    },
  ] as Scenario[],

  school: [
    {
      id: "jobyul-gwaje",
      korean: "조별과제 역할 분담",
      context: "한국 대학의 조별과제는 팀워크가 매우 중요합니다. 역할을 명확히 나누고 카카오톡 단톡방에서 소통하는 것이 일반적입니다.",
      tips: [
        "첫 모임에서 역할을 명확히 분담하세요",
        "카카오톡 단톡방을 만들어 소통하세요",
        "무임승차(free-riding)를 주의하세요",
        "마감 전날 급하게 하지 말고 미리미리 준비하세요",
      ],
      videoPrompt: `대학 도서관에서 학생들이 조별과제 회의를 하며 역할을 나누는 장면. '저는 PPT 만들게요', '저는 자료 조사할게요' 등 역할 분담. 배경: 도서관 스터디룸. 오디오: 토론 소리, 한국어 대화`,
    },
    {
      id: "seonbae-hubae",
      korean: "선배/후배 문화",
      context: "한국 대학에서는 학번(입학 연도)에 따라 선배/후배 관계가 형성됩니다. 존댓말 사용과 예의가 중요합니다.",
      tips: [
        "선배에게는 존댓말을 사용하세요",
        "동기(같은 학번)끼리는 편하게 지낼 수 있어요",
        "MT(membership training)나 학과 행사에 참여하면 친해지기 좋아요",
      ],
      videoPrompt: `대학 동아리방에서 신입생이 선배에게 '선배님, 이거 어떻게 하는 건가요?'라고 존댓말로 묻는 장면. 선배가 친절하게 설명해준다. 배경: 동아리방. 오디오: 한국어 대화`,
    },
  ] as Scenario[],

  daily: [
    {
      id: "age-question",
      korean: "나이 물어보기",
      literal: "How old are you?",
      actual: "To determine speech level",
      context: "한국에서는 나이를 물어보는 것이 실례가 아닙니다. 존댓말을 쓸지 반말을 쓸지 결정하기 위해 묻는 경우가 많습니다.",
      correctResponse: "OO살이에요 / OO년생이에요",
      videoPrompt: `처음 만난 사람들이 친해지려고 '나이가 어떻게 되세요?'라고 묻는 장면. 상대방이 자연스럽게 답하고 '아 그럼 저보다 한 살 위시네요!' 하며 반응. 배경: 카페. 오디오: 카페 배경음, 한국어 대화`,
    },
    {
      id: "jikjang-yeobuin",
      korean: "직장인/주부 구분",
      context: "한국에서는 '직장 다녀요?'라는 질문을 자주 합니다. 대화의 소재를 찾기 위한 질문입니다.",
      videoPrompt: `동네 마트에서 이웃을 만나 '요즘 뭐 하세요? 직장 다니세요?'라고 묻는 장면. 배경: 마트. 오디오: 마트 배경음, 한국어 대화`,
    },
    {
      id: "mani-deuseyo",
      korean: "많이 드세요~",
      literal: "Eat a lot",
      actual: "환대의 표현으로 음식을 계속 덜어줌",
      context:
        "가정식이나 식사 자리에서 호스트가 손님 접시에 계속 음식을 덜어주며 '많이 드세요~'라고 말하는 것은 친절과 환대 표현입니다. 손님은 배부르더라도 웃으며 감사 인사와 함께 예의 있게 양을 조절하는 표현을 사용하는 것이 자연스럽습니다.",
      correctResponse:
        "감사 인사 후 '정말 맛있어요! 조금만 더 먹을게요'처럼 부드럽게 양 조절 의사를 표현",
      tips: [
        "웃으며 감사 인사 먼저 하기",
        "'조금만 주세요'처럼 완곡한 표현 사용",
        "식사 중간에 칭찬하며 속도 조절",
      ],
      videoPrompt: `A Korean home dining table, family dinner setting. A Korean mother keeps putting food on a foreign guest's plate, repeatedly saying "많이 드세요~" (Eat a lot) with a warm smile. The guest's plate is already overflowing. The guest looks overwhelmed but tries to smile politely. 8 seconds, warm home lighting.`,
    },
  ] as Scenario[],
};

// 모든 시나리오를 하나의 배열로
export const allScenarios: Scenario[] = [
  ...scenarios.greetings,
  ...scenarios.workplace,
  ...scenarios.school,
  ...scenarios.daily,
];

// 시나리오 검색 함수
export function findScenarioById(id: string): Scenario | undefined {
  return allScenarios.find((scenario) => scenario.id === id);
}

// 카테고리별 시나리오 가져오기
export function getScenariosByKeywords(keywords: string[]): Scenario[] {
  return allScenarios.filter((scenario) =>
    keywords.some(
      (keyword) =>
        scenario.korean.includes(keyword) ||
        scenario.context.includes(keyword) ||
        (scenario.literal && scenario.literal.includes(keyword))
    )
  );
}
