// 해석(템플릿) 엔진 — 계산 데이터를 쉽고 담백한 한국어 문장으로 옮긴다.
// AI 없이 규칙·템플릿으로 생성하며, 모든 문장은 사전 검수되어 금지 표현을 포함하지 않는다.

import { HOUSE_AREAS } from "./astro-config";
import { safeText } from "./safety";
import type { Meter } from "./energy";
import type { RankedSignals, ScoredAspect } from "./ranking";

// 트랜짓 천체 → 오늘 두드러지는 주제(일상어)
const TRANSIT_THEME: Record<string, string> = {
  sun: "자신감과 활력",
  moon: "감정",
  mercury: "생각과 대화",
  venus: "관계와 애정",
  mars: "의욕과 행동",
  jupiter: "기대와 여유",
  saturn: "책임과 현실",
  uranus: "변화",
  neptune: "감성과 상상",
  pluto: "집중과 몰입",
};

// 출생 포인트 → 내 삶의 부분(일상어)
const NATAL_DOMAIN: Record<string, string> = {
  sun: "나 자신",
  moon: "마음",
  asc: "태도",
  mc: "일과 목표",
  mercury: "생각",
  venus: "관계",
  mars: "의욕",
  jupiter: "기대",
  saturn: "책임감",
  uranus: "자유",
  neptune: "이상",
  pluto: "속마음",
};

// 한국어 조사(받침 유무) 처리
function hasBatchim(word: string): boolean {
  const c = word.charCodeAt(word.length - 1);
  if (c < 0xac00 || c > 0xd7a3) return false;
  return (c - 0xac00) % 28 !== 0;
}
const subj = (w: string) => w + (hasBatchim(w) ? "이" : "가");

const PLANET_KO: Record<string, string> = {
  sun: "태양",
  moon: "달",
  mercury: "수성",
  venus: "금성",
  mars: "화성",
  jupiter: "목성",
  saturn: "토성",
  uranus: "천왕성",
  neptune: "해왕성",
  pluto: "명왕성",
};
const NATAL_KO: Record<string, string> = {
  ...PLANET_KO,
  asc: "상승점",
  mc: "정점",
};

// 각의 성격 → 한 줄 설명(담백)
const DYNAMIC: Record<string, string> = {
  결합: "이 부분이 평소보다 크게 느껴질 수 있어요.",
  조화: "큰 힘 들이지 않아도 자연스럽게 풀릴 수 있어요.",
  긴장: "살짝 부딪힐 수 있으니 천천히 다뤄보세요.",
};

const HEADLINES: Record<string, string[]> = {
  결합: ["오늘은 한 가지에 마음이 모이는 날이에요.", "여러 가지보다, 지금 또렷한 하나에 집중해도 좋아요."],
  조화: ["무리하지 않아도 자연스럽게 풀리는 날이에요.", "오늘은 흐름을 편하게 타도 좋은 날이에요."],
  긴장: ["앞서가기보다, 방향을 다시 살펴보면 좋은 날이에요.", "서두르기보다 무엇을 조율할지 먼저 보면 좋아요."],
  quiet: ["오늘은 나의 리듬을 조용히 살피기 좋은 하루예요.", "특별한 일보다 내 상태를 돌보기 좋은 날이에요."],
};

const CAUTION: Record<string, string[]> = {
  결합: ["한쪽으로 너무 쏠리지 않게 균형을 살펴보세요."],
  조화: ["편하다고 중요한 확인을 건너뛰지 마세요."],
  긴장: ["확신이 사실을 앞서지 않게 조심하세요.", "성급한 결론보다 확인이 먼저예요."],
};

