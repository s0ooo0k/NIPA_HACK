"use client";

import { Solution } from "@/types";

interface SolutionCardProps {
  solution: Solution;
}

export default function SolutionCard({ solution }: SolutionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* 문화적 맥락 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">💡</span>
          <h3 className="text-xl font-bold text-gray-800">이 상황 이해하기</h3>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-gray-700 leading-relaxed">
            {solution.culturalContext}
          </p>
        </div>
      </div>

      {/* 설명 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">📖</span>
          <h3 className="text-lg font-bold text-gray-800">상세 설명</h3>
        </div>
        <p className="text-gray-700 leading-relaxed">{solution.explanation}</p>
      </div>

      {/* 올바른 대응 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">✅</span>
          <h3 className="text-lg font-bold text-gray-800">
            다음에 이렇게 해보세요
          </h3>
        </div>
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-gray-700 font-medium">
            {solution.correctResponse}
          </p>
        </div>
      </div>

      {/* 추가 팁 */}
      {solution.additionalTips && solution.additionalTips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">💭</span>
            <h3 className="text-lg font-bold text-gray-800">추가 팁</h3>
          </div>
          <ul className="space-y-2">
            {solution.additionalTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500 mt-1">•</span>
                <p className="text-gray-700 flex-1">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
