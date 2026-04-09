"use client";

export const dynamic = "force-dynamic";

import { useWallet } from "@/components/providers/WalletProvider";
import { useEffect, useState, useCallback } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  TrendingUp,
  MessageSquare,
  Loader2,
  Zap,
  User,
} from "lucide-react";
import Link from "next/link";
import { shortAddress, voyagerTxUrl } from "@/lib/constants";
import type { Tip } from "@/lib/db";
import { CreatorSetupModal } from "@/components/dashboard/CreatorSetupModal";

export default function DashboardPage() {
  const { isConnected, address, strkBalance, connect, isConnecting } =
    useWallet();
  const [tips, setTips] = useState<Tip[]>([]);
  const [creator, setCreator] = useState<{
    name: string;
    handle: string;
    bio: string;
  } | null>(null);
  const [loadingTips, setLoadingTips] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const appUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://starkjar.app";

  const profileUrl = address ? `${appUrl}/tip/${address}` : "";

  const fetchData = useCallback(async () => {
    if (!address) return;
    setLoadingTips(true);
    try {
      const [creatorRes, tipsRes] = await Promise.all([
        fetch(`/api/creator?address=${address}`),
        fetch(`/api/tips?creator=${address}`),
      ]);

      if (creatorRes.ok) {
        const data = await creatorRes.json();
        setCreator(data);
      } else {
        setShowSetup(true);
      }

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
    }
  }, [isConnected, address, fetchData]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const totalReceived = tips.reduce((acc, t) => acc + parseFloat(t.amount || "0"), 0);

  if (!isConnected) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-6 animate-pulse-glow">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-black text-white mb-3">
          Connect to access your dashboard
        </h1>
        <p className="text-slate-400 mb-8 max-w-md">
          Sign in with email or Google. Your Starknet wallet is created
          automatically. No seed phrases needed.
        </p>
        <button
          id="dashboard-connect-btn"
          onClick={connect}
          disabled={isConnecting}
          className="btn-primary px-8 py-4 text-base rounded-xl"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Connect Wallet
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {showSetup && (
        <CreatorSetupModal
          address={address!}
          onClose={() => setShowSetup(false)}
          onSaved={(data) => {
            setCreator(data);
            setShowSetup(false);
          }}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">
            {creator ? (
              <>
                Welcome, <span className="gradient-text">{creator.name}</span>
              </>
            ) : (
              "Your Dashboard"
            )}
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-mono">
            {shortAddress(address)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="dashboard-setup-btn"
            onClick={() => setShowSetup(true)}
            className="btn-ghost text-sm border border-white/8 rounded-lg px-4 py-2"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
          {profileUrl && (
            <Link
              href={profileUrl}
              target="_blank"
              id="dashboard-view-page-btn"
              className="btn-secondary text-sm rounded-lg"
            >
              View Page
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "STRK Balance",
            value: strkBalance ?? "...",
            icon: Zap,
            color: "from-brand-500 to-brand-400",
            id: "stat-balance",
          },
          {
            label: "Total Received",
            value: `${totalReceived.toFixed(2)} STRK`,
            icon: TrendingUp,
            color: "from-emerald-500 to-teal-400",
            id: "stat-received",
          },
          {
            label: "Total Tips",
            value: tips.length.toString(),
            icon: MessageSquare,
            color: "from-accent-500 to-purple-400",
            id: "stat-tips",
          },
          {
            label: "Network",
            value: "Sepolia",
            icon: Check,
            color: "from-amber-500 to-orange-400",
            id: "stat-network",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} id={stat.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  {stat.label}
                </p>
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="card mb-6 border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-transparent">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Your public tip link
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          <code className="flex-1 text-brand-300 text-sm font-mono bg-surface-800 px-4 py-2.5 rounded-lg border border-white/5 truncate">
            {profileUrl || "Connect wallet to get your link"}
          </code>
          <button
            id="dashboard-copy-link-btn"
            onClick={handleCopyLink}
            disabled={!profileUrl}
            className="btn-primary rounded-lg px-4 py-2.5 text-sm flex-shrink-0"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Share this link so fans can tip you without any gas fees.
        </p>
      </div>

      <div className="card">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-400" />
          Recent Tips
        </h2>

        {loadingTips ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
          </div>
        ) : tips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-slate-600" />
            </div>
            <p className="text-slate-500 font-medium">No tips received yet</p>
            <p className="text-slate-600 text-sm mt-1">
              Share your link and your community will start sending gasless tips.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tips.map((tip) => (
              <div
                key={tip.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-surface-800/50 border border-white/5 hover:border-brand-500/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-300 font-bold text-xs">
                    {tip.donorAddress.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-mono text-slate-400 text-xs">
                      {shortAddress(tip.donorAddress)}
                    </p>
                    <span className="text-emerald-400 font-bold text-sm">
                      +{tip.amount} STRK
                    </span>
                  </div>
                  {tip.message && (
                    <p className="text-slate-300 text-sm mt-1 italic">
                      &ldquo;{tip.message}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-slate-600 text-xs">
                      {new Date(tip.timestamp).toLocaleDateString()}
                    </span>
                    <a
                      href={voyagerTxUrl(tip.txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-500 hover:text-brand-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
