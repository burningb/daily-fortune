// 오늘의 트랜짓 계산 — 정량 데이터만 반환(해석과 분리, 스펙 §8.3)

import { computeBodies } from "./ephemeris";
import { PLANET_META, SIGNS } from "./astrology";
import { ASPECTS, ORB_BY_TRANSIT } from "./astro-config";

export type NatalPoint = { key: string; name: string; lon: number };

export type TransitPlanet = {
  key: string;
  name: string;
  glyph: string;
  lon: number;
  signIndex: number;
  signName: string;
  degInSign: number;
  house: number | null;
  retrograde: boolean;
};

export type TransitAspect = {
  transit: string; // 트랜짓 천체 key
  natal: string; // 출생 포인트 key
  natalName: string;
  aspectKey: string;
  aspectKo: string;
  glyph: string;
  nature: string; // 결합/조화/긴장
  angle: number;
  orb: number;
  allowedOrb: number;
  applying: boolean;
  transitHouse: number | null;
  retrograde: boolean;
};

export type MoonPhase = { name: string; illumination: number };

export type TransitData = {
  transitPlanets: TransitPlanet[];
  aspects: TransitAspect[];
  moonPhase: MoonPhase;
};

const rev = (x: number) => ((x % 360) + 360) % 360;
const sep = (a: number, b: number) => {
  const d = Math.abs(rev(a) - rev(b));
  return Math.min(d, 360 - d);
};

const MOON_PHASES = [
  "신월",
  "초승달",
  "상현달",
  "상현 볼록달",
  "보름달",
  "하현 볼록달",
  "하현달",
  "그믐달",
];

function moonPhase(sunLon: number, moonLon: number): MoonPhase {
  const elong = rev(moonLon - sunLon);
  const idx = Math.floor(((elong + 22.5) % 360) / 45);
  const illum = (1 - Math.cos(elong * (Math.PI / 180))) / 2;
  return { name: MOON_PHASES[idx], illumination: illum };
}

// 오늘(현지 정오 기준)의 트랜짓. tz=현재 위치 UTC 오프셋.
export function computeTransit(
  natalPoints: NatalPoint[],
  natalAscSignIndex: number | null,
  year: number,
  month: number,
  day: number,
  tz: number,
): TransitData {
  const utNoon = 12 - tz;
  const today = computeBodies(year, month, day, utNoon);
  const tomorrow = computeBodies(year, month, day, utNoon + 24);

  const transitPlanets: TransitPlanet[] = PLANET_META.map((p) => {
    const lon = today[p.key as keyof typeof today];
    const signIndex = Math.floor(lon / 30) % 12;
    const lonT = tomorrow[p.key as keyof typeof tomorrow];
    // 역행: 하루 뒤 황경이 뒤로 가면(모듈러 차이 > 180) 역행
    const retrograde =
      p.key !== "sun" && p.key !== "moon" && rev(lonT - lon) > 180;
    const house =
      natalAscSignIndex != null
        ? ((signIndex - natalAscSignIndex + 12) % 12) + 1
        : null;
    return {
      key: p.key,
      name: p.name,
      glyph: p.glyph,
      lon,
      signIndex,
      signName: SIGNS[signIndex].name,
      degInSign: lon - signIndex * 30,
      house,
      retrograde,
    };
  });

  const aspects: TransitAspect[] = [];
  for (const tp of transitPlanets) {
    const allowed = ORB_BY_TRANSIT[tp.key] ?? 4;
    const lonT = tomorrow[tp.key as keyof typeof tomorrow];
    for (const np of natalPoints) {
      // 가장 정확한 각 하나 선택
      let best: (typeof ASPECTS)[number] | null = null;
      let bestOrb = Infinity;
      for (const asp of ASPECTS) {
        const orb = Math.abs(sep(tp.lon, np.lon) - asp.angle);
        if (orb <= allowed && orb < bestOrb) {
          best = asp;
          bestOrb = orb;
        }
      }
      if (!best) continue;
      const orbTomorrow = Math.abs(sep(lonT, np.lon) - best.angle);
      aspects.push({
        transit: tp.key,
        natal: np.key,
        natalName: np.name,
        aspectKey: best.key,
        aspectKo: best.ko,
        glyph: best.glyph,
        nature: best.nature,
        angle: best.angle,
        orb: bestOrb,
        allowedOrb: allowed,
        applying: orbTomorrow < bestOrb,
        transitHouse: tp.house,
        retrograde: tp.retrograde,
      });
    }
  }

  const moon = today.moon;
  const sun = today.sun;
  return { transitPlanets, aspects, moonPhase: moonPhase(sun, moon) };
}
