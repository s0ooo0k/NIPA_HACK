"use client";

import { Solution } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  LightBulbIcon,
  BookOpenIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/solid";

interface SolutionCardProps {
  solution: Solution;
}

export default function SolutionCard({ solution }: SolutionCardProps) {
  const { t } = useLanguage();

  const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-primary/20 p-2 rounded-xl">{icon}</div>
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
        {children}
      </div>
    </div>
  );

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 space-y-6">
      <Section icon={<LightBulbIcon className="w-6 h-6 text-primary" />} title={t("solution.context")}>
        <div className="bg-gray-100/70 p-4 rounded-2xl">
          <p>{solution.culturalContext}</p>
        </div>
      </Section>

      <Section icon={<BookOpenIcon className="w-6 h-6 text-primary" />} title={t("solution.title")}>
        <p>{solution.explanation}</p>
      </Section>

      <Section icon={<CheckCircleIcon className="w-6 h-6 text-primary" />} title={t("solution.response")}>
        <div className="bg-primary/10 p-4 rounded-2xl">
          <p className="font-semibold text-primary-dark">
            {solution.correctResponse}
          </p>
        </div>
      </Section>

      {solution.additionalTips && solution.additionalTips.length > 0 && (
        <Section icon={<SparklesIcon className="w-6 h-6 text-primary" />} title={t("solution.tips")}>
          <ul className="space-y-3">
            {solution.additionalTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-primary/70 mt-0.5 flex-shrink-0" />
                <p className="flex-1">{tip}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
