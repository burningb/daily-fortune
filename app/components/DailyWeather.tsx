import type { NatalChart } from "@/lib/astrology";
import type { DailyBundle } from "@/lib/daily";
import { DISCLAIMER } from "@/lib/astro-config";
import DualChart from "@/app/components/DualChart";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 mt-2 flex items-center justify-center gap-3">
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
      <h3 className="font-serif text-sm tracking-[0.25em] text-gold">{children}</h3>
      <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}

// 중립적 감각 스펙트럼(새벽 청색 → 금빛). 좋음/나쁨 색이 아님.
function Meter({ label, score, note }: { label: string; score: number; note: string }) {
  return (
    <div
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${label} ${score}점 · ${note}`}
    >
      <div className="mb-1 flex items-baseline justify-between font-gowun text-sm">
        <span className="text-indigo-50/90">{label}</span>
        <span className="font-serif text-gold/90">{score}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-[#0c0a26]/80 ring-1 ring-white/5">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,#6b7db3,#9fc3e0,#e9c877)]"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="font-gowun mt-1 text-[11px] text-indigo-100/55" aria-hidden>
        {note}
      </p>
    </div>
  );
}

export default function DailyWeather({
  daily,
  chart,
  dateLabel,
  placeLabel,
}: {
  daily: DailyBundle;
  chart: NatalChart;
  dateLabel: string;
  placeLabel: string;
}) {
  const r = daily.report;

  return (
    <div className="font-gowun">
      {/* 날짜 / 위치 / 달 위상 */}
      <div className="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-indigo-100/60">
        <span>{dateLabel}</span>
        <span className="text-gold/40">·</span>
        <span>{placeLabel}</span>
        <span className="text-gold/40">·</span>
        <span>☾ {daily.moonPhaseName}</span>
      </div>

      {/* 오늘의 한 문장 */}
      <p className="mx-auto mb-4 max-w-md text-center text-lg leading-relaxed text-[#f3e9d2]">
        “{r.headline}”
      </p>
      <p className="mx-auto mb-2 max-w-md text-center text-sm leading-loose text-indigo-50/80">
        {r.weatherSummary}
      </p>

      {/* 이중 차트 */}
      <SectionTitle>출생 × 오늘의 하늘</SectionTitle>
      <div className="flex justify-center">
        <DualChart
          chart={chart}
          transitPlanets={daily.transitPlanets}
          ranked={daily.ranked}
          altText={`출생차트(안쪽 원)와 오늘의 트랜짓(바깥쪽 원)을 겹친 이중 천궁도. 오늘의 핵심 신호: ${
            r.mainSignal ? `${r.mainSignal.title} (${r.mainSignal.evidence})` : "두드러진 신호 없음"
          }`}
        />
      </div>
      <p className="mb-2 text-center text-[11px] text-indigo-100/40">
        안쪽 = 출생차트 · 바깥쪽 = 오늘의 트랜짓 · 선 = 핵심 접점
      </p>

      {/* 에너지 계기판 */}
      <SectionTitle>에너지 계기판</SectionTitle>
      <div className="mb-2 flex flex-col gap-3">
        {daily.energy.map((m) => (
          <Meter key={m.key} label={m.label} score={m.score} note={m.note} />
        ))}
      </div>

      {/* 핵심 천체 신호 */}
      {r.mainSignal && (
        <>
          <SectionTitle>핵심 천체 신호</SectionTitle>
          <div className="rounded-lg border border-gold/20 bg-[#0c0a26]/40 p-4">
            <p className="font-serif mb-1 text-[11px] tracking-[0.2em] text-gold/60">
              {r.mainSignal.combo}
            </p>
            <p className="mb-2 text-base text-[#f3e9d2]">{r.mainSignal.title}</p>
            <p className="mb-2 text-sm leading-relaxed text-indigo-50/85">{r.mainSignal.meaning}</p>
            {r.mainSignal.caution && (
              <p className="mb-1 text-sm leading-relaxed text-amber-100/80">
                <span className="text-gold">주의 · </span>
                {r.mainSignal.caution}
              </p>
            )}
            {r.mainSignal.action && (
              <p className="mb-2 text-sm leading-relaxed text-emerald-100/80">
                <span className="text-gold">활용 · </span>
                {r.mainSignal.action}
              </p>
            )}
            <p className="font-serif text-[11px] text-indigo-100/45">{r.mainSignal.evidence}</p>
          </div>
          {r.supporting.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {r.supporting.map((s, i) => (
                <div key={i} className="rounded-lg border border-white/5 bg-[#0c0a26]/30 p-3">
                  <p className="text-sm text-[#f3e9d2]">{s.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-indigo-100/60">{s.meaning}</p>
                  <p className="font-serif mt-1 text-[10px] text-indigo-100/40">{s.evidence}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 활성화된 삶의 영역 */}
      {r.lifeArea && (
        <>
          <SectionTitle>활성화된 삶의 영역</SectionTitle>
          <div className="rounded-lg border border-gold/15 bg-[#0c0a26]/40 p-4 text-center">
            <p className="text-gold">
              {r.lifeArea.house}하우스 · {r.lifeArea.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-indigo-50/85">{r.lifeArea.interpretation}</p>
          </div>
        </>
      )}

      {/* 시간대별 흐름 (달의 이동 기반) */}
      {daily.timeWindows.length > 0 && (
        <>
          <SectionTitle>시간대별 흐름</SectionTitle>
          <div className="flex flex-col gap-2">
            {daily.timeWindows.map((w) => (
              <div
                key={w.period}
                className="rounded-lg border border-gold/10 bg-[#0c0a26]/30 p-3"
              >
                <p className="mb-1 flex items-center gap-2 text-sm text-gold">
                  <span>{w.period}</span>
                  <span className="text-[11px] text-indigo-100/50">{w.label}</span>
                </p>
                <p className="text-xs leading-relaxed text-indigo-50/80">{w.text}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 오늘의 활용법 */}
      <SectionTitle>오늘의 활용법</SectionTitle>
      <ul className="flex flex-col gap-2">
        {r.actionTips.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm leading-relaxed text-indigo-50/85">
            <span className="text-gold">·</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {/* 성찰 질문 */}
      <SectionTitle>오늘의 질문</SectionTitle>
      <p className="mx-auto max-w-md text-center text-base italic leading-relaxed text-gold/90">
        {r.reflectionQuestion}
      </p>

      {/* 면책 */}
      <p className="mx-auto mt-6 max-w-md text-center text-[11px] leading-relaxed text-indigo-100/35">
        {DISCLAIMER}
      </p>
    </div>
  );
}
