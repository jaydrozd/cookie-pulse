"use client";

import { type ReactNode, useEffect } from "react";
import { WalletProvider } from "./WalletProvider";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Ensure Buffer exists for @solana/web3.js memo encoding in the browser.
    void import("buffer").then(({ Buffer }) => {
      if (typeof window !== "undefined" && !(window as unknown as { Buffer?: unknown }).Buffer) {
        (window as unknown as { Buffer: typeof Buffer }).Buffer = Buffer;
      }
      if (typeof globalThis !== "undefined" && !(globalThis as { Buffer?: unknown }).Buffer) {
        (globalThis as { Buffer: typeof Buffer }).Buffer = Buffer;
      }
    });
  }, []);

  return <WalletProvider>{children}</WalletProvider>;
}
