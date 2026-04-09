"use client";

import { useWallet } from "@/components/providers/WalletProvider";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  const { isConnected, isConnecting, connect } = useWallet();

  return (
    <section className="py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative card border-brand-500/20 overflow-hidden text-center py-16">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 60% 60% at 50% 0%, rgba(97,114,243,0.4), transparent)",
            }}
          />
          <div className="relative z-10">
            <p className="section-label mb-4">Ready to start?</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Your creator page in{" "}
              <span className="gradient-text">30 seconds</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              Connect with Google, copy your link, and start receiving gasless
              tips from your community on Starknet Mainnet.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isConnected ? (
                <Link
                  href="/dashboard"
                  id="cta-dashboard-btn"
                  className="btn-primary px-10 py-4 text-base rounded-xl"
                >
                  Open Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  id="cta-connect-btn"
                  onClick={connect}
                  disabled={isConnecting}
                  className="btn-primary px-10 py-4 text-base rounded-xl"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      Create Your Page Free
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>

            <p className="text-slate-600 text-xs mt-6">
              No wallet extension required. No gas fees to set up.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
