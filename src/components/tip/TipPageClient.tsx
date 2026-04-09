"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@/components/providers/WalletProvider";
import { TipForm } from "@/components/tip/TipForm";
import { SuccessOverlay } from "@/components/tip/SuccessOverlay";
import { shortAddress } from "@/lib/constants";
import { Zap, Heart } from "lucide-react";
import Link from "next/link";
import { CallData, cairo, uint256 } from "starknet";

const STRK_ADDRESS =
  "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

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
  const { isConnected, isConnecting, connect, account, address } = useWallet();

  const [creator] = useState<Creator>(initialCreator);
  const [amount, setAmount] = useState("1");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TipResult | null>(null);

  const isSelf =
    !!address && address.toLowerCase() === creatorAddress.toLowerCase();

  const handleSendTip = useCallback(async () => {
    if (!account || !amount || parseFloat(amount) <= 0) return;
    setSending(true);
    setError("");

    try {
      // Convert amount (in STRK) to u256 (18 decimals)
      const amountBigInt = BigInt(Math.round(parseFloat(amount) * 1e18));
      const u256Amount = uint256.bnToUint256(amountBigInt);

      const tippingContract =
        process.env.NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS ?? "";

      let calls;

      if (tippingContract.length > 5) {
        // Encode message as ByteArray
        const msgBytes = new TextEncoder().encode(message.slice(0, 100));
        const msgPending = msgBytes.length > 0 ? msgBytes[msgBytes.length - 1] : 0;
        const fullWords = Math.floor(msgBytes.length / 31);

        calls = [
          {
            contractAddress: STRK_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({
              spender: tippingContract,
              amount: u256Amount,
            }),
          },
          {
            contractAddress: tippingContract,
            entrypoint: "send_tip",
            calldata: CallData.compile({
              creator: creatorAddress,
              amount: u256Amount,
              message: {
                data: Array.from({ length: fullWords }, (_, i) =>
                  cairo.felt(
                    BigInt(
                      "0x" +
                        Array.from(msgBytes.slice(i * 31, i * 31 + 31))
                          .map((b) => b.toString(16).padStart(2, "0"))
                          .join("")
                    )
                  )
                ),
                pending_word:
                  msgBytes.length > 0
                    ? cairo.felt(BigInt(msgPending))
                    : cairo.felt(BigInt(0)),
                pending_word_len: msgBytes.length % 31,
              },
            }),
          },
        ];
      } else {
        // Fallback: direct STRK transfer
        calls = [
          {
            contractAddress: STRK_ADDRESS,
            entrypoint: "transfer",
            calldata: CallData.compile({
              recipient: creatorAddress,
              amount: u256Amount,
            }),
          },
        ];
      }

      const tx = await account.execute(calls);
      await account.waitForTransaction(tx.transaction_hash);

      // Record tip in DB
      await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          creatorAddress,
          donorAddress: address,
          amount,
          message,
          txHash: tx.transaction_hash,
        }),
      });

      setResult({ txHash: tx.transaction_hash, amount, message });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Transaction failed. Try again.";
      setError(
        msg.toLowerCase().includes("insufficient")
          ? "Insufficient STRK balance to send this tip."
          : msg.toLowerCase().includes("rejected") ||
            msg.toLowerCase().includes("cancel")
          ? "Transaction was cancelled."
          : msg.length > 120
          ? msg.slice(0, 120) + "..."
          : msg
      );
    } finally {
      setSending(false);
    }
  }, [account, amount, message, creatorAddress, address]);

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
              STRK tips
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
            Tips sent in STRK on Starknet Sepolia
          </p>
        </div>
      </div>
    </div>
  );
}
