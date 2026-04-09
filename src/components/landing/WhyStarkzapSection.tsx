export function WhyStarkzapSection() {
  const specs = [
    { key: "NETWORK",      value: "Starknet Sepolia Testnet" },
    { key: "ASSET",        value: "STRK (native token)" },
    { key: "WALLET",       value: "Argent X / Braavos / Any Starknet wallet" },
    { key: "GAS / DONOR",  value: "Zero — wallets pay their own gas" },
    { key: "CONTRACT",     value: "0x7a105e…c418 (verified on Voyager)" },
    { key: "CONFIRM TIME", value: "~1–3 seconds" },
    { key: "DATA",         value: "Message stored on-chain as Starknet event" },
    { key: "OPEN SOURCE",  value: "github.com/cilokcimol/Starkjar" },
  ];

  return (
    <section style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
      <div className="max-w-7xl mx-auto px-6 py-28">

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left — copy */}
          <div>
            <span className="label-amber">TECHNICAL SPEC</span>
            <h2
              className="font-display font-bold mt-4 mb-6"
              style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", letterSpacing: "-0.025em", color: "var(--text)" }}
            >
              Built on Starknet.<br />Transparent by design.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)", maxWidth: "44ch" }}>
              Every tip is an on-chain transaction. The Tipping contract is deployed, verified, and open for anyone to inspect. No middlemen, no fees skimmed, no custodians.
            </p>
            <a
              href="https://sepolia.voyager.online/contract/0x7a105e998b5e09b6a40b15a32bc1fc591f5748025d355e042259d659ab3c418"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-amber-outline"
            >
              <span className="font-mono text-xs">VIEW CONTRACT ON VOYAGER ↗</span>
            </a>
          </div>

          {/* Right — spec table */}
          <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: "2.5rem" }}>
            {specs.map((spec, i) => (
              <div
                key={spec.key}
                className="flex gap-4 py-3.5"
                style={{ borderBottom: i < specs.length - 1 ? "1px solid var(--border-dim)" : "none" }}
              >
                <span
                  className="font-mono text-xs flex-shrink-0 w-36 pt-0.5"
                  style={{ color: "var(--text-dim)", letterSpacing: "0.08em" }}
                >
                  {spec.key}
                </span>
                <span className="text-sm" style={{ color: "var(--text)" }}>
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
