import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/providers/WalletProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Starkjar — Tips for Creators on Starknet",
  description:
    "Support creators with STRK tokens on Starknet. Connect Argent, Braavos, or any Starknet wallet and send on-chain tips in seconds.",
  keywords: ["starknet", "creator tips", "web3", "STRK", "argent", "braavos", "starkjar"],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://starkjar.netlify.app"
  ),
  openGraph: {
    title: "Starkjar — Tips for Creators on Starknet",
    description: "Support creators with STRK tokens. Connect any Starknet wallet.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starkjar — Tips for Creators on Starknet",
    description: "Support creators with STRK tokens on Starknet.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning style={{ fontFamily: "var(--font-display)" }}>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
