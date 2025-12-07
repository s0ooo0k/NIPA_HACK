"use client";

import { Scenario } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { AcademicCapIcon } from "@heroicons/react/24/solid";

interface LearningOptionsProps {
  scenarios: Scenario[];
  onSelectScenario: (scenarioId: string) => void;
}

export default function LearningOptions({ scenarios, onSelectScenario }: LearningOptionsProps) {
  const { t, lang } = useLanguage();

  if (scenarios.length === 0) return null;

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/20 p-2 rounded-xl">
          <AcademicCapIcon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800">{t("learning.title")}</h3>
      </div>

      <p className="text-gray-600 mb-5 text-sm">
        {lang === "ko" ? "비슷한 상황들을 선택하여 학습해 보세요." : "Select similar situations to learn more."}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario, index) => (
          <button
            key={scenario.id}
            onClick={() => onSelectScenario(scenario.id)}
            className="group p-4 bg-white rounded-2xl text-left transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-transparent hover:border-primary"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-base">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 mb-1 text-sm group-hover:text-primary transition-colors">
                  {scenario.korean}
                </p>
                <p className="text-xs text-gray-500">
                  {scenario.literal || scenario.context}
                </p>
                {scenario.actual && (
                  <p className="mt-1 text-xs text-purple-600 font-medium">
                    <span className="font-semibold">{lang === "ko" ? "→ 실제 의미: " : "→ Actual: "}</span>
                    {scenario.actual}
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
