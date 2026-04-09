"use client";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Sign in, no wallet needed",
      desc: "Creators and donors log in with email or Google via Privy. Starkzap automatically creates and deploys a Starknet smart wallet in the background. No seed phrases, no browser extensions.",
      tag: "Starkzap Onboarding API",
      color: "from-brand-500 to-brand-400",
    },
    {
      num: "02",
      title: "Donor enters a tip amount",
      desc: "On the creator's public profile, a donor types an amount in STRK and an optional message. That is all. No gas estimation pop-ups, no confusing fee dialogs.",
      tag: "Web2-like UX",
      color: "from-accent-500 to-accent-400",
    },
    {
      num: "03",
      title: "Gasless on-chain transaction",
      desc: "The Starkzap SDK submits the tip to the Tipping Cairo contract on Starknet Mainnet. AVNU Paymaster sponsors the gas so the donor only spends the tip amount, nothing more.",
      tag: "AVNU Paymaster + Cairo",
      color: "from-emerald-500 to-teal-400",
    },
    {
      num: "04",
      title: "Creator receives STRK instantly",
      desc: "The Cairo contract records the donor message as an on-chain event and transfers STRK directly to the creator's wallet. The creator sees the tip in their dashboard in seconds.",
      tag: "Real-time Dashboard",
      color: "from-amber-500 to-orange-400",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-3">The Flow</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white">
            How Starkjar works
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">
            A complete Web2 to on-chain experience. No friction at any step.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="card card-hover group relative overflow-hidden"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${step.color} opacity-60 group-hover:opacity-100 transition-opacity`}
              />
              <div className="pl-6">
                <div className="flex items-start justify-between mb-4">
                  <span
                    className={`text-5xl font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent opacity-30 group-hover:opacity-50 transition-opacity`}
                  >
                    {step.num}
                  </span>
                  <span
                    className={`status-badge text-xs bg-gradient-to-r ${step.color} bg-clip-text text-transparent border-white/10`}
                  >
                    {step.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
