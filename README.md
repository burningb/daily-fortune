# 🍀 오늘의 운세

카드를 뒤집어 오늘의 운세와 행운의 아이템을 확인하는 Next.js 웹 앱입니다.

## 기능

- 🔮 카드를 누르면 3D로 뒤집히며 랜덤 운세가 나옵니다
- 🎁 행운의 아이템 · 색 · 숫자 추천
- 📊 애정운 · 금전운 · 건강운 · 직장운 지수를 막대 그래프로 표시
- 💞 궁합이 좋은 띠 추천
- 🔁 "다시 뽑기"로 새 운세 확인

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

## 구조

- `app/page.tsx` — 메인 페이지
- `app/components/FortuneCard.tsx` — 운세 카드 UI
- `lib/fortunes.ts` — 운세 데이터 및 랜덤 로직
