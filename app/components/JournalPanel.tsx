"use client";

import { useEffect, useState } from "react";

const MOODS = [
  "안정됨",
  "활발함",
  "예민함",
  "막막함",
  "집중됨",
  "연결됨",
  "지침",
  "설명하기 어려움",
];

const KEY = "bstoday.journal";

type Entry = { moods: string[]; reflection: string };

function loadAll(): Record<string, Entry> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

export default function JournalPanel({
  dateKey,
  yesterdayKey,
  question,
}: {
  dateKey: string;
  yesterdayKey?: string;
  question: string;
}) {
  const [moods, setMoods] = useState<string[]>([]);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [yesterdayMoods, setYesterdayMoods] = useState<string[]>([]);
  const [todayCard, setTodayCard] = useState<string | null>(null);

  useEffect(() => {
    const all = loadAll();
    const e = all[dateKey];
    if (e) {
      setMoods(e.moods ?? []);
      setReflection(e.reflection ?? "");
      setSaved(true);
    }
    if (yesterdayKey && all[yesterdayKey]) {
      setYesterdayMoods(all[yesterdayKey].moods ?? []);
    }
    // 오늘 뽑은 타로가 있으면 함께 표시
    try {
      const raw = localStorage.getItem("bstoday.tarot");
      if (raw) {
        const t = JSON.parse(raw);
        if (t.date === dateKey && t.card) {
          setTodayCard(`${t.card.name} · ${t.card.keyword}`);
        }
      }
    } catch {
      /* ignore */
    }
  }, [dateKey, yesterdayKey]);

  const toggle = (m: string) => {
    setMoods((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );
    setSaved(false);
  };

  const save = () => {
    const all = loadAll();
    all[dateKey] = { moods, reflection };
    localStorage.setItem(KEY, JSON.stringify(all));
    setSaved(true);
  };

  const remove = () => {
    const all = loadAll();
    delete all[dateKey];
    localStorage.setItem(KEY, JSON.stringify(all));
    setMoods([]);
    setReflection("");
    setSaved(false);
  };

  return (
    <div className="font-gowun">
      <p className="mb-3 text-center text-xs text-indigo-100/50">
        오늘의 기분을 고르고, 성찰 질문에 답해보세요. 기록은 이 기기에만 비공개로 저장됩니다.
      </p>

      {/* 기분 (복수 선택) */}
      <div className="mb-4 flex flex-wrap justify-center gap-1.5">
        {MOODS.map((m) => {
          const on = moods.includes(m);
          return (
            <button
              key={m}
              type="button"
              onClick={() => toggle(m)}
              aria-pressed={on}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                on
                  ? "border-gold/60 bg-gold/20 text-gold"
                  : "border-white/15 bg-white/5 text-indigo-100/70 hover:border-gold/30"
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>

      {/* 성찰 질문 답변 */}
      <label className="mb-1.5 block text-xs text-gold/80">{question}</label>
      <textarea
        value={reflection}
        onChange={(e) => {
          setReflection(e.target.value);
          setSaved(false);
        }}
        rows={3}
        placeholder="떠오르는 생각을 자유롭게 적어보세요…"
        className="w-full resize-none rounded-lg border border-gold/25 bg-[#0c0a26]/70 px-3 py-2.5 text-sm text-[#f3e9d2] placeholder:text-indigo-200/30 outline-none focus:border-gold/60"
      />

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={save}
          className="font-serif rounded-md border border-gold/50 bg-gold/10 px-6 py-2 text-sm tracking-[0.1em] text-gold transition hover:bg-gold/20 active:scale-95"
        >
          기록 저장
        </button>
        {(moods.length > 0 || reflection) && (
          <button
            type="button"
            onClick={remove}
            className="rounded-md border border-white/15 px-4 py-2 text-xs text-indigo-100/60 transition hover:border-rose-300/40 hover:text-rose-200/80"
          >
            오늘 기록 삭제
          </button>
        )}
      </div>
      {saved && (
        <p className="mt-2 text-center text-[11px] text-emerald-200/70">
          ✓ 저장되었습니다 · 비공개
        </p>
      )}

      {(todayCard || yesterdayMoods.length > 0) && (
        <div className="mt-4 border-t border-white/5 pt-3 text-center text-[11px] text-indigo-100/50">
          {todayCard && <p>🃏 오늘 뽑은 카드 · {todayCard}</p>}
          {yesterdayMoods.length > 0 && (
            <p className={todayCard ? "mt-1" : ""}>
              어제의 기분 · {yesterdayMoods.join(" · ")}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
