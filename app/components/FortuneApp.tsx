"use client";

import { useEffect, useState } from "react";
import {
  generateReading,
  type BirthProfile,
  type Reading,
} from "@/lib/astrology";
import { CITIES } from "@/lib/cities";
import { buildDaily, type DailyBundle } from "@/lib/daily";
import Constellation from "@/app/components/Constellation";
import DailyWeather from "@/app/components/DailyWeather";
import JournalPanel from "@/app/components/JournalPanel";
import ShareCard from "@/app/components/ShareCard";
import TarotDraw from "@/app/components/TarotDraw";

const PROFILE_KEY = "bstoday.profile";


/* 네 모서리 금빛 장식 */
function Corners() {
  return (
    <>
      <span className="tarot-corner left-2 top-2">✦</span>
      <span className="tarot-corner right-2 top-2">✦</span>
      <span className="tarot-corner bottom-2 left-2">✦</span>
      <span className="tarot-corner bottom-2 right-2">✦</span>
    </>
  );
}

/* 금빛 섹션 제목 */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
      <h3 className="font-serif text-sm tracking-[0.25em] text-gold">{children}</h3>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

const inputClass =
  "w-full rounded-md border border-gold/25 bg-[#0c0a26]/70 px-3 py-2.5 text-[#f3e9d2] placeholder:text-indigo-200/30 outline-none transition focus:border-gold/70 focus:ring-1 focus:ring-gold/40";
const labelClass =
  "font-serif mb-1.5 block text-xs tracking-[0.2em] text-gold/80";

