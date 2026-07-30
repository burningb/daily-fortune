"use client";

import { useEffect, useState } from "react";

// 백엔드 없이 방문자 수를 세기 위해 무료 hit counter 사용.
// (익명 카운터 — 개인정보를 보내지 않으며, 세션당 1회만 증가시킨다. 실패 시 아무것도 표시하지 않음.)
const NS = "birth-sky-today";
const KEY = "visits";
const SESSION_FLAG = "bstoday.counted";

export default function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const counted = sessionStorage.getItem(SESSION_FLAG);
        const url = counted
          ? `https://abacus.jasoncameron.dev/get/${NS}/${KEY}`
          : `https://abacus.jasoncameron.dev/hit/${NS}/${KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        const value = typeof data?.value === "number" ? data.value : null;
        if (!cancelled && value != null) {
          setCount(value);
          sessionStorage.setItem(SESSION_FLAG, "1");
        }
      } catch {
        /* 카운터 실패 시 조용히 숨김 */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count == null) return null;

  return (
    <p className="font-gowun text-[11px] tracking-[0.05em] text-indigo-100/45">
      ☾ 지금까지 {count.toLocaleString()}명이 오늘의 하늘을 만났어요
    </p>
  );
}
