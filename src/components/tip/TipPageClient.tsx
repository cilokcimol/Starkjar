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
      const amountBigInt = BigInt(Math.round(parseFloat(amount) * 1e18));
      const u256Amount = uint256.bnToUint256(amountBigInt);
      const tippingContract = process.env.NEXT_PUBLIC_TIPPING_CONTRACT_ADDRESS ?? "";

      let calls;
      if (tippingContract.length > 5) {
        const msgBytes = new TextEncoder().encode(message.slice(0, 100));
        const msgPending = msgBytes.length > 0 ? msgBytes[msgBytes.length - 1] : 0;
        const fullWords = Math.floor(msgBytes.length / 31);

        calls = [
          {
            contractAddress: STRK_ADDRESS,
            entrypoint: "approve",
            calldata: CallData.compile({ spender: tippingContract, amount: u256Amount }),
          },
          {
            contractAddress: tippingContract,
            entrypoint: "send_tip",
            calldata: CallData.compile({
              creator: creatorAddress,
              amount: u256Amount,
              message: {
                data: Array.from({ length: fullWords }, (_, i) =>
                  cairo.felt(BigInt("0x" + Array.from(msgBytes.slice(i * 31, i * 31 + 31))
                    .map((b) => b.toString(16).padStart(2, "0")).join("")))
                ),
                pending_word: msgBytes.length > 0 ? cairo.felt(BigInt(msgPending)) : cairo.felt(BigInt(0)),
                pending_word_len: msgBytes.length % 31,
              },
            }),
          },
        ];
      } else {
        calls = [{
          contractAddress: STRK_ADDRESS,
          entrypoint: "transfer",
          calldata: CallData.compile({ recipient: creatorAddress, amount: u256Amount }),
        }];
      }

      const tx = await account.execute(calls);
      await account.waitForTransaction(tx.transaction_hash);

      await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorAddress, donorAddress: address, amount, message, txHash: tx.transaction_hash }),
      });

      setResult({ txHash: tx.transaction_hash, amount, message });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed.";
      setError(
        msg.toLowerCase().includes("insufficient") ? "Insufficient STRK balance." :
        msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("cancel") ? "Transaction cancelled." :
        msg.length > 120 ? msg.slice(0, 120) + "..." : msg
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
        onReset={() => { setResult(null); setAmount("1"); setMessage(""); }}
      />
    );
  }

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 bg-grid-fine pt-28">
      <div className="w-full max-w-lg">
        <div className="mb-6 pb-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <span className="label-amber mb-3 block">CREATOR / PROFILE</span>
          <h1
            className="font-display font-bold mb-2"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", letterSpacing: "-0.025em", color: "var(--text)" }}
          >
            {creator?.name ?? shortAddress(creatorAddress)}
          </h1>
          {creator?.handle && (
            <p className="font-mono text-sm mb-2" style={{ color: "var(--text-dim)" }}>
              @{creator.handle}
            </p>
          )}
          {creator?.bio && (
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "44ch" }}>
              {creator.bio}
            </p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <span className="tag-amber"><Zap className="w-3 h-3" />STRK TIPS</span>
            <span className="tag"><Heart className="w-3 h-3" />{creator?.tipCount ?? 0} supporters</span>
          </div>
        </div>

        {isSelf ? (
          <div className="panel p-5">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--ax)" }}>This is your own profile.</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Share this URL with your community so they can tip you.
            </p>
            <Link href="/dashboard" id="tip-self-back" className="btn-primary px-6 py-2.5">
              <span className="font-mono text-xs">GO TO DASHBOARD</span>
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

        <div className="mt-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ax)", opacity: 0.5 }} />
          <p className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
            STARKNET SEPOLIA / STRK / {shortAddress(creatorAddress)}
          </p>
        </div>
      </div>
    </div>
  );
}
