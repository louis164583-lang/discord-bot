"use client";

import { useState, useEffect } from "react";

export default function ViewTokenButton({ token }: { token: string }) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!visible) return;
    setCountdown(30);
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setVisible(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [visible]);

  if (visible) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <code className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded font-mono text-green-400 select-all break-all">
          {token}
        </code>
        <span className="text-xs text-gray-500 shrink-0">hides in {countdown}s</span>
        <button
          onClick={() => setVisible(false)}
          className="text-xs text-gray-500 hover:text-gray-300 transition shrink-0"
        >
          Hide
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-gray-400 text-sm">{token.slice(0, 20)}***</span>
      <button
        onClick={() => setVisible(true)}
        className="text-gray-500 hover:text-gray-300 transition"
        title="View full token"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
