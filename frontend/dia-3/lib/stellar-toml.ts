export type StellarCurrency = {
  code: string;
  issuer: string;
  status: string;
  display_decimals: number;
  name: string;
  desc: string;
  conditions: string;
};

export type StellarDocumentation = {
  ORG_NAME: string;
  ORG_OFFICIAL_EMAIL: string;
};

export type StellarToml = {
  VERSION: string;
  NETWORK_PASSPHRASE: string;
  CURRENCIES: StellarCurrency[];
  DOCUMENTATION: StellarDocumentation;
};

function stripComment(line: string): string {
  let inString = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (ch === "#" && !inString) {
      return line.slice(0, i);
    }
  }
  return line;
}

function parseValue(raw: string): string | number {
  const trimmed = raw.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }
  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  return trimmed;
}

function emptyCurrency(): StellarCurrency {
  return {
    code: "",
    issuer: "",
    status: "",
    display_decimals: 0,
    name: "",
    desc: "",
    conditions: "",
  };
}

function emptyDocumentation(): StellarDocumentation {
  return {
    ORG_NAME: "",
    ORG_OFFICIAL_EMAIL: "",
  };
}

/** Minimal parser for the bootcamp stellar.toml template (flat keys and tables). */
export function parseStellarToml(source: string): StellarToml {
  const result: StellarToml = {
    VERSION: "",
    NETWORK_PASSPHRASE: "",
    CURRENCIES: [],
    DOCUMENTATION: emptyDocumentation(),
  };

  let section: "root" | "currencies" | "documentation" = "root";
  let currentCurrency: StellarCurrency | null = null;

  for (const rawLine of source.split(/\r?\n/)) {
    const line = stripComment(rawLine).trim();
    if (!line) continue;

    if (line === "[[CURRENCIES]]") {
      section = "currencies";
      currentCurrency = emptyCurrency();
      result.CURRENCIES.push(currentCurrency);
      continue;
    }

    if (line === "[DOCUMENTATION]") {
      section = "documentation";
      currentCurrency = null;
      continue;
    }

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    const value = parseValue(line.slice(eq + 1));

    if (section === "root") {
      if (key === "VERSION" && typeof value === "string") {
        result.VERSION = value;
      } else if (key === "NETWORK_PASSPHRASE" && typeof value === "string") {
        result.NETWORK_PASSPHRASE = value;
      }
      continue;
    }

    if (section === "currencies" && currentCurrency) {
      if (key === "display_decimals" && typeof value === "number") {
        currentCurrency.display_decimals = value;
      } else if (key in currentCurrency && typeof value === "string") {
        currentCurrency[key as keyof Omit<StellarCurrency, "display_decimals">] =
          value;
      }
      continue;
    }

    if (section === "documentation") {
      if (key === "ORG_NAME" && typeof value === "string") {
        result.DOCUMENTATION.ORG_NAME = value;
      } else if (key === "ORG_OFFICIAL_EMAIL" && typeof value === "string") {
        result.DOCUMENTATION.ORG_OFFICIAL_EMAIL = value;
      }
    }
  }

  return result;
}

export async function fetchStellarToml(): Promise<StellarToml> {
  const response = await fetch("/.well-known/stellar.toml");
  if (!response.ok) {
    throw new Error(
      `Could not load /.well-known/stellar.toml (${response.status}).`,
    );
  }
  const text = await response.text();
  return parseStellarToml(text);
}
