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
  title: "오늘의 나에게 · 별과 타로",
  description: "별과 별자리를 통해 오늘의 나를 들여다보는 시간",
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
