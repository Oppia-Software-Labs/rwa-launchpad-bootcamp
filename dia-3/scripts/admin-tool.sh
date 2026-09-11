#!/usr/bin/env bash
# Admin tool — invocations that require the issuer/admin key to sign.
# Replace placeholders before running on testnet.

set -euo pipefail

NETWORK="${NETWORK:-testnet}"
ADMIN_KEY="${ADMIN_KEY:-alice}"
CONTRACT_ID="${CONTRACT_ID:-C...DEPLOYED_LAUNCHPAD_CONTRACT_ID...}"
PAYMENT_TOKEN="${PAYMENT_TOKEN:-C...INSTRUCTOR_PAYMENT_TOKEN_ID...}"
INVESTOR="${INVESTOR:-G...INVESTOR_PUBLIC_KEY...}"
TREASURY="${TREASURY:-G...TREASURY_PUBLIC_KEY...}"

echo "=== initialize (run once after deploy) ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- \
  initialize \
  --admin "$(stellar keys address "$ADMIN_KEY")" \
  --asset '{"name":"RWAToken","total_supply":1000000,"price_per_unit":100,"payment_token":"'"$PAYMENT_TOKEN"'","paused":false}'

echo "=== set_whitelist ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- \
  set_whitelist \
  --admin "$(stellar keys address "$ADMIN_KEY")" \
  --investor "$INVESTOR" \
  --approved true

echo "=== mint (admin-only; optional if using invest) ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- \
  mint \
  --admin "$(stellar keys address "$ADMIN_KEY")" \
  --to "$INVESTOR" \
  --amount 100

echo "=== withdraw collected payment tokens ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- \
  withdraw \
  --admin "$(stellar keys address "$ADMIN_KEY")" \
  --to "$TREASURY" \
  --amount 500

echo "=== pause ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- \
  pause \
  --admin "$(stellar keys address "$ADMIN_KEY")"

echo "=== unpause ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_KEY" \
  --network "$NETWORK" \
  -- \
  unpause \
  --admin "$(stellar keys address "$ADMIN_KEY")"
