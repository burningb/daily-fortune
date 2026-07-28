import type { NatalChart as Chart } from "@/lib/astrology";
import { PLANET_META } from "@/lib/astrology";

const GOLD = "#e9c877";
const CREAM = "#f3e9d2";
// U+FE0E(텍스트 표현 강제)로 이모지가 아닌 금빛 모노크롬 글리프로 렌더링
const SIGN_GLYPHS = [
  "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎",
  "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎",
];

// 조화(삼각·육각) / 긴장(사각·대칭) / 합
const ASPECT_COLOR: Record<string, string> = {
  삼각: "#7fd4c1",
  육각: "#7fd4c1",
  사각: "#e0908c",
  대칭: "#e0908c",
  합: GOLD,
};

export default function NatalChart({ chart }: { chart: Chart }) {
  const cx = 50;
  const cy = 50;
  const R_OUT = 48;
  const R_SIGN = 39; // 사인 밴드 안쪽
  const R_HOUSE = 34;
  const R_PLANET = 30;
  const R_HUB = 26; // 애스펙트 선 반경

  // 황경 → 화면 좌표 (상승궁을 왼쪽 9시에 두고 반시계로 증가)
  const pos = (lon: number, r: number) => {
    const theta = (180 + (lon - chart.ascLon)) * (Math.PI / 180);
    return { x: cx + r * Math.cos(theta), y: cy - r * Math.sin(theta) };
  };

  // 행성 글리프 겹침 완화 (가까우면 안쪽으로 내림)
  const sorted = [...chart.planets].sort((a, b) => a.lon - b.lon);
  const placed = sorted.map((p) => ({ ...p, r: R_PLANET }));
  for (let i = 0; i < placed.length; i++) {
    for (let j = 0; j < i; j++) {
      const d = Math.abs(placed[i].lon - placed[j].lon);
      const sep = Math.min(d, 360 - d);
      if (sep < 8 && Math.abs(placed[i].r - placed[j].r) < 3.5) {
        placed[i].r = placed[j].r - 4;
      }
    }
  }

  const byKey = (k: string) => chart.planets.find((p) => p.key === k)!;
  const glyphOf = (k: string) => PLANET_META.find((p) => p.key === k)!.glyph;

  return (
    <div className="flex flex-col items-center">
      {/* 천궁도 휠 */}
      <svg viewBox="0 0 100 100" className="h-72 w-72 sm:h-80 sm:w-80" aria-hidden>
        {/* 링 */}
        <circle cx={cx} cy={cy} r={R_OUT} fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.6" />
        <circle cx={cx} cy={cy} r={R_SIGN} fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.4" />
        <circle cx={cx} cy={cy} r={R_HOUSE} fill="none" stroke={GOLD} strokeWidth="0.35" opacity="0.25" />
        <circle cx={cx} cy={cy} r={R_HUB} fill="none" stroke={GOLD} strokeWidth="0.3" opacity="0.2" />

        {/* 사인 경계선 + 글리프 + 하우스 번호 */}
        {Array.from({ length: 12 }, (_, k) => {
          const bound = pos(k * 30, R_OUT);
          const boundIn = pos(k * 30, R_HOUSE);
          const glyphP = pos(k * 30 + 15, (R_OUT + R_SIGN) / 2);
          const signIdx = k;
          const houseNum = ((signIdx - chart.ascSignIndex + 12) % 12) + 1;
          const houseP = pos(k * 30 + 15, (R_HOUSE + R_HUB) / 2 + 1);
          return (
            <g key={k}>
              <line
                x1={boundIn.x}
                y1={boundIn.y}
                x2={bound.x}
                y2={bound.y}
                stroke={GOLD}
                strokeWidth="0.35"
                opacity="0.3"
              />
              <text
                x={glyphP.x}
                y={glyphP.y}
                fontSize="4.2"
                fill={GOLD}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {SIGN_GLYPHS[signIdx]}
              </text>
              <text
                x={houseP.x}
                y={houseP.y}
                fontSize="2.6"
                fill={CREAM}
                opacity="0.4"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {houseNum}
              </text>
            </g>
          );
        })}

        {/* 애스펙트 선 */}
        <g>
          {chart.aspects
            .filter((asp) => asp.type !== "합")
            .map((asp, i) => {
              const pa = pos(byKey(asp.a).lon, R_HUB);
              const pb = pos(byKey(asp.b).lon, R_HUB);
              return (
                <line
                  key={i}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={ASPECT_COLOR[asp.type] ?? GOLD}
                  strokeWidth="0.35"
                  opacity="0.5"
                />
              );
            })}
        </g>

        {/* 상승궁 표식 (왼쪽) */}
        <line
          x1={pos(chart.ascLon, R_HUB).x}
          y1={pos(chart.ascLon, R_HUB).y}
          x2={pos(chart.ascLon, R_OUT).x}
          y2={pos(chart.ascLon, R_OUT).y}
          stroke={GOLD}
          strokeWidth="0.7"
        />
        <text x="3.5" y="50" fontSize="3" fill={GOLD} dominantBaseline="central">
          Asc
        </text>

        {/* 행성 */}
        {placed.map((p) => {
          const pt = pos(p.lon, p.r);
          const tick = pos(p.lon, R_HOUSE);
          return (
            <g key={p.key}>
              <line
                x1={tick.x}
                y1={tick.y}
                x2={pt.x}
                y2={pt.y}
                stroke={GOLD}
                strokeWidth="0.25"
                opacity="0.35"
              />
              <circle cx={pt.x} cy={pt.y} r="2.9" fill="#0c0a26" opacity="0.8" />
              <text
                x={pt.x}
                y={pt.y}
                fontSize="3.6"
                fill={CREAM}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {p.glyph}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 행성 표 */}
      <div className="mt-4 grid w-full grid-cols-2 gap-x-4 gap-y-1.5 font-gowun text-sm text-indigo-50/90">
        {chart.planets.map((p) => (
          <div key={p.key} className="flex items-center justify-between gap-2">
            <span className="text-gold">
              <span className="mr-1">{p.glyph}</span>
              {p.name}
            </span>
            <span className="text-right text-[13px]">
              {p.sign.name} {Math.floor(p.degInSign)}°
              {p.house != null && (
                <span className="text-indigo-100/45"> · {p.house}하우스</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* 애스펙트 */}
      {chart.aspects.length > 0 && (
        <div className="mt-4 w-full">
          <p className="font-serif mb-2 text-center text-[11px] tracking-[0.25em] text-gold/70">
            ASPECTS
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {chart.aspects.map((asp, i) => (
              <span
                key={i}
                className="font-gowun rounded-full border border-gold/20 bg-gold/5 px-2.5 py-1 text-xs"
                style={{ color: ASPECT_COLOR[asp.type] ?? GOLD }}
              >
                {glyphOf(asp.a)} {asp.glyph} {glyphOf(asp.b)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
