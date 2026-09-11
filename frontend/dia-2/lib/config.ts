export type AppNetwork = "testnet" | "public" | "futurenet";

const RAW_NETWORK = (
  process.env.NEXT_PUBLIC_NETWORK ?? "testnet"
).toLowerCase();

export const config = {
  contractId: process.env.NEXT_PUBLIC_CONTRACT_ID?.trim() || undefined,
  paymentTokenId: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ID?.trim() || undefined,
  adminAddress: process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.trim() || undefined,
  network: (["testnet", "public", "futurenet"].includes(RAW_NETWORK)
    ? RAW_NETWORK
    : "testnet") as AppNetwork,
  sorobanRpcUrl:
    process.env.NEXT_PUBLIC_SOROBAN_RPC_URL?.trim() ||
    "https://soroban-testnet.stellar.org",
} as const;

export function isContractConfigured(): boolean {
  return Boolean(config.contractId);
}

export function stellarExpertTxUrl(txHash: string): string {
  const networkPath =
    config.network === "public"
      ? "public"
      : config.network === "futurenet"
        ? "futurenet"
        : "testnet";
  return `https://stellar.expert/explorer/${networkPath}/tx/${txHash}`;
}

export const NOT_DEPLOYED_MESSAGE =
  "Contract not configured. Set NEXT_PUBLIC_CONTRACT_ID in your environment.";
