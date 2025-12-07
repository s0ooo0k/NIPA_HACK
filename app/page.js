"use client";

import { useState } from "react";
import AffectCard from "./components/AffectCard";

const mockStudents = [
  {
    id: 1,
    name: "Aisha",
    country: "Pakistan",
    language: "Urdu / English",
    note: "입학 1년차, 수업 적응 중",
    affect: {
      emotion_label: "tired",
      affect_state: "정신적 피로 · 과부하 상태",
      stress_level: 0.78,
      social_adaptation: 0.62,
      summary:
        "새로운 환경에 적응하려 노력하지만, 학업과 언어 부담으로 피로가 누적된 상태로 보입니다.",
    },
  },
  {
    id: 2,
    name: "Nguyen",
    country: "Vietnam",
    language: "Vietnamese / Korean(중급)",
    note: "동아리 활동 활발, 친구 관계 양호",
    affect: {
      emotion_label: "calm",
      affect_state: "대체로 안정적인 상태",
      stress_level: 0.32,
      social_adaptation: 0.78,
      summary:
        "일상 스트레스는 있지만 전반적으로 관계와 생활에 잘 적응하고 있는 상태입니다.",
    },
  },
  {
    id: 3,
    name: "Yuki",
    country: "Japan",
    language: "Japanese / Korean(초급)",
    note: "발언 적음, 수업 참여 눈에 띄게 감소",
    affect: {
      emotion_label: "anxious",
      affect_state: "불안 · 위축 상태",
      stress_level: 0.71,
      social_adaptation: 0.4,
      summary:
        "언어 장벽과 대인관계에 대한 불안으로 위축된 모습을 보이며, 지원적 개입이 도움이 될 수 있습니다.",
    },
  },
];

export default function Home() {
  const [text, setText] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);
  const [result, setResult] = useState(mockStudents[0].affect);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("분석할 내용을 입력해 주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/affect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          studentId: selectedStudent.id, // 필요하면 나중에 서버에서 활용
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("API 오류:", errData);
        alert("정서 분석 중 오류가 발생했습니다.");
        return;
      }

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("요청 실패:", error);
      alert("서버와 통신 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="min-h-screen bg-gray-50 flex justify-center text-black">
      <div className="w-full max-w-5xl px-4 py-8 flex gap-4">
        
        {/* 왼쪽: 학생 리스트 */}
        <aside className="w-1/3 max-w-xs rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold mb-3">학생 목록 (더미)</h2>
          <p className="text-xs text-black mb-3">
            실제로는 DB나 설문/상담 기록에서 불러올 데이터를 가정하고,
            현재는 UI 구조만 잡는 단계입니다.
          </p>

          <div className="space-y-2">
            {mockStudents.map((stu) => {
              const isActive = stu.id === selectedStudent.id;
              return (
                <button
                  key={stu.id}
                  onClick={() => {
                    setSelectedStudent(stu);
                    setResult(stu.affect);
                    setText("");
                  }}
                  className={`w-full text-left rounded-lg border px-3 py-2 text-sm ${
                    isActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{stu.name}</span>
                    <span className="text-[11px] text-black">
                      {stu.country}
                    </span>
                  </div>
                  <div className="text-[11px] text-black">
                    언어: {stu.language}
                  </div>
                  <div className="text-[11px] text-black truncate">
                    메모: {stu.note}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* 오른쪽 */}
        <section className="flex-1">
          <h1 className="text-2xl font-bold mb-2 text-black">
            정서 상태 분석 (UI 더미 버전)
          </h1>
          <p className="text-sm text-black mb-4">
            왼쪽에서 학생을 선택하면, 해당 학생의 정서·적응 상태 예시가 카드로 표시됩니다.
            지금은 더미 데이터이며, 나중에 실제 AI 분석 결과와 연결할 예정입니다.
          </p>

          {/* 선택된 학생 박스 */}
          <div className="mb-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-xs text-black mb-3">선택된 학생</div>
                <div className="text-lg font-semibold">
                  {selectedStudent.name}
                </div>
              </div>
              <div className="text-right text-xs text-black">
                <div>{selectedStudent.country}</div>
                <div>{selectedStudent.language}</div>
              </div>
            </div>
            <div className="text-xs text-black">
              메모: {selectedStudent.note}
            </div>
          </div>

          {/* 텍스트 입력 */}
          <label className="block text-sm font-medium mb-1 text-black">
            최근 발화 / 서술 내용 (예시)
          </label>
          <textarea
            className="w-full h-28 rounded-md border border-gray-300 px-3 py-2 text-sm bg-white 
            focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-black"
            placeholder="학생이 한 말, 상담/면담 기록 일부 등을 붙여넣는 영역이라고 가정합니다."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="mt-3 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? "분석 중..." : "정서 분석하기 (더미)"}
            </button>
          </div>

          <AffectCard data={result} />
        </section>
      </div>
    </main>
  );
}
