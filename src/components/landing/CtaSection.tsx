"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import Link from "next/link";

export function CtaSection() {
  const { isConnected, connect, isConnecting } = useWallet();

  return (
    <section className="bg-grid" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <span className="label-amber">INITIALIZE</span>
          <h2
            className="font-display font-bold mt-4 mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem)", letterSpacing: "-0.03em", color: "var(--text)" }}
          >
            Ready to start<br />receiving tips?
          </h2>
          <p className="text-base leading-relaxed mb-10" style={{ color: "var(--text-muted)", maxWidth: "42ch" }}>
            Connect your Starknet wallet and set up your creator profile in under a minute. Your public tip link is ready immediately.
          </p>
          <div className="flex flex-wrap gap-3">
            {isConnected ? (
              <Link href="/dashboard" className="btn-primary px-8 py-3">
                <span className="font-mono text-sm">OPEN DASHBOARD →</span>
              </Link>
            ) : (
              <button onClick={connect} disabled={isConnecting} className="btn-primary px-8 py-3">
                <span className="font-mono text-sm">
                  {isConnecting ? <>CONNECTING<span className="cursor" /></> : "CONNECT WALLET →"}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom coordinate line */}
        <div
          className="mt-24 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}
        >
          <span className="label">STARKJAR / 2026</span>
          <span className="label">SEPOLIA TESTNET</span>
        </div>
      </div>
    </section>
  );
}
