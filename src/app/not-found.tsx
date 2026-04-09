import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-6 mx-auto">
        <span className="text-white font-black text-3xl">?</span>
      </div>
      <h1 className="text-5xl font-black text-white mb-3">404</h1>
      <p className="text-xl font-semibold text-slate-400 mb-2">Page not found</p>
      <p className="text-slate-500 text-sm max-w-sm mb-8">
        The page you are looking for does not exist. If you were looking for a
        creator profile, make sure the wallet address in the URL is correct.
      </p>
      <Link
        href="/"
        className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2"
      >
        Back to Home
      </Link>
    </div>
  );
}
