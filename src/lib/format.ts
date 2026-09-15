export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

export function formatCook(lamports: number | bigint, decimals = 9): string {
  const n = typeof lamports === "bigint" ? Number(lamports) : lamports;
  const value = n / 10 ** decimals;
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";
  if (value < 0.0001) return value.toExponential(2);
  if (value < 1) return value.toFixed(6).replace(/\.?0+$/, "");
  if (value < 1000) return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
  return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function formatNumber(n: number, digits = 0): string {
  if (!Number.isFinite(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: digits });
}

export function formatLatency(ms: number): string {
  if (!Number.isFinite(ms)) return "—";
  return `${Math.round(ms)} ms`;
}

export function clsxJoin(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
