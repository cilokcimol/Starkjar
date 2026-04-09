import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { PrivyClientProvider } from "@/components/providers/PrivyProvider";
import { WalletProvider } from "@/components/providers/WalletProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starkjar - Gasless Tips for Creators on Starknet",
  description:
    "Support your favorite creators with STRK tokens on Starknet. Zero gas fees required. Powered by Starkzap SDK and AVNU Paymaster for a seamless Web2-like experience.",
  keywords: [
    "starknet",
    "creator tips",
    "gasless",
    "web3",
    "STRK",
    "buy me a coffee",
    "crypto tips",
    "starkzap",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://starkjar.app"
  ),
  openGraph: {
    title: "Starkjar - Gasless Tips for Creators on Starknet",
    description:
      "Support creators with STRK tokens. Zero gas fees. Built on Starknet.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starkjar - Gasless Tips for Creators on Starknet",
    description: "Support creators with STRK tokens. Zero gas fees.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <PrivyClientProvider>
          <WalletProvider>{children}</WalletProvider>
        </PrivyClientProvider>
      </body>
    </html>
  );
}
