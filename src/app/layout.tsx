import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/components/providers/WalletProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Starkjar - Tips for Creators on Starknet",
  description:
    "Support your favorite creators with STRK tokens on Starknet. Connect with Argent, Braavos, or any Starknet wallet.",
  keywords: [
    "starknet",
    "creator tips",
    "web3",
    "STRK",
    "buy me a coffee",
    "crypto tips",
    "argent",
    "braavos",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://starkjar.netlify.app"
  ),
  openGraph: {
    title: "Starkjar - Tips for Creators on Starknet",
    description:
      "Support creators with STRK tokens. Connect with Argent, Braavos, or any Starknet wallet.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starkjar - Tips for Creators on Starknet",
    description: "Support creators with STRK tokens on Starknet.",
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
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}

