"use client";

import type { ReactNode } from "react";
import { stellarExpertTxUrl } from "@/lib/config";

export function TxSuccess({
  hash,
  children,
}: {
  hash: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-md border border-semantic-success/30 bg-semantic-success/10 px-3 py-2 text-body-sm text-semantic-success">
      {children ?? "Transaction confirmed."}{" "}
      <a
        href={stellarExpertTxUrl(hash)}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold underline underline-offset-2 hover:text-text-primary"
      >
        View on Stellar Expert
      </a>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <div className="rounded-md border border-semantic-danger/30 bg-semantic-danger/10 px-3 py-2 text-body-sm text-semantic-danger">
      {message}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-label uppercase tracking-wide text-text-muted">
        {label}
      </span>
      {children}
      {hint ? <span className="text-label text-text-muted">{hint}</span> : null}
    </label>
  );
}

export const inputClassName =
  "min-h-[44px] w-full rounded-md border border-border-default bg-bg-elevated px-3 text-body-sm text-text-primary placeholder:text-text-muted focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-cyan/40";
