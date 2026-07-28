// 모던 점성학 기반 오늘의 운세 로직 (클라이언트 전용, 백엔드 없이 동작)

export type Element = "불" | "흙" | "공기" | "물";

export type SunSign = {
  key: string;
  name: string; // 한글 별자리명
  symbol: string; // 이모지
  element: Element;
  range: string; // 표기용 날짜 범위
};

export type CategoryReading = {
  label: string;
  stars: number; // 1~5
  value: number; // 막대 그래프용 40~100
  text: string;
};

export type Reading = {
  name: string;
  sunSign: SunSign;
  ascendant: SunSign | null; // 태어난 시간을 모르면 null
  themeLine: string;
  overallText: string;
  categories: CategoryReading[];
  lucky: {
    item: string;
    color: string;
    number: number;
    direction: string;
    time: string;
  };
  doAdvice: string;
  dontAdvice: string;
  compatibleSign: string;
  keyword: string;
};

// ── 12 별자리 정의 (양자리부터 순서대로) ──────────────────────────
export const SIGNS: SunSign[] = [
  { key: "aries", name: "양자리", symbol: "♈️", element: "불", range: "3.21~4.19" },
  { key: "taurus", name: "황소자리", symbol: "♉️", element: "흙", range: "4.20~5.20" },
  { key: "gemini", name: "쌍둥이자리", symbol: "♊️", element: "공기", range: "5.21~6.21" },
  { key: "cancer", name: "게자리", symbol: "♋️", element: "물", range: "6.22~7.22" },
  { key: "leo", name: "사자자리", symbol: "♌️", element: "불", range: "7.23~8.22" },
  { key: "virgo", name: "처녀자리", symbol: "♍️", element: "흙", range: "8.23~9.22" },
  { key: "libra", name: "천칭자리", symbol: "♎️", element: "공기", range: "9.23~10.22" },
  { key: "scorpio", name: "전갈자리", symbol: "♏️", element: "물", range: "10.23~11.22" },
  { key: "sagittarius", name: "사수자리", symbol: "♐️", element: "불", range: "11.23~12.21" },
  { key: "capricorn", name: "염소자리", symbol: "♑️", element: "흙", range: "12.22~1.19" },
  { key: "aquarius", name: "물병자리", symbol: "♒️", element: "공기", range: "1.20~2.18" },
  { key: "pisces", name: "물고기자리", symbol: "♓️", element: "물", range: "2.19~3.20" },
];

// 생월/생일 → 태양궁
export function getSunSign(month: number, day: number): SunSign {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return SIGNS[0];
  if (md >= 420 && md <= 520) return SIGNS[1];
  if (md >= 521 && md <= 621) return SIGNS[2];
  if (md >= 622 && md <= 722) return SIGNS[3];
  if (md >= 723 && md <= 822) return SIGNS[4];
  if (md >= 823 && md <= 922) return SIGNS[5];
  if (md >= 923 && md <= 1022) return SIGNS[6];
  if (md >= 1023 && md <= 1122) return SIGNS[7];
  if (md >= 1123 && md <= 1221) return SIGNS[8];
  if (md >= 1222 || md <= 119) return SIGNS[9];
  if (md >= 120 && md <= 218) return SIGNS[10];
  return SIGNS[11]; // 2.19~3.20
}

// 태어난 시간 → 상승궁(어센던트) 근사치.
// 위경도 없이 계산하는 단순화 모델(일출=태양궁 기준, 약 2시간마다 한 궁씩 이동).
// 분까지 반영해 소수 시각으로 계산한다.
export function estimateAscendant(sun: SunSign, birthHour: number, birthMinute = 0): SunSign {
  const sunIndex = SIGNS.findIndex((s) => s.key === sun.key);
  const decimalHour = birthHour + birthMinute / 60;
  const offset = Math.floor(((decimalHour - 6 + 24) % 24) / 2);
  return SIGNS[(sunIndex + offset) % 12];
}

