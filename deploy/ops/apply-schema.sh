#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
source "$ROOT/.env"
export PGPASSWORD="$POSTGRES_PASSWORD"
PSQL=(docker exec -i lanatw1-ops-postgres psql -U lanatw1 -d lanatw1_ops -v ON_ERROR_STOP=1)

echo "==> 01_base.sql"
"${PSQL[@]}" < "$ROOT/schema/01_base.sql"
echo "==> 03_helpers_and_otp.sql"
"${PSQL[@]}" < "$ROOT/schema/03_helpers_and_otp.sql"
echo "==> 02_place_order_first_order.sql"
"${PSQL[@]}" < "$ROOT/schema/02_place_order_first_order.sql"
echo "Schema apply OK"
