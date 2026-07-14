import FortuneCard from "@/app/components/FortuneCard";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-slate-900 to-slate-800 px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          🍀 오늘의 운세
        </h1>
        <p className="mt-2 text-slate-300">
          카드를 눌러 오늘의 운세와 행운의 아이템을 확인해보세요
        </p>
      </div>
      <FortuneCard />
    </main>
  );
}
