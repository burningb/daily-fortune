// 해석(템플릿) 엔진 — 계산 데이터를 사용자용 한국어 문장으로 번역.
// AI 없이 규칙·템플릿으로 생성하며, 모든 문장은 사전 검수되어 금지 표현을 포함하지 않는다.

import { HOUSE_AREAS } from "./astro-config";
import { safeText } from "./safety";
import type { Meter } from "./energy";
import type { RankedSignals, ScoredAspect } from "./ranking";

// 트랜짓 천체 테마
const TRANSIT_THEME: Record<string, string> = {
  sun: "정체성과 활력",
  moon: "감정과 리듬",
  mercury: "생각과 말",
  venus: "애정과 취향",
  mars: "행동과 추진",
  jupiter: "확장과 기회",
  saturn: "책임과 구조",
  uranus: "변화와 각성",
  neptune: "상상과 감수성",
  pluto: "깊이와 전환",
};

// 출생 포인트가 상징하는 영역
const NATAL_DOMAIN: Record<string, string> = {
  sun: "나의 중심",
  moon: "마음의 결",
  asc: "태도와 첫인상",
  mc: "일과 방향",
  mercury: "생각의 방식",
  venus: "관계와 취향",
  mars: "의욕",
  jupiter: "믿음과 기대",
  saturn: "책임감",
  uranus: "자유의 감각",
  neptune: "이상과 상상",
  pluto: "깊은 동기",
};

// 한국어 조사(받침 유무) 처리
function hasBatchim(word: string): boolean {
  const c = word.charCodeAt(word.length - 1);
  if (c < 0xac00 || c > 0xd7a3) return false;
  return (c - 0xac00) % 28 !== 0;
}
const subj = (w: string) => w + (hasBatchim(w) ? "이" : "가");
const obj = (w: string) => w + (hasBatchim(w) ? "을" : "를");
const wa = (w: string) => w + (hasBatchim(w) ? "과" : "와");

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
  asc: "상승궁",
  mc: "천정",
};

const DYNAMIC: Record<string, string> = {
  결합: "하나로 겹쳐 또렷하게 부각됩니다",
  조화: "비교적 자연스럽게 흐를 수 있습니다",
  긴장: "의식적으로 조율할 필요가 있습니다",
};

const HEADLINES: Record<string, string[]> = {
  결합: [
    "오늘은 한 가지 주제가 또렷하게 떠오르는 날입니다.",
    "흩어진 마음보다, 지금 부각되는 하나에 집중해도 좋은 날입니다.",
  ],
  조화: [
    "무리해서 밀어붙이기보다, 열린 흐름을 가볍게 활용하기 좋은 날입니다.",
    "오늘은 애쓰지 않아도 이어지는 흐름을 믿어봐도 좋습니다.",
  ],
  긴장: [
    "앞으로 나아가기보다, 내가 향하는 방향을 다시 정렬하는 날입니다.",
    "서두르는 마음보다, 무엇을 조율해야 하는지 먼저 살펴보는 날입니다.",
  ],
  quiet: [
    "큰 자극보다, 나의 리듬을 조용히 확인하기 좋은 하루입니다.",
    "오늘은 특별한 사건보다 스스로의 상태를 살피기 좋은 날입니다.",
  ],
};

const CAUTION: Record<string, string[]> = {
  결합: ["에너지가 한쪽으로 쏠리지 않도록 균형을 살펴보세요."],
  조화: ["흐름이 편하다고 중요한 확인을 건너뛰지는 마세요."],
  긴장: [
    "확신이 사실을 앞서지 않도록 주의하세요.",
    "빠른 결론이 불안을 줄여주는 듯해도, 확인이 먼저입니다.",
  ],
};

