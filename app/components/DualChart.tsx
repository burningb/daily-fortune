import type { NatalChart } from "@/lib/astrology";
import type { TransitPlanet } from "@/lib/transit";
import type { RankedSignals } from "@/lib/ranking";

const GOLD = "#e9c877";
const CREAM = "#f3e9d2";
const TRANSIT_C = "#9fc3e0"; // 트랜짓은 옅은 청색광
const SIGN_GLYPHS = [
  "♈︎", "♉︎", "♊︎", "♋︎", "♌︎", "♍︎",
  "♎︎", "♏︎", "♐︎", "♑︎", "♒︎", "♓︎",
];
const NATURE_C: Record<string, string> = {
  조화: "#7fd4c1",
  긴장: "#e0908c",
  결합: GOLD,
};

export default function DualChart({
  chart,
  transitPlanets,
  ranked,
}: {
  chart: NatalChart;
  transitPlanets: TransitPlanet[];
  ranked: RankedSignals;
}) {
  const cx = 50;
  const cy = 50;
  const R_OUT = 48;
  const R_SIGN = 40;
  const R_TRANSIT = 36;
  const R_HOUSE = 30;
  const R_NATAL = 25;
  const R_HUB = 21;

  const pos = (lon: number, r: number) => {
    const t = (180 + (lon - chart.ascLon)) * (Math.PI / 180);
    return { x: cx + r * Math.cos(t), y: cy - r * Math.sin(t) };
  };

  const natalLon = (key: string) =>
    key === "asc"
      ? chart.ascLon
      : key === "mc"
        ? chart.mcLon
        : (chart.planets.find((p) => p.key === key)?.lon ?? null);

  const declutter = (items: { lon: number }[], base: number) => {
    const s = items.map((p) => ({ ...p, r: base }));
    for (let i = 0; i < s.length; i++)
      for (let j = 0; j < i; j++) {
        const d = Math.abs(s[i].lon - s[j].lon);
        const sep = Math.min(d, 360 - d);
        if (sep < 8 && Math.abs(s[i].r - s[j].r) < 3) s[i].r = s[j].r - 3.4;
      }
    return s;
  };

  const natal = declutter(
    [...chart.planets].sort((a, b) => a.lon - b.lon),
    R_NATAL,
  ) as (NatalChart["planets"][number] & { r: number })[];
  const transit = declutter(
    [...transitPlanets].sort((a, b) => a.lon - b.lon),
    R_TRANSIT,
  ) as (TransitPlanet & { r: number })[];

  const drawAspects = [ranked.main, ...ranked.supporting].filter(
    (a): a is NonNullable<typeof a> => !!a,
  );

  return (
    <svg viewBox="0 0 100 100" className="h-80 w-80 sm:h-96 sm:w-96" aria-hidden>
      {/* 링 */}
      <circle cx={cx} cy={cy} r={R_OUT} fill="none" stroke={GOLD} strokeWidth="0.5" opacity="0.6" />
      <circle cx={cx} cy={cy} r={R_SIGN} fill="none" stroke={GOLD} strokeWidth="0.4" opacity="0.4" />
      <circle cx={cx} cy={cy} r={R_HOUSE} fill="none" stroke={GOLD} strokeWidth="0.3" opacity="0.2" />
      <circle cx={cx} cy={cy} r={R_HUB} fill="none" stroke={GOLD} strokeWidth="0.3" opacity="0.15" />

      {/* 사인/하우스 */}
      {Array.from({ length: 12 }, (_, k) => {
        const b = pos(k * 30, R_OUT);
        const bi = pos(k * 30, R_HOUSE);
        const g = pos(k * 30 + 15, (R_OUT + R_SIGN) / 2);
        const houseNum = ((k - chart.ascSignIndex + 12) % 12) + 1;
        const hp = pos(k * 30 + 15, (R_HOUSE + R_HUB) / 2);
        return (
          <g key={k}>
            <line x1={bi.x} y1={bi.y} x2={b.x} y2={b.y} stroke={GOLD} strokeWidth="0.3" opacity="0.28" />
            <text x={g.x} y={g.y} fontSize="4" fill={GOLD} textAnchor="middle" dominantBaseline="central">
              {SIGN_GLYPHS[k]}
            </text>
            <text x={hp.x} y={hp.y} fontSize="2.4" fill={CREAM} opacity="0.35" textAnchor="middle" dominantBaseline="central">
              {houseNum}
            </text>
          </g>
        );
      })}

      {/* 핵심 애스펙트 선 (트랜짓 ↔ 출생) */}
      {drawAspects.map((a, i) => {
        const nl = natalLon(a.natal);
        const tp = transitPlanets.find((p) => p.key === a.transit);
        if (nl == null || !tp) return null;
        const pa = pos(tp.lon, R_HUB);
        const pb = pos(nl, R_HUB);
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={NATURE_C[a.nature] ?? GOLD}
            strokeWidth={i === 0 ? 0.6 : 0.4}
            opacity={i === 0 ? 0.8 : 0.5}
          />
        );
      })}

      {/* Asc 표식 */}
      <line
        x1={pos(chart.ascLon, R_HUB).x}
        y1={pos(chart.ascLon, R_HUB).y}
        x2={pos(chart.ascLon, R_OUT).x}
        y2={pos(chart.ascLon, R_OUT).y}
        stroke={GOLD}
        strokeWidth="0.7"
      />
      <text x="3" y="50" fontSize="2.8" fill={GOLD} dominantBaseline="central">Asc</text>

      {/* 출생 행성 (안쪽, 크림) */}
      {natal.map((p) => {
        const pt = pos(p.lon, p.r);
        return (
          <text key={p.key} x={pt.x} y={pt.y} fontSize="3.4" fill={CREAM} textAnchor="middle" dominantBaseline="central">
            {p.glyph}
          </text>
        );
      })}

      {/* 트랜짓 행성 (바깥, 청색광) */}
      {transit.map((p) => {
        const pt = pos(p.lon, p.r);
        return (
          <g key={p.key}>
            <circle cx={pt.x} cy={pt.y} r="2.6" fill="#0c0a26" opacity="0.7" />
            <text x={pt.x} y={pt.y} fontSize="3.3" fill={TRANSIT_C} textAnchor="middle" dominantBaseline="central">
              {p.glyph}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
