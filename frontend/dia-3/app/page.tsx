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
import {
  fetchStellarToml,
  type StellarCurrency,
  type StellarToml,
} from "@/lib/stellar-toml";

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

function CurrencyFields({ currency }: { currency: StellarCurrency }) {
  return (
    <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
      <div className="min-w-0">
        <dt className="text-label uppercase text-text-muted">code</dt>
        <dd className="mt-1 font-mono text-data text-text-primary">
          {currency.code}
        </dd>
      </div>
      <div className="min-w-0">
        <dt className="text-label uppercase text-text-muted">issuer</dt>
        <dd className="mt-1 break-all font-mono text-body-sm text-text-primary">
          {currency.issuer}
        </dd>
      </div>
      <div className="min-w-0">
        <dt className="text-label uppercase text-text-muted">status</dt>
        <dd className="mt-1 font-mono text-data text-text-primary">
          {currency.status}
        </dd>
      </div>
      <div className="min-w-0">
        <dt className="text-label uppercase text-text-muted">
          display_decimals
        </dt>
        <dd className="mt-1 font-mono text-data text-text-primary">
          {currency.display_decimals}
        </dd>
      </div>
      <div className="min-w-0 sm:col-span-2">
        <dt className="text-label uppercase text-text-muted">name</dt>
        <dd className="mt-1 break-words text-body text-text-primary">
          {currency.name}
        </dd>
      </div>
      <div className="min-w-0 sm:col-span-2">
        <dt className="text-label uppercase text-text-muted">desc</dt>
        <dd className="mt-1 break-words text-body text-text-primary">
          {currency.desc}
        </dd>
      </div>
      <div className="min-w-0 sm:col-span-2">
        <dt className="text-label uppercase text-text-muted">conditions</dt>
        <dd className="mt-1 break-words text-body text-text-primary">
          {currency.conditions}
        </dd>
      </div>
    </dl>
  );
}

function Sep1Panel() {
  const [toml, setToml] = useState<StellarToml | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await fetchStellarToml();
      setToml(parsed);
    } catch (err) {
      setError(toUserErrorMessage(err));
      setToml(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <Card
        title="SEP-1 · stellar.toml"
        state="loading"
        metadata="as declared in your stellar.toml"
      />
    );
  }

  if (error) {
    return (
      <Card
        title="SEP-1 · stellar.toml"
        state="error"
        errorMessage={error}
        metadata="as declared in your stellar.toml"
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

  if (!toml) {
    return (
      <Card
        title="SEP-1 · stellar.toml"
        state="empty"
        emptyMessage="No stellar.toml data available."
        metadata="as declared in your stellar.toml"
      />
    );
  }

  return (
    <Card
      title="SEP-1 · stellar.toml"
      metadata="as declared in your stellar.toml"
      className="min-w-0"
      footer={
        <span className="font-mono text-mono">/.well-known/stellar.toml</span>
      }
    >
      <div className="min-w-0 space-y-6">
        <div>
          <p className="mb-3 text-label font-semibold uppercase text-text-muted">
            [DOCUMENTATION]
          </p>
          <dl className="grid min-w-0 gap-3 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-label uppercase text-text-muted">
                ORG_NAME
              </dt>
              <dd className="mt-1 break-words text-body text-text-primary">
                {toml.DOCUMENTATION.ORG_NAME}
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="text-label uppercase text-text-muted">
                ORG_OFFICIAL_EMAIL
              </dt>
              <dd className="mt-1 break-words text-body text-text-primary">
                {toml.DOCUMENTATION.ORG_OFFICIAL_EMAIL}
              </dd>
            </div>
          </dl>
        </div>

        {toml.CURRENCIES.map((currency, index) => (
          <div key={`${currency.code}-${index}`} className="min-w-0">
            <p className="mb-3 text-label font-semibold uppercase text-text-muted">
              [[CURRENCIES]]{toml.CURRENCIES.length > 1 ? ` #${index + 1}` : ""}
            </p>
            <CurrencyFields currency={currency} />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-lg border border-border-default bg-bg-surface">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
          aria-hidden
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 80% at 70% 45%, #000 15%, transparent 72%)",
            maskImage:
              "radial-gradient(ellipse 85% 80% at 70% 45%, #000 15%, transparent 72%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/oppia-wave-linkedin-right-to-left.svg"
            alt=""
            className="h-full w-full object-cover object-right"
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3 px-5 py-8 md:px-8 md:py-10">
          <p className="text-label uppercase tracking-wider text-brand-cyan">
            Oppia · Stellar Bolivia Bootcamp · Día 3
          </p>
          <h1 className="text-h1 text-text-primary md:text-display">
            RWA Launchpad
          </h1>
          <p className="text-body text-text-secondary">
            Functional demo UI for the Soroban RWA launchpad: initialize an
            asset, whitelist investors, accept payment-token investments, mint
            RWA units, and withdraw proceeds against the live Día 3 contract on
            testnet.
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContractGate>
          <AssetInfoPanel />
        </ContractGate>

        <Sep1Panel />
      </div>
    </div>
  );
}