const ACTION_BY_THEME: Record<string, string[]> = {
  "생각과 말": ["중요한 메시지는 전송 전에 한 번 더 읽어보세요.", "떠오른 생각을 짧게 메모로 남겨보세요."],
  "행동과 추진": ["결정과 실행 사이에 30분의 간격을 두어보세요.", "가장 하기 싫은 일 하나를 먼저 처리해보세요."],
  "애정과 취향": ["아끼는 사람에게 짧은 안부를 건네보세요.", "오늘 마음에 드는 것 하나를 기록해보세요."],
  "책임과 구조": ["할 일 목록에서 하나를 의도적으로 줄여보세요.", "미뤄둔 정리 하나를 끝내보세요."],
  "확장과 기회": ["평소 미뤄둔 배움을 10분만 시도해보세요.", "가능성을 넓혀줄 대화를 하나 나눠보세요."],
  "변화와 각성": ["익숙한 경로를 조금 바꿔보세요.", "불편하게 느껴지는 감정을 한 문장으로 적어보세요."],
  "상상과 감수성": ["휴대전화를 잠시 끄고 지금 들리는 소리를 적어보세요.", "몸의 긴장부터 확인한 뒤 감정을 설명해보세요."],
  "깊이와 전환": ["내려놓고 싶은 생각을 한 문장으로 적어보세요.", "오늘 사용하지 않을 물건 하나를 정리해보세요."],
  "정체성과 활력": ["오늘의 컨디션을 먼저 확인하고 일정을 조정해보세요.", "나를 위한 5분의 휴식을 일정에 넣어보세요."],
  "감정과 리듬": ["감정을 결론짓기보다 그대로 기록해보세요.", "잠깐 창밖을 보며 세 번 호흡해보세요."],
};

const AUTO_REACTION: Record<string, string[]> = {
  긴장: [
    "상대의 침묵을 거절로 단정하지 마세요.",
    "다른 사람의 속도를 나의 가치에 대한 평가로 받아들이지 마세요.",
  ],
  조화: ["편안함에 기대어 중요한 확인을 미루지 않도록 살펴보세요."],
  결합: ["하나의 생각에 몰입한 나머지 다른 신호를 놓치지 않도록 하세요."],
  quiet: ["조용함을 무기력으로 해석하지 않아도 괜찮습니다."],
};

const REFLECTION: Record<string, string[]> = {
  긴장: [
    "지금 내가 서두르는 이유는 무엇인가요?",
    "지금의 망설임은 두려움인가요, 더 정확한 시간을 기다리는 감각인가요?",
  ],
  조화: ["오늘 내가 자연스럽게 잘 되는 것은 무엇인가요?"],
  결합: ["지금 내가 증명하려는 것은 능력일까요, 존재의 가치일까요?"],
  quiet: ["오늘 내가 지키고 싶은 경계는 무엇인가요?"],
};

const RITUALS = [
  "창문을 열고 세 번 깊게 호흡한 뒤, 오늘 남기고 싶은 한 문장을 적어보세요.",
  "휴대전화 화면을 잠시 끄고, 지금 들리는 소리를 세 가지 기록해보세요.",
  "오늘 사용하지 않을 물건 하나를 치우며, 내려놓고 싶은 생각을 한 문장으로 적어보세요.",
];

