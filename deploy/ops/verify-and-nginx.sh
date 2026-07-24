#!/bin/bash
set -e
SECRET=$(grep '^ADMIN_SECRET=' /opt/lanatw1-ops/.env | cut -d= -f2-)

echo "== admin orders =="
curl -sS -H "Authorization: Bearer $SECRET" http://127.0.0.1:3055/api/admin/orders | python3 -c 'import sys,json; d=json.load(sys.stdin); print(len(d.get("orders",[])), "orders")'

echo "== DNS =="
getent hosts ops.lanatw1.com || true
dig +short ops.lanatw1.com A @1.1.1.1 || true
dig +short ops.lanatw1.com A @8.8.8.8 || true

echo "== add temp server_name on vibehxj if present =="
# Also listen as ops on IP via separate conf alias for any domain we control on this box
cat > /www/server/panel/vhost/nginx/ops.lanatw1.com.conf << 'EOF'
server {
    listen 80;
    listen 443 ssl http2;
    server_name ops.lanatw1.com;
    client_max_body_size 8m;

    # certs filled by certbot/BT when available
    ssl_certificate /www/server/panel/vhost/cert/ops.lanatw1.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/ops.lanatw1.com/privkey.pem;

    location /.well-known/acme-challenge/ {
        root /www/wwwroot/ops.lanatw1.com;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://127.0.0.1:3055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}

# HTTP-only bootstrap until cert exists (avoid nginx fail on missing ssl files)
server {
    listen 80;
    server_name ops.lanatw1.com;
    client_max_body_size 8m;

    location /.well-known/acme-challenge/ {
        root /www/wwwroot/ops.lanatw1.com;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://127.0.0.1:3055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
EOF

# Keep only HTTP server until certs exist (ssl block would break nginx -t)
cat > /www/server/panel/vhost/nginx/ops.lanatw1.com.conf << 'EOF'
server {
    listen 80;
    server_name ops.lanatw1.com;
    client_max_body_size 8m;

    location /.well-known/acme-challenge/ {
        root /www/wwwroot/ops.lanatw1.com;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:3055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://127.0.0.1:3055;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
    }
}
EOF

nginx -t && nginx -s reload
echo NGINX_RELOADED
