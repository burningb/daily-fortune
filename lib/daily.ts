// 오늘의 날씨 오케스트레이터 — 계산(트랜짓·랭킹·에너지)과 해석(템플릿)을 조립.

import type { NatalChart } from "./astrology";
import { computeTransit, type TransitPlanet } from "./transit";
import { rankSignals, type RankedSignals } from "./ranking";
import { computeEnergy, type Meter } from "./energy";
import { interpret, type DailyReport } from "./interpret";

export type DailyBundle = {
  report: DailyReport;
  energy: Meter[];
  transitPlanets: TransitPlanet[];
  moonPhaseName: string;
  ranked: RankedSignals;
};

// chart: 출생차트, tz: 현재(오늘 기준) 위치의 UTC 오프셋, today: 오늘 날짜
export function buildDaily(
  chart: NatalChart,
  tz: number,
  today: Date,
): DailyBundle {
  const natalPoints = [
    ...chart.planets.map((p) => ({ key: p.key, name: p.name, lon: p.lon })),
    { key: "asc", name: "상승궁", lon: chart.ascLon },
    { key: "mc", name: "천정", lon: chart.mcLon },
  ];

  const transit = computeTransit(
    natalPoints,
    chart.ascSignIndex,
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
    tz,
  );

  const ranked = rankSignals(transit);
  const energy = computeEnergy(transit);
  const report = interpret(ranked, energy);

  return {
    report,
    energy,
    transitPlanets: transit.transitPlanets,
    moonPhaseName: transit.moonPhase.name,
    ranked,
  };
}
