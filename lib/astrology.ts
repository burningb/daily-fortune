// 모던 점성학 기반 오늘의 운세 로직 (클라이언트 전용, 백엔드 없이 동작)

export type Element = "불" | "흙" | "공기" | "물";

export type SunSign = {
  key: string;
  name: string; // 한글 별자리명
  symbol: string; // 이모지
  element: Element;
  range: string; // 표기용 날짜 범위
};

export type SignProfile = {
  tagline: string; // 한 줄 정수
  personality: string; // 기질과 성격
  strength: string; // 빛나는 점
  shadow: string; // 살며시 조심할 그림자
  inLove: string; // 관계에서의 결
  keywords: string[]; // 특성 키워드
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
  signProfile: SignProfile;
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

// ── 별자리별 섬세한 성격 프로필 ──────────────────────────────────
export const SIGN_PROFILES: Record<string, SignProfile> = {
  aries: {
    tagline: "가장 먼저 문을 여는, 순수한 시작의 별",
    personality:
      "당신은 생각보다 몸이 먼저 움직이는 사람입니다. 망설임이 길지 않고, 마음이 향하는 곳으로 곧장 나아가는 정직한 추진력이 있어요. 그 에너지는 계산에서 나온 것이 아니라 순수한 열정에서 비롯되기에, 곁에 있는 사람까지 덩달아 설레게 만듭니다.",
    strength:
      "두려움 앞에서도 먼저 손을 드는 용기, 그리고 지나간 일에 오래 매이지 않는 회복력이 당신을 빛나게 합니다.",
    shadow:
      "다만 불꽃이 빠른 만큼 쉬 사그라들기도 해요. 시작의 뜨거움을 끝까지 데워갈 인내를 살짝 곁들이면 완벽합니다.",
    inLove:
      "사랑에도 솔직합니다. 좋으면 좋다고, 아끼는 마음을 숨기지 못하는 직진형. 그 꾸밈없음이 당신의 가장 큰 매력이에요.",
    keywords: ["개척", "열정", "솔직함", "용기"],
  },
  taurus: {
    tagline: "천천히, 그러나 가장 깊이 뿌리내리는 별",
    personality:
      "당신은 서두르지 않습니다. 눈으로 보고 손으로 만지고 마음으로 확인한 뒤에야 한 걸음을 내딛는, 감각과 신뢰의 사람이에요. 한번 마음을 준 것에는 좀처럼 흔들리지 않는 든든한 항상성이 있습니다.",
    strength:
      "꾸준함과 끈기, 그리고 주변을 편안하게 만드는 안정감. 당신 곁에 있으면 사람들은 이상하게 마음이 놓입니다.",
    shadow:
      "익숙함을 사랑하는 만큼 변화가 조금 두려울 수 있어요. 가끔은 낯선 길에 발을 들여도 괜찮다고 스스로를 다독여 주세요.",
    inLove:
      "사랑은 느리게 데워지지만 그만큼 오래갑니다. 말보다 곁을 지키는 행동으로 마음을 증명하는 헌신적인 사람이에요.",
    keywords: ["안정", "끈기", "감각", "충직"],
  },
  gemini: {
    tagline: "세상 모든 것에 물음표를 띄우는 바람의 별",
    personality:
      "당신의 머릿속은 늘 여러 개의 창이 동시에 열려 있습니다. 호기심이 이끄는 대로 이 주제 저 주제를 넘나들고, 그 과정에서 반짝이는 재치와 언어 감각이 자연스럽게 흘러나와요. 지루함은 당신에게 가장 견디기 힘든 감정이죠.",
    strength:
      "빠른 이해력과 유연한 사고, 그리고 누구와도 대화를 트는 사교성. 당신은 분위기를 순식간에 가볍고 즐겁게 바꿉니다.",
    shadow:
      "관심이 여러 갈래로 흩어지면 정작 깊이가 아쉬울 수 있어요. 마음이 향한 하나를 끝까지 붙잡아 보면 놀라운 결실이 옵니다.",
    inLove:
      "말이 통하는 사람에게 마음이 열립니다. 지적인 대화와 웃음이 오가는 관계에서 가장 당신다워져요.",
    keywords: ["호기심", "재치", "소통", "다재다능"],
  },
  cancer: {
    tagline: "말없이 곁을 지키는, 물결 같은 별",
    personality:
      "당신은 감정의 결이 아주 섬세한 사람입니다. 겉으로는 단단한 껍질을 두르고 있지만, 그 안에는 사랑하는 이들을 향한 따뜻하고 여린 마음이 흐르고 있어요. 분위기의 미묘한 변화를 남보다 먼저 느끼는 직관이 있습니다.",
    strength:
      "깊은 공감력과 보살피는 마음. 당신은 사람들이 기댈 수 있는 안전한 항구가 되어줍니다.",
    shadow:
      "타인의 감정을 다 끌어안다 보면 정작 자신이 지칠 수 있어요. 당신의 마음도 돌봄이 필요하다는 걸 잊지 마세요.",
    inLove:
      "한번 품은 사람은 온 마음으로 지킵니다. 안정과 신뢰가 쌓일 때 비로소 마음속 문을 활짝 여는 헌신형이에요.",
    keywords: ["감성", "보살핌", "직관", "가족애"],
  },
  leo: {
    tagline: "존재만으로 주위를 밝히는 태양의 별",
    personality:
      "당신에게는 사람을 끌어당기는 따뜻한 빛이 있습니다. 숨기기보다 드러내고, 움츠리기보다 당당히 서는 것이 자연스러운 사람이에요. 그 자신감은 허세가 아니라 스스로와 곁의 사람을 아끼는 마음에서 나옵니다.",
    strength:
      "타고난 관대함과 리더십, 그리고 어떤 무대에서도 빛을 잃지 않는 존재감. 당신은 사람들에게 용기를 나눠 줍니다.",
    shadow:
      "인정받고 싶은 마음이 클수록 작은 무관심에 쉽게 상처받을 수 있어요. 당신의 가치는 박수와 무관하게 이미 충분합니다.",
    inLove:
      "사랑엔 화끈하고 로맨틱합니다. 아끼는 사람에게 아낌없이 표현하고 최고로 대접하는, 마음이 큰 사람이에요.",
    keywords: ["자신감", "관대함", "따뜻함", "카리스마"],
  },
  virgo: {
    tagline: "작은 결까지 어루만지는 섬세함의 별",
    personality:
      "당신은 남들이 지나치는 디테일을 놓치지 않는 사람입니다. 무언가를 더 낫게 다듬고, 어질러진 것에 질서를 부여할 때 마음이 편안해져요. 그 성실함과 분석력은 겉으로 요란하지 않지만 결국 모든 것을 완성시킵니다.",
    strength:
      "꼼꼼함과 실용적인 지혜, 그리고 묵묵히 제 몫을 해내는 책임감. 당신이 손댄 일에는 늘 신뢰가 따라옵니다.",
    shadow:
      "완벽을 바라는 마음이 때로 스스로를 향한 날 선 비판이 되곤 해요. 이미 충분히 잘하고 있다는 사실을 자주 떠올려 주세요.",
    inLove:
      "화려한 말 대신 상대의 일상을 조용히 챙기는 방식으로 사랑합니다. 그 세심한 배려가 오래 기억되는 사람이에요.",
    keywords: ["섬세함", "성실", "분석", "실용"],
  },
  libra: {
    tagline: "어긋난 저울을 다시 맞추는 조화의 별",
    personality:
      "당신은 사람과 사람 사이의 공기를 예민하게 읽어내는 사람입니다. 어느 한쪽으로 치우치기보다 균형을 찾으려 하고, 그 과정에서 자연스러운 품위와 미적 감각이 배어 나와요. 갈등보다 조화를 택하는 다정한 마음이 있습니다.",
    strength:
      "공정한 시선과 세련된 감각, 그리고 상대를 편안하게 만드는 매너. 당신은 어떤 자리든 우아하게 어우러집니다.",
    shadow:
      "모두를 배려하려다 정작 자신의 마음을 미루기 쉬워요. 당신이 진짜 원하는 것을 먼저 말해도 관계는 무너지지 않습니다.",
    inLove:
      "함께 나누고 맞춰가는 파트너십을 소중히 여깁니다. 로맨틱한 분위기와 서로에 대한 예의가 사랑을 더 깊게 만들어요.",
    keywords: ["조화", "균형", "미감", "관계지향"],
  },
  scorpio: {
    tagline: "표면 아래 본질을 꿰뚫는 심연의 별",
    personality:
      "당신은 어중간함을 견디지 못하는 사람입니다. 무언가에 마음을 두면 그 깊은 곳까지 가닿고 싶어 하고, 사람의 진심과 사건의 이면을 직관적으로 읽어냅니다. 겉은 고요해 보여도 안에는 뜨거운 몰입이 흐르고 있어요.",
    strength:
      "강렬한 집중력과 통찰, 그리고 한번 정한 사람과 목표를 향한 흔들림 없는 충성심. 당신은 위기 속에서 더 단단해집니다.",
    shadow:
      "깊이 사랑하는 만큼 잃을까 두려워 집착이 되기도 해요. 붙잡는 대신 믿고 놓아줄 때 관계는 더 자유로워집니다.",
    inLove:
      "사랑에 전부를 겁니다. 얕은 관계엔 흥미가 없고, 영혼까지 닿는 깊은 연결을 원하는 진심의 사람이에요.",
    keywords: ["강렬함", "통찰", "몰입", "충성"],
  },
  sagittarius: {
    tagline: "지평선 너머를 꿈꾸는 자유의 별",
    personality:
      "당신은 한곳에 머무는 것보다 넓은 세상을 향해 나아갈 때 살아 있음을 느끼는 사람입니다. 낙천적인 시선으로 가능성을 먼저 보고, 경험과 배움 속에서 삶의 의미를 찾아요. 솔직하고 유쾌한 기운이 사람들을 끌어당깁니다.",
    strength:
      "긍정적인 에너지와 넓은 시야, 그리고 어떤 상황에서도 배움을 길어 올리는 지혜. 당신은 곁의 사람에게 희망을 줍니다.",
    shadow:
      "자유를 향한 마음이 때로 마무리를 흐릿하게 만들 수 있어요. 벌여둔 것을 매듭짓는 순간, 당신의 여정은 더 빛납니다.",
    inLove:
      "구속보다 함께 성장하는 사랑을 원합니다. 서로의 세계를 존중하며 나란히 걷는 동반자를 만나면 가장 행복해져요.",
    keywords: ["자유", "낙천", "모험", "탐구"],
  },
  capricorn: {
    tagline: "한 계단씩, 끝내 정상에 닿는 대지의 별",
    personality:
      "당신은 눈앞의 화려함보다 시간이 증명하는 가치를 믿는 사람입니다. 목표를 정하면 묵묵히, 꾸준히, 현실적인 발걸음으로 나아가요. 그 인내와 책임감은 요란하지 않지만 결국 가장 멀리까지 당신을 데려갑니다.",
    strength:
      "강한 자기 절제와 현실 감각, 그리고 맡은 것을 끝까지 해내는 신뢰성. 당신은 위기에서 사람들이 가장 먼저 기대는 기둥이에요.",
    shadow:
      "책임을 홀로 짊어지려다 마음이 굳어질 수 있어요. 기대어도 괜찮고, 잠시 쉬어가도 무너지지 않는다는 걸 믿어 주세요.",
    inLove:
      "표현은 담백해도 마음은 진중합니다. 한번 곁을 내준 사람과 오래도록 함께할 미래를 그리는 사람이에요.",
    keywords: ["책임감", "인내", "야망", "현실감각"],
  },
  aquarius: {
    tagline: "남과 다른 각도로 세상을 보는 미래의 별",
    personality:
      "당신은 정해진 틀보다 자기만의 시선을 더 신뢰하는 사람입니다. 유행을 좇기보다 스스로 옳다고 느끼는 방향으로 걷고, 그 독창적인 관점이 종종 시대를 앞서갑니다. 개인을 넘어 더 나은 세상을 향한 따뜻한 이상도 품고 있어요.",
    strength:
      "창의적인 사고와 열린 마음, 그리고 편견 없이 사람을 대하는 공정함. 당신은 새로운 가능성의 문을 여는 사람입니다.",
    shadow:
      "생각에 몰두하다 감정 표현이 조금 서툴러질 수 있어요. 가까운 이에게 마음을 말로 건네면 관계가 한층 따뜻해집니다.",
    inLove:
      "친구 같은 편안함 위에 사랑을 쌓아 올립니다. 서로의 독립을 존중하며 함께 성장하는 관계를 가장 편안해해요.",
    keywords: ["독창성", "자유", "이상", "지성"],
  },
  pisces: {
    tagline: "경계 없이 스며드는 공감의 별",
    personality:
      "당신은 세상을 마음으로 느끼는 사람입니다. 타인의 감정이 마치 제 것처럼 스며들고, 그 풍부한 감수성이 상상력과 예술적인 결로 피어나요. 눈에 보이지 않는 것을 믿고 어루만질 줄 아는 다정한 마음의 소유자입니다.",
    strength:
      "깊은 공감력과 무한한 상상력, 그리고 조건 없이 내어주는 헌신. 당신은 지친 사람에게 위로가 되는 존재예요.",
    shadow:
      "타인과 세상의 감정에 젖어 자신을 놓치기 쉬워요. 나와 남 사이에 부드러운 경계를 그어 주면 마음이 더 단단해집니다.",
    inLove:
      "낭만적이고 헌신적인 사랑을 합니다. 상대의 마음을 섬세하게 헤아리며 온기로 감싸 안는 사람이에요.",
    keywords: ["공감", "상상력", "예술성", "헌신"],
  },
};

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
    signProfile: SIGN_PROFILES[sunSign.key],
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
