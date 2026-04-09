"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { AccountInterface } from "starknet";

export type WalletState = {
  address: string | null;
  account: AccountInterface | null;
  isConnecting: boolean;
  isConnected: boolean;
  walletName: string | null;
};

type WalletContextType = WalletState & {
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    account: null,
    isConnecting: false,
    isConnected: false,
    walletName: null,
  });

  const walletRef = useRef<{ disconnect?: () => void } | null>(null);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true }));
    try {
      const { connect: gsConnect } = await import("@starknet-io/get-starknet");

      const selectedWallet = await gsConnect({
        modalMode: "alwaysAsk",
        modalTheme: "dark",
      });

      if (!selectedWallet) {
        setState((prev) => ({ ...prev, isConnecting: false }));
        return;
      }

      const w = selectedWallet as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const address: string =
        w.selectedAddress ?? w.account?.address ?? w.address ?? null;

      if (!address) throw new Error("No address returned from wallet");

      walletRef.current = w;

      setState({
        address,
        account: w.account as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        isConnecting: false,
        isConnected: true,
        walletName: w.name ?? w.id ?? "Wallet",
      });
    } catch (err) {
      console.error("Wallet connect error:", err);
      setState((prev) => ({ ...prev, isConnecting: false }));
    }
  }, []);

  const disconnect = useCallback(() => {
    try {
      if (walletRef.current?.disconnect) {
        walletRef.current.disconnect();
      }
    } catch {
      void 0;
    }
    walletRef.current = null;
    setState({
      address: null,
      account: null,
      isConnecting: false,
      isConnected: false,
      walletName: null,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
