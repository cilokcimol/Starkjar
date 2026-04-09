"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import Link from "next/link";

export function HeroSection() {
  const { isConnected, isConnecting, connect } = useWallet();

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-grid overflow-hidden pt-14">
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--ax-border), transparent)" }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: "linear-gradient(to top, rgba(212,144,15,0.04), transparent)" }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[15, 35, 65, 85].map((pct) => (
          <div
            key={pct}
            className="absolute left-0 right-0 flex items-center"
            style={{ top: `${pct}%` }}
          >
            <span className="font-mono text-[10px] px-4 opacity-20" style={{ color: "var(--ax)" }}>
              {String(pct).padStart(3, "0")}
            </span>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="mb-10 animate-fade-in">
          <span className="tag-amber">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ax)" }} />
            NETWORK / STARKNET SEPOLIA / ACTIVE
          </span>
        </div>

        <div className="animate-slide-up max-w-5xl" style={{ animationDelay: "0.1s" }}>
          <h1
            className="font-display font-bold text-balance"
            style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)", lineHeight: 1.04, letterSpacing: "-0.03em", color: "var(--text)" }}
          >
            Send STRK.
            <br />
            <span style={{ color: "var(--ax)" }}>No gas. No friction.</span>
            <br />
            Just support.
          </h1>
        </div>

        <p
          className="mt-8 text-lg max-w-xl animate-fade-in"
          style={{ color: "var(--text-muted)", lineHeight: 1.7, animationDelay: "0.25s" }}
        >
          Starkjar lets anyone tip creators on Starknet. Connect your Argent or Braavos wallet, pick an amount, sign once, done.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: "0.35s" }}>
          {isConnected ? (
            <Link href="/dashboard" id="hero-dashboard-btn" className="btn-primary px-8 py-3">
              <span className="font-mono text-sm">OPEN DASHBOARD</span>
            </Link>
          ) : (
            <button
              id="hero-connect-btn"
              onClick={connect}
              disabled={isConnecting}
              className="btn-primary px-8 py-3"
            >
              <span className="font-mono text-sm">
                {isConnecting ? <>CONNECTING<span className="cursor" /></> : "CONNECT WALLET"}
              </span>
            </button>
          )}
          <Link href="/#protocol" id="hero-learn-btn" className="btn-amber-outline px-8 py-3">
            <span className="font-mono text-sm">SEE PROTOCOL</span>
          </Link>
        </div>

        <div
          className="mt-24 pt-10 grid grid-cols-3 gap-0 animate-fade-in"
          style={{ borderTop: "1px solid var(--border)", maxWidth: "560px", animationDelay: "0.5s" }}
        >
          {[
            { value: "0 STRK", label: "Gas / Donor" },
            { value: "<2s",    label: "Tx Time" },
            { value: "100%",   label: "On-chain" },
          ].map((s, i) => (
            <div
              key={s.label}
              className="stat-item py-4"
              style={{ paddingRight: "2rem", borderRight: i < 2 ? "1px solid var(--border)" : "none", paddingLeft: i > 0 ? "2rem" : "0" }}
            >
              <span className="stat-value text-3xl">{s.value}</span>
              <span className="stat-label mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
