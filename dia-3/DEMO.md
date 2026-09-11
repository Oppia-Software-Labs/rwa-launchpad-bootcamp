# Demo checklist (3 minutes)

Use this script when recording your final bootcamp demo. Keep each section within the suggested time.

## Before you record

- [ ] Contract deployed to testnet from `dia-3/`
- [ ] `CONTRACT_ID`, `PAYMENT_TOKEN`, and keys set in `scripts/admin-tool.sh` and `scripts/user-tool.sh`
- [ ] Admin address funded (Día 1 Friendbot key)
- [ ] At least one investor whitelisted and funded with payment tokens (instructor token)
- [ ] Terminal windows ready: one for admin tool, one for user tool

## 1. What your launchpad does + variación (30s)

- [ ] Name your RWA asset and what real-world asset backs it (SEP-1 / `stellar.toml`)
- [ ] Explain admin tool vs user tool in one sentence
- [ ] State your team's **variación** (access pass, balance gate, limited slots, etc.)

## 2. Admin tool on testnet (60s)

Run commands from `scripts/admin-tool.sh` (or paste individual invokes):

- [ ] Show `set_whitelist` approving an investor
- [ ] Show `mint` **or** explain why you rely on `invest` instead
- [ ] Show `withdraw` moving collected payment tokens to treasury
- [ ] Show `pause` then `unpause` (optional but recommended)

Speak briefly: who signs, and why `require_auth` matters for admin functions.

## 3. User tool on testnet (60s)

Run commands from `scripts/user-tool.sh`:

- [ ] `invest` — payment token in, RWA balance out; mention price per unit
- [ ] `balance` — show updated RWA balance
- [ ] `transfer` — move RWA tokens to another address
- [ ] Highlight how your **variación** affects `invest` (gate passes or fails)

## 4. One design decision (30s)

Pick one concrete choice, for example:

- Why Instance vs Persistent for a given field
- How your variación maps to `check_variation_gate`
- Why you separated admin and user scripts (SEP-10/45 off-chain auth in the app layer)

## Deliverables

1. Link to your repo (fork or team repo with all three days)
2. This 3-minute demo video or live presentation
