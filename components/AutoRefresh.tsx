"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ intervalSeconds = 30 }: { intervalSeconds?: number }) {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
      setLastUpdated(new Date());
    }, intervalSeconds * 1000);

    return () => clearInterval(id);
  }, [router, intervalSeconds]);

  return (
    <span className="text-xs text-gray-500">
      Updated {lastUpdated.toLocaleTimeString()}
    </span>
  );
}
