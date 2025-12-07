"use client";

import { Scenario } from "@/types";

interface LearningOptionsProps {
  scenarios: Scenario[];
  onSelectScenario: (scenarioId: string) => void;
}

export default function LearningOptions({
  scenarios,
  onSelectScenario,
}: LearningOptionsProps) {
  if (scenarios.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🎓</span>
        <h3 className="text-xl font-bold text-gray-800">
          비슷한 상황 더 알아보기
        </h3>
      </div>

      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        비슷하게 헷갈릴 수 있는 표현들도 영상으로 볼까요?
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-lg text-left transition-all duration-200 border-2 border-transparent hover:border-blue-300 group"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {scenario.korean}
                </p>
                <p className="text-xs text-gray-600 mb-2">
                  {scenario.literal || scenario.context}
                </p>
                {scenario.actual && (
                  <p className="text-xs text-purple-600 font-medium">
                    실제 의미: {scenario.actual}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
