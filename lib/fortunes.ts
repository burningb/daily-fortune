export type FortuneScore = {
  label: string;
  value: number;
};

export type Fortune = {
  message: string;
  luckyItem: string;
  luckyColor: string;
  luckyNumber: number;
  scores: FortuneScore[];
  compatibleZodiac: string;
};

const messages = [
  "오늘은 생각지도 못한 곳에서 좋은 소식이 들려올 거예요.",
  "작은 용기가 큰 행운을 불러오는 하루입니다.",
  "미뤄뒀던 일을 시작하기 좋은 날이에요.",
  "주변 사람에게 뜻밖의 도움을 받게 될 거예요.",
  "평소보다 직감이 예리해지는 하루, 믿고 따라가 보세요.",
  "느긋하게 마음먹으면 모든 일이 순조롭게 풀립니다.",
  "새로운 인연이 찾아올 수 있는 날이에요.",
  "금전운이 서서히 상승하는 흐름이 보입니다.",
  "말 한마디가 큰 힘이 되는 하루니 따뜻한 말을 건네보세요.",
  "오늘 내린 결정이 먼 훗날 좋은 결과로 돌아옵니다.",
  "휴식이 필요한 신호일 수 있어요. 잠시 쉬어가세요.",
  "꾸준함이 빛을 발하는 순간이 다가옵니다.",
  "예상치 못한 칭찬을 받게 될 하루예요.",
  "작은 실수에 연연하지 마세요, 전체 흐름은 좋습니다.",
  "오늘은 평소보다 유머 감각이 빛나는 날이에요.",
  "가족과의 대화 속에서 뜻밖의 힌트를 얻게 됩니다.",
  "미루던 정리를 하면 마음이 한결 가벼워져요.",
  "새로운 취미에 도전하기 좋은 기운이 흐릅니다.",
  "동료와의 협업에서 좋은 성과가 나올 거예요.",
  "오늘 하루, 나 자신을 칭찬해주는 것도 잊지 마세요.",
];

const luckyItems = [
  "우산",
  "노란 손수건",
  "동전 지갑",
  "만년필",
  "귀여운 스티커",
  "손거울",
  "향초",
  "머그컵",
  "책갈피",
  "귀걸이",
  "텀블러",
  "다이어리",
  "키링",
  "향수",
  "초콜릿",
];

const luckyColors = [
  "빨강",
  "주황",
  "노랑",
  "초록",
  "파랑",
  "보라",
  "하양",
  "검정",
  "분홍",
  "하늘색",
];

const scoreLabels = ["애정운", "금전운", "건강운", "직장운"];

const zodiacs = [
  "쥐띠",
  "소띠",
  "호랑이띠",
  "토끼띠",
  "용띠",
  "뱀띠",
  "말띠",
  "양띠",
  "원숭이띠",
  "닭띠",
  "개띠",
  "돼지띠",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomFortune(): Fortune {
  const message = pick(messages);
  const luckyItem = pick(luckyItems);
  const luckyColor = pick(luckyColors);
  const luckyNumber = Math.floor(Math.random() * 99) + 1;
  const scores = scoreLabels.map((label) => ({
    label,
    // 30~100 사이로 뽑아 너무 낮은 값이 나오지 않게 함
    value: Math.floor(Math.random() * 71) + 30,
  }));
  const compatibleZodiac = pick(zodiacs);

  return {
    message,
    luckyItem,
    luckyColor,
    luckyNumber,
    scores,
    compatibleZodiac,
  };
}
