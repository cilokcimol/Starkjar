"use client";

import { Loader2, Zap, MessageSquare, ChevronRight } from "lucide-react";
import { PRESET_AMOUNTS } from "@/lib/constants";
import clsx from "clsx";

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
  amount,
  message,
  sending,
  error,
  isConnected,
  isConnecting,
  creatorName,
  onAmountChange,
  onMessageChange,
  onConnect,
  onSend,
}: Props) {
  const parsedAmount = parseFloat(amount) || 0;
  const isValid = parsedAmount > 0;

  return (
    <div className="card border-white/8">
      <div className="flex items-center gap-2 mb-5">
        <Zap className="w-4 h-4 text-brand-400" />
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Send a gasless tip
        </h2>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Quick amounts (STRK)
        </label>
        <div className="flex gap-2 flex-wrap">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              id={`preset-${preset}`}
              onClick={() => onAmountChange(preset)}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200",
                amount === preset
                  ? "bg-brand-500 text-white shadow-glow scale-[1.04]"
                  : "bg-surface-800 text-slate-400 border border-white/6 hover:border-brand-500/40 hover:text-white"
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
          Custom amount (STRK)
        </label>
        <div className="relative flex items-center p-4 rounded-xl bg-surface-800 border border-white/6 focus-within:border-brand-500/50 transition-colors">
          <input
            id="tip-amount-input"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            min="0.001"
            step="0.1"
            className="amount-input"
            placeholder="0.00"
          />
          <span className="text-slate-500 font-bold text-lg ml-2 flex-shrink-0">
            STRK
          </span>
        </div>
        {parsedAmount > 0 && (
          <p className="text-slate-600 text-xs mt-1.5 ml-1">
            You send exactly {parsedAmount} STRK. Gas is covered by Starkzap.
          </p>
        )}
      </div>

      <div className="mb-5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 block">
          <MessageSquare className="w-3.5 h-3.5" />
          Message (optional, stored on-chain)
        </label>
        <textarea
          id="tip-message-input"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder={`Say something nice to ${creatorName}...`}
          className="input-field resize-none"
          rows={3}
          maxLength={200}
        />
        {message && (
          <p className="text-slate-600 text-xs mt-1 ml-1">
            {message.length}/200 characters. Will be emitted as a Starknet event.
          </p>
        )}
      </div>

      {error && (
        <div
          id="tip-error-msg"
          className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {!isConnected ? (
        <button
          id="tip-connect-btn"
          onClick={onConnect}
          disabled={isConnecting}
          className="btn-primary w-full rounded-xl py-4 text-base"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting wallet...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Connect to Send Tip
            </>
          )}
        </button>
      ) : (
        <button
          id="tip-send-btn"
          onClick={onSend}
          disabled={sending || !isValid}
          className="btn-primary w-full rounded-xl py-4 text-base group"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending gasless tip...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              Send {isValid ? `${parsedAmount} STRK` : "Tip"} (Gas Free)
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      )}

      <div className="mt-4 flex items-center gap-2 justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <p className="text-slate-600 text-xs">
          No gas fees charged to the donor
        </p>
      </div>
    </div>
  );
}
