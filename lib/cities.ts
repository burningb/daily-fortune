// 정확한 상승궁 계산을 위한 출생 지역 목록.
// tz는 표준시 기준 UTC 오프셋(서머타임 미반영). lon은 동경(+) 기준.

export type City = {
  name: string;
  lat: number;
  lon: number;
  tz: number;
  group: "국내" | "해외";
};

export const CITIES: City[] = [
  // 국내
  { name: "서울", lat: 37.5665, lon: 126.978, tz: 9, group: "국내" },
  { name: "부산", lat: 35.1796, lon: 129.0756, tz: 9, group: "국내" },
  { name: "인천", lat: 37.4563, lon: 126.7052, tz: 9, group: "국내" },
  { name: "대구", lat: 35.8714, lon: 128.6014, tz: 9, group: "국내" },
  { name: "대전", lat: 36.3504, lon: 127.3845, tz: 9, group: "국내" },
  { name: "광주", lat: 35.1595, lon: 126.8526, tz: 9, group: "국내" },
  { name: "울산", lat: 35.5384, lon: 129.3114, tz: 9, group: "국내" },
  { name: "수원", lat: 37.2636, lon: 127.0286, tz: 9, group: "국내" },
  { name: "춘천", lat: 37.8813, lon: 127.73, tz: 9, group: "국내" },
  { name: "강릉", lat: 37.7519, lon: 128.8761, tz: 9, group: "국내" },
  { name: "전주", lat: 35.8242, lon: 127.148, tz: 9, group: "국내" },
  { name: "청주", lat: 36.6424, lon: 127.489, tz: 9, group: "국내" },
  { name: "포항", lat: 36.019, lon: 129.3435, tz: 9, group: "국내" },
  { name: "창원", lat: 35.228, lon: 128.6811, tz: 9, group: "국내" },
  { name: "제주", lat: 33.4996, lon: 126.5312, tz: 9, group: "국내" },
  // 해외
  { name: "도쿄", lat: 35.6762, lon: 139.6503, tz: 9, group: "해외" },
  { name: "오사카", lat: 34.6937, lon: 135.5023, tz: 9, group: "해외" },
  { name: "베이징", lat: 39.9042, lon: 116.4074, tz: 8, group: "해외" },
  { name: "상하이", lat: 31.2304, lon: 121.4737, tz: 8, group: "해외" },
  { name: "홍콩", lat: 22.3193, lon: 114.1694, tz: 8, group: "해외" },
  { name: "타이베이", lat: 25.033, lon: 121.5654, tz: 8, group: "해외" },
  { name: "싱가포르", lat: 1.3521, lon: 103.8198, tz: 8, group: "해외" },
  { name: "방콕", lat: 13.7563, lon: 100.5018, tz: 7, group: "해외" },
  { name: "뉴델리", lat: 28.6139, lon: 77.209, tz: 5.5, group: "해외" },
  { name: "두바이", lat: 25.2048, lon: 55.2708, tz: 4, group: "해외" },
  { name: "런던", lat: 51.5074, lon: -0.1278, tz: 0, group: "해외" },
  { name: "파리", lat: 48.8566, lon: 2.3522, tz: 1, group: "해외" },
  { name: "베를린", lat: 52.52, lon: 13.405, tz: 1, group: "해외" },
  { name: "로마", lat: 41.9028, lon: 12.4964, tz: 1, group: "해외" },
  { name: "모스크바", lat: 55.7558, lon: 37.6173, tz: 3, group: "해외" },
  { name: "뉴욕", lat: 40.7128, lon: -74.006, tz: -5, group: "해외" },
  { name: "시카고", lat: 41.8781, lon: -87.6298, tz: -6, group: "해외" },
  { name: "로스앤젤레스", lat: 34.0522, lon: -118.2437, tz: -8, group: "해외" },
  { name: "토론토", lat: 43.6532, lon: -79.3832, tz: -5, group: "해외" },
  { name: "상파울루", lat: -23.5505, lon: -46.6333, tz: -3, group: "해외" },
  { name: "시드니", lat: -33.8688, lon: 151.2093, tz: 10, group: "해외" },
];
