"use client";

import { PRESET_AMOUNTS } from "@/lib/constants";

type Props = {
  amount: string;
  message: string;
  sending: boolean;
  error: string;
  isConnected: boolean;
  isConnecting: boolean;
  creatorName: string;
  onAmountChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onConnect: () => void;
  onSend: () => void;
};

export function TipForm({
  amount, message, sending, error,
  isConnected, isConnecting, creatorName,
  onAmountChange, onMessageChange, onConnect, onSend,
}: Props) {
  const parsedAmount = parseFloat(amount) || 0;
  const isValid = parsedAmount > 0;

  return (
    <div className="panel-raised p-0 overflow-hidden">
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <span className="label-amber">TIP / STRK</span>
        <span className="label">SEPOLIA</span>
      </div>

      <div className="p-5 space-y-5">
        {/* Preset amounts */}
        <div>
          <span className="label mb-2 block">QUICK SELECT</span>
          <div className="flex gap-2 flex-wrap">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                id={`preset-${preset}`}
                onClick={() => onAmountChange(preset)}
                className="font-mono text-sm px-4 py-2 transition-colors"
                style={{
                  border: "1px solid",
                  borderColor: amount === preset ? "var(--ax)" : "var(--border)",
                  background: amount === preset ? "var(--ax-faint)" : "transparent",
                  color: amount === preset ? "var(--ax)" : "var(--text-muted)",
                  borderRadius: "2px",
                }}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Custom amount */}
        <div>
          <span className="label mb-2 block">CUSTOM AMOUNT</span>
          <div
            className="flex items-center px-4"
            style={{ border: "1px solid var(--border)", borderRadius: "2px", background: "var(--surface)" }}
          >
            <input
              id="tip-amount-input"
              type="number"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              min="0.001"
              step="0.1"
              placeholder="0.00"
              className="flex-1 py-3.5 text-2xl font-mono font-bold bg-transparent outline-none"
              style={{ color: "var(--text)" }}
            />
            <span className="font-mono text-sm font-bold ml-2" style={{ color: "var(--ax)" }}>STRK</span>
          </div>
        </div>

        {/* Message */}
        <div>
          <span className="label mb-2 block">MESSAGE (OPTIONAL)</span>
          <textarea
            id="tip-message-input"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={`A note for ${creatorName}…`}
            className="field resize-none"
            rows={3}
            maxLength={200}
            style={{ fontFamily: "var(--font-sans)" }}
          />
          {message && (
            <p className="font-mono text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              {message.length}/200 — stored on-chain
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            id="tip-error-msg"
            className="px-4 py-3 text-sm"
            style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", borderRadius: "2px", color: "#f87171" }}
          >
            {error}
          </div>
        )}

        {/* Action */}
        {!isConnected ? (
          <button id="tip-connect-btn" onClick={onConnect} disabled={isConnecting} className="btn-primary w-full py-4">
            <span className="font-mono text-sm">
              {isConnecting ? <>CONNECTING<span className="cursor" /></> : "CONNECT WALLET TO TIP"}
            </span>
          </button>
        ) : (
          <button
            id="tip-send-btn"
            onClick={onSend}
            disabled={sending || !isValid}
            className="btn-primary w-full py-4"
            style={{ opacity: sending || !isValid ? 0.35 : 1 }}
          >
            <span className="font-mono text-sm">
              {sending
                ? <>SENDING<span className="cursor" /></>
                : `SEND ${isValid ? parsedAmount + " STRK" : "TIP"} →`}
            </span>
          </button>
        )}

        {/* Footer note */}
        <div className="flex items-center gap-2 justify-center" style={{ paddingTop: "2px" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--ax)", opacity: 0.6 }} />
          <span className="font-mono text-xs" style={{ color: "var(--text-dim)" }}>
            STRK on Starknet Sepolia
          </span>
        </div>
      </div>
    </div>
  );
}
