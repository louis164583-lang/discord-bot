"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ intervalSeconds = 30 }: { intervalSeconds?: number }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(intervalSeconds);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setRefreshing(true);
          router.refresh();
          setTimeout(() => setRefreshing(false), 1000);
          return intervalSeconds;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [router, intervalSeconds]);

  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500">
      {refreshing ? (
        <>
          <svg className="animate-spin w-3 h-3 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-indigo-400">Refreshing...</span>
        </>
      ) : (
        <>
          <span className="tabular-nums">Refreshes in {countdown}s</span>
        </>
      )}
    </div>
  );
}