const ACTION_BY_THEME: Record<string, string[]> = {
  "생각과 대화": ["중요한 메시지는 보내기 전에 한 번 더 읽어보세요.", "떠오른 생각을 짧게 메모해두세요."],
  "의욕과 행동": ["결정과 실행 사이에 30분만 간격을 두세요.", "가장 하기 싫은 일 하나를 먼저 끝내보세요."],
  "관계와 애정": ["아끼는 사람에게 짧은 안부를 건네보세요.", "오늘 마음에 든 것 하나를 기록해두세요."],
  "책임과 현실": ["할 일 목록에서 하나를 의도적으로 줄여보세요.", "미뤄둔 정리 하나를 끝내보세요."],
  "기대와 여유": ["미뤄둔 배움을 딱 10분만 시도해보세요.", "여유를 넓혀줄 대화를 하나 나눠보세요."],
  "변화": ["익숙한 길을 조금만 바꿔보세요.", "불편한 감정을 한 문장으로 적어보세요."],
  "감성과 상상": ["휴대폰을 잠시 끄고 지금 들리는 소리를 적어보세요.", "몸의 긴장을 먼저 푼 뒤 감정을 살펴보세요."],
  "집중과 몰입": ["내려놓고 싶은 생각을 한 문장으로 적어보세요.", "오늘 안 쓸 물건 하나를 정리해보세요."],
  "자신감과 활력": ["컨디션을 먼저 확인하고 일정을 조정해보세요.", "나를 위한 5분 휴식을 일정에 넣어보세요."],
  "감정": ["감정을 결론짓기보다 그대로 적어보세요.", "잠깐 창밖을 보며 세 번 호흡해보세요."],
};

const GENERAL_TIPS = [
  "잠깐 멈춰서 세 번 깊게 호흡해보세요.",
  "오늘 꼭 남기고 싶은 한 문장을 적어보세요.",
  "지금의 기분을 한 단어로 표현해보세요.",
];

const REFLECTION: Record<string, string[]> = {
  긴장: ["지금 내가 서두르는 이유는 무엇인가요?", "지금의 망설임은 두려움일까요, 더 나은 때를 기다리는 감각일까요?"],
  조화: ["오늘 나에게 자연스럽게 잘 되는 것은 무엇인가요?"],
  결합: ["지금 내가 증명하려는 건 능력일까요, 나의 가치일까요?"],
  quiet: ["오늘 내가 지키고 싶은 것은 무엇인가요?"],
};

const HOUSE_INTERPRET: Record<number, string> = {
  1: "오늘은 남에게 보이는 모습보다, 어떤 태도로 하루를 시작할지가 먼저예요.",
  2: "무엇을 갖고 싶은지보다, 지금 나에게 정말 소중한 게 뭔지 살펴보세요.",
  3: "말과 정보가 오가는 하루예요. 전하기 전에 한 번 더 정리해보세요.",
  4: "바깥의 요구보다, 나의 안정감을 먼저 챙기는 시간이 필요해요.",
  5: "잘 해내려는 마음보다, 지금 즐거운 것을 해보는 게 좋아요.",
  6: "큰 변화보다, 오늘의 습관과 몸 상태를 돌보는 게 도움이 돼요.",
  7: "상대의 반응을 해석하기 전에, 내가 원하는 관계부터 분명히 해보세요.",
  8: "겉의 정리보다, 마음 깊은 곳의 변화를 알아차리는 시간이에요.",
  9: "익숙한 답보다, 시야를 넓혀줄 질문 하나를 품어보기 좋아요.",
  10: "무엇을 더 할지보다, 어떤 사람으로 기억되고 싶은지에 가까워요.",
  11: "혼자의 목표보다, 함께 그리고 싶은 미래를 떠올려보기 좋아요.",
  12: "성과를 내기보다, 잠시 물러나 쉬고 정리하기 좋은 시간이에요.",
};

