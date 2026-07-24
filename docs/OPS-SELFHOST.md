# Ops 自建后台（quant）

订单后台与数据库已迁到服务器 `quant`（`107.167.13.66`）。

## 入口

| 用途 | URL |
|------|-----|
| 后台 | `https://ops.lanatw1.com/admin2589`（需先加 DNS） |
| API | `https://ops.lanatw1.com/api/*` |
| 本机探测 | `curl -H 'Host: ops.lanatw1.com' http://127.0.0.1/api/health` |

当前生产站（`lanatw1` 等）在 **ops DNS 未生效前** 仍走 Vercel serverless + Supabase（`vercel.json` 暂不 rewrite `/api`）。

## DNS（必做）

Cloudflare zone `lanatw1.com` 添加：

| 类型 | 名称 | 内容 | 代理 |
|------|------|------|------|
| A | `ops` | `107.167.13.66` | DNS only（灰云）推荐 |

然后在宝塔为 `ops.lanatw1.com` 申请 Let’s Encrypt，并在 `vercel.json` 恢复：

```json
{
  "source": "/api/:path*",
  "destination": "https://ops.lanatw1.com/api/:path*"
}
```

以及 admin 301 到 `https://ops.lanatw1.com/admin2589`。

## 服务器路径

- `/opt/lanatw1-ops/` — compose、.env、schema、dumps
- systemd: `lanatw1-ops`（Node 监听 `127.0.0.1:3055`）
- Postgres Docker: `lanatw1-ops-postgres` → `127.0.0.1:5433`
- Nginx: `/www/server/panel/vhost/nginx/ops.lanatw1.com.conf`

## 常用命令

```bash
systemctl status lanatw1-ops
docker compose -f /opt/lanatw1-ops/docker-compose.yml ps
curl -s http://127.0.0.1:3055/api/health
```
