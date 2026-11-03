"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditTokenForm({ currentToken }: { currentToken: string }) {
  const [editing, setEditing] = useState(false);
  const [newToken, setNewToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/bots/${encodeURIComponent(currentToken)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newToken }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    setEditing(false);
    setNewToken("");
    router.refresh();
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-gray-500 hover:text-indigo-400 transition"
        title="Update token"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 py-1">
      {error && <span className="text-red-400 text-xs">{error}</span>}
      <input
        type="text"
        placeholder="Paste new token"
        value={newToken}
        onChange={(e) => setNewToken(e.target.value)}
        className="bg-gray-800 border border-gray-700 focus:border-indigo-500 rounded px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none w-full"
        required
        autoFocus
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded px-2 py-1 transition"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => { setEditing(false); setError(""); setNewToken(""); }}
          className="text-xs text-gray-500 hover:text-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
