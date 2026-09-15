# Cookie Pulse

Live **Cookie Chain** explorer-lite + portfolio pulse: Nightly wallet connect, COOK/SPL balances, network health, Cookiescan DAS token search, and real on-chain write paths (memo + tiny COOK transfer) with transaction status UI.

Built for the Superteam Earn bounty [*Create an App on Cookie Chain*](https://superteam.fun/earn/listing/create-an-app-on-cookie-chain-app/) (1000 USDC).

## Features

| Feature | Details |
| --- | --- |
| Wallet | **Nightly required** (explicit `NightlyWalletAdapter`) + Wallet Standard for other Solana wallets |
| Network switch | Calls `window.nightly.solana.changeNetwork({ genesisHash, url })` after Nightly connects |
| Reads | Slot / epoch / latency / validators via `https://rpc.cookiescan.io`; COOK + SPL balances; DAS `searchAssets` / `getAssetsByOwner` via `https://api.cookiescan.io` |
| Writes | Memo program (`MemoSq4…`) and native COOK `SystemProgram.transfer` with building → signing → confirming → success/error UI |
| Charts | Live RPC latency sparkline (Recharts) |
| UI | Dark, mobile-responsive Next.js App Router + TypeScript + Tailwind |

## Network endpoints

| Role | URL |
| --- | --- |
| RPC | `https://rpc.cookiescan.io` |
| WebSocket | `https://wss.cookiescan.io` |
| DAS API | `https://api.cookiescan.io` |
| Explorer | `https://cookiescan.io` |
| Bridge | `https://bridge.cookiescan.io` |
| Swap | `https://swap.cookiescan.io` |
| Docs | `https://docs.cookiechain.wtf/` |
| Wallets | `https://docs.cookiechain.wtf/wallets` |

**Genesis hash** (from `getGenesisHash`):

```text
9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2
```

## Nightly setup for Cookie Chain

1. Install [Nightly](https://nightly.app/) (browser extension).
2. Open Cookie Pulse and click **Select Wallet → Nightly**.
3. On connect, the app calls Nightly `changeNetwork` with the Cookie Chain genesis hash + RPC above.
4. If auto-switch fails, set a custom SVM / RPC network in Nightly manually:
   - RPC: `https://rpc.cookiescan.io`
   - WebSocket: `https://wss.cookiescan.io`
5. Fund the wallet with a little **COOK** (via [bridge](https://bridge.cookiescan.io)) before memo/transfer tests.

## Run locally

```bash
cd cookie-pulse
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm install
npm run build
npm start
```

## Deploy (suggested: Vercel)

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com) (framework: Next.js).
3. No env vars required for the default public RPC/DAS endpoints.
4. Deploy → set the live URL for Superteam submission.

Optional: pin a private RPC later via `NEXT_PUBLIC_COOKIE_RPC` if you extend `src/lib/cookie-chain.ts`.

## On-chain verification checklist

- [ ] RPC `getHealth` → `ok`
- [ ] Connect Nightly; address shown in Portfolio
- [ ] COOK balance + optional SPL list loads
- [ ] Network health card shows live slot / latency chart
- [ ] Token search returns fungible assets from Cookiescan DAS
- [ ] **Memo**: sign → confirm → explorer link on Cookiescan
- [ ] **Transfer** (optional): send tiny COOK with status UI

## Project layout

```text
src/
  app/                 # Next.js App Router pages
  components/          # UI + wallet provider + write actions
  hooks/               # network health + balances
  lib/                 # Cookie Chain constants, DAS, Nightly helper
```

## Submission notes (do not auto-submit)

When you are ready for Superteam Earn:

- GitHub repository (public)
- Live application URL
- Relevant addresses (e.g. memo program `MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr`)

## License

MIT
