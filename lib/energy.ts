// 에너지 계기판 5축 (스펙 §12) — 길흉이 아니라 상태의 성격을 0~100으로.

import type { TransitData, TransitAspect } from "./transit";

export type Meter = { key: string; label: string; score: number; note: string };

const clamp = (x: number) => Math.max(2, Math.min(98, Math.round(x)));

const involves = (a: TransitAspect, k: string) => a.transit === k || a.natal === k;
const isTense = (a: TransitAspect) => a.nature === "긴장";
const isHarm = (a: TransitAspect) => a.nature === "조화";
const between = (a: TransitAspect, x: string, y: string) =>
  (a.transit === x && a.natal === y) || (a.transit === y && a.natal === x);

function bandNote(
  score: number,
  low: string,
  mid: string,
  high: string,
): string {
  if (score < 40) return low;
  if (score > 66) return high;
  return mid;
}

export function computeEnergy(data: TransitData): Meter[] {
  const A = data.aspects;
  const planets = data.transitPlanets;
  const inHouse = (h: number[]) =>
    planets.filter((p) => p.house != null && h.includes(p.house)).length;

  // 추진력
  let drive = 50;
  drive += A.filter((a) => involves(a, "mars")).length * 5;
  drive += A.filter((a) => between(a, "sun", "mars")).length * 8;
  drive += inHouse([1, 5, 10]) * 3;
  drive -= A.filter((a) => between(a, "saturn", "mars") && isTense(a)).length * 6;

  // 감정 민감도
  let sensitivity = 45;
  sensitivity += A.filter((a) => a.transit === "moon").length * 6;
  sensitivity += (planets.find((p) => p.key === "moon")?.house ?? 0) &&
    [4, 8, 12].includes(planets.find((p) => p.key === "moon")!.house ?? 0)
    ? 8
    : 0;
  sensitivity += A.filter((a) => between(a, "neptune", "moon")).length * 8;
  sensitivity += A.filter((a) => isTense(a)).length * 3;

  // 관계 개방도
  let openness = 50;
  openness += A.filter((a) => involves(a, "venus") || involves(a, "moon")).length * 4;
  openness += inHouse([7]) * 6;
  openness += A.filter((a) => between(a, "jupiter", "venus") && isHarm(a)).length * 8;
  openness -=
    A.filter((a) => (involves(a, "saturn") || involves(a, "pluto")) && isTense(a))
      .length * 6;

  // 집중력
  let focus = 50;
  focus += A.filter((a) => between(a, "mercury", "saturn") && isHarm(a)).length * 9;
  focus += inHouse([3, 6, 10]) * 4;
  focus -= A.filter((a) => between(a, "mercury", "neptune") && isTense(a)).length * 9;

  // 변화 압력
  let change = 40;
  change += A.filter((a) => involves(a, "uranus") || involves(a, "pluto")).length * 8;
  change += inHouse([8, 10, 12]) * 5;
  change +=
    A.filter(
      (a) =>
        ["uranus", "neptune", "pluto"].includes(a.transit) && a.orb < 1,
    ).length * 6;

  return [
    {
      key: "drive",
      label: "추진력",
      score: clamp(drive),
      note: bandNote(clamp(drive), "천천히 움직이는 흐름", "무리 없는 페이스", "행동이 빨라질 수 있음"),
    },
    {
      key: "sensitivity",
      label: "감정 민감도",
      score: clamp(sensitivity),
      note: bandNote(clamp(sensitivity), "감정이 비교적 안정적", "평소와 비슷한 결", "평소보다 예민하게 느껴질 수 있음"),
    },
    {
      key: "openness",
      label: "관계 개방도",
      score: clamp(openness),
      note: bandNote(clamp(openness), "혼자만의 시간이 편한 날", "선택적으로 열리는 날", "교류에 마음이 열리는 날"),
    },
    {
      key: "focus",
      label: "집중력",
      score: clamp(focus),
      note: bandNote(clamp(focus), "주의가 흩어지기 쉬움", "적당한 집중", "몰입이 잘 되는 날"),
    },
    {
      key: "changePressure",
      label: "변화 압력",
      score: clamp(change),
      note: bandNote(clamp(change), "현 상태를 유지하는 흐름", "가벼운 조정의 여지", "전환의 기운이 감지됨"),
    },
  ];
}