// 시드 난수 (날짜+신호 기준 하루 동안 동일)
function rng(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type SignalCard = {
  combo: string;
  title: string;
  meaning: string;
  caution?: string;
  action?: string;
  evidence: string;
};

export type DailyReport = {
  headline: string;
  weatherSummary: string;
  mainSignal: SignalCard | null;
  supporting: SignalCard[];
  lifeArea: { house: number; title: string; interpretation: string } | null;
  actionTips: string[];
  reflectionQuestion: string;
};

const fmtDeg = (x: number) => x.toFixed(1);

function evidenceLabel(a: ScoredAspect): string {
  const t = a.transit[0].toUpperCase() + a.transit.slice(1);
  const n = a.natal === "asc" ? "Asc" : a.natal === "mc" ? "MC" : a.natal[0].toUpperCase() + a.natal.slice(1);
  return `Transit ${t} ${a.aspectKo} Natal ${n} · Orb ${fmtDeg(a.orb)}° · ${
    a.applying ? "Applying" : "Separating"
  }${a.retrograde ? " · ℞" : ""}`;
}

function buildCard(a: ScoredAspect, pick: (arr: string[]) => string): SignalCard {
  const theme = TRANSIT_THEME[a.transit] ?? "오늘의 흐름";
  const domain = NATAL_DOMAIN[a.natal] ?? "나의 어떤 부분";
  const title =
    a.nature === "긴장"
      ? `${subj(theme)} 시험받는 날`
      : a.nature === "조화"
        ? `${subj(theme)} 잘 풀리는 날`
        : `${subj(theme)} 도드라지는 날`;
  const meaning = `오늘은 '${theme}'의 기운이 나의 ${domain}에 닿습니다. ${
    DYNAMIC[a.nature] ?? ""
  }${a.retrograde ? " 지금은 새로 시작하기보다 점검하고 다듬기에 어울려요." : ""}`;
  const caution =
    a.nature === "긴장" || a.nature === "결합"
      ? pick(CAUTION[a.nature] ?? CAUTION["긴장"])
      : pick(CAUTION["조화"]);
  const action = pick(ACTION_BY_THEME[theme] ?? GENERAL_TIPS);
  return {
    combo: `${PLANET_KO[a.transit] ?? a.transit} × 출생 ${NATAL_KO[a.natal] ?? a.natal}`,
    title,
    meaning: safeText(meaning, "오늘의 흐름을 차분히 살펴보기 좋은 날이에요."),
    caution: safeText(caution, "중요한 선택은 한 번 더 확인해보세요."),
    action: safeText(action, "지금의 감각을 짧게 기록해보세요."),
    evidence: evidenceLabel(a),
  };
}

export function interpret(ranked: RankedSignals, energy: Meter[]): DailyReport {
  const main = ranked.main;
  const nature = main?.nature ?? "quiet";
  const seed = main
    ? `${main.transit}-${main.natal}-${main.aspectKey}-${Math.round(main.orb * 10)}`
    : `quiet-${energy.map((e) => e.score).join("")}`;
  const rand = rng(seed);
  const pick = (arr: string[]) => arr[Math.floor(rand() * arr.length)] ?? arr[0];

  const headline = pick(HEADLINES[nature] ?? HEADLINES.quiet);

  const mainCard = main ? buildCard(main, pick) : null;
  const supporting = ranked.supporting.map((a) => {
    const c = buildCard(a, pick);
    return { combo: c.combo, title: c.title, meaning: c.meaning, evidence: c.evidence };
  });

  const house = main?.transitHouse ?? null;
  const lifeArea =
    house != null
      ? {
          house,
          title: HOUSE_AREAS[house]?.title ?? `${house}하우스`,
          interpretation: HOUSE_INTERPRET[house] ?? "오늘 특히 이 부분에 마음이 향해요.",
        }
      : null;

  const themeForAction = main ? (TRANSIT_THEME[main.transit] ?? "감정") : "감정";
  const tipPool = [
    ...new Set([...(ACTION_BY_THEME[themeForAction] ?? []), ...GENERAL_TIPS]),
  ];
  const actionTips: string[] = [];
  while (actionTips.length < 2 && tipPool.length) {
    actionTips.push(tipPool.splice(Math.floor(rand() * tipPool.length), 1)[0]);
  }

  const weatherSummary = safeText(
    main
      ? `오늘은 ${subj(TRANSIT_THEME[main.transit])} 두드러지는 하루예요. 서두르기보다 지금 상태를 살피며 천천히 움직여보세요.`
      : "오늘은 큰 사건보다 잔잔한 하루예요. 나의 리듬을 확인하며 보내기 좋습니다.",
    "오늘의 흐름을 차분히 살펴보기 좋은 날이에요.",
  );

  return {
    headline: safeText(headline, "오늘의 나를 조용히 살펴보기 좋은 날이에요."),
    weatherSummary,
    mainSignal: mainCard,
    supporting,
    lifeArea,
    actionTips,
    reflectionQuestion: safeText(
      pick(REFLECTION[nature] ?? REFLECTION.quiet),
      "오늘 내가 지키고 싶은 것은 무엇인가요?",
    ),
  };
}
