"use client";

import Link from "next/link";
import { useWallet } from "@/components/providers/WalletProvider";
import { shortAddress } from "@/lib/constants";
import { useState } from "react";

export function Navbar() {
  const { isConnected, isConnecting, address, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50" style={{ borderBottom: "1px solid var(--border)", background: "rgba(9,9,26,0.92)", backdropFilter: "blur(12px)" }}>
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="font-mono text-xs label-amber">SJ-001</span>
          <span className="w-px h-4" style={{ background: "var(--border)" }} />
          <span className="font-display font-bold text-base tracking-tight" style={{ color: "var(--text)" }}>
            STARK<span style={{ color: "var(--ax)" }}>JAR</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/#protocol" className="btn-ghost text-xs py-1.5 px-4">PROTOCOL</Link>
          <Link href="/dashboard" className="btn-ghost text-xs py-1.5 px-4">DASHBOARD</Link>
        </nav>

        {/* Wallet */}
        <div className="flex items-center gap-2">
          {!isConnected ? (
            <button
              id="navbar-connect-btn"
              onClick={connect}
              disabled={isConnecting}
              className="btn-primary py-2 px-5 text-xs"
            >
              {isConnecting ? (
                <span className="font-mono">CONNECTING<span className="cursor" /></span>
              ) : (
                <span className="font-mono">CONNECT WALLET</span>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                id="navbar-copy-address"
                onClick={handleCopy}
                className="tag font-mono text-xs py-1.5 px-3 hover:border-ax transition-colors"
                style={{ color: copied ? "var(--ax)" : "var(--text-muted)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ax)", opacity: 0.8 }} />
                {copied ? "COPIED" : shortAddress(address)}
              </button>
              <button
                id="navbar-disconnect-btn"
                onClick={disconnect}
                className="label hover:text-red-400 transition-colors px-2 py-1.5"
                title="Disconnect"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
