# RWA Launchpad: Día 1 Demo Frontend

Next.js 15 (App Router) + TypeScript + Tailwind demo UI for the **Día 1** Soroban contract (`../../dia-1`). It covers the day-one bootcamp checkpoint: deploy the scaffold, configure `stellar.toml`, fund testnet, and call `initialize`; nothing more.

> Bootcamp demo only. Not production-hardened (no audit, limited error recovery, testnet assumptions).

## Scope (Día 1 only)

| Contract function | Status in contract | This frontend |
|---|---|---|
| `initialize` | Implemented | `/initialize` form |
| `balance` | `todo!()` stub | Listed as unavailable |
| `mint` | `todo!()` stub | Listed as unavailable |
| `transfer` | `todo!()` stub | Listed as unavailable |
| `set_whitelist` | `todo!()` stub | Listed as unavailable |

For mint, transfer, whitelist, invest, and admin flows see the sibling apps in `../dia-2` and `../dia-3`.

## Prerequisites

- Node.js 20+
- [Freighter](https://www.freighter.app/) browser extension
- Día 1 contract deployed on Stellar testnet (or leave env unset to browse empty states)

## Setup

```bash
cd frontend/dia-1
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Fill these in `.env.local` **after** the Día 1 contract is deployed:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CONTRACT_ID` | Deployed `rwa-launchpad-dia-1` contract id (`C…`) |
| `NEXT_PUBLIC_PAYMENT_TOKEN_ID` | Payment token / SAC id; prefills initialize form |
| `NEXT_PUBLIC_NETWORK` | `testnet` (default), `public`, or `futurenet` |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Optional; defaults to `https://soroban-testnet.stellar.org` |

If `NEXT_PUBLIC_CONTRACT_ID` is missing, pages that need the chain show a clear **Contract not configured** empty state instead of crashing.

## Pages

- `/`: Launchpad intro, SEP-1 / `stellar.toml` explainer, on-chain status after initialize, coming-soon stubs
- `/initialize`: `initialize(admin, asset)` via Freighter (name, total_supply, price_per_unit, payment_token, paused)

## Design tokens

Visual tokens live under `frontend-design/` (Oppia design system). Tailwind exposes them via `tailwind.config.ts` and `app/globals.css`. Brand marks are in `public/brand/`.

## Stack

- Next.js 15 App Router, React 19, TypeScript
- Tailwind CSS (dark-first Oppia tokens)
- `@stellar/stellar-sdk` (Soroban RPC + contract invoke)
- `@stellar/freighter-api` (wallet connect / sign)