const HOUSE_INTERPRET: Record<number, string> = {
  1: "오늘은 남에게 보이는 모습보다, 내가 어떤 태도로 하루를 시작하고 싶은지가 먼저입니다.",
  2: "무엇을 갖고 싶은지보다, 지금 나에게 정말 가치 있는 것이 무엇인지 확인해보세요.",
  3: "말과 정보가 오가는 하루입니다. 전하기 전에 한 번 더 정리해보세요.",
  4: "바깥의 요구보다, 나의 뿌리와 안정감을 먼저 살피는 시간이 필요합니다.",
  5: "결과를 증명하기 위한 표현보다, 지금 살아 있다는 감각을 회복하는 표현이 중요합니다.",
  6: "거창한 변화보다, 오늘의 루틴과 몸의 신호를 돌보는 것이 도움이 됩니다.",
  7: "상대의 반응을 해석하기 전에, 내가 원하는 관계의 방식부터 분명히 해보세요.",
  8: "표면적인 정리보다, 깊은 감정이나 관계의 전환을 알아차리는 시간입니다.",
  9: "익숙한 답보다, 시야를 넓혀줄 질문 하나를 품어보기 좋은 날입니다.",
  10: "무엇을 더 할 것인가보다, 나는 어떤 사람으로 기억되고 싶은가에 가깝습니다.",
  11: "혼자의 목표보다, 함께 그리고 싶은 미래를 떠올려보기 좋은 날입니다.",
  12: "성과를 내기보다, 잠시 물러나 회복하고 정리하는 시간이 어울립니다.",
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
  automaticReaction: string;
  reflectionQuestion: string;
  smallRitual: string;
  emotionalText: string;
  background: { text: string; evidence: string } | null;
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
  const dyn = DYNAMIC[a.nature] ?? "부각됩니다";
  const title =
    a.nature === "긴장"
      ? `${subj(theme)} ${obj(domain)} 시험하는 날`
      : a.nature === "조화"
        ? `${subj(theme)} ${wa(domain)} 잘 맞물리는 날`
        : `${subj(theme)} ${domain}에 겹치는 날`;
  const meaning = `오늘의 ${theme}이 당신의 ${wa(domain)} 만나 ${dyn}.${
    a.retrograde ? " 지금은 새로 시작하기보다 검토·재정비에 어울리는 시기입니다." : ""
  }`;
  const caution =
    a.nature === "긴장" || a.nature === "결합"
      ? pick(CAUTION[a.nature] ?? CAUTION["긴장"])
      : pick(CAUTION["조화"]);
  const action = pick(ACTION_BY_THEME[theme] ?? RITUALS);
  return {
    combo: `${PLANET_KO[a.transit] ?? a.transit} × 출생 ${NATAL_KO[a.natal] ?? a.natal}`,
    title,
    meaning: safeText(meaning, "오늘의 흐름을 차분히 살펴보기 좋은 날입니다."),
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

  // 삶의 영역: 메인 트랜짓의 하우스
  const house = main?.transitHouse ?? null;
  const lifeArea =
    house != null
      ? {
          house,
          title: HOUSE_AREAS[house]?.title ?? `${house}하우스`,
          interpretation: HOUSE_INTERPRET[house] ?? "오늘 특히 이 영역에 마음이 향합니다.",
        }
      : null;

  const themeForAction = main ? (TRANSIT_THEME[main.transit] ?? "감정과 리듬") : "감정과 리듬";
  const tipPool = [
    ...new Set([...(ACTION_BY_THEME[themeForAction] ?? []), ...RITUALS]),
  ];
  const actionTips: string[] = [];
  while (actionTips.length < 3 && tipPool.length) {
    actionTips.push(tipPool.splice(Math.floor(rand() * tipPool.length), 1)[0]);
  }

  const emotional = ranked.emotional;
  const emotionalText = `달은 ${emotional.moonSignName}${
    emotional.moonHouse ? ` · ${emotional.moonHouse}하우스` : ""
  }에 머물며 오늘은 ${emotional.phase}입니다. 감정의 결이 ${
    emotional.topAspect && emotional.topAspect.nature === "긴장"
      ? "평소보다 예민하게"
      : "비교적 부드럽게"
  } 느껴질 수 있어요.`;

  const background = ranked.background
    ? {
        text: `${TRANSIT_THEME[ranked.background.transit]}의 큰 흐름이 당신의 ${
          NATAL_DOMAIN[ranked.background.natal]
        } 주제를 배경에서 천천히 다루고 있습니다.`,
        evidence: evidenceLabel(ranked.background),
      }
    : null;

  const weatherSummary = safeText(
    main
      ? `${TRANSIT_THEME[main.transit]}의 기운이 ${DYNAMIC[main.nature]}. 서두르기보다 지금의 상태를 알아차리며 오늘의 에너지를 사용해보세요.`
      : "오늘은 강한 신호보다 잔잔한 흐름입니다. 나의 리듬을 확인하며 하루를 보내기 좋습니다.",
    "오늘의 흐름을 차분히 살펴보기 좋은 날입니다.",
  );

  return {
    headline: safeText(headline, "오늘의 나를 조용히 살펴보기 좋은 날입니다."),
    weatherSummary,
    mainSignal: mainCard,
    supporting,
    lifeArea,
    actionTips,
    automaticReaction: safeText(
      pick(AUTO_REACTION[nature] ?? AUTO_REACTION.quiet),
      "성급한 결론보다 확인을 먼저 해보세요.",
    ),
    reflectionQuestion: safeText(
      pick(REFLECTION[nature] ?? REFLECTION.quiet),
      "오늘 내가 지키고 싶은 경계는 무엇인가요?",
    ),
    smallRitual: pick(RITUALS),
    emotionalText,
    background,
  };
}
