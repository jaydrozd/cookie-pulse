import { COOKIE_DAS } from "./cookie-chain";

export type DasTokenItem = {
  id: string;
  interface?: string;
  content?: {
    metadata?: {
      name?: string;
      symbol?: string;
    };
    json_uri?: string;
    files?: Array<{ uri?: string; mime?: string }>;
  };
  token_info?: {
    symbol?: string;
    balance?: number;
    supply?: number;
    decimals?: number;
    token_program?: string;
    price_info?: {
      price_per_token?: number;
      total_price?: number;
      currency?: string;
    };
  };
  market_cap?: number;
  volume_24h?: number;
  price_change_24h?: number;
  holder_count?: number;
};

type DasResponse<T> = {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: { code: number; message: string };
};

async function dasRpc<T>(method: string, params: Record<string, unknown>): Promise<T> {
  const res = await fetch(COOKIE_DAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`DAS HTTP ${res.status}`);
  }
  const json = (await res.json()) as DasResponse<T>;
  if (json.error) {
    throw new Error(json.error.message || "DAS error");
  }
  if (json.result === undefined) {
    throw new Error("Empty DAS result");
  }
  return json.result;
}

export async function searchFungibleTokens(query: string, limit = 12): Promise<DasTokenItem[]> {
  const trimmed = query.trim();
  const page = 1;

  // Prefer name/symbol search when query looks like text; mint when base58-ish.
  const isMintLike = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed);

  if (isMintLike) {
    try {
      const asset = await dasRpc<DasTokenItem>("getAsset", { id: trimmed });
      return asset ? [asset] : [];
    } catch {
      return [];
    }
  }

  const result = await dasRpc<{ total: number; items: DasTokenItem[] }>("searchAssets", {
    page,
    limit: Math.max(limit * 3, 30),
    tokenType: "fungible",
    ...(trimmed
      ? {
          // Cookiescan DAS accepts name / symbol filters on some deployments;
          // fall back to client-side filter if ignored.
          name: trimmed,
        }
      : {}),
  });

  const items = result.items || [];
  if (!trimmed) return items.slice(0, limit);

  const q = trimmed.toLowerCase();
  const filtered = items.filter((item) => {
    const name = item.content?.metadata?.name?.toLowerCase() || "";
    const symbol =
      item.content?.metadata?.symbol?.toLowerCase() ||
      item.token_info?.symbol?.toLowerCase() ||
      "";
    const id = item.id?.toLowerCase() || "";
    return name.includes(q) || symbol.includes(q) || id.includes(q);
  });

  return (filtered.length ? filtered : items).slice(0, limit);
}

export async function getAssetsByOwner(owner: string, limit = 50): Promise<DasTokenItem[]> {
  const result = await dasRpc<{ total: number; items: DasTokenItem[] }>("getAssetsByOwner", {
    ownerAddress: owner,
    page: 1,
    limit,
  });
  return (result.items || []).filter(
    (i) => i.interface === "FungibleToken" || i.token_info?.decimals !== undefined
  );
}
