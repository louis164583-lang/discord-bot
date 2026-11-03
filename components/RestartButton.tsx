"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RestartButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleRestart() {
    if (!confirm("Restart all bots?")) return;
    setLoading(true);
    setMsg("");

    const res = await fetch("/api/bots/restart", { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setMsg("Restarting...");
      setTimeout(() => {
        setMsg("");
        router.refresh();
      }, 4000);
    } else {
      setMsg("Failed to restart");
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleRestart}
        disabled={loading}
        className="bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 text-white text-xs font-medium rounded px-3 py-1.5 transition"
      >
        {loading ? "Restarting..." : "Restart All Bots"}
      </button>
      {msg && <span className="text-xs text-yellow-400">{msg}</span>}
    </div>
  );
}
