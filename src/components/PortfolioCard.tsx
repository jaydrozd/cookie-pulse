"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Coins, RefreshCw, Wallet } from "lucide-react";
import { useWalletBalances } from "@/hooks/useWalletBalances";
import { formatCook, shortenAddress } from "@/lib/format";
import { explorerAddressUrl, explorerTokenUrl } from "@/lib/cookie-chain";

export function PortfolioCard() {
  const { publicKey, connected } = useWallet();
  const { cookLamports, tokens, loading, error, refresh } = useWalletBalances();

  if (!connected || !publicKey) {
    return (
      <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-semibold text-white">Portfolio</h2>
        </div>
        <p className="mt-3 text-sm text-zinc-400">
          Connect Nightly (or another Solana wallet pointed at Cookie Chain) to
          view COOK + SPL balances.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Portfolio</h2>
          </div>
          <a
            href={explorerAddressUrl(publicKey.toBase58())}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block font-mono text-xs text-zinc-400 hover:text-amber-300"
          >
            {shortenAddress(publicKey.toBase58(), 6)}
          </a>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-amber-400/40 hover:text-amber-200"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wide text-amber-200/70">
          Native COOK
        </div>
        <div className="mt-1 font-mono text-2xl font-semibold text-amber-100">
          {cookLamports == null ? "…" : formatCook(cookLamports)}{" "}
          <span className="text-base font-medium text-amber-200/80">COOK</span>
        </div>
      </div>

      {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
          SPL tokens ({tokens.length})
        </h3>
        {tokens.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-zinc-500">
            {loading ? "Loading token accounts…" : "No SPL balances found."}
          </p>
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
            {tokens.map((t) => (
              <li
                key={t.mint}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm text-zinc-100">
                    {t.symbol || t.name || "Token"}
                  </div>
                  <a
                    href={explorerTokenUrl(t.mint)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-zinc-500 hover:text-amber-300"
                  >
                    {shortenAddress(t.mint, 4)}
                  </a>
                </div>
                <div className="shrink-0 font-mono text-sm text-zinc-200">
                  {t.uiAmount == null
                    ? t.amount
                    : t.uiAmount.toLocaleString(undefined, {
                        maximumFractionDigits: Math.min(t.decimals, 6),
                      })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
