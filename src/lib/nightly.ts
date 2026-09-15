import { COOKIE_GENESIS_HASH, COOKIE_RPC } from "./cookie-chain";

type NightlySolana = {
  changeNetwork?: (args: { genesisHash: string; url?: string }) => Promise<unknown>;
};

declare global {
  interface Window {
    nightly?: {
      solana?: NightlySolana;
    };
  }
}

/**
 * Point Nightly at Cookie Chain via genesisHash + RPC.
 * Safe no-op when Nightly is not installed or the method is unavailable.
 */
export async function switchNightlyToCookieChain(): Promise<{
  ok: boolean;
  message: string;
}> {
  if (typeof window === "undefined") {
    return { ok: false, message: "SSR" };
  }

  const nightly = window.nightly?.solana;
  if (!nightly?.changeNetwork) {
    return {
      ok: false,
      message:
        "Nightly changeNetwork unavailable. Set Cookie Chain RPC manually in Nightly network settings.",
    };
  }

  try {
    await nightly.changeNetwork({
      genesisHash: COOKIE_GENESIS_HASH,
      url: COOKIE_RPC,
    });
    return { ok: true, message: "Nightly switched to Cookie Chain" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, message: msg };
  }
}
