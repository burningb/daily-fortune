"use client";

import { useState } from "react";

const W = 1080;
const H = 1350;

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const ch of text) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export default function ShareCard({
  headline,
  question,
  dateLabel,
}: {
  headline: string;
  question: string;
  dateLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  const render = (): string => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // 배경
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0b0a24");
    g.addColorStop(0.55, "#05040f");
    g.addColorStop(1, "#030210");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // 잔별
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    const stars = [
      [120, 180], [900, 140], [300, 320], [780, 400], [180, 900],
      [960, 820], [520, 1180], [240, 1120], [860, 1150], [640, 260],
    ];
    for (const [x, y] of stars) {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 금빛 테두리
    ctx.strokeStyle = "rgba(233,200,119,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.strokeStyle = "rgba(233,200,119,0.25)";
    ctx.strokeRect(60, 60, W - 120, H - 120);

    const gold = "#e9c877";
    const cream = "#f3e9d2";
    ctx.textAlign = "center";

    // 상단 타이틀
    ctx.fillStyle = gold;
    ctx.font = "600 34px 'Times New Roman', serif";
    ctx.fillText("☾  B I R T H   S K Y ,   T O D A Y  ☽", W / 2, 170);
    ctx.fillStyle = cream;
    ctx.font = "700 60px serif";
    ctx.fillText("오늘, 나의 날씨", W / 2, 250);
    ctx.fillStyle = "rgba(199,205,255,0.55)";
    ctx.font = "400 30px serif";
    ctx.fillText(dateLabel, W / 2, 310);

    // 오늘의 한 문장
    ctx.fillStyle = cream;
    ctx.font = "600 56px serif";
    const hl = wrapText(ctx, headline, W - 260);
    let y = 560;
    for (const l of hl) {
      ctx.fillText(l, W / 2, y);
      y += 78;
    }

    // 구분
    ctx.fillStyle = gold;
    ctx.font = "400 40px serif";
    ctx.fillText("✦", W / 2, y + 40);

    // 오늘의 질문
    ctx.fillStyle = gold;
    ctx.font = "600 30px serif";
    ctx.fillText("오늘의 질문", W / 2, y + 130);
    ctx.fillStyle = "rgba(236,231,255,0.85)";
    ctx.font = "italic 400 40px serif";
    const q = wrapText(ctx, question, W - 300);
    let qy = y + 195;
    for (const l of q) {
      ctx.fillText(l, W / 2, qy);
      qy += 56;
    }

    // 푸터
    ctx.fillStyle = "rgba(233,200,119,0.6)";
    ctx.font = "400 28px serif";
    ctx.fillText("@burning_bunnies", W / 2, H - 90);

    return canvas.toDataURL("image/png");
  };

  const download = () => {
    const url = render();
    const a = document.createElement("a");
    a.href = url;
    a.download = "birth-sky-today.png";
    a.click();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${headline}\n\n오늘의 질문\n${question}\n\nBIRTH SKY, TODAY · 오늘, 나의 날씨`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={download}
          className="font-serif rounded-md border border-gold/50 bg-gold/10 px-5 py-2 text-sm tracking-[0.1em] text-gold transition hover:bg-gold/20 active:scale-95"
        >
          이미지로 저장
        </button>
        <button
          type="button"
          onClick={copy}
          className="rounded-md border border-white/15 px-5 py-2 text-sm text-indigo-100/70 transition hover:border-gold/30 hover:text-gold/90 active:scale-95"
        >
          문장 복사
        </button>
      </div>
      {copied && (
        <p className="text-[11px] text-emerald-200/70">✓ 복사되었습니다</p>
      )}
      <p className="text-[11px] text-indigo-100/40">
        출생 정보는 카드에 포함되지 않습니다
      </p>
    </div>
  );
}
