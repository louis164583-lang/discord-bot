"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RemoveButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRemove() {
    if (!confirm("Remove this bot?")) return;
    setLoading(true);

    await fetch(`/api/bots/${encodeURIComponent(token)}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition"
    >
      {loading ? "Removing..." : "Remove"}
    </button>
  );
}
