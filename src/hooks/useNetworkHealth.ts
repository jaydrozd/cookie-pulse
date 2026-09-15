"use client";

import { useCallback, useEffect, useState } from "react";
import { createConnection, COOKIE_GENESIS_HASH } from "@/lib/cookie-chain";

export type HealthSample = {
  t: number;
  slot: number;
  latencyMs: number;
};

export type NetworkHealth = {
  ok: boolean;
  slot: number | null;
  blockHeight: number | null;
  epoch: number | null;
  slotIndex: number | null;
  slotsInEpoch: number | null;
  transactionCount: number | null;
  latencyMs: number | null;
  genesisHash: string | null;
  genesisMatch: boolean;
  validatorCount: number | null;
  samples: HealthSample[];
  error: string | null;
  updatedAt: number | null;
};

const INITIAL: NetworkHealth = {
  ok: false,
  slot: null,
  blockHeight: null,
  epoch: null,
  slotIndex: null,
  slotsInEpoch: null,
  transactionCount: null,
  latencyMs: null,
  genesisHash: null,
  genesisMatch: false,
  validatorCount: null,
  samples: [],
  error: null,
  updatedAt: null,
};

export function useNetworkHealth(pollMs = 8000) {
  const [health, setHealth] = useState<NetworkHealth>(INITIAL);

  const refresh = useCallback(async () => {
    const connection = createConnection();
    const started = performance.now();
    try {
      const [slot, epochInfo, genesisHash, nodes] = await Promise.all([
        connection.getSlot("processed"),
        connection.getEpochInfo("processed"),
        connection.getGenesisHash(),
        connection.getClusterNodes().catch(() => []),
      ]);
      const latencyMs = performance.now() - started;

      setHealth((prev) => {
        const sample: HealthSample = { t: Date.now(), slot, latencyMs };
        const samples = [...prev.samples, sample].slice(-24);
        return {
          ok: true,
          slot,
          blockHeight: epochInfo.blockHeight ?? null,
          epoch: epochInfo.epoch,
          slotIndex: epochInfo.slotIndex,
          slotsInEpoch: epochInfo.slotsInEpoch,
          transactionCount: epochInfo.transactionCount ?? null,
          latencyMs,
          genesisHash,
          genesisMatch: genesisHash === COOKIE_GENESIS_HASH,
          validatorCount: Array.isArray(nodes) ? nodes.length : null,
          samples,
          error: null,
          updatedAt: Date.now(),
        };
      });
    } catch (err) {
      setHealth((prev) => ({
        ...prev,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        updatedAt: Date.now(),
      }));
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => void refresh(), pollMs);
    return () => window.clearInterval(id);
  }, [refresh, pollMs]);

  return { health, refresh };
}
