"use client";

import { useEffect, useState } from "react";
import { drawTarot, type TarotCard } from "@/lib/tarot";

const KEY = "bstoday.tarot";

export default function TarotDraw({ dateKey }: { dateKey: string }) {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [lockedToday, setLockedToday] = useState(false);

  // 오늘 이미 뽑았다면 그 카드를 복원 (하루 한 장)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.date === dateKey && saved.card) {
        setCard(saved.card);
        setFlipped(true);
        setLockedToday(true);
      }
    } catch {
      /* ignore */
    }
  }, [dateKey]);

  const draw = () => {
    if (lockedToday) return; // 하루 한 번만
    const c = drawTarot();
    setCard(c);
    setFlipped(true);
    setLockedToday(true);
    try {
      localStorage.setItem(KEY, JSON.stringify({ date: dateKey, card: c }));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-serif text-xs tracking-[0.35em] text-gold/60">
        ☾ ONE CARD ☽
      </p>
      <p className="font-gowun -mt-2 text-center text-xs text-indigo-100/50">
        하루 한 장, 오늘을 비추는 타로 — 예언이 아니라 오늘을 돌아보는 질문입니다.
      </p>

      <div className="[perspective:1200px]">
        <button
          type="button"
          onClick={draw}
          disabled={lockedToday}
          aria-label={
            flipped && card
              ? `오늘의 타로 카드 ${card.name}`
              : "타로 카드 한 장 뽑기"
          }
          className={`block ${lockedToday ? "cursor-default" : "cursor-pointer"}`}
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

      {!flipped ? (
        <button
          type="button"
          onClick={draw}
          className="font-serif rounded-md border border-gold/40 bg-gold/5 px-6 py-2.5 text-sm tracking-[0.1em] text-gold/90 transition hover:bg-gold/15 active:scale-95"
        >
          🃏 타로카드로 오늘의 운세
        </button>
      ) : (
        <p className="font-gowun text-center text-[11px] text-indigo-100/45">
          오늘의 카드는 뽑았어요 · 내일 다시 만나요
        </p>
      )}
    </div>
  );
}
