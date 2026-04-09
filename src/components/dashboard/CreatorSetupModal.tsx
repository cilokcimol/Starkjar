"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

type Props = {
  address: string;
  onClose: () => void;
  onSaved: (data: { name: string; handle: string; bio: string }) => void;
};

export function CreatorSetupModal({ address, onClose, onSaved }: Props) {
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Display name is required."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, name: name.trim(), handle: handle.trim() || address.slice(0, 8), bio: bio.trim() }),
      });
      if (!res.ok) throw new Error("Failed to save");
      onSaved(await res.json());
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(9,9,26,0.88)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="relative w-full max-w-md panel-raised animate-appear"
        style={{ padding: 0, overflow: "hidden" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <div>
            <span className="label-amber block mb-0.5">PROFILE / SETUP</span>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>This is how fans will see you</p>
          </div>
          <button
            onClick={onClose}
            id="setup-modal-close"
            className="font-mono text-xs py-1 px-2 transition-colors"
            style={{ color: "var(--text-dim)", border: "1px solid var(--border)", borderRadius: "2px" }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <span className="label mb-2 block">DISPLAY NAME *</span>
            <input
              id="setup-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vika Joestar"
              className="field"
              maxLength={50}
              required
            />
          </div>

          <div>
            <span className="label mb-2 block">HANDLE (OPTIONAL)</span>
            <input
              id="setup-handle-input"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, ""))}
              placeholder="e.g. vikajoestar"
              className="field"
              maxLength={30}
            />
          </div>

          <div>
            <span className="label mb-2 block">BIO (OPTIONAL)</span>
            <textarea
              id="setup-bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your fans who you are…"
              className="field resize-none"
              rows={3}
              maxLength={200}
            />
          </div>

          {error && (
            <div
              className="px-4 py-3 text-sm font-mono"
              style={{ border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", borderRadius: "2px", color: "#f87171" }}
            >
              {error}
            </div>
          )}

          <button id="setup-save-btn" type="submit" disabled={loading} className="btn-primary w-full py-3">
            <span className="font-mono text-sm">
              {loading ? <><Loader2 className="w-4 h-4 inline animate-spin mr-2" />SAVING…</> : "SAVE PROFILE →"}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
