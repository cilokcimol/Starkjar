"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { WalletInterface } from "starkzap";

export type WalletState = {
  address: string | null;
  starkzapWallet: WalletInterface | null;
  isConnecting: boolean;
  isConnected: boolean;
  strkBalance: string | null;
};

type WalletContextType = WalletState & {
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { ready, authenticated, login, logout, getAccessToken, user } =
    usePrivy();

  const [state, setState] = useState<WalletState>({
    address: null,
    starkzapWallet: null,
    isConnecting: false,
    isConnected: false,
    strkBalance: null,
  });

  const walletRef = useRef<WalletInterface | null>(null);

  const refreshBalance = useCallback(async () => {
    if (!walletRef.current) return;
    try {
      const { getPresets } = await import("starkzap");
      const wallet = walletRef.current;
      const chainId = wallet.getChainId();
      const presets = getPresets(chainId);
      const STRK = presets["STRK"] ?? presets["strk"];
      if (!STRK) return;
      const balance = await wallet.balanceOf(STRK);
      setState((prev) => ({
        ...prev,
        strkBalance: balance.toFormatted(true),
      }));
    } catch {
      setState((prev) => ({ ...prev, strkBalance: "0 STRK" }));
    }
  }, []);

  const connect = useCallback(async () => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      const accessToken = await getAccessToken();
      const appUrl =
        typeof window !== "undefined"
          ? window.location.origin
          : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

      const { StarkZap, OnboardStrategy, accountPresets } = await import(
        "starkzap"
      );

      const sdk = new StarkZap({
        network: "sepolia",
        rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
        paymaster: {
          nodeUrl: `${appUrl}/api/paymaster`,
        },
      });

      const result = await sdk.onboard({
        strategy: OnboardStrategy.Privy,
        accountPreset: accountPresets.argentXV050,
        feeMode: "sponsored",
        deploy: "if_needed",
        privy: {
          resolve: async () => {
            const res = await fetch("/api/wallet/starknet", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({ userId: user?.id }),
            });
            if (!res.ok) throw new Error("Failed to resolve Privy wallet");
            const data = await res.json();
            return {
              walletId: data.walletId,
              publicKey: data.publicKey,
              serverUrl: `${appUrl}/api/wallet/sign`,
            };
          },
        },
      });

      const wallet = result.wallet;
      walletRef.current = wallet;

      const address = wallet.address.toString();
      setState({
        address,
        starkzapWallet: wallet,
        isConnecting: false,
        isConnected: true,
        strkBalance: null,
      });

      refreshBalance();
    } catch (err) {
      console.error("Wallet connect error:", err);
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  }, [ready, authenticated, login, getAccessToken, user?.id, refreshBalance]);

  const disconnect = useCallback(() => {
    walletRef.current = null;
    setState({
      address: null,
      starkzapWallet: null,
      isConnecting: false,
      isConnected: false,
      strkBalance: null,
    });
    logout();
  }, [logout]);

  return (
    <WalletContext.Provider
      value={{ ...state, connect, disconnect, refreshBalance }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