const ELEMENT_COMPAT: Record<Element, Element[]> = {
  불: ["불", "공기"],
  공기: ["공기", "불"],
  흙: ["흙", "물"],
  물: ["물", "흙"],
};

const ELEMENT_THEME: Record<Element, string> = {
  불: "열정의 불(火) 기운이 하루를 밝히는 날",
  흙: "안정의 흙(土) 기운이 든든하게 받쳐주는 날",
  공기: "소통의 바람(風) 기운이 가볍게 흐르는 날",
  물: "감성의 물(水) 기운이 마음을 적시는 날",
};

// ── 텍스트 풀 ────────────────────────────────────────────────────
const OVERALL = [
  "전반적으로 흐름이 부드럽습니다. 무리하지 않아도 원하는 방향으로 일이 흘러가요.",
  "행성의 배치가 당신에게 우호적입니다. 미뤄둔 결정을 내리기 좋은 하루예요.",
  "작은 변화의 기운이 감돕니다. 익숙한 길 대신 새로운 시도를 해보세요.",
  "안정과 도전이 균형을 이루는 날. 마음의 중심을 지키면 만사가 순조롭습니다.",
  "직관이 예리해지는 하루입니다. 머리보다 마음의 소리를 믿어보세요.",
  "관계의 기운이 활발합니다. 사람들과의 교류 속에서 기회가 열립니다.",
  "잠시 속도를 늦추라는 별들의 신호가 있어요. 재충전이 곧 도약의 발판이 됩니다.",
  "오늘 뿌린 씨앗이 훗날 큰 결실로 돌아옵니다. 꾸준함이 최고의 무기예요.",
];

const LOVE = [
  "금성의 기운이 따뜻하게 흐릅니다. 솔직한 한마디가 관계를 깊게 만들어요.",
  "설레는 인연이 가까이 있습니다. 마음을 열면 뜻밖의 호감을 확인하게 돼요.",
  "연인·배우자와의 대화에서 오해가 풀리는 하루입니다.",
  "혼자만의 시간이 오히려 매력을 채워주는 날. 서두르지 마세요.",
  "작은 배려가 큰 감동으로 돌아옵니다. 표현을 아끼지 마세요.",
  "감정의 파도가 조금 높을 수 있어요. 한 박자 쉬고 말하면 완벽합니다.",
];

const MONEY = [
  "재물의 흐름이 서서히 상승합니다. 충동구매만 조심하면 완벽해요.",
  "예상 밖의 수입이나 작은 이득이 생길 수 있는 날입니다.",
  "장기적인 계획을 점검하기 좋은 시기. 새는 돈을 막아보세요.",
  "투자나 큰 지출은 하루 미루는 편이 유리합니다.",
  "주변의 정보 속에 쏠쏠한 기회가 숨어 있어요. 귀를 기울이세요.",
  "나눔의 기운이 결국 나에게 복으로 돌아오는 하루입니다.",
];

const HEALTH = [
  "몸의 리듬이 안정적입니다. 가벼운 산책이 활력을 더해줘요.",
  "수분을 충분히 채우고 목·어깨를 풀어주면 컨디션이 올라갑니다.",
  "피로가 쌓이기 쉬운 날. 일찍 잠자리에 드는 것이 최고의 보약이에요.",
  "규칙적인 식사가 오늘의 에너지를 좌우합니다.",
  "마음의 긴장을 풀어주는 심호흡이 도움이 됩니다.",
  "무리한 운동보다 스트레칭 위주로 몸을 아껴주세요.",
];

const WORK = [
  "집중력이 빛나는 하루입니다. 어려운 과제부터 처리하면 술술 풀려요.",
  "동료·팀과의 협업에서 좋은 성과가 나옵니다.",
  "새로운 아이디어가 인정받을 기운. 주저 말고 의견을 내보세요.",
  "미뤄둔 서류·정리를 끝내면 마음이 한결 가벼워집니다.",
  "작은 실수에 흔들리지 마세요. 전체 평가는 긍정적입니다.",
  "배움의 기운이 강한 날. 새로운 지식이 곧 기회가 됩니다.",
];

