"use client";

import { ShieldCheck, Zap, Globe, Code2, Coins, Lock } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Truly gasless for donors",
    desc: "The AVNU Paymaster sponsors every tipping transaction. The donor pays only the STRK tip amount. The gas fee is completely abstracted away by the Starkzap SDK.",
    accent: "from-brand-500 to-brand-400",
    id: "feature-gasless",
  },
  {
    icon: Globe,
    title: "Web2 login experience",
    desc: "Users sign in with email, Google, or Twitter via Privy integration. Starkzap creates a Starknet smart account behind the scenes. No MetaMask or Argent required.",
    accent: "from-accent-500 to-purple-400",
    id: "feature-login",
  },
  {
    icon: ShieldCheck,
    title: "Fully on-chain tips",
    desc: "Every tip is recorded on Starknet Mainnet via a purpose-built Cairo contract. Donor messages are emitted as on-chain events for full transparency and immutability.",
    accent: "from-emerald-500 to-teal-400",
    id: "feature-onchain",
  },
  {
    icon: Code2,
    title: "Cairo smart contracts",
    desc: "The tipping logic lives in a Cairo contract that handles STRK token transfers, maps tips to creator addresses, and emits events that power the creator dashboard.",
    accent: "from-amber-500 to-orange-400",
    id: "feature-cairo",
  },
  {
    icon: Coins,
    title: "Instant STRK settlement",
    desc: "STRK tokens land directly in the creator wallet the moment the transaction is confirmed. No intermediary escrow, no withdrawal periods, no platform cuts.",
    accent: "from-rose-500 to-pink-400",
    id: "feature-settlement",
  },
  {
    icon: Lock,
    title: "Non-custodial and secure",
    desc: "Private keys are managed by Privy server-side infrastructure and never exposed to the frontend. The signing endpoint runs on the backend with proper authentication.",
    accent: "from-sky-500 to-cyan-400",
    id: "feature-secure",
  },
];

export function WhyStarkzapSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">Why Starkzap</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            Blockchain without
            <span className="gradient-text"> the headache</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            Starkzap SDK turns the hardest parts of Web3 UX into a few lines of
            code.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                id={feat.id}
                className="card card-hover group"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feat.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 card border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-accent-500/5">
          <div className="text-center">
            <p className="text-slate-400 text-sm font-medium mb-2 uppercase tracking-widest">
              Before Starkzap vs After Starkzap
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-6 text-left">
              <div className="space-y-3">
                <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">
                  Traditional Web3
                </p>
                {[
                  "Install MetaMask browser extension",
                  "Create and back up a seed phrase",
                  "Buy STRK on an exchange",
                  "Approve gas fee pop-up for every TX",
                  "Wait for TX confirmation anxiously",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5 text-sm">x</span>
                    <span className="text-slate-400 text-sm">{item}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                  With Starkjar and Starkzap
                </p>
                {[
                  "Sign in with Google in 2 seconds",
                  "Wallet auto-created and deployed",
                  "Hold STRK, that is the only requirement",
                  "Zero gas fees through AVNU Paymaster",
                  "Transaction confirmed, success animation plays",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 text-sm">v</span>
                    <span className="text-slate-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
