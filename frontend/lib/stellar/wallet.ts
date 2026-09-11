"use client";

import {
  getAddress,
  getNetworkDetails,
  isConnected as freighterIsConnected,
  requestAccess,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";
import { networksMatch } from "@/lib/stellar/network";
import type { SignTransactionFn } from "@/lib/stellar/contract";

export type FreighterNetworkDetails = {
  network: string;
  networkPassphrase: string;
  networkUrl?: string;
  sorobanRpcUrl?: string;
};

export async function checkFreighterConnected(): Promise<boolean> {
  try {
    const result = await freighterIsConnected();
    if (typeof result === "boolean") return result;
    if (result && typeof result === "object" && "isConnected" in result) {
      return Boolean((result as { isConnected: boolean }).isConnected);
    }
    return false;
  } catch {
    return false;
  }
}

export async function connectFreighter(): Promise<string> {
  const access = await requestAccess();
  if (access && typeof access === "object" && "error" in access && access.error) {
    throw new Error(
      typeof access.error === "string"
        ? access.error
        : "Freighter access denied.",
    );
  }
  if (access && typeof access === "object" && "address" in access && access.address) {
    return String(access.address);
  }

  const addr = await getAddress();
  if (addr && typeof addr === "object" && "address" in addr && addr.address) {
    return String(addr.address);
  }

  throw new Error("Could not read Freighter address. Is the extension installed?");
}

export async function readFreighterAddress(): Promise<string | null> {
  try {
    const connected = await checkFreighterConnected();
    if (!connected) return null;
    const addr = await getAddress();
    if (addr && typeof addr === "object" && "address" in addr && addr.address) {
      return String(addr.address);
    }
    return null;
  } catch {
    return null;
  }
}

export async function readFreighterNetwork(): Promise<FreighterNetworkDetails | null> {
  try {
    const details = await getNetworkDetails();
    if (!details || typeof details !== "object") return null;
    if ("error" in details && details.error) return null;
    return {
      network: String((details as FreighterNetworkDetails).network ?? ""),
      networkPassphrase: String(
        (details as FreighterNetworkDetails).networkPassphrase ?? "",
      ),
      networkUrl: (details as FreighterNetworkDetails).networkUrl,
      sorobanRpcUrl: (details as FreighterNetworkDetails).sorobanRpcUrl,
    };
  } catch {
    return null;
  }
}

export async function isWalletNetworkMatching(): Promise<boolean> {
  const details = await readFreighterNetwork();
  if (!details) return true;
  return networksMatch(details.network, details.networkPassphrase);
}

export const signWithFreighter: SignTransactionFn = async (xdr, opts) => {
  const signed = await freighterSignTransaction(xdr, {
    networkPassphrase: opts.networkPassphrase,
    address: opts.address,
  });

  if (signed && typeof signed === "object") {
    if ("error" in signed && signed.error) {
      throw new Error(
        typeof signed.error === "string"
          ? signed.error
          : "Freighter failed to sign the transaction.",
      );
    }
    if ("signedTxXdr" in signed && signed.signedTxXdr) {
      return String(signed.signedTxXdr);
    }
  }

  if (typeof signed === "string") return signed;

  throw new Error("Unexpected Freighter signTransaction response.");
};

export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
