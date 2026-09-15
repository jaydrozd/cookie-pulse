import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { NetworkHealthCard } from "@/components/NetworkHealthCard";
import { NightlyNetworkSync } from "@/components/NightlyNetworkSync";
import { PortfolioCard } from "@/components/PortfolioCard";
import { TokenSearch } from "@/components/TokenSearch";
import { WriteActions } from "@/components/WriteActions";
import {
  COOKIE_GENESIS_HASH,
  COOKIE_RPC,
  COOKIE_WALLETS_DOCS,
  COOKIE_WSS,
} from "@/lib/cookie-chain";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6 sm:py-8">
        <section className="rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-white sm:text-xl">
            Cookie Chain, at a glance
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-zinc-300">
            Cookie Pulse is a live explorer-lite + portfolio dashboard. Connect{" "}
            <strong className="text-amber-200">Nightly</strong>, read balances
            and network health from Cookie Chain RPC / Cookiescan DAS, then
            submit a real memo or tiny COOK transfer with clear transaction
            status.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-zinc-400">
            <Chip>RPC {COOKIE_RPC.replace("https://", "")}</Chip>
            <Chip>WSS {COOKIE_WSS.replace("https://", "")}</Chip>
            <Chip>genesis {COOKIE_GENESIS_HASH.slice(0, 12)}…</Chip>
            <a
              href={COOKIE_WALLETS_DOCS}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 hover:border-amber-400/40 hover:text-amber-200"
            >
              Wallet setup docs
            </a>
          </div>
          <div className="mt-3">
            <NightlyNetworkSync />
          </div>
        </section>

        <NetworkHealthCard />

        <div className="grid gap-4 lg:grid-cols-2">
          <PortfolioCard />
          <TokenSearch />
        </div>

        <WriteActions />

        <footer className="border-t border-white/5 pt-6 pb-10 text-center text-xs text-zinc-500">
          Built for the Superteam Earn bounty{" "}
          <em>Create an App on Cookie Chain</em>. Not affiliated with Cookie
          Chain core. Always verify URLs before signing.
        </footer>
      </main>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 bg-black/20 px-2.5 py-1 font-mono">
      {children}
    </span>
  );
}
