import { Navbar } from "@/components/layout/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />
      <main>{children}</main>
      <footer style={{ borderTop: "1px solid var(--border)", marginTop: "4rem" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="label">STARKJAR / 2026 / OPEN SOURCE</span>
          <a
            href="https://github.com/cilokcimol/Starkjar"
            target="_blank"
            rel="noopener noreferrer"
            className="label hover:text-ax transition-colors"
            style={{ textDecoration: "none" }}
          >
            GITHUB ↗
          </a>
        </div>
      </footer>
    </div>
  );
}
