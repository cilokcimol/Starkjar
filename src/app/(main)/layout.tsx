import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-950">
      <Navbar />
      <main className="pt-16">{children}</main>
      <footer className="border-t border-white/5 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-slate-500 text-sm">
            Built by{" "}
            <span className="text-slate-400 font-medium">Vika Joestar</span>{" "}
            for the Starkzap Developer Bounty Program.
          </p>
          <p className="text-slate-600 text-xs mt-1">
            Powered by{" "}
            <span className="text-brand-400">Starkzap SDK</span>
            {" and "}
            <span className="text-brand-400">AVNU Paymaster</span>
            {" on Starknet Mainnet."}
          </p>
        </div>
      </footer>
    </div>
  );
}
