"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BackfillButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleClick() {
    setLoading(true);
    setMsg("");
    const res = await fetch("/api/bots/backfill", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setMsg(`Updated ${data.updated} of ${data.total} bots`);
      router.refresh();
    } else {
      setMsg("Failed to refresh usernames");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="text-xs text-gray-400 hover:text-white disabled:opacity-50 transition"
      >
        {loading ? "Refreshing..." : "Refresh Usernames"}
      </button>
      {msg && <span className="text-xs text-gray-500">{msg}</span>}
    </div>
  );
}
