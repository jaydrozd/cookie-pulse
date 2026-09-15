"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { switchNightlyToCookieChain } from "@/lib/nightly";
import { COOKIE_GENESIS_HASH, COOKIE_RPC } from "@/lib/cookie-chain";

/**
 * After Nightly connects, call changeNetwork with Cookie Chain genesisHash + RPC.
 */
export function NightlyNetworkSync() {
  const { connected, wallet } = useWallet();
  const [status, setStatus] = useState<string | null>(null);
  const attempted = useRef<string | null>(null);

  useEffect(() => {
    if (!connected || !wallet) return;
    const name = wallet.adapter.name;
    const key = `${name}:${wallet.adapter.publicKey?.toBase58() || "pending"}`;
    if (attempted.current === key) return;

    const run = async () => {
      if (name !== "Nightly") {
        setStatus(
          `Connected via ${name}. Ensure wallet RPC is ${COOKIE_RPC} (genesis ${COOKIE_GENESIS_HASH.slice(0, 8)}…).`
        );
        attempted.current = key;
        return;
      }
      const result = await switchNightlyToCookieChain();
      attempted.current = key;
      setStatus(result.ok ? result.message : `Nightly network: ${result.message}`);
    };

    void run();
  }, [connected, wallet]);

  if (!status) return null;

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-100/90">
      {status}
    </div>
  );
}
