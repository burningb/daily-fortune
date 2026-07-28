"use client";

import { useState } from "react";
import { drawTarot, type TarotCard } from "@/lib/tarot";

export default function TarotDraw() {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [flipped, setFlipped] = useState(false);

  const draw = () => {
    if (flipped) {
      // 다시 뽑기: 잠깐 뒤집었다가 새 카드로
      setFlipped(false);
      window.setTimeout(() => {
        setCard(drawTarot());
        setFlipped(true);
      }, 350);
    } else {
      setCard(drawTarot());
      setFlipped(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-serif text-xs tracking-[0.35em] text-gold/60">
        ☾ ONE CARD ☽
      </p>
      <p className="font-gowun -mt-2 text-center text-xs text-indigo-100/50">
        가볍게 한 장 뽑아보는 오늘의 타로 — 예언이 아니라 오늘을 비추는 질문입니다.
      </p>

      <div className="[perspective:1200px]">
        <button
          type="button"
          onClick={draw}
          aria-label={
            flipped && card
              ? `타로 카드 ${card.name}. 다시 뽑으려면 누르세요.`
              : "타로 카드 한 장 뽑기"
          }
          className="block cursor-pointer"
        >
          <div
            className={`relative h-64 w-40 select-none transition-transform duration-[600ms] [transform-style:preserve-3d] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* 뒷면 */}
            <div className="tarot-frame absolute inset-0 rounded-xl p-3 [backface-visibility:hidden]">
              <div className="tarot-inline flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg">
                <span className="text-4xl text-gold">🃏</span>
                <span className="font-serif text-[10px] tracking-[0.3em] text-gold/60">
                  TAROT
                </span>
              </div>
            </div>

            {/* 앞면 */}
            <div className="tarot-frame absolute inset-0 rounded-xl p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div className="tarot-inline flex h-full w-full flex-col items-center justify-between rounded-lg py-4">
                {card && (
                  <>
                    <span className="font-serif text-xs tracking-[0.3em] text-gold/80">
                      {card.roman}
                    </span>
                    <span className="text-4xl">{card.emoji}</span>
                    <div className="flex flex-col items-center gap-1 px-2 text-center">
                      <span className="font-gowun text-base text-gold">{card.name}</span>
                      <span className="font-gowun text-[11px] text-indigo-100/60">
                        {card.keyword}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </button>
      </div>

      {flipped && card && (
        <p className="font-gowun max-w-xs text-center text-sm leading-relaxed text-indigo-50/85">
          {card.message}
        </p>
      )}

      <button
        type="button"
        onClick={draw}
        className="font-serif rounded-md border border-gold/40 bg-gold/5 px-6 py-2.5 text-sm tracking-[0.1em] text-gold/90 transition hover:bg-gold/15 active:scale-95"
      >
        {flipped ? "다시 뽑기" : "🃏 타로카드로 오늘의 운세"}
      </button>
    </div>
  );
}
