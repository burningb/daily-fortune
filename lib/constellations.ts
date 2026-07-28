// 12황도 별자리를 실제 항성 데이터로 그린다.
// 각 별은 적경(ra, degree)·적위(dec, degree)·겉보기 등급(mag)을 가지며,
// projectConstellation()이 이를 카드 안 2D 좌표로 정확히 투영한다.

export type Star = { ra: number; dec: number; mag: number };

export type Constellation = {
  stars: Star[];
  lines: [number, number][]; // IAU 성좌 형태(별 인덱스 쌍)
};

export const CONSTELLATIONS: Record<string, Constellation> = {
  // 양자리
  aries: {
    stars: [
      { ra: 31.793, dec: 23.462, mag: 2.01 }, // 0 Hamal
      { ra: 28.66, dec: 20.808, mag: 2.64 }, // 1 Sheratan
      { ra: 28.383, dec: 19.294, mag: 3.88 }, // 2 Mesarthim
      { ra: 42.671, dec: 27.261, mag: 3.61 }, // 3 Bharani
    ],
    lines: [
      [2, 1],
      [1, 0],
      [0, 3],
    ],
  },

  // 황소자리
  taurus: {
    stars: [
      { ra: 68.98, dec: 16.509, mag: 0.85 }, // 0 Aldebaran
      { ra: 81.573, dec: 28.607, mag: 1.65 }, // 1 Elnath
      { ra: 84.411, dec: 21.143, mag: 3.0 }, // 2 ζ Tau
      { ra: 64.948, dec: 15.628, mag: 3.65 }, // 3 γ Tau
      { ra: 65.734, dec: 17.542, mag: 3.76 }, // 4 δ Tau
      { ra: 67.154, dec: 19.18, mag: 3.53 }, // 5 ε Tau
      { ra: 60.17, dec: 12.49, mag: 3.41 }, // 6 λ Tau
    ],
    lines: [
      [6, 3],
      [3, 4],
      [4, 5],
      [5, 1],
      [0, 4],
      [0, 2],
    ],
  },

  // 쌍둥이자리
  gemini: {
    stars: [
      { ra: 113.65, dec: 31.888, mag: 1.58 }, // 0 Castor
      { ra: 116.329, dec: 28.026, mag: 1.16 }, // 1 Pollux
      { ra: 99.428, dec: 16.399, mag: 1.93 }, // 2 Alhena
      { ra: 95.74, dec: 22.514, mag: 2.87 }, // 3 μ Tejat
      { ra: 100.983, dec: 25.131, mag: 2.98 }, // 4 ε Mebsuta
      { ra: 106.027, dec: 20.57, mag: 3.9 }, // 5 ζ Mekbuda
      { ra: 110.031, dec: 21.982, mag: 3.53 }, // 6 δ Wasat
      { ra: 93.719, dec: 22.507, mag: 3.28 }, // 7 η Propus
      { ra: 109.523, dec: 16.54, mag: 3.58 }, // 8 λ Gem
      { ra: 116.112, dec: 24.398, mag: 3.57 }, // 9 κ Gem
    ],
    lines: [
      [0, 1],
      [0, 4],
      [4, 3],
      [3, 7],
      [1, 6],
      [6, 5],
      [5, 8],
      [8, 2],
      [6, 9],
    ],
  },

  // 게자리
  cancer: {
    stars: [
      { ra: 124.129, dec: 9.186, mag: 3.5 }, // 0 β Tarf
      { ra: 131.171, dec: 18.154, mag: 3.94 }, // 1 δ Asellus Aus.
      { ra: 130.821, dec: 21.469, mag: 4.66 }, // 2 γ Asellus Bor.
      { ra: 131.674, dec: 28.76, mag: 4.02 }, // 3 ι Cnc
      { ra: 134.622, dec: 11.858, mag: 4.26 }, // 4 α Acubens
    ],
    lines: [
      [3, 2],
      [2, 1],
      [1, 0],
      [1, 4],
    ],
  },

  // 사자자리
  leo: {
    stars: [
      { ra: 152.093, dec: 11.967, mag: 1.36 }, // 0 Regulus
      { ra: 177.265, dec: 14.572, mag: 2.14 }, // 1 Denebola
      { ra: 154.993, dec: 19.842, mag: 2.08 }, // 2 Algieba
      { ra: 168.527, dec: 20.524, mag: 2.56 }, // 3 Zosma
      { ra: 146.463, dec: 23.774, mag: 2.98 }, // 4 ε Ras Elased
      { ra: 167.416, dec: 15.43, mag: 3.32 }, // 5 θ Chertan
      { ra: 151.833, dec: 16.763, mag: 3.48 }, // 6 η Leo
      { ra: 154.173, dec: 23.417, mag: 3.43 }, // 7 ζ Adhafera
      { ra: 148.19, dec: 26.007, mag: 3.88 }, // 8 μ Rasalas
    ],
    lines: [
      [0, 6],
      [6, 2],
      [2, 7],
      [7, 8],
      [8, 4],
      [2, 3],
      [3, 1],
      [1, 5],
      [5, 0],
    ],
  },

  // 처녀자리
  virgo: {
    stars: [
      { ra: 201.298, dec: -11.161, mag: 0.98 }, // 0 Spica
      { ra: 177.674, dec: 1.765, mag: 3.6 }, // 1 β Zavijava
      { ra: 190.415, dec: -1.449, mag: 2.74 }, // 2 γ Porrima
      { ra: 193.901, dec: 3.398, mag: 3.39 }, // 3 δ Auva
      { ra: 195.544, dec: 10.959, mag: 2.83 }, // 4 ε Vindemiatrix
      { ra: 203.673, dec: -0.596, mag: 3.37 }, // 5 ζ Heze
      { ra: 184.977, dec: -0.667, mag: 3.89 }, // 6 η Zaniah
      { ra: 214.004, dec: -6.0, mag: 4.08 }, // 7 ι Syrma
    ],
    lines: [
      [4, 3],
      [3, 2],
      [2, 6],
      [6, 1],
      [3, 5],
      [5, 0],
      [5, 7],
    ],
  },

  // 천칭자리
  libra: {
    stars: [
      { ra: 222.72, dec: -16.042, mag: 2.75 }, // 0 Zubenelgenubi
      { ra: 229.252, dec: -9.383, mag: 2.61 }, // 1 Zubeneschamali
      { ra: 233.881, dec: -14.789, mag: 3.91 }, // 2 Zubenelakrab
      { ra: 226.017, dec: -25.281, mag: 3.29 }, // 3 σ Brachium
    ],
    lines: [
      [1, 0],
      [1, 2],
      [2, 0],
      [0, 3],
    ],
  },

  // 전갈자리
  scorpio: {
    stars: [
      { ra: 247.352, dec: -26.432, mag: 1.06 }, // 0 Antares
      { ra: 241.359, dec: -19.805, mag: 2.6 }, // 1 β Graffias
      { ra: 240.083, dec: -22.622, mag: 2.29 }, // 2 δ Dschubba
      { ra: 239.713, dec: -26.114, mag: 2.89 }, // 3 π Sco
      { ra: 245.297, dec: -25.593, mag: 2.9 }, // 4 σ Sco
      { ra: 248.971, dec: -28.216, mag: 2.82 }, // 5 τ Sco
      { ra: 252.541, dec: -34.293, mag: 2.29 }, // 6 ε Sco
      { ra: 253.084, dec: -38.017, mag: 3.0 }, // 7 μ Sco
      { ra: 253.499, dec: -42.36, mag: 3.6 }, // 8 ζ Sco
      { ra: 258.038, dec: -43.239, mag: 3.33 }, // 9 η Sco
      { ra: 264.33, dec: -42.998, mag: 1.86 }, // 10 θ Sargas
      { ra: 266.896, dec: -40.127, mag: 3.03 }, // 11 ι Sco
      { ra: 265.622, dec: -39.03, mag: 2.39 }, // 12 κ Sco
      { ra: 263.402, dec: -37.104, mag: 1.62 }, // 13 λ Shaula
      { ra: 262.691, dec: -37.296, mag: 2.7 }, // 14 υ Lesath
    ],
    lines: [
      [3, 2],
      [2, 1],
      [2, 4],
      [4, 0],
      [0, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
      [10, 12],
      [12, 13],
      [13, 14],
      [10, 11],
    ],
  },

  // 사수자리 (찻주전자)
  sagittarius: {
    stars: [
      { ra: 271.452, dec: -30.424, mag: 2.98 }, // 0 γ Alnasl
      { ra: 276.043, dec: -34.385, mag: 1.79 }, // 1 ε Kaus Australis
      { ra: 275.248, dec: -29.828, mag: 2.7 }, // 2 δ Kaus Media
      { ra: 276.993, dec: -25.421, mag: 2.81 }, // 3 λ Kaus Borealis
      { ra: 281.414, dec: -26.99, mag: 3.17 }, // 4 φ Sgr
      { ra: 283.816, dec: -26.297, mag: 2.05 }, // 5 σ Nunki
      { ra: 286.171, dec: -27.67, mag: 3.32 }, // 6 τ Sgr
      { ra: 285.653, dec: -29.88, mag: 2.6 }, // 7 ζ Ascella
    ],
    lines: [
      [0, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [2, 1],
      [1, 7],
      [7, 5],
      [5, 6],
      [6, 7],
    ],
  },

  // 염소자리
  capricorn: {
    stars: [
      { ra: 304.514, dec: -12.545, mag: 3.57 }, // 0 α Algedi
      { ra: 305.253, dec: -14.781, mag: 3.05 }, // 1 β Dabih
      { ra: 311.523, dec: -25.271, mag: 4.13 }, // 2 ψ Cap
      { ra: 312.955, dec: -26.919, mag: 4.11 }, // 3 ω Cap
      { ra: 326.76, dec: -16.127, mag: 2.85 }, // 4 δ Deneb Algedi
      { ra: 325.023, dec: -16.662, mag: 3.69 }, // 5 γ Nashira
      { ra: 321.667, dec: -22.411, mag: 3.74 }, // 6 ζ Cap
      { ra: 316.487, dec: -17.233, mag: 4.07 }, // 7 θ Cap
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 6],
      [6, 4],
      [4, 5],
      [5, 7],
      [7, 0],
    ],
  },

  // 물병자리
  aquarius: {
    stars: [
      { ra: 322.89, dec: -5.571, mag: 2.9 }, // 0 β Sadalsuud
      { ra: 331.446, dec: -0.32, mag: 2.95 }, // 1 α Sadalmelik
      { ra: 335.414, dec: -1.387, mag: 3.85 }, // 2 γ Sadachbia
      { ra: 337.208, dec: -0.019, mag: 3.65 }, // 3 ζ Aqr
      { ra: 338.839, dec: -0.117, mag: 4.02 }, // 4 η Aqr
      { ra: 343.663, dec: -15.821, mag: 3.27 }, // 5 δ Skat
      { ra: 344.412, dec: -7.58, mag: 3.73 }, // 6 λ Aqr
      { ra: 348.6, dec: -6.05, mag: 4.22 }, // 7 φ Aqr
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [3, 6],
      [6, 5],
      [6, 7],
    ],
  },

  // 물고기자리 (적경 0h를 넘는 별자리 — 투영에서 wrap 처리)
  pisces: {
    stars: [
      { ra: 30.512, dec: 2.764, mag: 3.82 }, // 0 α Alrescha (매듭)
      { ra: 22.871, dec: 15.346, mag: 3.62 }, // 1 η Alpherg (북쪽 물고기)
      { ra: 349.29, dec: 3.282, mag: 3.7 }, // 2 γ Psc
      { ra: 5.535, dec: 6.863, mag: 4.03 }, // 3 ω Psc
      { ra: 5.628, dec: 5.616, mag: 4.13 }, // 4 ι Psc
      { ra: 349.5, dec: 6.38, mag: 4.28 }, // 5 θ Psc
      { ra: 15.66, dec: 7.89, mag: 4.27 }, // 6 ε Psc
      { ra: 11.34, dec: 7.585, mag: 4.43 }, // 7 δ Psc
      { ra: 27.72, dec: 5.49, mag: 4.44 }, // 8 ν Psc
      { ra: 26.6, dec: 9.16, mag: 4.26 }, // 9 ο Psc
    ],
    lines: [
      [2, 5],
      [5, 4],
      [4, 3],
      [3, 2],
      [3, 7],
      [7, 6],
      [6, 8],
      [8, 0],
      [0, 9],
      [9, 1],
    ],
  },
};

export type ProjectedPoint = { x: number; y: number; mag: number };

// 실제 적경·적위를 카드 안(0~100) 좌표로 투영. 형태 왜곡이 없도록 등비 스케일.
export function projectConstellation(
  c: Constellation,
  size = 100,
  pad = 17,
): { points: ProjectedPoint[]; lines: [number, number][] } {
  let ras = c.stars.map((s) => s.ra);
  // 적경 0h(=360°)를 가로지르는 경우 연속되도록 보정
  if (Math.max(...ras) - Math.min(...ras) > 180) {
    ras = ras.map((r) => (r < 180 ? r + 360 : r));
  }
  const meanDec =
    c.stars.reduce((sum, s) => sum + s.dec, 0) / c.stars.length;
  const cosDec = Math.cos((meanDec * Math.PI) / 180);

  // 하늘을 올려다본 방향: 적경 증가 → 왼쪽, 적위 증가 → 위쪽
  const xs = ras.map((r) => -r * cosDec);
  const ys = c.stars.map((s) => -s.dec);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const scale = (size - 2 * pad) / Math.max(w, h);

  const offX = (size - w * scale) / 2 - minX * scale;
  const offY = (size - h * scale) / 2 - minY * scale;

  const points = c.stars.map((s, i) => ({
    x: xs[i] * scale + offX,
    y: ys[i] * scale + offY,
    mag: s.mag,
  }));

  return { points, lines: c.lines };
}

// 겉보기 등급 → 별 반지름 (밝을수록 큼)
export function magToRadius(mag: number): number {
  return Math.max(1.0, 2.9 - Math.max(0, mag - 1) * 0.42);
}

// 배경 장식용 흩뿌린 잔별(고정 좌표)
export const SCATTER_STARS: [number, number, number][] = [
  [12, 18, 0.6],
  [22, 62, 0.5],
  [15, 84, 0.7],
  [86, 20, 0.6],
  [90, 55, 0.5],
  [80, 82, 0.7],
  [50, 9, 0.5],
  [66, 14, 0.55],
  [8, 44, 0.5],
  [92, 74, 0.6],
  [34, 90, 0.5],
  [72, 92, 0.55],
];
