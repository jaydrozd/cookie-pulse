"use client";

import { useCallback, useMemo, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-nightly";
import { COOKIE_RPC, COOKIE_WSS } from "@/lib/cookie-chain";

import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletProvider({ children }: { children: ReactNode }) {
  const endpoint = COOKIE_RPC;
  const wallets = useMemo(() => {
    // Explicit Nightly adapter (bounty requirement). Wallet Standard also
    // surfaces other installed Solana wallets automatically.
    return [new NightlyWalletAdapter()];
  }, []);

  const onError = useCallback((error: Error) => {
    console.error("[Cookie Pulse wallet]", error);
  }, []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: "confirmed",
        wsEndpoint: COOKIE_WSS,
      }}
    >
      <SolanaWalletProvider
        wallets={wallets}
        autoConnect
        onError={onError}
        localStorageKey="cookie-pulse-wallet"
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
