"use client";

import dynamic from "next/dynamic";
import { Cookie, ExternalLink } from "lucide-react";
import {
  COOKIE_BRIDGE,
  COOKIE_DOCS,
  COOKIE_EXPLORER,
  COOKIE_SWAP,
} from "@/lib/cookie-chain";

const WalletMultiButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0b0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20">
            <Cookie className="h-5 w-5 text-[#1a1008]" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
              Cookie Pulse
            </h1>
            <p className="text-[11px] text-zinc-400 sm:text-xs">
              Live portfolio + network pulse on Cookie Chain
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden items-center gap-3 text-xs text-zinc-400 md:flex">
            <a
              className="inline-flex items-center gap-1 hover:text-amber-300"
              href={COOKIE_EXPLORER}
              target="_blank"
              rel="noreferrer"
            >
              Explorer <ExternalLink className="h-3 w-3" />
            </a>
            <a
              className="inline-flex items-center gap-1 hover:text-amber-300"
              href={COOKIE_SWAP}
              target="_blank"
              rel="noreferrer"
            >
              Cookieswap <ExternalLink className="h-3 w-3" />
            </a>
            <a
              className="inline-flex items-center gap-1 hover:text-amber-300"
              href={COOKIE_BRIDGE}
              target="_blank"
              rel="noreferrer"
            >
              Bridge <ExternalLink className="h-3 w-3" />
            </a>
            <a
              className="inline-flex items-center gap-1 hover:text-amber-300"
              href={COOKIE_DOCS}
              target="_blank"
              rel="noreferrer"
            >
              Docs <ExternalLink className="h-3 w-3" />
            </a>
          </nav>
          <WalletMultiButton className="!h-10 !rounded-xl !bg-amber-500 !px-4 !text-sm !font-semibold !text-[#1a1008] hover:!bg-amber-400" />
        </div>
      </div>
    </header>
  );
}
