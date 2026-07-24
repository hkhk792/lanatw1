#!/bin/bash
set -e
cd /opt/lanatw1-ops
set -a
. ./.env
set +a

echo "==> restore dump"
cd /opt/lanatw1-ops/apps/api
node restore-orders-dump.mjs /opt/lanatw1-ops/dumps/latest.json

echo "==> verify counts"
docker exec -i lanatw1-ops-postgres psql -U lanatw1 -d lanatw1_ops -c "SELECT (SELECT count(*) FROM orders) AS orders, (SELECT count(*) FROM order_items) AS items, (SELECT count(*) FROM inventory) AS inv;"

echo "==> start systemd"
cp /opt/lanatw1-ops/lanatw1-ops.service /etc/systemd/system/lanatw1-ops.service
systemctl daemon-reload
systemctl enable lanatw1-ops
systemctl restart lanatw1-ops
sleep 2
systemctl --no-pager status lanatw1-ops || true
curl -sS http://127.0.0.1:3010/api/health
echo
