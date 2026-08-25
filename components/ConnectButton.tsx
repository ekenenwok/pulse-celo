"use client";

import { shortAddress } from "@/lib/celo";

export default function ConnectButton({
  address,
  connecting,
  onConnect,
}: {
  address: string | null;
  connecting: boolean;
  onConnect: () => void;
}) {
  if (address) {
    return (
      <div className="font-mono text-xs px-3 py-2 border border-rule rounded-sm bg-forest/5 text-forest">
        {shortAddress(address)}
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={connecting}
      className="font-body text-sm px-4 py-2 rounded-sm bg-forest text-parchment hover:bg-ink transition-colors disabled:opacity-60"
    >
      {connecting ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
