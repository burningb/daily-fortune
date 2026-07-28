# 🔮 오늘의 나에게

이름과 생년월일·태어난 시간을 입력하면 **모던 점성학**을 토대로 오늘의 나를 들여다보게 해주는 Next.js 웹 앱입니다. 예언이 아니라, 별과 별자리를 통해 나를 알아가는 시간을 위한 앱입니다.

## 기능

- 🌌 생년월일로 **태양궁(별자리)**, 태어난 시간+출생 지역으로 **정확한 상승궁(어센던트)** 계산 (항성시 기반)
- 🪐 **천궁도(네이탈 차트)** — 태양·달·수성~명왕성 위치, 홀사인 하우스, 애스펙트를 휠·표로 표시 (자체 천체력, 외부 API 없음)
- 🃏 카드가 3D로 뒤집히며 실제 별자리 성좌와 오늘의 키워드 공개
- 🌠 별 이름 라벨 · 반짝임 · 배경 패럴랙스로 살아있는 밤하늘 연출
- 📊 총운·애정운·건강운 등 영역별 기운을 별점 + 막대 그래프로 표시
- 👍🙅 오늘 하면 좋은 것 / 피할 것 조언
- 🎁 행운의 아이템 · 색 · 숫자 · 방향 · 시간
- 💞 원소 궁합이 좋은 별자리 추천
- 📅 같은 사람은 하루 동안 동일한 결과 (날짜+개인정보 기반 시드)

## 실행

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 기술 스택

- [Next.js 16](https://nextjs.org) (App Router)
- React · TypeScript
- Tailwind CSS

> 모든 계산은 브라우저에서 동작하며 별도의 백엔드/API가 필요 없습니다.

## 구조

- `app/page.tsx` — 메인 페이지
- `app/components/FortuneApp.tsx` — 입력 폼 & 결과 UI
- `app/components/Constellation.tsx` — 실제 항성 데이터 기반 별자리 성좌 SVG
- `lib/astrology.ts` — 별자리 판정 및 점성학 기반 리딩 생성 로직
- `lib/constellations.ts` — 12별자리 항성 좌표·등급 데이터
- `lib/cities.ts` — 상승궁 계산용 출생 지역(위·경도·시간대) 데이터
- `lib/ephemeris.ts` — 태양·달·행성 위치 천체력(Schlyter 알고리즘)
- `app/components/NatalChart.tsx` — 천궁도 휠·행성표·애스펙트 UI
