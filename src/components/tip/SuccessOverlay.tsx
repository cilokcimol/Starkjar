"use client";

import { CheckCircle, ExternalLink, RotateCcw, Sparkles } from "lucide-react";
import { voyagerTxUrl } from "@/lib/constants";
import type { TipResult } from "./TipPageClient";

type Props = {
  result: TipResult;
  creatorName: string;
  onReset: () => void;
};

export function SuccessOverlay({ result, creatorName, onReset }: Props) {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card border-emerald-500/20 bg-gradient-to-b from-emerald-500/5 to-transparent text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-pulse-glow">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  background:
                    i % 2 === 0 ? "#10b981" : "#6172f3",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-50px)`,
                  animation: `confetti 1s ease-out ${i * 0.1}s both`,
                }}
              />
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3 h-3" />
            Transaction confirmed on Starknet
          </div>

          <h2 className="text-3xl font-black text-white mb-2">
            Tip sent successfully!
          </h2>
          <p className="text-slate-400 text-base mb-6">
            You sent{" "}
            <span className="text-white font-bold">{result.amount} STRK</span>{" "}
            to <span className="text-brand-300 font-bold">{creatorName}</span>.
            Zero gas fees paid.
          </p>

          {result.message && (
            <div className="text-left mb-6 px-4 py-3 rounded-xl bg-surface-800/60 border border-white/5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Your message (on-chain)
              </p>
              <p className="text-slate-300 text-sm italic">
                &ldquo;{result.message}&rdquo;
              </p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href={voyagerTxUrl(result.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              id="success-voyager-link"
              className="btn-secondary w-full rounded-xl py-3 justify-center"
            >
              <ExternalLink className="w-4 h-4" />
              View on Voyager Explorer
            </a>

            <button
              id="success-send-another-btn"
              onClick={onReset}
              className="btn-ghost w-full rounded-xl py-3 border border-white/8"
            >
              <RotateCcw className="w-4 h-4" />
              Send another tip
            </button>
          </div>
        </div>

        <div className="mt-6 card border-brand-500/10 bg-brand-500/5">
          <p className="text-xs text-slate-500 text-center leading-relaxed">
            Transaction hash:{" "}
            <span className="font-mono text-brand-400 text-xs break-all">
              {result.txHash}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
