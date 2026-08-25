"use client";

import { useState } from "react";
import ConnectButton from "@/components/ConnectButton";
import SendPulse from "@/components/SendPulse";
import Ledger from "@/components/Ledger";
import { connectWallet } from "@/lib/celo";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [ledgerKey, setLedgerKey] = useState(0);

  async function handleConnect() {
    setConnecting(true);
    try {
      const addr = await connectWallet();
      setAddress(addr);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-2xl mx-auto px-5 md:px-0">
        <header className="flex items-center justify-between py-6 border-b border-rule">
          <span className="font-display text-xl tracking-tight text-ink">
            PULSE
          </span>
          <ConnectButton
            address={address}
            connecting={connecting}
            onConnect={handleConnect}
          />
        </header>

        <section className="py-14 border-b border-rule">
          <p className="font-mono text-xs uppercase tracking-widest text-gold mb-4">
            Built on Celo
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.1] text-ink mb-6">
            Every pulse is real value,{" "}
            <span className="italic text-forest">moved</span> — not simulated.
          </h1>
          <p className="font-body text-base text-moss max-w-md leading-relaxed">
            Send cUSD to someone, and an agent writes the line that goes
            with it. No likes, no simulated volume — just two wallets, a
            transfer, and a ledger that remembers it.
          </p>
        </section>

        <section className="py-10 grid gap-8">
          <SendPulse address={address} onSent={() => setLedgerKey((k) => k + 1)} />
          <Ledger key={ledgerKey} />
        </section>

        <footer className="py-10 text-center">
          <p className="font-mono text-xs text-moss">
            settled on celo · cUSD · demo mode until wired to mainnet
          </p>
        </footer>
      </div>
    </main>
  );
}
