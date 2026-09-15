"use client";

import { CheckCircle2, Loader2, XCircle, Clock } from "lucide-react";
import { explorerTxUrl } from "@/lib/cookie-chain";
import { shortenAddress } from "@/lib/format";

export type TxPhase =
  | "idle"
  | "building"
  | "signing"
  | "sending"
  | "confirming"
  | "success"
  | "error";

export type TxStatusState = {
  phase: TxPhase;
  signature?: string;
  message?: string;
};

export function TxStatus({ state }: { state: TxStatusState }) {
  if (state.phase === "idle") return null;

  const meta = phaseMeta(state.phase);

  return (
    <div
      className={`mt-3 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs ${meta.box}`}
    >
      {meta.icon}
      <div className="min-w-0 flex-1">
        <div className="font-medium">{meta.label}</div>
        {state.message && (
          <div className="mt-0.5 break-words text-[11px] opacity-80">
            {state.message}
          </div>
        )}
        {state.signature && (
          <a
            href={explorerTxUrl(state.signature)}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-block font-mono text-[11px] underline underline-offset-2"
          >
            {shortenAddress(state.signature, 8)}
          </a>
        )}
      </div>
    </div>
  );
}

function phaseMeta(phase: TxPhase) {
  switch (phase) {
    case "building":
    case "signing":
    case "sending":
    case "confirming":
      return {
        label:
          phase === "building"
            ? "Building transaction…"
            : phase === "signing"
              ? "Awaiting wallet signature…"
              : phase === "sending"
                ? "Broadcasting to Cookie Chain…"
                : "Confirming on-chain…",
        box: "border-sky-500/30 bg-sky-500/10 text-sky-100",
        icon: <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />,
      };
    case "success":
      return {
        label: "Confirmed on Cookie Chain",
        box: "border-emerald-500/30 bg-emerald-500/10 text-emerald-100",
        icon: <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />,
      };
    case "error":
      return {
        label: "Transaction failed",
        box: "border-rose-500/30 bg-rose-500/10 text-rose-100",
        icon: <XCircle className="mt-0.5 h-4 w-4 shrink-0" />,
      };
    default:
      return {
        label: "Ready",
        box: "border-white/10 bg-white/5 text-zinc-300",
        icon: <Clock className="mt-0.5 h-4 w-4 shrink-0" />,
      };
  }
}
