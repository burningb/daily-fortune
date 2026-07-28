// 저·중정밀 천체력 (Paul Schlyter 알고리즘).
// 태양·달·수성~명왕성의 지구중심 황경(黃經, degree)을 계산한다.
// 별자리+도수 표기용으로 실제 이페메리스와 ±0.5° 이내로 일치(1800~2100 유효).

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const sin = (x: number) => Math.sin(x * RAD);
const cos = (x: number) => Math.cos(x * RAD);
const atan2 = (y: number, x: number) => Math.atan2(y, x) * DEG;
const rev = (x: number) => ((x % 360) + 360) % 360;

// 2000-01-00 0:00 UT 기준 경과일
function dayNumber(y: number, m: number, d: number, utHour: number): number {
  const n =
    367 * y -
    Math.floor((7 * (y + Math.floor((m + 9) / 12))) / 4) +
    Math.floor((275 * m) / 9) +
    d -
    730530;
  return n + utHour / 24;
}

function eccAnom(M: number, e: number): number {
  let E = M + DEG * e * sin(M) * (1 + e * cos(M));
  for (let i = 0; i < 10; i++) {
    const dE = (E - DEG * e * sin(E) - M) / (1 - e * cos(E));
    E -= dE;
    if (Math.abs(dE) < 1e-6) break;
  }
  return E;
}

type Elements = {
  N: (d: number) => number;
  i: (d: number) => number;
  w: (d: number) => number;
  a: (d: number) => number;
  e: (d: number) => number;
  M: (d: number) => number;
};

const EL: Record<string, Elements> = {
  mercury: { N: (d) => 48.3313 + 3.24587e-5 * d, i: (d) => 7.0047 + 5.0e-8 * d, w: (d) => 29.1241 + 1.01444e-5 * d, a: () => 0.387098, e: (d) => 0.205635 + 5.59e-10 * d, M: (d) => 168.6562 + 4.0923344368 * d },
  venus: { N: (d) => 76.6799 + 2.4659e-5 * d, i: (d) => 3.3946 + 2.75e-8 * d, w: (d) => 54.891 + 1.38374e-5 * d, a: () => 0.72333, e: (d) => 0.006773 - 1.302e-9 * d, M: (d) => 48.0052 + 1.6021302244 * d },
  mars: { N: (d) => 49.5574 + 2.11081e-5 * d, i: (d) => 1.8497 - 1.78e-8 * d, w: (d) => 286.5016 + 2.92961e-5 * d, a: () => 1.523688, e: (d) => 0.093405 + 2.516e-9 * d, M: (d) => 18.6021 + 0.5240207766 * d },
  jupiter: { N: (d) => 100.4542 + 2.76854e-5 * d, i: (d) => 1.303 - 1.557e-7 * d, w: (d) => 273.8777 + 1.64505e-5 * d, a: () => 5.20256, e: (d) => 0.048498 + 4.469e-9 * d, M: (d) => 19.895 + 0.0830853001 * d },
  saturn: { N: (d) => 113.6634 + 2.3898e-5 * d, i: (d) => 2.4886 - 1.081e-7 * d, w: (d) => 339.3939 + 2.97661e-5 * d, a: () => 9.55475, e: (d) => 0.055546 - 9.499e-9 * d, M: (d) => 316.967 + 0.0334442282 * d },
  uranus: { N: (d) => 74.0005 + 1.3978e-5 * d, i: (d) => 0.7733 + 1.9e-8 * d, w: (d) => 96.6612 + 3.0565e-5 * d, a: (d) => 19.18171 - 1.55e-8 * d, e: (d) => 0.047318 + 7.45e-9 * d, M: (d) => 142.5905 + 0.011725806 * d },
  neptune: { N: (d) => 131.7806 + 3.0173e-5 * d, i: (d) => 1.77 - 2.55e-7 * d, w: (d) => 272.8461 - 6.027e-6 * d, a: (d) => 30.05826 + 3.313e-8 * d, e: (d) => 0.008606 + 2.15e-9 * d, M: (d) => 260.2471 + 0.005995147 * d },
};

function sunPos(d: number) {
  const w = 282.9404 + 4.70935e-5 * d;
  const e = 0.016709 - 1.151e-9 * d;
  const M = rev(356.047 + 0.9856002585 * d);
  const E = M + DEG * e * sin(M) * (1 + e * cos(M));
  const xv = cos(E) - e;
  const yv = Math.sqrt(1 - e * e) * sin(E);
  const v = atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const lon = rev(v + w);
  return { lon, r, M, w, xs: r * cos(lon), ys: r * sin(lon) };
}

