"use client";

import { useState } from "react";
import { getRandomFortune, type Fortune } from "@/lib/fortunes";

export default function FortuneCard() {
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [flipped, setFlipped] = useState(false);

  const handleClick = () => {
    if (flipped) {
      setFlipped(false);
      return;
    }
    setFortune(getRandomFortune());
    setFlipped(true);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="[perspective:1200px]">
        <div
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") handleClick();
          }}
          className={`relative h-80 w-56 cursor-pointer select-none transition-transform duration-700 [transform-style:preserve-3d] sm:h-96 sm:w-64 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-center shadow-xl [backface-visibility:hidden]">
            <span className="text-6xl">🔮</span>
            <p className="text-lg font-semibold text-white">오늘의 운세</p>
            <p className="text-sm text-purple-100">카드를 눌러 확인하세요</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 p-6 text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            {fortune && (
              <>
                <span className="text-4xl">✨</span>
                <p className="text-base font-medium leading-relaxed text-white">
                  {fortune.message}
                </p>
                <div className="mt-2 flex flex-col gap-1 text-sm text-white/90">
                  <p>🎁 행운의 아이템: {fortune.luckyItem}</p>
                  <p>🎨 행운의 색: {fortune.luckyColor}</p>
                  <p>🔢 행운의 숫자: {fortune.luckyNumber}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {flipped && fortune && (
        <div className="w-72 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur sm:w-80">
          <h2 className="mb-4 text-center text-lg font-semibold text-white">
            오늘의 운세 지수
          </h2>
          <div className="flex flex-col gap-3">
            {fortune.scores.map((score) => (
              <div key={score.label}>
                <div className="mb-1 flex justify-between text-sm text-slate-200">
                  <span>{score.label}</span>
                  <span className="font-medium">{score.value}%</span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-700"
                    style={{ width: `${score.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-white">
            <span className="text-xl">💞</span>
            <span className="text-sm text-slate-200">궁합이 좋은 띠</span>
            <span className="font-semibold">{fortune.compatibleZodiac}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        className="rounded-full bg-indigo-600 px-8 py-3 font-medium text-white shadow-md transition hover:bg-indigo-700 active:scale-95"
      >
        {flipped ? "다시 뽑기" : "오늘의 운세 보기"}
      </button>
    </div>
  );
}
