/** Contract Error enum used in later bootcamp days; dia-1 may adopt AlreadyInitialized. */
export enum ContractErrorCode {
  AlreadyInitialized = 2,
}

const MESSAGES: Record<ContractErrorCode, string> = {
  [ContractErrorCode.AlreadyInitialized]:
    "The launchpad is already initialized. initialize can only run once.",
};

export function messageForContractError(
  code: ContractErrorCode | number,
): string {
  return (
    MESSAGES[code as ContractErrorCode] ??
    `Contract error #${code}. Check the transaction details on Stellar Expert.`
  );
}

export function parseContractErrorCode(error: unknown): number | null {
  const text =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? `${error.message}\n${String((error as Error & { response?: unknown }).response ?? "")}`
        : String(error);

  const patterns = [
    /Error\(Contract,\s*#(\d+)\)/i,
    /ContractError\((\d+)\)/i,
    /"code"\s*:\s*(\d+)/,
    /error:\s*#(\d+)/i,
    /HostError[^\d]*(\d+)/i,
    /AlreadyInitialized/i,
  ];

  for (const re of patterns) {
    const match = text.match(re);
    if (re.source === "AlreadyInitialized/i") {
      if (/AlreadyInitialized/i.test(text)) {
        return ContractErrorCode.AlreadyInitialized;
      }
      continue;
    }
    if (match?.[1]) {
      const code = Number(match[1]);
      if (code === ContractErrorCode.AlreadyInitialized) return code;
    }
  }

  return null;
}

export class ContractCallError extends Error {
  readonly code: number | null;

  constructor(message: string, code: number | null = null) {
    super(message);
    this.name = "ContractCallError";
    this.code = code;
  }
}

export function toUserErrorMessage(error: unknown): string {
  const code = parseContractErrorCode(error);
  if (code !== null) return messageForContractError(code);

  if (error instanceof Error && error.message) {
    if (/User declined|rejected|denied/i.test(error.message)) {
      return "Transaction rejected in Freighter.";
    }
    if (/network/i.test(error.message) && /mismatch|passphrase/i.test(error.message)) {
      return "Wallet network does not match this app. Switch Freighter to the configured network.";
    }
    return error.message;
  }

  return "Something went wrong. See the browser console for details.";
}

export function toContractCallError(error: unknown): ContractCallError {
  const code = parseContractErrorCode(error);
  return new ContractCallError(toUserErrorMessage(error), code);
}