function moonLon(d: number, sun: ReturnType<typeof sunPos>): number {
  const N = rev(125.1228 - 0.0529538083 * d);
  const i = 5.1454;
  const w = rev(318.0634 + 0.1643573223 * d);
  const a = 60.2666;
  const e = 0.0549;
  const M = rev(115.3654 + 13.0649929509 * d);
  const E = eccAnom(M, e);
  const xv = a * (cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sin(E);
  const v = atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const xh = r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i));
  const yh = r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i));
  let lon = rev(atan2(yh, xh));

  // 주요 섭동(evection, variation 등)
  const Ls = rev(sun.M + sun.w);
  const Lm = rev(N + w + M);
  const Ms = sun.M;
  const Mm = M;
  const D = rev(Lm - Ls);
  const F = rev(Lm - N);
  lon +=
    -1.274 * sin(Mm - 2 * D) +
    0.658 * sin(2 * D) -
    0.186 * sin(Ms) -
    0.059 * sin(2 * Mm - 2 * D) -
    0.057 * sin(Mm - 2 * D + Ms) +
    0.053 * sin(Mm + 2 * D) +
    0.046 * sin(2 * D - Ms) +
    0.041 * sin(Mm - Ms) -
    0.035 * sin(D) -
    0.031 * sin(Mm + Ms) -
    0.015 * sin(2 * F - 2 * D) +
    0.011 * sin(Mm - 4 * D);
  return rev(lon);
}

function planetLon(
  d: number,
  el: Elements,
  sun: ReturnType<typeof sunPos>,
): { lon: number; M: number } {
  const N = el.N(d);
  const i = el.i(d);
  const w = el.w(d);
  const a = el.a(d);
  const e = el.e(d);
  const M = rev(el.M(d));
  const E = eccAnom(M, e);
  const xv = a * (cos(E) - e);
  const yv = a * Math.sqrt(1 - e * e) * sin(E);
  const v = atan2(yv, xv);
  const r = Math.sqrt(xv * xv + yv * yv);
  const xh = r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i));
  const yh = r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i));
  const xg = xh + sun.xs;
  const yg = yh + sun.ys;
  return { lon: rev(atan2(yg, xg)), M };
}

function plutoLon(d: number): number {
  const S = 50.03 + 0.033459652 * d;
  const P = 238.95 + 0.003968789 * d;
  return rev(
    238.9508 +
      0.00400703 * d -
      19.799 * sin(P) +
      19.848 * cos(P) +
      0.897 * sin(2 * P) -
      4.956 * cos(2 * P) +
      0.61 * sin(3 * P) +
      1.211 * cos(3 * P) -
      0.341 * sin(4 * P) -
      0.19 * cos(4 * P) +
      0.128 * sin(5 * P) -
      0.034 * cos(5 * P) -
      0.038 * sin(6 * P) +
      0.031 * cos(6 * P) +
      0.02 * sin(S - P) -
      0.01 * cos(S - P),
  );
}

export const BODY_KEYS = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
] as const;

export type BodyKey = (typeof BODY_KEYS)[number];

// 지구중심 황경(0~360°)을 body별로 반환
export function computeBodies(
  year: number,
  month: number,
  day: number,
  utHour: number,
): Record<BodyKey, number> {
  const d = dayNumber(year, month, day, utHour);
  const sun = sunPos(d);

  const mer = planetLon(d, EL.mercury, sun);
  const ven = planetLon(d, EL.venus, sun);
  const mar = planetLon(d, EL.mars, sun);
  const jup = planetLon(d, EL.jupiter, sun);
  const sat = planetLon(d, EL.saturn, sun);
  const ura = planetLon(d, EL.uranus, sun);
  const nep = planetLon(d, EL.neptune, sun);

  // 외행성 상호섭동(Jupiter/Saturn/Uranus)
  const Mj = jup.M;
  const Msa = sat.M;
  const Mu = ura.M;
  const jupLon = rev(
    jup.lon -
      0.332 * sin(2 * Mj - 5 * Msa - 67.6) -
      0.056 * sin(2 * Mj - 2 * Msa + 21) +
      0.042 * sin(3 * Mj - 5 * Msa + 21) -
      0.036 * sin(Mj - 2 * Msa) +
      0.022 * cos(Mj - Msa) +
      0.023 * sin(2 * Mj - 3 * Msa + 52) -
      0.016 * sin(Mj - 5 * Msa - 69),
  );
  const satLon = rev(
    sat.lon +
      0.812 * sin(2 * Mj - 5 * Msa - 67.6) -
      0.229 * cos(2 * Mj - 4 * Msa - 2) +
      0.119 * sin(Mj - 2 * Msa - 3) +
      0.046 * sin(2 * Mj - 6 * Msa - 69) +
      0.014 * sin(Mj - 3 * Msa + 32),
  );
  const uraLon = rev(
    ura.lon +
      0.04 * sin(Msa - 2 * Mu + 6) +
      0.035 * sin(Msa - 3 * Mu + 33) -
      0.015 * sin(Mj - Mu + 20),
  );

  return {
    sun: sun.lon,
    moon: moonLon(d, sun),
    mercury: mer.lon,
    venus: ven.lon,
    mars: mar.lon,
    jupiter: jupLon,
    saturn: satLon,
    uranus: uraLon,
    neptune: nep.lon,
    pluto: plutoLon(d),
  };
}
