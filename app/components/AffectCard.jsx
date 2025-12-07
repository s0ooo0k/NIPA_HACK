// app/components/AffectCard.jsx

export default function AffectCard({ data }) {
  if (!data) return null;

  const {
    emotion_label,
    affect_state,
    stress_level,
    social_adaptation,
    summary,
  } = data;

  const stressPercent = Math.round((stress_level ?? 0) * 100);
  const adaptPercent = Math.round((social_adaptation ?? 0) * 100);

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">정서 상태 분석 결과</h2>
        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          주요 정서: {emotion_label || "알 수 없음"}
        </span>
      </div>

      <p className="text-sm text-gray-700 mb-4">{summary}</p>

      <div className="space-y-3 text-sm">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-medium">스트레스 수준</span>
            <span>{stressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-red-400"
              style={{ width: `${stressPercent}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="font-medium">사회적/환경적 적응도</span>
            <span>{adaptPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-400"
              style={{ width: `${adaptPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          전체 정서 상태: <span className="font-semibold">{affect_state}</span>
        </div>
      </div>
    </div>
  );
}
