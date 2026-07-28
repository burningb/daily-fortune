// 트랜짓 중요도 점수 → 핵심 신호 1~3개 선정 (스펙 §9)

import {
  TRANSIT_WEIGHT,
  NATAL_WEIGHT,
  ASPECT_WEIGHT,
  type AspectKey,
} from "./astro-config";
import type { TransitAspect, TransitData } from "./transit";

export type ScoredAspect = TransitAspect & { score: number };

const OUTER = ["saturn", "uranus", "neptune", "pluto"];

export function scoreAspect(a: TransitAspect): number {
  const tw = TRANSIT_WEIGHT[a.transit] ?? 3;
  const nw = NATAL_WEIGHT[a.natal] ?? 3;
  const aw = ASPECT_WEIGHT[a.aspectKey as AspectKey] ?? 3;
  const orbScore = Math.max(0, (a.allowedOrb - a.orb) / a.allowedOrb) * 10;
  const applyingBonus = a.applying ? 2 : 0;
  return tw + nw + aw + orbScore + applyingBonus;
}

export type EmotionalWeather = {
  moonSignName: string;
  moonHouse: number | null;
  phase: string;
  topAspect: ScoredAspect | null;
};

export type RankedSignals = {
  main: ScoredAspect | null;
  supporting: ScoredAspect[];
  emotional: EmotionalWeather;
  background: ScoredAspect | null;
};

export function rankSignals(data: TransitData): RankedSignals {
  const scored: ScoredAspect[] = data.aspects
    .map((a) => ({ ...a, score: scoreAspect(a) }))
    .sort((x, y) => y.score - x.score);

  // 메인/보조: 달 트랜짓 제외(달은 감정 날씨로)
  const nonMoon = scored.filter((a) => a.transit !== "moon");
  const main = nonMoon[0] ?? null;

  const supporting: ScoredAspect[] = [];
  const usedTransit = new Set(main ? [main.transit] : []);
  const usedNatal = new Set(main ? [main.natal] : []);
  for (const a of nonMoon.slice(1)) {
    if (usedTransit.has(a.transit) || usedNatal.has(a.natal)) continue;
    supporting.push(a);
    usedTransit.add(a.transit);
    usedNatal.add(a.natal);
    if (supporting.length >= 2) break;
  }

  // 감정 날씨: 달
  const moon = data.transitPlanets.find((p) => p.key === "moon")!;
  const moonAspects = scored
    .filter((a) => a.transit === "moon")
    .sort((x, y) => y.score - x.score);
  const emotional: EmotionalWeather = {
    moonSignName: moon.signName,
    moonHouse: moon.house,
    phase: data.moonPhase.name,
    topAspect: moonAspects[0] ?? null,
  };

  // 장기 배경: 외행성 중 최강 각
  const background = scored.find((a) => OUTER.includes(a.transit)) ?? null;

  return { main, supporting, emotional, background };
}
