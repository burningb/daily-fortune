import type { Metadata } from "next";
import { Cinzel, Nanum_Myeongjo, Gowun_Batang } from "next/font/google";
import "./globals.css";

// 타로/천문 느낌의 클래식 세리프 (라틴 · 로마숫자 · 별자리명)
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// 한글 본문용 명조 — 명상적이고 고요한 분위기
const nanumMyeongjo = Nanum_Myeongjo({
  variable: "--font-myeongjo",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

// 한글 제목/강조용 부드러운 명조
const gowunBatang = Gowun_Batang({
  variable: "--font-gowun",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "BIRTH SKY, TODAY · 오늘, 나의 날씨",
  description:
    "출생차트와 오늘의 천체 흐름이 만나는 지점을 읽어, 오늘의 감정·관계·행동의 가능성을 보여주는 모던 애스트롤로지 자기성찰 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${cinzel.variable} ${nanumMyeongjo.variable} ${gowunBatang.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
