import FortuneApp from "@/app/components/FortuneApp";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          🔮 오늘의 운세
        </h1>
        <p className="mt-2 text-slate-300">
          이름과 생년월일·태어난 시간으로 보는 모던 점성술 운세
        </p>
      </div>
      <FortuneApp />
    </main>
  );
}
