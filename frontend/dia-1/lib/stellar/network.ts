import { Networks } from "@stellar/stellar-sdk";
import { config, type AppNetwork } from "@/lib/config";

export function networkPassphrase(network: AppNetwork = config.network): string {
  switch (network) {
    case "public":
      return Networks.PUBLIC;
    case "futurenet":
      return Networks.FUTURENET;
    case "testnet":
    default:
      return Networks.TESTNET;
  }
}

export function freighterNetworkExpected(
  network: AppNetwork = config.network,
): string {
  switch (network) {
    case "public":
      return "PUBLIC";
    case "futurenet":
      return "FUTURENET";
    case "testnet":
    default:
      return "TESTNET";
  }
}

export function networksMatch(
  walletNetwork: string | undefined | null,
  walletPassphrase?: string | null,
): boolean {
  if (!walletNetwork && !walletPassphrase) return true;

  const expected = freighterNetworkExpected();
  const expectedPassphrase = networkPassphrase();

  if (walletPassphrase && walletPassphrase === expectedPassphrase) {
    return true;
  }

  if (walletNetwork) {
    const normalized = walletNetwork.toUpperCase().replace(/\s+/g, "");
    if (normalized === expected) return true;
    if (normalized.includes("TESTNET") && expected === "TESTNET") return true;
    if (normalized.includes("PUBLIC") && expected === "PUBLIC") return true;
    if (normalized.includes("FUTURENET") && expected === "FUTURENET") return true;
  }

  return false;
}
