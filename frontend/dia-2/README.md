# RWA Launchpad: Día 2 Demo Frontend

Next.js 15 (App Router) + TypeScript + Tailwind demo UI for the **Día 2** Soroban contract (`../../dia-2`). It talks to a live contract via Soroban RPC and Freighter. This is not a static mockup.

> Bootcamp demo only. Not production-hardened (no audit, limited error recovery, testnet assumptions).

## Día 2 scope

This frontend covers only what the Día 2 contract implements:

| Function | Role |
|---|---|
| `initialize` | Admin: one-time asset setup |
| `mint` | Admin: mint RWA units to an address |
| `set_whitelist` | Admin: approve or revoke an investor |
| `balance` | User: read token balance for any address |
| `transfer` | User: move RWA units between holders |

**Not included (Día 3):** `invest`, `withdraw`, `pause`, `unpause`.

## Prerequisites

- Node.js 20+
- [Freighter](https://www.freighter.app/) browser extension
- Día 2 contract deployed on Stellar testnet (or leave env unset to browse empty states)

## Setup

```bash
cd frontend/dia-2
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Fill these in `.env.local` **after** the Día 2 contract is deployed:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed `rwa-launchpad` contract id (`C…`) |
| `NEXT_PUBLIC_PAYMENT_TOKEN_ID` | Payment token / SAC id used at `initialize` (prefills admin form) |
| `NEXT_PUBLIC_ADMIN_ADDRESS` | Admin `G…` key; gates `/admin` |
| `NEXT_PUBLIC_NETWORK` | `testnet` (default), `public`, or `futurenet` |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Optional; defaults to `https://soroban-testnet.stellar.org` |

If `NEXT_PUBLIC_CONTRACT_ID` is missing, every page that needs the chain shows a clear **Contract not configured** empty state instead of crashing.

## Pages

- `/`: Launchpad overview and on-chain `AssetInfo`
- `/admin`: `initialize`, `mint`, `set_whitelist` (admin Freighter key)
- `/user`: `balance` lookup and `transfer` (any connected wallet)

## Design tokens

Visual tokens live under `frontend-design/` (copied from the Oppia design system). Tailwind exposes them via `tailwind.config.ts` and `app/globals.css`. Brand marks are in `public/brand/`.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS (dark-first Oppia tokens)
- `@stellar/stellar-sdk` (Soroban RPC + contract invoke)
- `@stellar/freighter-api` (wallet connect / sign)
