import { CONSTELLATIONS, SCATTER_STARS } from "@/lib/constellations";

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

  // 각 인스턴스가 고유한 filter id를 갖도록 (한 화면에 여러 개여도 안전)
  const gid = `glow-${signKey}`;

  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <filter id={gid} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 성도(星圖) 배경 — 희미한 동심원과 격자 */}
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
          <circle key={i} cx={x} cy={y} r={r} opacity="0.5" />
        ))}
      </g>

      {/* 별자리 연결선 */}
      <g stroke={GOLD} strokeWidth="0.7" strokeLinecap="round" opacity="0.65">
        {data.lines.map(([a, b], i) => {
          const [x1, y1] = data.points[a];
          const [x2, y2] = data.points[b];
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>

      {/* 별 */}
      <g filter={`url(#${gid})`}>
        {data.points.map(([x, y], i) => {
          const isBright = data.bright.includes(i);
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isBright ? 3.4 : 2.2}
                fill={GOLD}
                opacity="0.35"
              />
              <circle cx={x} cy={y} r={isBright ? 1.7 : 1.1} fill={CREAM} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
