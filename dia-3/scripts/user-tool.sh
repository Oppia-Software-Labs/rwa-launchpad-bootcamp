#!/usr/bin/env bash
# User tool — invocations signed by the investor / token holder.
# Replace placeholders before running on testnet.

set -euo pipefail

NETWORK="${NETWORK:-testnet}"
USER_KEY="${USER_KEY:-bob}"
CONTRACT_ID="${CONTRACT_ID:-C...DEPLOYED_LAUNCHPAD_CONTRACT_ID...}"
RECIPIENT="${RECIPIENT:-G...RECIPIENT_PUBLIC_KEY...}"

echo "=== invest ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_KEY" \
  --network "$NETWORK" \
  -- \
  invest \
  --investor "$(stellar keys address "$USER_KEY")" \
  --payment_amount 500

echo "=== balance ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_KEY" \
  --network "$NETWORK" \
  -- \
  balance \
  --id "$(stellar keys address "$USER_KEY")"

echo "=== transfer RWA tokens ==="
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_KEY" \
  --network "$NETWORK" \
  -- \
  transfer \
  --from "$(stellar keys address "$USER_KEY")" \
  --to "$RECIPIENT" \
  --amount 10
