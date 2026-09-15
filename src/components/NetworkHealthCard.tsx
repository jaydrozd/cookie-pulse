"use client";

import type { ReactNode } from "react";
import {
  Activity,
  Gauge,
  Network,
  RefreshCw,
  Server,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useNetworkHealth } from "@/hooks/useNetworkHealth";
import { formatLatency, formatNumber } from "@/lib/format";
import { COOKIE_GENESIS_HASH, COOKIE_RPC } from "@/lib/cookie-chain";

export function NetworkHealthCard() {
  const { health, refresh } = useNetworkHealth(8000);

  const chartData = health.samples.map((s) => ({
    time: new Date(s.t).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    latency: Math.round(s.latencyMs),
    slot: s.slot,
  }));

  const epochProgress =
    health.slotIndex != null && health.slotsInEpoch
      ? (health.slotIndex / health.slotsInEpoch) * 100
      : null;

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-white">Network health</h2>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                health.ok
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-rose-500/15 text-rose-300"
              }`}
            >
              {health.ok ? "live" : "degraded"}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            RPC {COOKIE_RPC.replace("https://", "")} · genesis{" "}
            {COOKIE_GENESIS_HASH.slice(0, 8)}…
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-zinc-300 hover:border-amber-400/40 hover:text-amber-200"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat
          icon={<Zap className="h-3.5 w-3.5" />}
          label="Latency"
          value={health.latencyMs != null ? formatLatency(health.latencyMs) : "—"}
        />
        <Stat
          icon={<Gauge className="h-3.5 w-3.5" />}
          label="Slot"
          value={health.slot != null ? formatNumber(health.slot) : "—"}
        />
        <Stat
          icon={<Server className="h-3.5 w-3.5" />}
          label="Block height"
          value={
            health.blockHeight != null ? formatNumber(health.blockHeight) : "—"
          }
        />
        <Stat
          icon={<Network className="h-3.5 w-3.5" />}
          label="Epoch"
          value={
            health.epoch != null
              ? `${health.epoch}${
                  epochProgress != null ? ` · ${epochProgress.toFixed(1)}%` : ""
                }`
              : "—"
          }
        />
        <Stat
          label="Tx count"
          value={
            health.transactionCount != null
              ? formatNumber(health.transactionCount)
              : "—"
          }
        />
        <Stat
          label="Validators"
          value={
            health.validatorCount != null
              ? formatNumber(health.validatorCount)
              : "—"
          }
        />
      </div>

      {health.error && (
        <p className="mt-3 text-xs text-rose-300">RPC error: {health.error}</p>
      )}

      <div className="mt-4 h-40 w-full">
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="latencyFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                tick={{ fill: "#71717a", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
                unit="ms"
              />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="latency"
                stroke="#f59e0b"
                fill="url(#latencyFill)"
                strokeWidth={2}
                name="RPC latency (ms)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-xs text-zinc-500">
            Collecting latency samples…
          </div>
        )}
      </div>

      <p className="mt-3 text-[11px] text-zinc-500">
        Genesis match:{" "}
        <span className={health.genesisMatch ? "text-emerald-400" : "text-amber-300"}>
          {health.genesisMatch ? "yes" : health.genesisHash || "checking…"}
        </span>
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1 text-[10px] uppercase tracking-wide text-zinc-500">
        {icon}
        {label}
      </div>
      <div className="truncate font-mono text-sm text-zinc-100">{value}</div>
    </div>
  );
}
