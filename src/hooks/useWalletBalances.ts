"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getAssetsByOwner, type DasTokenItem } from "@/lib/das";

export type SplBalance = {
  mint: string;
  amount: string;
  decimals: number;
  uiAmount: number | null;
  name?: string;
  symbol?: string;
};

export function useWalletBalances() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [cookLamports, setCookLamports] = useState<number | null>(null);
  const [tokens, setTokens] = useState<SplBalance[]>([]);
  const [dasAssets, setDasAssets] = useState<DasTokenItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setCookLamports(null);
      setTokens([]);
      setDasAssets([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [lamports, tokenAccounts, das] = await Promise.all([
        connection.getBalance(publicKey, "confirmed"),
        connection.getParsedTokenAccountsByOwner(
          publicKey,
          { programId: TOKEN_PROGRAM_ID },
          "confirmed"
        ),
        getAssetsByOwner(publicKey.toBase58()).catch(() => [] as DasTokenItem[]),
      ]);

      setCookLamports(lamports);
      setDasAssets(das);

      const dasByMint = new Map(das.map((a) => [a.id, a]));
      const spl: SplBalance[] = tokenAccounts.value
        .map((acc) => {
          const info = acc.account.data.parsed.info;
          const mint: string = info.mint;
          const ta = info.tokenAmount;
          const meta = dasByMint.get(mint);
          return {
            mint,
            amount: ta.amount as string,
            decimals: ta.decimals as number,
            uiAmount: ta.uiAmount as number | null,
            name: meta?.content?.metadata?.name,
            symbol:
              meta?.content?.metadata?.symbol ||
              meta?.token_info?.symbol ||
              undefined,
          };
        })
        .filter((t) => t.uiAmount === null || t.uiAmount > 0)
        .sort((a, b) => (b.uiAmount || 0) - (a.uiAmount || 0));

      setTokens(spl);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    if (!connected || !publicKey) {
      setCookLamports(null);
      setTokens([]);
      setDasAssets([]);
      return;
    }
    void refresh();
    const id = window.setInterval(() => void refresh(), 20_000);
    return () => window.clearInterval(id);
  }, [connected, publicKey, refresh]);

  return { cookLamports, tokens, dasAssets, loading, error, refresh };
}
