"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchFungibleTokens, type DasTokenItem } from "@/lib/das";
import { explorerTokenUrl } from "@/lib/cookie-chain";
import { formatNumber, shortenAddress } from "@/lib/format";

export function TokenSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<DasTokenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await searchFungibleTokens(query, 10);
        if (!cancelled) setResults(items);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [query]);

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Search className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-semibold text-white">Token search</h2>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400">
          Cookiescan DAS
        </span>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, symbol, or mint…"
        className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-zinc-100 outline-none ring-amber-400/0 placeholder:text-zinc-600 focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/20"
      />

      {error && <p className="mt-2 text-xs text-rose-300">{error}</p>}

      <div className="mt-3 space-y-2">
        {loading && (
          <p className="text-xs text-zinc-500">Searching api.cookiescan.io…</p>
        )}
        {!loading && results.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-center text-xs text-zinc-500">
            No tokens matched.
          </p>
        )}
        {results.map((item) => {
          const name = item.content?.metadata?.name || "Unknown";
          const symbol =
            item.content?.metadata?.symbol ||
            item.token_info?.symbol ||
            "???";
          const decimals = item.token_info?.decimals ?? 0;
          const supply = item.token_info?.supply;
          return (
            <a
              key={item.id}
              href={explorerTokenUrl(item.id)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/20 px-3 py-2.5 transition hover:border-amber-400/30"
            >
              <div className="min-w-0">
                <div className="truncate text-sm text-zinc-100">
                  {name}{" "}
                  <span className="text-zinc-500">({symbol})</span>
                </div>
                <div className="font-mono text-[11px] text-zinc-500">
                  {shortenAddress(item.id, 6)} · {decimals}d
                  {typeof supply === "number" && supply > 0
                    ? ` · supply ${formatNumber(supply / 10 ** decimals, 2)}`
                    : ""}
                </div>
              </div>
              <div className="shrink-0 text-right text-[11px] text-zinc-400">
                {item.holder_count != null && item.holder_count > 0 && (
                  <div>{formatNumber(item.holder_count)} holders</div>
                )}
                {item.volume_24h != null && item.volume_24h > 0 && (
                  <div>vol {formatNumber(item.volume_24h, 2)}</div>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
