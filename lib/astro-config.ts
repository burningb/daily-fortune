// 점성 설정값 — 오브/가중치를 한곳에서 조정 (스펙 §7.5, §9.2)

export const ASPECTS = [
  { key: "conjunction", ko: "합", glyph: "☌", angle: 0, nature: "결합" },
  { key: "sextile", ko: "육각", glyph: "⚹", angle: 60, nature: "조화" },
  { key: "square", ko: "사각", glyph: "□", angle: 90, nature: "긴장" },
  { key: "trine", ko: "삼각", glyph: "△", angle: 120, nature: "조화" },
  { key: "opposition", ko: "대칭", glyph: "☍", angle: 180, nature: "긴장" },
] as const;

export type AspectKey = (typeof ASPECTS)[number]["key"];

// 트랜짓(움직이는) 천체별 허용 오브(도)
export const ORB_BY_TRANSIT: Record<string, number> = {
  sun: 8,
  moon: 3,
  mercury: 6,
  venus: 6,
  mars: 6,
  jupiter: 4,
  saturn: 4,
  uranus: 4,
  neptune: 4,
  pluto: 4,
};

// 트랜짓 천체 가중치
export const TRANSIT_WEIGHT: Record<string, number> = {
  moon: 2,
  mercury: 3,
  venus: 3,
  mars: 4,
  sun: 4,
  jupiter: 5,
  saturn: 6,
  uranus: 6,
  neptune: 6,
  pluto: 7,
};

// 접촉 대상(출생 포인트) 가중치 — asc/mc는 각도점
export const NATAL_WEIGHT: Record<string, number> = {
  sun: 6,
  moon: 6,
  asc: 7,
  mc: 7,
  mercury: 4,
  venus: 4,
  mars: 4,
  jupiter: 3,
  saturn: 4,
  uranus: 2,
  neptune: 2,
  pluto: 2,
};

export const ASPECT_WEIGHT: Record<AspectKey, number> = {
  conjunction: 6,
  opposition: 5,
  square: 5,
  trine: 4,
  sextile: 3,
};

// 하우스 → 삶의 영역 (스펙 §7.3)
export const HOUSE_AREAS: Record<
  number,
  { title: string; meaning: string }
> = {
  1: { title: "나와 태도", meaning: "자아·외형·시작" },
  2: { title: "돈과 가치", meaning: "소유·가치·재정" },
  3: { title: "말과 배움", meaning: "소통·학습·이동" },
  4: { title: "집과 내면", meaning: "가정·뿌리·내면" },
  5: { title: "창작과 즐거움", meaning: "창작·즐거움·연애" },
  6: { title: "루틴과 돌봄", meaning: "일상·노동·건강 습관" },
  7: { title: "관계와 협력", meaning: "파트너십·타인" },
  8: { title: "깊은 관계와 전환", meaning: "공유 자원·친밀감·변화" },
  9: { title: "확장과 탐구", meaning: "철학·여행·고등 학습" },
  10: { title: "일과 사회적 역할", meaning: "경력·명성·사회적 역할" },
  11: { title: "연대와 미래", meaning: "공동체·친구·미래" },
  12: { title: "회복과 내면", meaning: "무의식·휴식·해체" },
};

export const DISCLAIMER =
  "본 서비스는 천체 상징을 활용한 문화적·자기성찰 콘텐츠이며, 의학·법률·재정·심리 상담 또는 과학적 예측을 대체하지 않습니다.";
