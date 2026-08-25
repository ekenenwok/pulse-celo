"use client";

import { useState } from "react";
import { sendPulse } from "@/lib/celo";

export default function SendPulse({
  address,
  onSent,
}: {
  address: string | null;
  onSent: () => void;
}) {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("1");
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!address) {
      setError("Connect a wallet first.");
      return;
    }
    if (!to || !amount) {
      setError("Recipient address and amount are required.");
      return;
    }

    setSending(true);
    try {
      const txHash = await sendPulse(to, amount);

      await fetch("/api/pulses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromAddress: address,
          toAddress: to,
          amount,
          note,
          txHash,
        }),
      });

      setTo("");
      setNote("");
      onSent();
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong sending that pulse.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSend}
      className="border border-rule rounded-sm bg-parchment/60 p-5 space-y-4"
    >
      <h2 className="font-display text-lg text-ink">Send a pulse</h2>

      <div>
        <label className="block font-mono text-xs text-moss uppercase tracking-wide mb-1">
          Recipient address
        </label>
        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="0x…"
          className="w-full font-mono text-sm bg-transparent border border-rule rounded-sm px-3 py-2 text-ink placeholder:text-moss/50"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-mono text-xs text-moss uppercase tracking-wide mb-1">
            Amount (cUSD)
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            min="0.1"
            step="0.1"
            className="w-full font-mono text-sm bg-transparent border border-rule rounded-sm px-3 py-2 text-ink"
          />
        </div>
        <div className="flex-[2]">
          <label className="block font-mono text-xs text-moss uppercase tracking-wide mb-1">
            Note (optional)
          </label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="for the vibes"
            className="w-full font-body text-sm bg-transparent border border-rule rounded-sm px-3 py-2 text-ink placeholder:text-moss/50"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-700 font-body">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full font-body text-sm px-4 py-2.5 rounded-sm bg-gold text-ink font-medium hover:bg-amber transition-colors disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send pulse"}
      </button>
    </form>
  );
}
