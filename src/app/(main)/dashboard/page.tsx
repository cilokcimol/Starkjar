"use client";

export const dynamic = "force-dynamic";

import { useWallet } from "@/components/providers/WalletProvider";
import { useEffect, useState, useCallback } from "react";
import { ExternalLink, Copy, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { shortAddress, voyagerTxUrl } from "@/lib/constants";
import type { Tip } from "@/lib/db";
import { CreatorSetupModal } from "@/components/dashboard/CreatorSetupModal";

export default function DashboardPage() {
  const { isConnected, address, connect, isConnecting } = useWallet();
  const [strkBalance, setStrkBalance] = useState<string | null>(null);
  const [tips, setTips] = useState<Tip[]>([]);
  const [creator, setCreator] = useState<{ name: string; handle: string; bio: string } | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const appUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL ?? "https://starkjar.netlify.app";

  const profileUrl = address ? `${appUrl}/tip/${address}` : "";

  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoadingTips(true);
    try {
      const [creatorRes, tipsRes] = await Promise.all([
        fetch(`/api/creator?address=${address}`),
        fetch(`/api/tips?creator=${address}`),
      ]);
      if (creatorRes.ok) setCreator(await creatorRes.json());
      else setShowSetup(true);
      if (tipsRes.ok) {
        const data = await tipsRes.json();
        setTips(data.tips ?? []);
      }
    } finally {
      setLoadingTips(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      fetchData();
      // Fetch STRK balance via Alchemy
      fetch("https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_10/pAuTzan6E4kmLvnrI5EUh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0", method: "starknet_call",
          params: [{
            contract_address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
            entry_point_selector: "0x2e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e",
            calldata: [address],
          }, "latest"],
          id: 1,
        }),
      }).then(r => r.json()).then(data => {
        if (data.result?.[0]) {
          const raw = BigInt(data.result[0]);
          setStrkBalance((Number(raw) / 1e18).toFixed(4) + " STRK");
        }
      }).catch(() => setStrkBalance("-- STRK"));
    }
  }, [isConnected, address, fetchData]);

  const totalReceived = tips.reduce((acc, t) => acc + parseFloat(t.amount || "0"), 0);

  // ── Not connected ────────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-grid pt-14">
        <div className="max-w-md w-full">
          <span className="label-amber mb-4 block">DASHBOARD / AUTH</span>
          <h1
            className="font-display font-bold mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", letterSpacing: "-0.025em", color: "var(--text)" }}
          >
            Connect your wallet to continue
          </h1>
          <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
            Use Argent X or Braavos to access your creator dashboard. Your tip link will be ready immediately.
          </p>
          <button
            id="dashboard-connect-btn"
            onClick={connect}
            disabled={isConnecting}
            className="btn-primary px-8 py-3"
          >
            <span className="font-mono text-sm">
              {isConnecting ? <>CONNECTING<span className="cursor" /></> : "CONNECT WALLET →"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Connected ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-grid-fine pt-14">
      {showSetup && (
        <CreatorSetupModal
          address={address!}
          onClose={() => setShowSetup(false)}
          onSaved={(data) => { setCreator(data); setShowSetup(false); }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* ── Header ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-8"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <span className="label-amber mb-3 block">CREATOR / DASHBOARD</span>
            <h1
              className="font-display font-bold"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.03em", color: "var(--text)" }}
            >
              {creator ? creator.name : shortAddress(address)}
            </h1>
            <p className="font-mono text-sm mt-1" style={{ color: "var(--text-dim)" }}>
              {address}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              id="dashboard-setup-btn"
              onClick={() => setShowSetup(true)}
              className="btn-ghost text-xs py-2 px-4"
            >
              EDIT PROFILE
            </button>
            {profileUrl && (
              <Link href={profileUrl} target="_blank" id="dashboard-view-page-btn" className="btn-amber-outline text-xs py-2 px-4">
                VIEW PAGE ↗
              </Link>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 mb-12"
          style={{ borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)" }}
        >
          {[
            { label: "STRK BALANCE", value: strkBalance ?? "…" },
            { label: "TOTAL RECEIVED", value: totalReceived > 0 ? `${totalReceived.toFixed(2)} STRK` : "0 STRK" },
            { label: "TOTAL TIPS", value: tips.length.toString() },
            { label: "NETWORK", value: "SEPOLIA" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-6"
              style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
            >
              <span className="label mb-2 block">{stat.label}</span>
              <span className="font-mono font-bold text-2xl" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Tip Link ── */}
        <div className="mb-12">
          <span className="label mb-3 block">YOUR TIP LINK</span>
          <div className="flex items-center gap-3">
            <code
              className="flex-1 font-mono text-sm px-4 py-3 truncate"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "2px", color: "var(--ax)" }}
            >
              {profileUrl || "Connect wallet first"}
            </code>
            <button
              id="dashboard-copy-link-btn"
              onClick={() => {
                navigator.clipboard.writeText(profileUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              disabled={!profileUrl}
              className="btn-primary py-3 px-5 flex-shrink-0"
            >
              <span className="font-mono text-xs">
                {copiedLink ? (
                  <><Check className="w-3.5 h-3.5 inline mr-1" />COPIED</>
                ) : (
                  <><Copy className="w-3.5 h-3.5 inline mr-1" />COPY</>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* ── Tips Table ── */}
        <div>
          <span className="label mb-4 block">INCOMING TIPS</span>

          {loadingTips ? (
            <div className="flex items-center gap-3 py-12" style={{ color: "var(--text-dim)" }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-mono text-xs">LOADING TRANSACTIONS…</span>
            </div>
          ) : tips.length === 0 ? (
            <div
              className="py-16 text-center"
              style={{ border: "1px solid var(--border)", borderRadius: "2px", background: "var(--surface)" }}
            >
              <span className="label block mb-2">NO TIPS YET</span>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                Share your tip link and your community will start sending STRK.
              </p>
            </div>
          ) : (
            <div style={{ border: "1px solid var(--border)", borderRadius: "2px" }}>
              {/* Table header */}
              <div
                className="grid grid-cols-12 px-4 py-2.5 items-center"
                style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
              >
                <span className="label col-span-4">FROM</span>
                <span className="label col-span-2">AMOUNT</span>
                <span className="label col-span-4">MESSAGE</span>
                <span className="label col-span-1">DATE</span>
                <span className="label col-span-1 text-right">TX</span>
              </div>

              {tips.map((tip, i) => (
                <div
                  key={tip.id}
                  className="grid grid-cols-12 px-4 py-3.5 items-center"
                  style={{ borderBottom: i < tips.length - 1 ? "1px solid var(--border-dim)" : "none" }}
                >
                  <span className="font-mono text-xs col-span-4" style={{ color: "var(--text-muted)" }}>
                    {shortAddress(tip.donorAddress)}
                  </span>
                  <span className="font-mono text-sm font-bold col-span-2" style={{ color: "var(--ax)" }}>
                    +{tip.amount}
                  </span>
                  <span className="text-xs col-span-4 truncate" style={{ color: "var(--text-muted)", fontStyle: tip.message ? "italic" : "normal" }}>
                    {tip.message ? `"${tip.message}"` : "—"}
                  </span>
                  <span className="font-mono text-xs col-span-1" style={{ color: "var(--text-dim)" }}>
                    {new Date(tip.timestamp).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                  <div className="col-span-1 flex justify-end">
                    <a
                      href={voyagerTxUrl(tip.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--ax)" }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
