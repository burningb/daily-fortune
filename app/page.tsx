import FortuneApp from "@/app/components/FortuneApp";

export default function Home() {
  return (
    <main className="night-sky flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-4 py-20">
      {/* 밤하늘 별과 달빛 */}
      <div className="stars" aria-hidden />
      <div className="moon-glow" aria-hidden />

      <header className="animate-rise text-center">
        <p className="font-serif mb-3 text-xs tracking-[0.5em] text-gold/80">
          ☾ CELESTIAL FORTUNE ☽
        </p>
        <h1 className="font-serif gold-shimmer text-4xl font-semibold tracking-wide sm:text-5xl">
          오늘의 운세
        </h1>
        <p className="font-gowun mx-auto mt-4 max-w-sm text-sm leading-relaxed text-indigo-100/70">
          별이 내려앉은 자리에서, 이름과 생년월일·태어난 시간으로
          당신의 오늘을 조용히 읽어드립니다.
        </p>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-gold/60">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-sm">✦</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </header>

      <FortuneApp />
    </main>
  );
}
