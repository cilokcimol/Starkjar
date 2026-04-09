export function HowItWorksSection() {
  const steps = [
    {
      index: "01",
      title: "Connect your wallet",
      desc: "Open Argent X or Braavos in your browser. Click Connect on Starkjar and approve the connection. No email, no account creation.",
    },
    {
      index: "02",
      title: "Find a creator's page",
      desc: "Every creator on Starkjar gets a public link like starkjar.app/tip/0x… Share yours and receive STRK from anyone.",
    },
    {
      index: "03",
      title: "Choose an amount and sign",
      desc: "Pick 1, 5, or 10 STRK — or enter custom. Your wallet prompts a single transaction. No approvals, no gas surprises.",
    },
    {
      index: "04",
      title: "Tip lands on-chain",
      desc: "The transaction is recorded permanently on Starknet Sepolia. The creator's dashboard updates instantly.",
    },
  ];

  return (
    <section id="protocol" className="bg-grid-fine" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-28">

        {/* Section header */}
        <div className="mb-16">
          <span className="label-amber">PROTOCOL SEQUENCE</span>
          <h2
            className="font-display font-bold mt-4"
            style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.025em", color: "var(--text)" }}
          >
            How it works
          </h2>
        </div>

        {/* Steps — table style with left index */}
        <div style={{ borderTop: "1px solid var(--border)" }}>
          {steps.map((step, i) => (
            <div
              key={step.index}
              className="flex gap-8 md:gap-16 py-8 md:py-10"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {/* Index */}
              <div className="flex-shrink-0 w-16">
                <span
                  className="font-mono text-4xl font-bold"
                  style={{ color: i === 0 ? "var(--ax)" : "var(--text-dim)", lineHeight: 1 }}
                >
                  {step.index}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-display font-semibold text-xl mb-3"
                  style={{ color: "var(--text)", letterSpacing: "-0.01em" }}
                >
                  {step.title}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: "56ch" }}>
                  {step.desc}
                </p>
              </div>

              {/* Right label */}
              <div className="hidden lg:flex items-center flex-shrink-0">
                <span className="label">{`STEP-${step.index}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
