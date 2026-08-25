"use client";

import { useEffect, useState } from "react";
import { shortAddress } from "@/lib/celo";
import type { Pulse } from "@/lib/store";

function timeAgo(iso: string) {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

export default function Ledger() {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/pulses", { cache: "no-store" });
      const data = await res.json();
      setPulses(data.pulses ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-rule rounded-sm bg-parchment/60">
      <div className="flex items-baseline justify-between px-5 py-4 border-b border-rule">
        <h2 className="font-display text-lg text-ink">Ledger</h2>
        <span className="font-mono text-xs text-moss uppercase tracking-wide">
          live · every 8s
        </span>
      </div>

      {loading && (
        <p className="px-5 py-8 text-sm text-moss font-body">Reading the chain…</p>
      )}

      {!loading && pulses.length === 0 && (
        <p className="px-5 py-8 text-sm text-moss font-body">
          No pulses yet. Send the first one below.
        </p>
      )}

      <ul>
        {pulses.map((p, i) => (
          <li
            key={p.id}
            className="animate-fadeUp border-b border-rule last:border-b-0 px-5 py-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center"
            style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }}
          >
            <span className="font-mono text-xs text-moss w-6 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <p className="font-body text-sm text-ink truncate">
                <span className="font-mono">{shortAddress(p.from_address)}</span>
                <span className="text-moss mx-2">→</span>
                <span className="font-mono">{shortAddress(p.to_address)}</span>
              </p>
              <p className="font-display italic text-sm text-forest mt-0.5 truncate">
                {p.reaction}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-mono text-sm text-gold font-medium">
                {Number(p.amount).toFixed(2)} cUSD
              </p>
              <p className="font-mono text-[11px] text-moss">{timeAgo(p.created_at)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
