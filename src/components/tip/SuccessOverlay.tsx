"use client";

import { voyagerTxUrl } from "@/lib/constants";
import type { TipResult } from "./TipPageClient";

type Props = {
  result: TipResult;
  creatorName: string;
  onReset: () => void;
};

export function SuccessOverlay({ result, creatorName, onReset }: Props) {
  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-12 bg-grid-fine">
      <div className="w-full max-w-md animate-appear">

        {/* Status panel */}
        <div className="panel-raised overflow-hidden">
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: "1px solid var(--border)", background: "var(--ax-faint)" }}
          >
            <span className="label-amber">TX / CONFIRMED</span>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--ax)" }} />
          </div>

          <div className="px-6 py-8 text-left">
            {/* Big amount */}
            <div className="mb-6">
              <span className="label mb-1 block">AMOUNT SENT</span>
              <div className="flex items-baseline gap-3">
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: "var(--ax)", letterSpacing: "-0.04em", lineHeight: 1 }}
                >
                  {result.amount}
                </span>
                <span className="font-mono text-xl font-bold" style={{ color: "var(--text-muted)" }}>STRK</span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                to <span style={{ color: "var(--text)" }}>{creatorName}</span>
              </p>
            </div>

            {/* Message */}
            {result.message && (
              <div className="mb-6 p-4" style={{ border: "1px solid var(--border)", borderRadius: "2px" }}>
                <span className="label mb-2 block">ON-CHAIN MESSAGE</span>
                <p className="text-sm italic" style={{ color: "var(--text-muted)" }}>
                  &ldquo;{result.message}&rdquo;
                </p>
              </div>
            )}

            {/* Tx hash */}
            <div className="mb-6">
              <span className="label mb-1 block">TRANSACTION HASH</span>
              <p className="font-mono text-xs break-all" style={{ color: "var(--text-dim)" }}>
                {result.txHash}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <a
                href={voyagerTxUrl(result.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                id="success-voyager-link"
                className="btn-amber-outline w-full justify-center py-3"
              >
                <span className="font-mono text-xs">VIEW ON VOYAGER ↗</span>
              </a>
              <button
                id="success-send-another-btn"
                onClick={onReset}
                className="btn-ghost w-full py-3 justify-center"
              >
                <span className="font-mono text-xs">SEND ANOTHER TIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