export default function FortuneApp() {
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState<string>("unknown");
  const [minute, setMinute] = useState<string>("0");
  const [cityIdx, setCityIdx] = useState<string>("0"); // 기본: 서울
  const [error, setError] = useState("");

  const [reading, setReading] = useState<Reading | null>(null);
  const [daily, setDaily] = useState<DailyBundle | null>(null);
  const [dateLabel, setDateLabel] = useState("");
  const [dateKey, setDateKey] = useState("");
  const [yesterdayKey, setYesterdayKey] = useState("");
  const [savedName, setSavedName] = useState<string | null>(null);

  // 저장된 프로필 불러오기 (이 기기에만 저장)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.name) setName(p.name);
      if (p.year) setYear(String(p.year));
      if (p.month) setMonth(String(p.month));
      if (p.day) setDay(String(p.day));
      if (p.hour !== undefined && p.hour !== null) setHour(String(p.hour));
      if (p.minute !== undefined) setMinute(String(p.minute));
      if (p.cityIdx !== undefined) setCityIdx(String(p.cityIdx));
      if (p.name) setSavedName(p.name);
    } catch {
      /* ignore */
    }
  }, []);

  const clearProfile = () => {
    try {
      localStorage.removeItem(PROFILE_KEY);
    } catch {
      /* ignore */
    }
    setSavedName(null);
    setName("");
    setYear("");
    setMonth("");
    setDay("");
    setHour("unknown");
    setMinute("0");
    setCityIdx("0");
  };

  const handleSubmit = () => {
    const y = Number(year);
    const m = Number(month);
    const d = Number(day);

    if (!name.trim()) return setError("이름을 입력해주세요.");
    if (!y || y < 1900 || y > 2100) return setError("올바른 연도를 입력해주세요.");
    if (!m || m < 1 || m > 12) return setError("월은 1~12 사이로 입력해주세요.");
    if (!d || d < 1 || d > 31) return setError("일은 1~31 사이로 입력해주세요.");
    setError("");

    const knowsTime = hour !== "unknown";
    const city = CITIES[Number(cityIdx)] ?? CITIES[0];
    const profile: BirthProfile = {
      name: name.trim(),
      year: y,
      month: m,
      day: d,
      hour: knowsTime ? Number(hour) : null,
      minute: knowsTime ? Number(minute) : 0,
      lat: knowsTime ? city.lat : undefined,
      lon: knowsTime ? city.lon : undefined,
      tz: knowsTime ? city.tz : undefined,
      cityName: knowsTime ? city.name : undefined,
    };
    // 프로필을 이 기기에 저장 (재방문 시 자동 복원)
    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          name: name.trim(),
          year: y,
          month: m,
          day: d,
          hour,
          minute,
          cityIdx,
        }),
      );
      setSavedName(name.trim());
    } catch {
      /* ignore */
    }

    const now = new Date();
    const r = generateReading(profile, now);
    setReading(r);
    setDaily(r.chart ? buildDaily(r.chart, city.tz, now) : null);
    setDateLabel(
      `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`,
    );
    setDateKey(
      `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`,
    );
    const y1 = new Date(now.getTime() - 86400000);
    setYesterdayKey(
      `${y1.getFullYear()}-${y1.getMonth() + 1}-${y1.getDate()}`,
    );
  };

  const handleReset = () => {
    setReading(null);
    setDaily(null);
  };

  // ── 입력 폼 화면 ──────────────────────────────────────────────
  if (!reading) {
    return (
      <div className="tarot-frame animate-rise relative w-[21rem] rounded-xl p-7 sm:w-96">
        <Corners />
        <div className="tarot-inline rounded-lg p-6">
          <p className="font-serif mb-1 text-center text-xs tracking-[0.35em] text-gold/70">
            ☾ ASTRA ☽
          </p>
          <h2 className="font-gowun mb-1 text-center text-xl text-[#f3e9d2]">
            나의 별을 알려주세요
          </h2>
          <p className="font-gowun mb-4 text-center text-xs text-indigo-100/50">
            이름과 태어난 순간이 오늘의 나를 비춥니다
          </p>

          {savedName && (
            <div className="mb-5 flex items-center justify-between gap-2 rounded-lg border border-gold/20 bg-gold/5 px-3 py-2 font-gowun text-xs text-indigo-100/70">
              <span>
                <span className="text-gold">{savedName}</span> 님, 저장된 정보로 바로 볼 수 있어요.
              </span>
              <button
                type="button"
                onClick={clearProfile}
                className="shrink-0 text-indigo-100/45 underline-offset-2 hover:text-rose-200/80 hover:underline"
              >
                정보 지우기
              </button>
            </div>
          )}

          <label className={labelClass}>이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            aria-label="이름 또는 닉네임"
            className={`${inputClass} mb-4`}
          />

          <label className={labelClass}>생년월일</label>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              inputMode="numeric"
              placeholder="1995"
              aria-label="출생 연도"
              className={`${inputClass} text-center`}
            />
            <input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              inputMode="numeric"
              placeholder="월"
              aria-label="출생 월"
              className={`${inputClass} text-center`}
            />
            <input
              value={day}
              onChange={(e) => setDay(e.target.value)}
              inputMode="numeric"
              placeholder="일"
              aria-label="출생 일"
              className={`${inputClass} text-center`}
            />
          </div>

          <label className={labelClass}>
            태어난 시간 <span className="text-indigo-100/40">· 상승궁 계산</span>
          </label>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              aria-label="태어난 시"
              className={inputClass}
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
              aria-label="태어난 분"
              className={`${inputClass} disabled:opacity-40`}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>
                  {String(i).padStart(2, "0")}분
                </option>
              ))}
            </select>
          </div>

          <label className={labelClass}>
            출생 지역 <span className="text-indigo-100/40">· 정확한 상승궁</span>
          </label>
          <select
            value={cityIdx}
            onChange={(e) => setCityIdx(e.target.value)}
            disabled={hour === "unknown"}
            aria-label="출생 지역"
            className={`${inputClass} mb-2 disabled:opacity-40`}
          >
            <optgroup label="국내">
              {CITIES.map((c, i) =>
                c.group === "국내" ? (
                  <option key={i} value={i}>
                    {c.name}
                  </option>
                ) : null,
              )}
            </optgroup>
            <optgroup label="해외">
              {CITIES.map((c, i) =>
                c.group === "해외" ? (
                  <option key={i} value={i}>
                    {c.name}
                  </option>
                ) : null,
              )}
            </optgroup>
          </select>
          <p className="font-gowun mb-6 text-[11px] leading-relaxed text-indigo-100/40">
            {hour === "unknown"
              ? "시간을 알면 출생 지역으로 정확한 상승궁을 계산해요."
              : "표준시 기준이며 서머타임은 반영하지 않습니다."}
          </p>

          {error && (
            <p className="font-gowun mb-3 text-center text-sm text-rose-300">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="font-serif group w-full rounded-md border border-gold/50 bg-gradient-to-b from-gold/20 to-gold/5 px-8 py-3 tracking-[0.15em] text-gold shadow-[0_0_20px_-6px_rgba(233,200,119,0.6)] transition hover:from-gold/30 hover:to-gold/10 hover:shadow-[0_0_28px_-4px_rgba(233,200,119,0.8)] active:scale-95"
          >
            ✦ 오늘의 나 만나기 ✦
          </button>
        </div>
      </div>
    );
  }

  // ── 결과 화면 ────────────────────────────────────────────────
  return (
    <div className="animate-rise flex flex-col items-center gap-9">
      {/* 나의 별자리 (카드 없이 열린 레이아웃) */}
      <div className="flex flex-col items-center gap-2 text-center">
        <Constellation
          signKey={reading.sunSign.key}
          className="h-44 w-44 sm:h-52 sm:w-52"
          label={`${reading.sunSign.name} 별자리 성좌 그림`}
        />
        <p className="font-gowun text-xs text-indigo-100/60">
          {reading.name} 님의 별
        </p>
        <h2 className="font-gowun text-2xl tracking-wide text-gold">
          {reading.sunSign.name}
        </h2>
        <p className="font-gowun text-sm text-indigo-100/70">
          {reading.themeLine}
        </p>
        <span className="mt-1 rounded-full border border-gold/30 px-4 py-1 font-gowun text-xs text-indigo-100/80">
          오늘의 키워드 · {reading.keyword}
        </span>
      </div>

      {/* 오늘의 날씨 (출생 시각·지역 입력 시) */}
      {daily && reading.chart && (
        <div className="tarot-frame w-[21rem] rounded-xl p-6 sm:w-[30rem]">
          <div className="tarot-inline rounded-lg p-5 sm:p-6">
            <p className="font-serif mb-1 text-center text-xs tracking-[0.35em] text-gold/70">
              ☁ TODAY&apos;S WEATHER ☁
            </p>
            <h2 className="font-gowun mb-4 text-center text-lg text-[#f3e9d2]">
              오늘, 나의 날씨
            </h2>
            <DailyWeather
              daily={daily}
              chart={reading.chart}
              dateLabel={dateLabel}
              placeLabel={reading.birthPlace ?? ""}
            />
          </div>
        </div>
      )}

      {/* 상세 결과 패널 */}
      <div className="tarot-frame w-[21rem] rounded-xl p-7 sm:w-[26rem]">
        <div className="tarot-inline rounded-lg p-5 sm:p-6">
          {/* 태양궁 / 상승궁 */}
          <div className="mb-6 flex items-stretch justify-between gap-2 rounded-lg border border-gold/15 bg-[#0c0a26]/50 p-3">
            <div className="flex-1 text-center">
              <p className="font-serif text-[10px] tracking-[0.2em] text-gold/70">
                태양궁 · SUN
              </p>
              <p className="font-gowun mt-1 text-[#f3e9d2]">
                {reading.sunSign.symbol} {reading.sunSign.name}
              </p>
              <p className="font-gowun text-[11px] text-indigo-100/50">
                {reading.sunSign.element} · {reading.sunSign.range}
              </p>
            </div>
            <div className="w-px bg-gold/20" />
            <div className="flex-1 text-center">
              <p className="font-serif text-[10px] tracking-[0.2em] text-gold/70">
                상승궁 · ASC
              </p>
              <p className="font-gowun mt-1 text-[#f3e9d2]">
                {reading.ascendant
                  ? `${reading.ascendant.symbol} ${reading.ascendant.name}${
                      reading.ascendantDeg != null
                        ? ` ${Math.floor(reading.ascendantDeg)}°`
                        : ""
                    }`
                  : "—"}
              </p>
              <p className="font-gowun text-[11px] text-indigo-100/50">
                {reading.ascendant
                  ? `${reading.birthPlace ?? ""} 기준`
                  : "시간 미입력"}
              </p>
            </div>
          </div>

          {/* 별자리 성격 프로필 */}
          <SectionTitle>{reading.sunSign.name}, 당신은</SectionTitle>
          <p className="font-gowun mb-4 text-center text-sm italic text-gold/90">
            “{reading.signProfile.tagline}”
          </p>
          <p className="font-gowun mb-4 text-sm leading-loose text-indigo-50/90">
            {reading.signProfile.personality}
          </p>
          <div className="mb-4 flex flex-col gap-2.5 font-gowun text-sm leading-relaxed">
            <p className="text-indigo-50/85">
              <span className="text-gold">✧ 빛나는 점 · </span>
              {reading.signProfile.strength}
            </p>
            <p className="text-indigo-50/85">
              <span className="text-gold">☾ 살며시 조심할 점 · </span>
              {reading.signProfile.shadow}
            </p>
            <p className="text-indigo-50/85">
              <span className="text-gold">♡ 사랑할 때 · </span>
              {reading.signProfile.inLove}
            </p>
          </div>
          <div className="mb-7 flex flex-wrap justify-center gap-1.5">
            {reading.signProfile.keywords.map((k) => (
              <span
                key={k}
                className="font-gowun rounded-full border border-gold/25 bg-gold/5 px-3 py-1 text-xs text-gold/90"
              >
                {k}
              </span>
            ))}
          </div>

          {/* 별의 조언 — 오늘의 태양·달과 나의 별자리(및 출생 달) 관계 */}
          <SectionTitle>별의 조언</SectionTitle>
          <div className="mb-7 flex flex-col gap-3 font-gowun">
            <div className="rounded-lg border border-gold/15 bg-[#0c0a26]/40 p-4">
              <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm text-gold">
                  ☀ 오늘의 태양 · {reading.starAdvice.sun.transitSignName}
                </span>
                <span className="rounded-full border border-gold/25 px-2 py-0.5 text-[10px] text-gold/80">
                  {reading.starAdvice.sun.relationLabel}
                </span>
              </div>
              <p className="mb-1.5 text-sm text-[#f3e9d2]">{reading.starAdvice.sun.title}</p>
              <p className="text-xs leading-relaxed text-indigo-50/80">
                {reading.starAdvice.sun.text}
              </p>
            </div>
            <div className="rounded-lg border border-gold/15 bg-[#0c0a26]/40 p-4">
              <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm text-gold">
                  ☾ 오늘의 달 · {reading.starAdvice.moon.transitSignName}
                  <span className="text-indigo-100/45"> · {reading.starAdvice.moon.phase}</span>
                </span>
                <span className="rounded-full border border-gold/25 px-2 py-0.5 text-[10px] text-gold/80">
                  {reading.starAdvice.moon.relationLabel}
                </span>
              </div>
              <p className="mb-1.5 text-sm text-[#f3e9d2]">{reading.starAdvice.moon.title}</p>
              <p className="text-xs leading-relaxed text-indigo-50/80">
                {reading.starAdvice.moon.text}
              </p>
              <p className="mt-2 text-[10px] text-indigo-100/40">
                · {reading.starAdvice.moon.reference}
              </p>
            </div>
          </div>

          <p className="font-gowun mt-6 text-center text-[11px] text-indigo-100/40">
            ✦ 이 카드는 오늘 하루, 당신 곁에 머뭅니다 ✦
          </p>
        </div>
      </div>

      {/* 저널 */}
      <div className="tarot-frame w-[21rem] rounded-xl p-6 sm:w-[26rem]">
        <div className="tarot-inline rounded-lg p-5 sm:p-6">
          <SectionTitle>오늘의 기록</SectionTitle>
          <JournalPanel
            dateKey={dateKey}
            yesterdayKey={yesterdayKey}
            question={
              daily?.report.reflectionQuestion ??
              "오늘 나는 무엇을 느끼고 있나요?"
            }
          />
        </div>
      </div>

      {/* 공유 카드 */}
      <div className="tarot-frame w-[21rem] rounded-xl p-6 sm:w-[26rem]">
        <div className="tarot-inline rounded-lg p-5 sm:p-6">
          <SectionTitle>오늘을 공유하기</SectionTitle>
          <ShareCard
            headline={daily?.report.headline ?? reading.starAdvice.sun.title}
            question={
              daily?.report.reflectionQuestion ??
              "오늘 나는 무엇을 느끼고 있나요?"
            }
            dateLabel={dateLabel}
          />
        </div>
      </div>

      <button
        onClick={handleReset}
        className="font-serif rounded-md border border-gold/40 bg-gold/5 px-8 py-3 tracking-[0.15em] text-gold/90 transition hover:bg-gold/15 active:scale-95"
      >
        다시 별을 부르기
      </button>

      {/* 보너스: 타로 한 장 뽑기 */}
      <div className="mt-2 w-full max-w-[26rem]">
        <div className="mb-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
          <span className="font-serif text-sm tracking-[0.25em] text-gold">
            오늘의 타로 한 장
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
        </div>
        <TarotDraw dateKey={dateKey} />
      </div>
    </div>
  );
}
