"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContractGate } from "@/components/ContractGate";
import { config, isContractConfigured } from "@/lib/config";
import { fetchAssetInfo, type AssetInfo } from "@/lib/stellar/contract";
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
        footer={
          <Link
            href="/admin"
            className="font-semibold text-brand-cyan hover:underline"
          >
            Go to Admin →
          </Link>
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
        <div className="relative z-10 max-w-2xl space-y-4 px-5 py-8 md:px-8 md:py-10">
          <p className="text-label uppercase tracking-wider text-brand-cyan">
            Oppia · Stellar Bolivia Bootcamp · Día 2
          </p>
          <h1 className="text-h1 text-text-primary md:text-display">
            RWA Launchpad
          </h1>
          <p className="text-body text-text-secondary">
            Day-two checkpoint: a functional contract with separate admin and
            user tools. Initialize the asset, mint RWA units, manage the
            whitelist, look up balances, and transfer tokens, scoped to what
            the Día 2 contract actually implements. Invest and withdraw arrive
            on Día 3.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin">
              <Button>Admin actions</Button>
            </Link>
            <Link href="/user">
              <Button variant="secondary">User actions</Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ContractGate>
          <AssetInfoPanel />
        </ContractGate>

        <Card title="Día 2 contract scope" metadata="available functions">
          <ul className="space-y-3 text-body-sm">
            <li className="rounded-sm border border-border-subtle bg-bg-elevated/50 px-4 py-3">
              <span className="font-mono text-mono text-text-primary">
                initialize
              </span>
              <span className="ml-2 text-text-muted">· Admin</span>
            </li>
            <li className="rounded-sm border border-border-subtle bg-bg-elevated/50 px-4 py-3">
              <span className="font-mono text-mono text-text-primary">mint</span>
              <span className="ml-2 text-text-muted">· Admin</span>
            </li>
            <li className="rounded-sm border border-border-subtle bg-bg-elevated/50 px-4 py-3">
              <span className="font-mono text-mono text-text-primary">
                set_whitelist
              </span>
              <span className="ml-2 text-text-muted">· Admin</span>
            </li>
            <li className="rounded-sm border border-border-subtle bg-bg-elevated/50 px-4 py-3">
              <span className="font-mono text-mono text-text-primary">
                balance
              </span>
              <span className="ml-2 text-text-muted">· User</span>
            </li>
            <li className="rounded-sm border border-border-subtle bg-bg-elevated/50 px-4 py-3">
              <span className="font-mono text-mono text-text-primary">
                transfer
              </span>
              <span className="ml-2 text-text-muted">· User</span>
            </li>
          </ul>
          <p className="mt-4 text-body-sm text-text-muted">
            <code className="font-mono text-mono">invest</code> and{" "}
            <code className="font-mono text-mono">withdraw</code> are not part
            of Día 2. Use the Día 3 frontend when those are ready.
          </p>
        </Card>
      </div>
    </div>
  );
}
