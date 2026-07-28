"use client";

import { useEffect, useState } from "react";
import { drawTarot, type TarotCard } from "@/lib/tarot";

const KEY = "bstoday.tarot";

function msToMidnight(): number {
  const now = new Date();
  const mid = new Date(now);
  mid.setHours(24, 0, 0, 0);
  return mid.getTime() - now.getTime();
}
function fmtCountdown(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const EXTS = ["webp", "png", "jpg", "jpeg"];

export default function TarotDraw({
  dateKey,
  profileKey,
}: {
  dateKey: string;
  profileKey: string;
}) {
  // 프로필(이름+생년월일)별로 하루 한 장 — 같은 브라우저라도 사람이 다르면 각자 뽑기
  const storeKey = `${KEY}:${profileKey}`;
  const [card, setCard] = useState<TarotCard | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [lockedToday, setLockedToday] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [extIdx, setExtIdx] = useState(0); // 이미지 확장자 시도
  const [imgFailed, setImgFailed] = useState(false); // 이미지 없으면 이모지로 대체

  // 오늘 이미 뽑았다면 그 카드를 복원 (하루 한 장)
  useEffect(() => {
    setCard(null);
    setFlipped(false);
    setLockedToday(false);
    try {
      const raw = localStorage.getItem(storeKey);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.date === dateKey && saved.card) {
        setCard(saved.card);
        setFlipped(true);
        setLockedToday(true);
        setExtIdx(0);
        setImgFailed(false);
      }
    } catch {
      /* ignore */
    }
  }, [dateKey, storeKey]);

  // 자정까지 남은 시간(다음 카드까지)
  useEffect(() => {
    if (!lockedToday) return;
    const tick = () => setCountdown(fmtCountdown(msToMidnight()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [lockedToday]);

  const draw = () => {
    if (lockedToday) return; // 하루 한 번만
    const c = drawTarot();
    setCard(c);
    setFlipped(true);
    setLockedToday(true);
    setExtIdx(0);
    setImgFailed(false);
    try {
      localStorage.setItem(storeKey, JSON.stringify({ date: dateKey, card: c }));
    } catch {
      /* ignore */
    }
  };

  // 현재 카드 이미지를 파일로 저장
  const saveImage = async () => {
    if (!card) return;
    try {
      const res = await fetch(`${card.imgBase}.${EXTS[extIdx]}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tarot-${card.name}.${EXTS[extIdx]}`;
      a.click();
      URL.revokeObjectURL(url);
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
            className={`relative w-[84vw] max-w-[22rem] select-none transition-transform duration-[600ms] [aspect-ratio:2/3] [transform-style:preserve-3d] sm:w-80 ${
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

            {/* 앞면 — 이미지가 있으면 이미지, 없으면 이모지 대체 */}
            <div className="absolute inset-0 overflow-hidden rounded-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {card && !imgFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${card.imgBase}.${EXTS[extIdx]}`}
                  alt={`${card.name} 타로 카드`}
                  onError={() =>
                    extIdx < EXTS.length - 1
                      ? setExtIdx(extIdx + 1)
                      : setImgFailed(true)
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="tarot-frame h-full w-full rounded-xl p-3">
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
              )}
            </div>
          </div>
        </button>
      </div>

      {flipped && card && (
        <p className="font-gowun max-w-xs text-center text-sm leading-relaxed text-indigo-50/85">
          {card.message}
        </p>
      )}

      {flipped && card && !imgFailed && (
        <button
          type="button"
          onClick={saveImage}
          className="font-serif rounded-md border border-gold/40 bg-gold/5 px-5 py-2 text-sm tracking-[0.1em] text-gold/90 transition hover:bg-gold/15 active:scale-95"
        >
          카드 이미지 저장
        </button>
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
        <div className="text-center">
          <p className="font-gowun text-[11px] text-indigo-100/45">
            오늘의 카드는 뽑았어요 · 내일 다시 만나요
          </p>
          {countdown && (
            <p className="font-serif mt-1 text-[11px] tracking-[0.15em] text-gold/60">
              다음 카드까지 {countdown}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
