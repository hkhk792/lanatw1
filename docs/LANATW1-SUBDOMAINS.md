# lanatw1.com 子域名站群（sp2s-n）

每个子域 **独立 GitHub 仓库 + 独立 Vercel 项目**，后期只改某一站代码时 **不会** 带动其他子域部署。

| 入口 | Vercel | GitHub | `SITE_CODE` | 后台筛选 |
|------|--------|--------|-------------|----------|
| `lanatw1.com` / `www` | `sp2s-3` | `lanatw1` | `lanatw1` | lanatw1 |
| `sp2s-1.lanatw1.com` | `sp2s-1` | `sp2s-1` | `sp2s-1` | sp2s-1 |
| `sp2s-2.lanatw1.com` | `sp2s-2` | `sp2s-2` | `sp2s-2` | sp2s-2 |
| `sp2o.vip` | `sp2o-vip` | `sp2o-vip` | `sp2s-6` | sp2s-6 |
| … | `sp2s-n` | `sp2s-n` | `sp2s-n` | sp2s-n |

共用后台: https://sp2spods.com/admin2589（`VITE_ADMIN_SITE_CODES` 或内置列表筛选站点）

## 一键开通

```powershell
cd D:\obsidian\obsidian-vapor-zen
# 默认开通 1,2,4,5（3 留给主域 sp2s-3）
node scripts/provision-sp2s-subdomains.mjs --nums=1,2,4,5
```

Cloudflare DNS 需 **Zone.DNS Edit** 权限（`CLOUDFLARE_API_TOKEN` 或控制台手动加 CNAME）。详见桌面 `lanatw1-部署密钥/03-cloudflare-dns-子域名.txt`。

## 修复环境变量 / 重新部署

若开通脚本 env 未写入成功：

```powershell
node scripts/fix-sp2s-subdomain-env.mjs --nums=1,2,4,5
```

仅补 DNS（不 redeploy）：加 `--skip-deploy`。
## Cloudflare 与 Vercel（重要）

Vercel **不推荐** Cloudflare 橙云（反向代理）。子域请用：

- **仅 DNS（灰云）** + 各项目专用 `*.vercel-dns-017.com` CNAME
- Cloudflare **SSL/TLS = 灵活（Flexible）**（当前已验证可用）
- 不要用 Full + 橙云（525）

手动 DNS（类型 CNAME，**代理关/灰云**）：

| 子域 | CNAME 目标 |
|------|------------|
| sp2s-1 | `e84c9cbaf2cfbc48.vercel-dns-017.com` |
| sp2s-2 | `72cc949279eb3b4b.vercel-dns-017.com` |
| sp2s-4 | `4bcebb6e0c3db806.vercel-dns-017.com` |
| sp2s-5 | `21552bded485f41e.vercel-dns-017.com` |

Cloudflare SSL/TLS 加密模式选 **Full**（不要 Flexible）。
## 全站同步首单等功能（obsidian-vapor-zen → 各子域仓库）

在 `obsidian-vapor-zen` 的 `main` 开发完成后：

```powershell
cd D:\obsidian\obsidian-vapor-zen
node scripts/sync-sp2s-repos.mjs
# 可选：node scripts/fix-sp2s-subdomain-env.mjs --nums=1,2,4,5 --skip-dns
```

会 push 到 `sp2s-1`、`sp2s-2`、`sp2s-4`、`sp2s-5`、`lanatw1`（各项目连 GitHub 后 Vercel 自动部署）。

主站 `obsidian-vapor-zen`（sp2spods.com）请单独：`git push origin main`。

`sp2o.vip` 为独立前端仓库 `vapor-glow-store`，需在该目录单独提交/部署。

## 后期只改某一子域

1. 只 clone / 只改仓库 `hkhk792/sp2s-2`
2. push `main` → 仅 Vercel 项目 `sp2s-2` 部署
3. 其他 `sp2s-*` 与 `lanatw1.com` **不会** 自动更新

改文案（暂不改代码）：在该项目的 Vercel 环境变量改 `VITE_SHOP_*` 后 Redeploy。
