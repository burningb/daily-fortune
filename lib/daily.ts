// 오늘의 날씨 오케스트레이터 — 계산(트랜짓·랭킹·에너지)과 해석(템플릿)을 조립.

import { SIGNS, type NatalChart } from "./astrology";
import { computeBodies } from "./ephemeris";
import { computeTransit, type TransitPlanet } from "./transit";
import { rankSignals, type RankedSignals } from "./ranking";
import { computeEnergy, type Meter } from "./energy";
import { interpret, type DailyReport } from "./interpret";

export type TimeWindow = {
  period: string; // 아침 / 오후 / 저녁
  label: string; // 감각 설정 / 행동 구간 / 통합 구간
  moonSign: string;
  text: string;
};

export type DailyBundle = {
  report: DailyReport;
  energy: Meter[];
  transitPlanets: TransitPlanet[];
  moonPhaseName: string;
  ranked: RankedSignals;
  timeWindows: TimeWindow[];
};

// 아침·오후·저녁의 흐름 — 각 구간이 겹치지 않게 담백하게 (스펙 §19)
const WINDOW_FRAMES = [
  {
    hour: 9,
    period: "아침",
    label: "하루 열기",
    text: (sign: string) =>
      `달이 ${sign}에 머무는 아침이에요. 바깥 일정보다 나의 컨디션을 먼저 확인해보세요.`,
  },
  {
    hour: 15,
    period: "오후",
    label: "움직이기",
    text: () => "활동이 활발해지는 오후예요. 대화와 실행에 집중하되, 지나친 설명은 줄여보세요.",
  },
  {
    hour: 21,
    period: "저녁",
    label: "돌아보기",
    text: () => "하루를 정리하는 저녁이에요. 결론을 서두르기보다 오늘을 가볍게 돌아보고 쉬어가세요.",
  },
];

function buildTimeWindows(tz: number, today: Date): TimeWindow[] {
  const morningMoon = computeBodies(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
    9 - tz,
  );
  const morningSign = SIGNS[Math.floor(morningMoon.moon / 30) % 12].name;
  return WINDOW_FRAMES.map((w) => ({
    period: w.period,
    label: w.label,
    moonSign: morningSign,
    text: w.text(morningSign),
  }));
}

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

  const timeWindows = buildTimeWindows(tz, today);

  return {
    report,
    energy,
    transitPlanets: transit.transitPlanets,
    moonPhaseName: transit.moonPhase.name,
    ranked,
    timeWindows,
  };
}
