// 안전 검증 — 금지 표현(스펙 §24). 실패 시 안전 문장으로 대체.

export const FORBIDDEN = [
  "반드시",
  "무조건",
  "틀림없이",
  "큰 사고",
  "이별하게",
  "병에 걸릴",
  "투자에 성공",
  "복권",
  "임신 가능성",
  "운명의 상대",
  "기회를 잃습니다",
  "업보",
  "전생",
  "공유해야 행운",
];

export function isSafe(text: string): boolean {
  return !FORBIDDEN.some((w) => text.includes(w));
}

// 문장이 위험하면 안전한 대체 문장으로 교체
export function safeText(text: string, fallback: string): string {
  return isSafe(text) ? text : fallback;
}
