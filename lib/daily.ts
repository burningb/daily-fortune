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

// 사인 거리(0~6) → 관계 성격
const REL_NATURE = ["겹침", "전환", "조화", "긴장", "조화", "조정", "균형"];
function relNature(a: number, b: number): string {
  const d = Math.abs(a - b);
  return REL_NATURE[Math.min(d, 12 - d)];
}

// 달의 관계 성격 → 감정 뉘앙스 한 줄
const MOON_NUANCE: Record<string, string> = {
  겹침: "감정이 또렷해지니 마음의 신호를 살펴보세요.",
  전환: "기분의 결이 바뀔 수 있으니 가볍게 넘겨보세요.",
  조화: "마음이 비교적 편안해 흐름을 타기 좋아요.",
  긴장: "감정이 예민해질 수 있으니 한 박자 쉬어가세요.",
  조정: "마음이 조금 어수선해도 억지로 정리하지 마세요.",
  균형: "타인의 기분에 휩쓸리지 않도록 나를 먼저 살펴보세요.",
};

const WINDOW_FRAMES = [
  { hour: 9, period: "아침", label: "감각 설정", frame: "외부의 요구보다 나의 컨디션을 먼저 확인하기 좋은 시간입니다." },
  { hour: 15, period: "오후", label: "행동 구간", frame: "실행과 대화에 힘이 실리는 구간입니다." },
  { hour: 21, period: "저녁", label: "통합 구간", frame: "하루를 정리하고 감정을 가라앉히는 시간입니다." },
];

// 달의 이동을 바탕으로 아침·오후·저녁의 흐름을 만든다 (스펙 §19)
function buildTimeWindows(
  natalSunIndex: number,
  tz: number,
  today: Date,
): TimeWindow[] {
  return WINDOW_FRAMES.map((w) => {
    const bodies = computeBodies(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
      w.hour - tz,
    );
    const moonIdx = Math.floor(bodies.moon / 30) % 12;
    const nature = relNature(natalSunIndex, moonIdx);
    return {
      period: w.period,
      label: w.label,
      moonSign: SIGNS[moonIdx].name,
      text: `달이 ${SIGNS[moonIdx].name}에 머무는 ${w.period}. ${w.frame} ${
        MOON_NUANCE[nature] ?? ""
      }`,
    };
  });
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

  const natalSunIndex =
    Math.floor((chart.planets.find((p) => p.key === "sun")?.lon ?? 0) / 30) % 12;
  const timeWindows = buildTimeWindows(natalSunIndex, tz, today);

  return {
    report,
    energy,
    transitPlanets: transit.transitPlanets,
    moonPhaseName: transit.moonPhase.name,
    ranked,
    timeWindows,
  };
}
