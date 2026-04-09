"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { Zap, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  const { isConnected, isConnecting, connect } = useWallet();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 bg-hero-glow" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 35%, rgba(97,114,243,0.15) 0%, transparent 50%), radial-gradient(circle at 75% 65%, rgba(217,70,239,0.12) 0%, transparent 50%)",
        }}
      />
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-brand-500/10"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `pulseGlow ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-500/30 bg-brand-500/10 text-brand-300 text-xs font-semibold mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          Built for the Starkzap Developer Bounty Program
        </div>

        <h1
          className="text-5xl sm:text-7xl font-black text-white leading-[1.05] mb-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          Support creators.
          <br />
          <span className="gradient-text">Zero gas fees.</span>
        </h1>

        <p
          className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Starkjar is a gasless tipping platform on Starknet. Fans send STRK
          tokens to their favorite creators with{" "}
          <span className="text-white font-medium">
            no pop-ups, no gas fees, no friction
          </span>
          . Powered by the Starkzap SDK and AVNU Paymaster.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          {isConnected ? (
            <Link href="/dashboard" id="hero-dashboard-btn" className="btn-primary px-8 py-4 text-base rounded-xl">
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <button
              id="hero-connect-btn"
              onClick={connect}
              disabled={isConnecting}
              className="btn-primary px-8 py-4 text-base rounded-xl animate-pulse-glow"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connecting wallet...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Start Receiving Tips
                </>
              )}
            </button>
          )}
          <Link
            href="/#how-it-works"
            id="hero-learn-btn"
            className="btn-secondary px-8 py-4 text-base rounded-xl"
          >
            See how it works
          </Link>
        </div>

        <div
          className="grid grid-cols-3 gap-6 mt-20 max-w-lg mx-auto animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { value: "0 STRK", label: "Gas fees for donors" },
            { value: "2s", label: "Login time" },
            { value: "100%", label: "On-chain tips" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black gradient-text">{stat.value}</p>
              <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-gentle">
        <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-brand-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
