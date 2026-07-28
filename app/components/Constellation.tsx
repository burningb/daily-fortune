import {
  CONSTELLATIONS,
  SCATTER_STARS,
  projectConstellation,
  magToRadius,
} from "@/lib/constellations";

const GOLD = "#e9c877";
const CREAM = "#fff7e0";

export default function Constellation({
  signKey,
  className,
}: {
  signKey: string;
  className?: string;
}) {
  const data = CONSTELLATIONS[signKey];
  if (!data) return null;

  const { points, lines } = projectConstellation(data);
  const gid = `glow-${signKey}`;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <filter id={gid} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 성도(星圖) 배경 — 희미한 동심원과 십자 격자 */}
      <g stroke={GOLD} fill="none">
        <circle cx="50" cy="50" r="47" opacity="0.12" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="33" opacity="0.09" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="19" opacity="0.07" strokeWidth="0.4" />
        <line x1="50" y1="3" x2="50" y2="97" opacity="0.05" strokeWidth="0.4" />
        <line x1="3" y1="50" x2="97" y2="50" opacity="0.05" strokeWidth="0.4" />
      </g>

      {/* 흩뿌린 잔별 */}
      <g fill={CREAM}>
        {SCATTER_STARS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity="0.45" />
        ))}
      </g>

      {/* 별자리 연결선 */}
      <g stroke={GOLD} strokeWidth="0.65" strokeLinecap="round" opacity="0.6">
        {lines.map(([a, b], i) => (
          <line
            key={i}
            x1={points[a].x}
            y1={points[a].y}
            x2={points[b].x}
            y2={points[b].y}
          />
        ))}
      </g>

      {/* 별 — 겉보기 등급에 따라 크기·광채가 달라지고, 은은하게 반짝인다 */}
      <g filter={`url(#${gid})`}>
        {points.map((p, i) => {
          const r = magToRadius(p.mag);
          return (
            <g
              key={i}
              className="cst-star"
              style={{ animationDelay: `${((i * 0.7) % 3.5).toFixed(2)}s` }}
            >
              <circle cx={p.x} cy={p.y} r={r * 1.9} fill={GOLD} opacity="0.28" />
              <circle cx={p.x} cy={p.y} r={r} fill={GOLD} opacity="0.55" />
              <circle cx={p.x} cy={p.y} r={r * 0.5} fill={CREAM} />
            </g>
          );
        })}
      </g>

      {/* 밝은 별 이름 라벨 (은은하게) */}
      <g fill={GOLD} className="cst-label">
        {points.map((p, i) => {
          if (!p.name) return null;
          const r = magToRadius(p.mag);
          const anchor = p.x < 24 ? "start" : p.x > 76 ? "end" : "middle";
          const below = p.y < 24;
          const ty = below ? p.y + r * 1.9 + 4.2 : p.y - r * 1.9 - 2.4;
          const tx = Math.min(96, Math.max(4, p.x));
          return (
            <text
              key={i}
              x={tx}
              y={ty}
              textAnchor={anchor}
              fontSize="3.5"
              letterSpacing="0.2"
              opacity="0.72"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              {p.name}
            </text>
          );
        })}
      </g>
    </svg>
  );
}
