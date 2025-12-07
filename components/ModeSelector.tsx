"use client";

interface ModeSelectorProps {
  onSelectMode: (mode: "text" | "voice") => void;
}

export default function ModeSelector({ onSelectMode }: ModeSelectorProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🌉</div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          CultureBridge
        </h2>
        <p className="text-gray-600 text-lg">
          어떤 방식으로 대화하시겠어요?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        {/* 채팅 모드 */}
        <button
          onClick={() => onSelectMode("text")}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
              💬
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              채팅으로 대화
            </h3>
            <p className="text-gray-600 text-sm">
              텍스트로 편하게 이야기해요
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
        </button>

        {/* 음성 모드 */}
        <button
          onClick={() => onSelectMode("voice")}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl hover:scale-105"
        >
          <div className="flex flex-col items-center text-center">
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
              🎤
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              음성으로 대화
            </h3>
            <p className="text-gray-600 text-sm">
              목소리로 자연스럽게 이야기해요
            </p>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
        </button>
      </div>

      <p className="text-gray-500 text-sm mt-8 text-center max-w-md">
        언제든지 모드를 변경할 수 있어요
      </p>
    </div>
  );
}
