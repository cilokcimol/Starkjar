"use client";

import Link from "next/link";
import { useWallet } from "@/components/providers/WalletProvider";
import { shortAddress } from "@/lib/constants";
import { Copy, LogOut, Wallet, Loader2 } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

export function Navbar() {
  const { isConnected, isConnecting, address, connect, disconnect } =
    useWallet();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
              <span className="text-white font-black text-sm">SJ</span>
            </div>
            <span className="font-bold text-lg text-white">
              Stark<span className="gradient-text">jar</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#how-it-works" className="btn-ghost text-slate-400 hover:text-white text-sm">
              How it works
            </Link>
            <Link href="/dashboard" className="btn-ghost text-slate-400 hover:text-white text-sm">
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {!isConnected ? (
              <button
                id="navbar-connect-btn"
                onClick={connect}
                disabled={isConnecting}
                className="btn-primary h-9 px-4 text-sm rounded-lg"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Connecting
                  </>
                ) : (
                  <>
                    <Wallet className="w-3.5 h-3.5" />
                    Connect
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="navbar-copy-address"
                  onClick={handleCopy}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200",
                    "bg-surface-800 border border-white/8 text-slate-300",
                    "hover:border-brand-500/40 hover:text-white"
                  )}
                >
                  {copied ? (
                    <span className="text-emerald-400">Copied!</span>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {shortAddress(address)}
                      <Copy className="w-3 h-3 text-slate-500" />
                    </>
                  )}
                </button>
                <button
                  id="navbar-disconnect-btn"
                  onClick={disconnect}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
