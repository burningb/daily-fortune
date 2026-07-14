import FortuneCard from "@/app/components/FortuneCard";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-10 overflow-hidden bg-slate-950 px-4 py-16">
      {/* 프라이드 무지개 배경 */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#E40303,#FF8C00,#FFED00,#008026,#004DFF,#750787)] opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[linear-gradient(90deg,#E40303,#FF8C00,#FFED00,#008026,#004DFF,#750787)]" />
      <div className="relative text-center">
        <h1 className="bg-[linear-gradient(90deg,#E40303,#FF8C00,#FFED00,#008026,#004DFF,#750787)] bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">
          🏳️‍🌈 오늘의 운세
        </h1>
        <p className="mt-2 text-slate-200">
          카드를 눌러 오늘의 운세와 행운의 아이템을 확인해보세요
        </p>
      </div>
      <div className="relative">
        <FortuneCard />
      </div>
    </main>
  );
}
