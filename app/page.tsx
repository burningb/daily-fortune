import FortuneApp from "@/app/components/FortuneApp";

export default function Home() {
  return (
    <main className="night-sky flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden px-4 py-20">
      {/* 깊이감 있는 밤하늘: 떠다니는 성운 + 원경/근경 별밭 + 달빛 */}
      <div className="nebula nebula-1" aria-hidden />
      <div className="nebula nebula-2" aria-hidden />
      <div className="starfield layer-far" aria-hidden />
      <div className="starfield layer-near" aria-hidden />
      <div className="moon-glow" aria-hidden />

      <header className="animate-rise text-center">
        <p className="font-serif mb-3 text-xs tracking-[0.5em] text-gold/80">
          ☾ BIRTH SKY, TODAY ☽
        </p>
        <h1 className="font-serif gold-shimmer text-4xl font-semibold tracking-wide sm:text-5xl">
          오늘, 나의 날씨
        </h1>
        <p className="font-gowun mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-indigo-100/70">
          태어난 순간의 하늘은 변하지 않지만, 오늘의 하늘은 계속 움직입니다.
          <br />
          경민님이 두 하늘이 만나는 지점을 읽어, 오늘을 조금 더 선명하게 바라보게 합니다.
        </p>
        <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-gold/60">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/50" />
          <span className="text-sm">✦</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/50" />
        </div>
      </header>

      <FortuneApp />

      {/* 크레딧 */}
      <footer className="relative mt-4 flex flex-col items-center gap-1 pb-2 text-center">
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <p className="font-serif mt-3 text-[10px] tracking-[0.4em] text-gold/50">
          CREDIT
        </p>
        <p className="font-gowun text-sm tracking-[0.15em] text-indigo-50/80">
          KIM KYUNG MIN
        </p>
        <a
          href="https://www.instagram.com/burning_bunnies/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-gowun text-xs text-gold/70 underline-offset-4 transition hover:text-gold hover:underline"
        >
          @burning_bunnies
        </a>
      </footer>
    </main>
  );
}
