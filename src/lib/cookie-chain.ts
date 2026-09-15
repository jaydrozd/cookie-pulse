import { Connection, PublicKey } from "@solana/web3.js";

/** Cookie Chain network constants (verified against live RPC). */
export const COOKIE_RPC = "https://rpc.cookiescan.io";
export const COOKIE_WSS = "https://wss.cookiescan.io";
export const COOKIE_DAS = "https://api.cookiescan.io";
export const COOKIE_BRIDGE = "https://bridge.cookiescan.io";
export const COOKIE_EXPLORER = "https://cookiescan.io";
export const COOKIE_SWAP = "https://swap.cookiescan.io";
export const COOKIE_DOCS = "https://docs.cookiechain.wtf/";
export const COOKIE_WALLETS_DOCS = "https://docs.cookiechain.wtf/wallets";

/** Genesis hash from getGenesisHash on Cookie Chain RPC. */
export const COOKIE_GENESIS_HASH = "9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2";

/** Memo program (confirmed deployed on Cookie Chain). */
export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
);

export const COOKIE_CHAIN = {
  name: "Cookie Chain",
  nativeSymbol: "COOK",
  nativeDecimals: 9,
  genesisHash: COOKIE_GENESIS_HASH,
  rpc: COOKIE_RPC,
  wss: COOKIE_WSS,
  das: COOKIE_DAS,
  explorer: COOKIE_EXPLORER,
  bridge: COOKIE_BRIDGE,
  swap: COOKIE_SWAP,
} as const;

let sharedConnection: Connection | null = null;

export function getConnection(
  commitment: "confirmed" | "processed" | "finalized" = "confirmed"
) {
  if (!sharedConnection) {
    sharedConnection = new Connection(COOKIE_RPC, {
      commitment,
      wsEndpoint: COOKIE_WSS,
      confirmTransactionInitialTimeout: 60_000,
    });
  }
  return sharedConnection;
}

/** Create a fresh connection (useful for latency probes). */
export function createConnection() {
  return new Connection(COOKIE_RPC, {
    commitment: "confirmed",
    wsEndpoint: COOKIE_WSS,
  });
}

export function explorerTxUrl(signature: string) {
  return `${COOKIE_EXPLORER}/tx/${signature}`;
}

export function explorerAddressUrl(address: string) {
  return `${COOKIE_EXPLORER}/account/${address}`;
}

export function explorerTokenUrl(mint: string) {
  return `${COOKIE_EXPLORER}/token/${mint}`;
}
