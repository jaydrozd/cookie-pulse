"use client";

import { useMemo, useState } from "react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MessageSquarePlus, Send } from "lucide-react";
import { Buffer } from "buffer";
import { MEMO_PROGRAM_ID } from "@/lib/cookie-chain";
import { TxStatus, type TxStatusState } from "./TxStatus";

const DEFAULT_MEMO = "Cookie Pulse ♥ Cookie Chain";

export function WriteActions() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [memo, setMemo] = useState(DEFAULT_MEMO);
  const [recipient, setRecipient] = useState("");
  const [amountCook, setAmountCook] = useState("0.001");
  const [memoStatus, setMemoStatus] = useState<TxStatusState>({ phase: "idle" });
  const [xferStatus, setXferStatus] = useState<TxStatusState>({ phase: "idle" });

  const canAct = connected && !!publicKey;

  const recipientPreview = useMemo(() => {
    try {
      if (!recipient.trim()) return null;
      return new PublicKey(recipient.trim()).toBase58();
    } catch {
      return null;
    }
  }, [recipient]);

  async function sendAndConfirm(
    tx: Transaction,
    setStatus: (s: TxStatusState) => void
  ) {
    if (!publicKey) throw new Error("Wallet not connected");
    setStatus({ phase: "signing" });
    const signature = await sendTransaction(tx, connection, {
      skipPreflight: false,
      maxRetries: 3,
      preflightCommitment: "confirmed",
    });
    setStatus({ phase: "confirming", signature, message: "Waiting for confirmation…" });
    const latest = await connection.getLatestBlockhash("confirmed");
    await connection.confirmTransaction(
      {
        signature,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      },
      "confirmed"
    );
    setStatus({
      phase: "success",
      signature,
      message: "Transaction landed on Cookie Chain.",
    });
    return signature;
  }

  async function onMemo() {
    if (!publicKey) return;
    try {
      setMemoStatus({ phase: "building" });
      const text = memo.trim() || DEFAULT_MEMO;
      const ix = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(text, "utf8"),
      });
      const tx = new Transaction().add(ix);
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = publicKey;
      await sendAndConfirm(tx, setMemoStatus);
    } catch (err) {
      setMemoStatus({
        phase: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  async function onTransfer() {
    if (!publicKey) return;
    try {
      if (!recipientPreview) {
        setXferStatus({ phase: "error", message: "Invalid recipient address." });
        return;
      }
      const amount = Number(amountCook);
      if (!Number.isFinite(amount) || amount <= 0) {
        setXferStatus({ phase: "error", message: "Enter a positive COOK amount." });
        return;
      }
      const lamports = Math.round(amount * LAMPORTS_PER_SOL);
      setXferStatus({ phase: "building" });
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipientPreview),
          lamports,
        })
      );
      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash = blockhash;
      tx.lastValidBlockHeight = lastValidBlockHeight;
      tx.feePayer = publicKey;
      await sendAndConfirm(tx, setXferStatus);
    } catch (err) {
      setXferStatus({
        phase: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 sm:p-5">
      <div className="mb-1 flex items-center gap-2">
        <Send className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-semibold text-white">On-chain write</h2>
      </div>
      <p className="mb-4 text-xs text-zinc-400">
        Real Cookie Chain transactions with live status. Prefer the memo path —
        it only costs a tiny fee and does not move funds.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-zinc-200">
            <MessageSquarePlus className="h-3.5 w-3.5 text-amber-400" />
            Post memo
          </div>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            rows={3}
            maxLength={200}
            className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-400/40"
            disabled={!canAct}
          />
          <button
            type="button"
            disabled={!canAct || memoStatus.phase === "signing" || memoStatus.phase === "confirming"}
            onClick={() => void onMemo()}
            className="mt-2 w-full rounded-xl bg-amber-500 px-3 py-2.5 text-sm font-semibold text-[#1a1008] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Sign memo on Cookie Chain
          </button>
          <TxStatus state={memoStatus} />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="mb-2 text-xs font-medium text-zinc-200">
            Transfer tiny COOK
          </div>
          <label className="mb-2 block text-[11px] text-zinc-500">
            Recipient
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Cookie Chain address"
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-zinc-100 outline-none focus:border-amber-400/40"
              disabled={!canAct}
            />
          </label>
          <label className="mb-2 block text-[11px] text-zinc-500">
            Amount (COOK)
            <input
              value={amountCook}
              onChange={(e) => setAmountCook(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 font-mono text-xs text-zinc-100 outline-none focus:border-amber-400/40"
              disabled={!canAct}
            />
          </label>
          <button
            type="button"
            disabled={!canAct || xferStatus.phase === "signing" || xferStatus.phase === "confirming"}
            onClick={() => void onTransfer()}
            className="mt-1 w-full rounded-xl border border-amber-400/40 bg-amber-500/10 px-3 py-2.5 text-sm font-semibold text-amber-100 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Transfer COOK
          </button>
          <TxStatus state={xferStatus} />
        </div>
      </div>

      {!canAct && (
        <p className="mt-3 text-xs text-zinc-500">
          Connect a wallet to enable write actions.
        </p>
      )}
    </section>
  );
}
