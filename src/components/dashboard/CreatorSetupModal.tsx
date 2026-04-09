"use client";

import { useState } from "react";
import { X, Loader2, User } from "lucide-react";

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
    if (!name.trim()) {
      setError("Display name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/creator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          name: name.trim(),
          handle: handle.trim() || address.slice(0, 8),
          bio: bio.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      const data = await res.json();
      onSaved(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md card border-brand-500/20 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          id="setup-modal-close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Set up your profile</h2>
            <p className="text-slate-500 text-xs">This is how fans will see you</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Display Name *
            </label>
            <input
              id="setup-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vika Joestar"
              className="input-field"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Handle (optional)
            </label>
            <input
              id="setup-handle-input"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/gi, ""))}
              placeholder="e.g. vikajoestar"
              className="input-field"
              maxLength={30}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Bio (optional)
            </label>
            <textarea
              id="setup-bio-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your fans who you are..."
              className="input-field resize-none"
              rows={3}
              maxLength={200}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
              {error}
            </p>
          )}

          <button
            id="setup-save-btn"
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-xl py-3"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
