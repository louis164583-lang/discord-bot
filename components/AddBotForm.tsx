"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddBotForm() {
  const [token, setToken] = useState("");
  const [channelId, setChannelId] = useState("");
  const [pm2Name, setPm2Name] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/bots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminToken: token, alertChannel: channelId, pm2Name }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setToken("");
    setChannelId("");
    setPm2Name("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <input
        type="text"
        placeholder="Discord token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        required
      />
      <input
        type="text"
        placeholder="Alert channel ID"
        value={channelId}
        onChange={(e) => setChannelId(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
        required
      />
      <input
        type="text"
        placeholder="PM2 process name (e.g. member-alert-bot)"
        value={pm2Name}
        onChange={(e) => setPm2Name(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded px-4 py-2 transition"
      >
        {loading ? "Adding..." : "Add Bot"}
      </button>
    </form>
  );
}