const LUCKY_ITEMS = [
  "은색 액세서리", "가죽 다이어리", "향초", "만년필", "손거울", "머그컵",
  "책갈피", "미니 화분", "텀블러", "향수", "이어폰", "손수건", "키링", "초콜릿",
];
const LUCKY_COLORS = ["빨강", "주황", "노랑", "초록", "파랑", "남색", "보라", "하양", "분홍", "터콰이즈"];
const DIRECTIONS = ["동쪽", "서쪽", "남쪽", "북쪽", "남동쪽", "남서쪽", "북동쪽", "북서쪽"];
const TIMES = ["이른 아침", "오전 9~11시", "정오 무렵", "오후 2~4시", "해 질 무렵", "저녁 7~9시"];
const KEYWORDS = ["용기", "균형", "설렘", "집중", "여유", "성장", "연결", "직관", "정리", "도약", "회복", "표현"];

const DO_ADVICE = [
  "먼저 안부를 건네보세요.",
  "미뤄둔 일 하나를 오늘 끝내보세요.",
  "감사한 마음을 말로 표현하세요.",
  "새로운 길로 돌아가 보세요.",
  "직관이 이끄는 선택을 믿으세요.",
  "잠깐이라도 나를 위한 시간을 가지세요.",
];
const DONT_ADVICE = [
  "즉흥적인 큰 지출은 피하세요.",
  "확신 없는 약속은 미루세요.",
  "감정적인 대응은 한 박자 늦추세요.",
  "무리한 밤샘은 삼가세요.",
  "소문에 휘둘리지 마세요.",
  "완벽주의로 자신을 몰아세우지 마세요.",
];

// ── 시드 기반 난수 (하루 동안 동일 결과 보장) ──────────────────────
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type BirthProfile = {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number | null; // 모르면 null
  minute: number; // 시간을 모르면 의미 없음(0)
};

export function generateReading(profile: BirthProfile, today: Date): Reading {
  const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const seedStr = `${profile.name}|${profile.year}-${profile.month}-${profile.day}|${
    profile.hour ?? "x"
  }:${profile.hour !== null ? profile.minute : "x"}|${todayStr}`;
  const seed = xmur3(seedStr)();
  const rand = mulberry32(seed);

  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const scoreValue = () => 40 + Math.floor(rand() * 61); // 40~100

  const sunSign = getSunSign(profile.month, profile.day);
  const ascendant =
    profile.hour !== null
      ? estimateAscendant(sunSign, profile.hour, profile.minute)
      : null;

  const makeCategory = (label: string, pool: string[]): CategoryReading => {
    const value = scoreValue();
    return { label, value, stars: Math.max(1, Math.round(value / 20)), text: pick(pool) };
  };

  const categories: CategoryReading[] = [
    makeCategory("총운", OVERALL),
    makeCategory("애정운", LOVE),
    makeCategory("금전운", MONEY),
    makeCategory("건강운", HEALTH),
    makeCategory("직장·학업운", WORK),
  ];

  // 궁합 별자리: 원소 궁합이 맞는 별자리 중 하나(자기 자신 제외)
  const compatPool = SIGNS.filter(
    (s) => ELEMENT_COMPAT[sunSign.element].includes(s.element) && s.key !== sunSign.key,
  );
  const compat = pick(compatPool);

  return {
    name: profile.name,
    sunSign,
    ascendant,
    themeLine: ELEMENT_THEME[sunSign.element],
    overallText: categories[0].text,
    categories,
    lucky: {
      item: pick(LUCKY_ITEMS),
      color: pick(LUCKY_COLORS),
      number: Math.floor(rand() * 99) + 1,
      direction: pick(DIRECTIONS),
      time: pick(TIMES),
    },
    doAdvice: pick(DO_ADVICE),
    dontAdvice: pick(DONT_ADVICE),
    compatibleSign: `${compat.symbol} ${compat.name}`,
    keyword: pick(KEYWORDS),
  };
}
