"use client";

import { useState } from "react";
import { generateReading, type BirthProfile, type Reading } from "@/lib/astrology";

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-300" aria-label={`${n}점`}>
      {"★".repeat(n)}
      <span className="text-white/25">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function FortuneApp() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState<string>("unknown");
  const [minute, setMinute] = useState<string>("0");
  const [error, setError] = useState("");

  const [reading, setReading] = useState<Reading | null>(null);
  const [flipped, setFlipped] = useState(false);

  const handleSubmit = () => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!y || y < 1900 || y > 2100) return setError("올바른 연도를 입력해주세요.");
    if (!m || m < 1 || m > 12) return setError("월은 1~12 사이로 입력해주세요.");
    if (!d || d < 1 || d > 31) return setError("일은 1~31 사이로 입력해주세요.");
    setError("");

    const profile: BirthProfile = {
      name: name.trim(),
      year: y,
      month: m,
      day: d,
      hour: hour === "unknown" ? null : Number(hour),
      minute: hour === "unknown" ? 0 : Number(minute),
    };
    setReading(generateReading(profile, new Date()));
    setFlipped(true);
  };

  const handleReset = () => {
    setFlipped(false);
    setReading(null);
  };

  // ── 입력 폼 화면 ──────────────────────────────────────────────
  if (!reading) {
    return (
      <div className="w-80 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur sm:w-96">
        <h2 className="mb-1 text-center text-lg font-semibold text-white">
          🔮 나의 정보 입력
        </h2>
        <p className="mb-5 text-center text-xs text-slate-300">
          모던 점성학으로 오늘의 운세를 읽어드려요
        </p>

        <label className="mb-1 block text-sm text-slate-200">이름</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동"
          className="mb-4 w-full rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
        />

        <label className="mb-1 block text-sm text-slate-200">생년월일</label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            inputMode="numeric"
            placeholder="1995"
            className="rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-center text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <input
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            inputMode="numeric"
            placeholder="월"
            className="rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-center text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
          <input
            value={day}
            onChange={(e) => setDay(e.target.value)}
            inputMode="numeric"
            placeholder="일"
            className="rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-center text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
          />
        </div>

        <label className="mb-1 block text-sm text-slate-200">
          태어난 시간 <span className="text-slate-400">(상승궁 추정에 사용)</span>
        </label>
        <div className="mb-5 grid grid-cols-2 gap-2">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="w-full rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-white focus:border-indigo-400 focus:outline-none"
          >
            <option value="unknown">모름</option>
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}시
              </option>
            ))}
          </select>
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            disabled={hour === "unknown"}
            className="w-full rounded-lg border border-white/20 bg-slate-900/50 px-3 py-2 text-white focus:border-indigo-400 focus:outline-none disabled:opacity-40"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}분
              </option>
            ))}
          </select>
        </div>

        {error && <p className="mb-3 text-center text-sm text-rose-300">{error}</p>}

        <button
          onClick={handleSubmit}
          className="w-full rounded-full bg-indigo-600 px-8 py-3 font-medium text-white shadow-md transition hover:bg-indigo-700 active:scale-95"
        >
          오늘의 운세 보기
        </button>
      </div>
    );
  }

  // ── 결과 화면 ────────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-8">
      {/* 뒤집히는 요약 카드 */}
      <div className="[perspective:1200px]">
        <div
          className={`relative h-80 w-56 select-none transition-transform duration-700 [transform-style:preserve-3d] sm:h-96 sm:w-64 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 p-6 text-center shadow-xl [backface-visibility:hidden]">
            <span className="text-6xl">🔮</span>
            <p className="text-lg font-semibold text-white">오늘의 운세</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 p-6 text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-5xl">{reading.sunSign.symbol}</span>
            <p className="text-sm text-white/90">{reading.name} 님</p>
            <p className="text-lg font-bold text-white">{reading.sunSign.name}</p>
            <p className="text-xs text-white/80">{reading.themeLine}</p>
            <div className="mt-2 rounded-full bg-white/25 px-4 py-1 text-sm font-medium text-white">
              오늘의 키워드 · {reading.keyword}
            </div>
          </div>
        </div>
      </div>

      {/* 상세 결과 패널 */}
      <div className="w-80 rounded-2xl bg-white/10 p-6 shadow-lg backdrop-blur sm:w-96">
        {/* 별자리 요약 */}
        <div className="mb-5 flex items-center justify-between gap-2 rounded-xl bg-white/10 p-3 text-sm text-white">
          <div className="text-center">
            <p className="text-xs text-slate-300">태양궁</p>
            <p className="font-semibold">
              {reading.sunSign.symbol} {reading.sunSign.name}
            </p>
            <p className="text-xs text-slate-400">{reading.sunSign.element} · {reading.sunSign.range}</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="text-xs text-slate-300">상승궁(추정)</p>
            <p className="font-semibold">
              {reading.ascendant
                ? `${reading.ascendant.symbol} ${reading.ascendant.name}`
                : "—"}
            </p>
            <p className="text-xs text-slate-400">
              {reading.ascendant ? "태어난 시간 기반" : "시간 미입력"}
            </p>
          </div>
        </div>

        {/* 총평 */}
        <p className="mb-5 rounded-xl bg-white/5 p-3 text-sm leading-relaxed text-slate-100">
          ✨ {reading.overallText}
        </p>

        {/* 운세 지수 */}
        <h3 className="mb-3 text-center text-base font-semibold text-white">오늘의 운세 지수</h3>
        <div className="mb-5 flex flex-col gap-3">
          {reading.categories.map((c) => (
            <div key={c.label}>
              <div className="mb-1 flex items-center justify-between text-sm text-slate-200">
                <span>{c.label}</span>
                <Stars n={c.stars} />
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-700"
                  style={{ width: `${c.value}%` }}
                />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-300">{c.text}</p>
            </div>
          ))}
        </div>

        {/* 조언 */}
        <div className="mb-5 grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl bg-emerald-500/15 p-3 text-emerald-100">
            <p className="mb-1 font-semibold">👍 오늘 하면 좋은 것</p>
            <p className="text-xs leading-relaxed">{reading.doAdvice}</p>
          </div>
          <div className="rounded-xl bg-rose-500/15 p-3 text-rose-100">
            <p className="mb-1 font-semibold">🙅 오늘 피할 것</p>
            <p className="text-xs leading-relaxed">{reading.dontAdvice}</p>
          </div>
        </div>

        {/* 행운 정보 */}
        <div className="grid grid-cols-2 gap-2 text-sm text-white">
          <div className="rounded-lg bg-white/5 p-2">🎁 아이템 · {reading.lucky.item}</div>
          <div className="rounded-lg bg-white/5 p-2">🎨 색 · {reading.lucky.color}</div>
          <div className="rounded-lg bg-white/5 p-2">🔢 숫자 · {reading.lucky.number}</div>
          <div className="rounded-lg bg-white/5 p-2">🧭 방향 · {reading.lucky.direction}</div>
          <div className="rounded-lg bg-white/5 p-2">⏰ 시간 · {reading.lucky.time}</div>
          <div className="rounded-lg bg-white/5 p-2">💞 궁합 · {reading.compatibleSign}</div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">
          ※ 이 운세는 오늘 하루 동안 동일하게 유지됩니다.
        </p>
      </div>

      <button
        onClick={handleReset}
        className="rounded-full bg-indigo-600 px-8 py-3 font-medium text-white shadow-md transition hover:bg-indigo-700 active:scale-95"
      >
        정보 다시 입력
      </button>
    </div>
  );
}
