// 타로 한 장 — 메이저 아르카나 22장.
// 예언이 아니라 오늘을 비추는 '성찰 프롬프트'로 쓴다(죽음·탑 등은 변화/재정비로 재해석).

export type TarotCard = {
  roman: string;
  name: string;
  emoji: string;
  keyword: string;
  message: string;
};

export const MAJOR_ARCANA: TarotCard[] = [
  { roman: "0", name: "바보", emoji: "🎒", keyword: "새로운 시작", message: "익숙함을 잠시 내려놓고, 오늘 내딛을 수 있는 가벼운 첫걸음을 떠올려보세요." },
  { roman: "I", name: "마법사", emoji: "✨", keyword: "실행과 의지", message: "이미 내 손에 있는 재료로 무엇을 만들 수 있을지 상상해보세요." },
  { roman: "II", name: "여사제", emoji: "🌙", keyword: "직관과 내면", message: "답을 서두르기보다, 내면의 조용한 목소리에 잠시 귀 기울여보세요." },
  { roman: "III", name: "여황제", emoji: "🌾", keyword: "풍요와 돌봄", message: "나를 채우고 돌보는 일에 오늘 조금의 시간을 내어보세요." },
  { roman: "IV", name: "황제", emoji: "🏛️", keyword: "질서와 구조", message: "흩어져 있던 것에 나만의 질서를 하나 세워보세요." },
  { roman: "V", name: "교황", emoji: "📜", keyword: "배움과 조언", message: "믿을 만한 가르침이나 조언 속에서 오늘의 힌트를 찾아보세요." },
  { roman: "VI", name: "연인", emoji: "💞", keyword: "선택과 마음", message: "지금 내 마음이 진짜 원하는 쪽이 어디인지 살펴보세요." },
  { roman: "VII", name: "전차", emoji: "🛞", keyword: "의지와 전진", message: "방향을 정했다면, 흔들림을 줄이고 한 방향으로 나아가 보세요." },
  { roman: "VIII", name: "힘", emoji: "🦁", keyword: "부드러운 용기", message: "억누르기보다 다독이는 방식의 힘을 떠올려보세요." },
  { roman: "IX", name: "은둔자", emoji: "🕯️", keyword: "성찰과 고요", message: "잠시 물러나 혼자만의 조용한 시간을 가져보세요." },
  { roman: "X", name: "운명의 수레바퀴", emoji: "🎡", keyword: "흐름과 변화", message: "바뀌는 흐름을 거스르기보다, 지금의 리듬을 먼저 읽어보세요." },
  { roman: "XI", name: "정의", emoji: "⚖️", keyword: "균형과 책임", message: "지금 상황을 한쪽으로 치우치지 않게 바라보고 있는지 점검해보세요." },
  { roman: "XII", name: "매달린 사람", emoji: "🙃", keyword: "관점의 전환", message: "익숙한 시선을 잠시 뒤집어, 다른 각도에서 바라보세요." },
  { roman: "XIII", name: "죽음", emoji: "🍂", keyword: "매듭과 전환", message: "무언가를 끝맺는 일은 새로운 것을 위한 자리 비움입니다. 놓아줄 것을 떠올려보세요." },
  { roman: "XIV", name: "절제", emoji: "🍵", keyword: "조화와 중용", message: "극단 사이에서 나에게 맞는 적당한 지점을 찾아보세요." },
  { roman: "XV", name: "악마", emoji: "⛓️", keyword: "습관의 자각", message: "나를 묶고 있는 습관이나 생각이 무엇인지 가만히 알아차려보세요." },
  { roman: "XVI", name: "탑", emoji: "🗼", keyword: "흔들림과 재정비", message: "흔들린 자리에서, 다시 세우고 싶은 것 하나를 골라보세요." },
  { roman: "XVII", name: "별", emoji: "⭐", keyword: "희망과 회복", message: "지친 마음에 작은 희망 한 조각을 오늘 허락해보세요." },
  { roman: "XVIII", name: "달", emoji: "🌛", keyword: "감정과 불확실", message: "안개 같은 감정을 억지로 걷어내지 말고, 잠시 그대로 두어보세요." },
  { roman: "XIX", name: "태양", emoji: "☀️", keyword: "활력과 명료", message: "오늘 마주한 작은 기쁨을 마음껏 누려보세요." },
  { roman: "XX", name: "심판", emoji: "🎺", keyword: "돌아봄과 부름", message: "지나온 나를 한 번 돌아보고, 지금의 부름에 귀 기울여보세요." },
  { roman: "XXI", name: "세계", emoji: "🌍", keyword: "완성과 통합", message: "하나의 매듭을 지었다면, 스스로를 조용히 축하해보세요." },
];

// 무작위 한 장
export function drawTarot(): TarotCard {
  return MAJOR_ARCANA[Math.floor(Math.random() * MAJOR_ARCANA.length)];
}
