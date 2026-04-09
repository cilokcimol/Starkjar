"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { TipForm } from "@/components/tip/TipForm";
import { SuccessOverlay } from "@/components/tip/SuccessOverlay";
import { shortAddress } from "@/lib/constants";
import { Zap, Heart } from "lucide-react";
import Link from "next/link";
import type { Call } from "starknet";

type Creator = {
  address: string;
  name: string;
  bio: string;
  handle: string;
  tipCount: number;
} | null;

type Props = {
  creatorAddress: string;
  initialCreator: Creator;
};

export type TipResult = {
  txHash: string;
  amount: string;
  message: string;
};

export function TipPageClient({ creatorAddress, initialCreator }: Props) {
  const { isConnected, isConnecting, connect, starkzapWallet, address } =
    useWallet();

  const [creator] = useState<Creator>(initialCreator);
  const [amount, setAmount] = useState("1");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TipResult | null>(null);

  const isSelf =
    !!address && address.toLowerCase() === creatorAddress.toLowerCase();

  const handleSendTip = useCallback(async () => {
    if (!starkzapWallet || !amount || parseFloat(amount) <= 0) return;
    setSending(true);
    setError("");

    try {
      const { Amount, getPresets } = await import("starkzap");
      const { CallData, cairo } = await import("starknet");

      const wallet = starkzapWallet;
      const chainId = wallet.getChainId();
      const presets = getPresets(chainId);
      const STRK = presets.STRK;
      if (!STRK) throw new Error("STRK token not found for this network");

      const parsedAmount = Amount.parse(amount, STRK);
      const rawAmount = parsedAmount.toBase();
      const u256Amount = cairo.uint256(rawAmount);

      const tippingContract =
        process.env.NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS ?? "";

      let calls: Call[];

      if (tippingContract.length > 5) {
        const approveCall: Call = {
          contractAddress: STRK.address.toString(),
          entrypoint: "approve",
          calldata: CallData.compile({
            spender: tippingContract,
            amount: u256Amount,
          }),
        };

        const messageBytes = Array.from(
          new TextEncoder().encode(message.slice(0, 100))
        ).map((b) => b.toString());

        const tipCall: Call = {
          contractAddress: tippingContract,
          entrypoint: "send_tip",
          calldata: CallData.compile({
            creator: creatorAddress,
            amount: u256Amount,
            message_len: messageBytes.length.toString(),
            message: messageBytes,
          }),
        };

        calls = [approveCall, tipCall];
      } else {
        const transferCall: Call = {
          contractAddress: STRK.address.toString(),
          entrypoint: "transfer",
          calldata: CallData.compile({
            recipient: creatorAddress,
            amount: u256Amount,
          }),
        };
        calls = [transferCall];
      }

      const tx = await wallet.execute(calls, { feeMode: "sponsored" });
      await tx.wait();

      await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorAddress,
          donorAddress: address,
          amount,
          message,
          txHash: tx.hash,
        }),
      });

      setResult({ txHash: tx.hash, amount, message });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Transaction failed. Try again.";
      setError(
        msg.toLowerCase().includes("insufficient")
          ? "Insufficient STRK balance to send this tip."
          : msg.length > 120
          ? msg.slice(0, 120) + "..."
          : msg
      );
    } finally {
      setSending(false);
    }
  }, [starkzapWallet, amount, message, creatorAddress, address]);

  if (result) {
    return (
      <SuccessOverlay
        result={result}
        creatorName={creator?.name ?? shortAddress(creatorAddress)}
        onReset={() => {
          setResult(null);
          setAmount("1");
          setMessage("");
        }}
      />
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card mb-4 text-center border-brand-500/10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white font-black text-2xl">
              {(creator?.name ?? creatorAddress).slice(0, 1).toUpperCase()}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {creator?.name ?? shortAddress(creatorAddress)}
          </h1>
          {creator?.handle && (
            <p className="text-slate-500 text-sm mt-0.5">@{creator.handle}</p>
          )}
          {creator?.bio && (
            <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto leading-relaxed">
              {creator.bio}
            </p>
          )}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="status-badge-info">
              <Heart className="w-3 h-3" />
              {creator?.tipCount ?? 0} supporters
            </div>
            <div className="status-badge-success">
              <Zap className="w-3 h-3" />
              Gasless tips
            </div>
          </div>
        </div>

        {isSelf ? (
          <div className="card border-amber-500/20 bg-amber-500/5 text-center">
            <p className="text-amber-400 font-semibold text-sm">
              This is your own profile page.
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Share this URL with your community so they can support you.
            </p>
            <Link
              href="/dashboard"
              id="tip-self-back"
              className="btn-primary mt-4 w-full rounded-xl inline-flex items-center justify-center gap-2"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <TipForm
            amount={amount}
            message={message}
            sending={sending}
            error={error}
            isConnected={isConnected}
            isConnecting={isConnecting}
            onAmountChange={setAmount}
            onMessageChange={setMessage}
            onConnect={connect}
            onSend={handleSendTip}
            creatorName={creator?.name ?? shortAddress(creatorAddress)}
          />
        )}

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-xs flex items-center justify-center gap-1.5">
            <Zap className="w-3 h-3 text-brand-500" />
            Gas fees sponsored by AVNU Paymaster via Starkzap SDK
          </p>
        </div>
      </div>
    </div>
  );
}
