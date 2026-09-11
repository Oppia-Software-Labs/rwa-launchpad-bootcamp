"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { config } from "@/lib/config";
import {
  checkFreighterConnected,
  connectFreighter,
  isWalletNetworkMatching,
  readFreighterAddress,
  readFreighterNetwork,
  signWithFreighter,
  type FreighterNetworkDetails,
} from "@/lib/stellar/wallet";
import type { SignTransactionFn } from "@/lib/stellar/contract";

type WalletContextValue = {
  address: string | null;
  connecting: boolean;
  networkOk: boolean;
  networkDetails: FreighterNetworkDetails | null;
  expectedNetwork: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  refresh: () => Promise<void>;
  signTransaction: SignTransactionFn;
  isAdmin: boolean;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [networkOk, setNetworkOk] = useState(true);
  const [networkDetails, setNetworkDetails] =
    useState<FreighterNetworkDetails | null>(null);

  const refresh = useCallback(async () => {
    const connected = await checkFreighterConnected();
    if (!connected) {
      setAddress(null);
      setNetworkDetails(null);
      setNetworkOk(true);
      return;
    }

    const addr = await readFreighterAddress();
    setAddress(addr);

    const details = await readFreighterNetwork();
    setNetworkDetails(details);
    setNetworkOk(await isWalletNetworkMatching());
  }, []);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      void refresh();
    }, 8_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  const connect = useCallback(async () => {
    setConnecting(true);
    try {
      const addr = await connectFreighter();
      setAddress(addr);
      const details = await readFreighterNetwork();
      setNetworkDetails(details);
      setNetworkOk(await isWalletNetworkMatching());
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  const isAdmin = Boolean(
    address &&
      config.adminAddress &&
      address === config.adminAddress,
  );

  const value = useMemo<WalletContextValue>(
    () => ({
      address,
      connecting,
      networkOk,
      networkDetails,
      expectedNetwork: config.network,
      connect,
      disconnect,
      refresh,
      signTransaction: signWithFreighter,
      isAdmin,
    }),
    [
      address,
      connecting,
      networkOk,
      networkDetails,
      connect,
      disconnect,
      refresh,
      isAdmin,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}
