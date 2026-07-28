"use client";

import { useState } from "react";
import {
  generateReading,
  SIGNS,
  type BirthProfile,
  type Reading,
} from "@/lib/astrology";
import { CITIES } from "@/lib/cities";
import Constellation from "@/app/components/Constellation";
import NatalChart from "@/app/components/NatalChart";

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI",
  "VII", "VIII", "IX", "X", "XI", "XII",
];

function romanFor(signKey: string) {
  const i = SIGNS.findIndex((s) => s.key === signKey);
  return i >= 0 ? ROMAN[i] : "";
}

/* 금빛 별점 */
function Stars({ n }: { n: number }) {
  return (
    <span className="text-gold" aria-label={`${n}점`}>
      {"★".repeat(n)}
      <span className="text-gold/20">{"★".repeat(5 - n)}</span>
    </span>
  );
}

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
      <div className="tarot-frame animate-rise relative w-[21rem] rounded-xl p-7 sm:w-96">
        <Corners />
        <div className="tarot-inline rounded-lg p-6">
          <p className="font-serif mb-1 text-center text-xs tracking-[0.35em] text-gold/70">
            ☾ ASTRA ☽
          </p>
          <h2 className="font-gowun mb-1 text-center text-xl text-[#f3e9d2]">
            나의 별을 알려주세요
          </h2>
          <p className="font-gowun mb-6 text-center text-xs text-indigo-100/50">
            이름과 태어난 순간이 오늘의 나를 비춥니다
          </p>

          <label className={labelClass}>이름</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className={`${inputClass} mb-4`}
          />

          <label className={labelClass}>생년월일</label>
          <div className="mb-4 grid grid-cols-3 gap-2">
            <input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              inputMode="numeric"
              placeholder="1995"
              className={`${inputClass} text-center`}
            />
            <input
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              inputMode="numeric"
              placeholder="월"
              className={`${inputClass} text-center`}
            />
            <input
              value={day}
              onChange={(e) => setDay(e.target.value)}
              inputMode="numeric"
              placeholder="일"
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
      {/* 뒤집히는 타로 카드 */}
      <div className="[perspective:1400px]">
        <div
          className={`relative h-[26rem] w-64 select-none transition-transform duration-[900ms] [transform-style:preserve-3d] sm:h-[28rem] sm:w-72 ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front (카드 뒷면 문양) */}
          <div className="tarot-frame absolute inset-0 rounded-xl p-4 [backface-visibility:hidden]">
            <Corners />
            <div className="tarot-inline flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg">
              <span className="text-5xl text-gold">☾</span>
              <span className="font-serif text-xs tracking-[0.4em] text-gold/70">
                ORACULUM
              </span>
              <span className="text-3xl text-gold/80">✦</span>
            </div>
          </div>

          {/* Back (별자리 아르카나) */}
          <div className="tarot-frame absolute inset-0 rounded-xl p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Corners />
            <div className="tarot-inline flex h-full w-full flex-col items-center justify-between rounded-lg py-6">
              <span className="font-serif text-sm tracking-[0.3em] text-gold/80">
                {romanFor(reading.sunSign.key)}
              </span>

              <div className="flex flex-col items-center gap-2">
                <Constellation
                  signKey={reading.sunSign.key}
                  className="h-40 w-40 sm:h-44 sm:w-44"
                />
                <span className="font-gowun text-xs text-indigo-100/60">
                  {reading.name} 님의 별
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 px-3 text-center">
                <span className="font-gowun text-xl tracking-wide text-gold">
                  {reading.sunSign.name}
                </span>
                <span className="font-gowun text-xs text-indigo-100/60">
                  {reading.themeLine}
                </span>
                <span className="mt-1 rounded-full border border-gold/30 px-3 py-1 font-gowun text-xs text-indigo-100/80">
                  오늘의 키워드 · {reading.keyword}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

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

          {/* 오늘의 흐름 */}
          <SectionTitle>오늘의 흐름</SectionTitle>
          <p className="font-gowun mb-7 rounded-lg border border-gold/15 bg-[#0c0a26]/40 p-4 text-center text-sm leading-loose text-indigo-50/90">
            {reading.overallText}
          </p>

          {/* 오늘의 나, 영역별 기운 */}
          <SectionTitle>오늘의 나, 영역별 기운</SectionTitle>
          <div className="mb-7 flex flex-col gap-3.5">
            {reading.categories.map((c) => (
              <div key={c.label}>
                <div className="mb-1 flex items-center justify-between font-gowun text-sm text-indigo-50/90">
                  <span>{c.label}</span>
                  <Stars n={c.stars} />
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#0c0a26]/80 ring-1 ring-gold/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold transition-all duration-1000"
                    style={{ width: `${c.value}%` }}
                  />
                </div>
                <p className="font-gowun mt-1.5 text-xs leading-relaxed text-indigo-100/55">
                  {c.text}
                </p>
              </div>
            ))}
          </div>

          {/* 조언 */}
          <SectionTitle>별의 조언</SectionTitle>
          <div className="mb-7 grid grid-cols-2 gap-2 font-gowun text-sm">
            <div className="rounded-lg border border-emerald-300/20 bg-emerald-400/5 p-3 text-emerald-100/90">
              <p className="mb-1 text-gold">☀ 하면 좋은 것</p>
              <p className="text-xs leading-relaxed">{reading.doAdvice}</p>
            </div>
            <div className="rounded-lg border border-rose-300/20 bg-rose-400/5 p-3 text-rose-100/90">
              <p className="mb-1 text-gold">☾ 피할 것</p>
              <p className="text-xs leading-relaxed">{reading.dontAdvice}</p>
            </div>
          </div>

          {/* 행운 정보 */}
          <SectionTitle>행운의 인연</SectionTitle>
          <div className="grid grid-cols-2 gap-2 font-gowun text-sm text-indigo-50/90">
            {[
              `🎁 아이템 · ${reading.lucky.item}`,
              `🎨 색 · ${reading.lucky.color}`,
              `🔢 숫자 · ${reading.lucky.number}`,
              `🧭 방향 · ${reading.lucky.direction}`,
              `⏰ 시간 · ${reading.lucky.time}`,
              `💞 궁합 · ${reading.compatibleSign}`,
            ].map((t) => (
              <div
                key={t}
                className="rounded-lg border border-gold/10 bg-[#0c0a26]/40 p-2.5"
              >
                {t}
              </div>
            ))}
          </div>

          {/* 천궁도 (출생 시각·지역을 입력한 경우) */}
          {reading.chart && (
            <>
              <div className="my-6" />
              <SectionTitle>천궁도 · NATAL CHART</SectionTitle>
              <NatalChart chart={reading.chart} />
            </>
          )}

          <p className="font-gowun mt-6 text-center text-[11px] text-indigo-100/40">
            ✦ 이 카드는 오늘 하루, 당신 곁에 머뭅니다 ✦
          </p>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="font-serif rounded-md border border-gold/40 bg-gold/5 px-8 py-3 tracking-[0.15em] text-gold/90 transition hover:bg-gold/15 active:scale-95"
      >
        다시 별을 부르기
      </button>
    </div>
  );
}
