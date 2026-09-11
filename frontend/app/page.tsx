"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { ContractGate } from "@/components/ContractGate";
import { config, isContractConfigured } from "@/lib/config";
import {
  fetchAssetInfo,
  type AssetInfo,
} from "@/lib/stellar/contract";
import { toUserErrorMessage } from "@/lib/errors";

function AssetInfoPanel() {
  const [asset, setAsset] = useState<AssetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isContractConfigured()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const info = await fetchAssetInfo();
      setAsset(info);
    } catch (err) {
      setError(toUserErrorMessage(err));
      setAsset(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (!isContractConfigured()) {
    return (
      <Card
        title="Asset info"
        state="empty"
        emptyMessage="Set NEXT_PUBLIC_CONTRACT_ID to load on-chain asset state."
      />
    );
  }

  if (loading) {
    return <Card title="Asset info" state="loading" metadata="on-chain" />;
  }

  if (error) {
    return (
      <Card
        title="Asset info"
        state="error"
        errorMessage={error}
        footer={
          <button
            type="button"
            onClick={() => void load()}
            className="font-semibold text-brand-cyan hover:underline"
          >
            Retry
          </button>
        }
      />
    );
  }

  if (!asset) {
    return (
      <Card
        title="Asset info"
        state="empty"
        emptyMessage="Contract is deployed but not initialized. An admin must call initialize on /admin."
        metadata={
          <code className="font-mono text-mono text-text-muted">
            {config.contractId?.slice(0, 8)}…
          </code>
        }
      />
    );
  }

  return (
    <Card
      title="Asset info"
      metadata={
        <span
          className={[
            "rounded-sm px-2 py-1 text-label font-semibold",
            asset.paused
              ? "bg-semantic-warning/15 text-semantic-warning"
              : "bg-semantic-success/15 text-semantic-success",
          ].join(" ")}
        >
          {asset.paused ? "Paused" : "Live"}
        </span>
      }
      footer={
        <span className="font-mono text-mono">
          payment_token {asset.payment_token}
        </span>
      }
    >
      <dl className="grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-label uppercase text-text-muted">Name</dt>
          <dd className="mt-1 font-mono text-data text-text-primary">
            {asset.name}
          </dd>
        </div>
        <div>
          <dt className="text-label uppercase text-text-muted">Total supply</dt>
          <dd className="mt-1 font-mono text-data text-text-primary">
            {asset.total_supply.toString()}
          </dd>
        </div>
        <div>
          <dt className="text-label uppercase text-text-muted">
            Price / unit
          </dt>
          <dd className="mt-1 font-mono text-data text-text-primary">
            {asset.price_per_unit.toString()}
          </dd>
        </div>
      </dl>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-border-default bg-bg-surface">
        <div
          className="pointer-events-none absolute inset-y-0 right-0 flex w-[55%] items-center justify-end opacity-[0.12]"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/oppia-wave-linkedin-right-to-left.svg"
            alt=""
            className="h-full max-h-[280px] w-auto object-contain object-right"
          />
        </div>
        <div className="relative max-w-2xl space-y-3 px-5 py-8 md:px-8 md:py-10">
          <p className="text-label uppercase tracking-wider text-brand-cyan">
            Oppia · Stellar Bolivia Bootcamp · Día 3
          </p>
          <h1 className="text-h1 text-text-primary md:text-display">
            RWA Launchpad
          </h1>
          <p className="text-body text-text-secondary">
            Functional demo UI for the Soroban RWA launchpad: initialize an
            asset, whitelist investors, accept payment-token investments, mint
            RWA units, and withdraw proceeds — against the live Día 3 contract
            on testnet.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContractGate>
          <AssetInfoPanel />
        </ContractGate>

        <Card
          title="SEP-1 · stellar.toml"
          metadata="static explainer"
          footer="This card is documentation only — it does not fetch a live toml."
        >
          <div className="space-y-3 text-body-sm text-text-secondary">
            <p>
              <strong className="text-text-primary">SEP-1</strong> defines how
              a Stellar deployment publishes a{" "}
              <code className="font-mono text-mono text-text-primary">
                stellar.toml
              </code>{" "}
              file so wallets and explorers can discover issuer metadata.
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Declares organization info, documentation URLs, and contact
                points.
              </li>
              <li>
                Lists currencies / assets (code, issuer, display decimals,
                conditions).
              </li>
              <li>
                Can point to transfer servers, KYC (SEP-12), and other SEP
                endpoints when those are in scope.
              </li>
            </ul>
            <p>
              For this bootcamp demo the on-chain source of truth is the
              launchpad contract&apos;s{" "}
              <code className="font-mono text-mono">AssetInfo</code>; a
              production issuer would still publish matching SEP-1 fields
              off-chain.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
