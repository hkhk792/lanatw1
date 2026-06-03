# lanatw1.com 方案 B 部署说明

独立品牌与 SEO（`lanatw1.com`），订单与库存与 `sp2spods.com` 共用同一 Supabase，后台统一在 `/admin2589`。

## 架构

| 项目 | sp2spods.com | lanatw1.com |
|------|----------------|-------------|
| Vercel 项目 | 现有 `obsidian-vapor-zen` | **新建**项目，同一 GitHub 仓库 |
| `SITE_CODE` | 不设或 `sp2spods` | **`lanatw1`** |
| `VITE_SHOP_SITE_URL` | `https://sp2spods.com` | `https://lanatw1.com` |
| Supabase / `ADMIN_SECRET` | 相同 | **相同** |
| 订单后台 | `https://sp2spods.com/admin2589` | 同一后台，筛选站点 `lanatw1` |

## 1. 新建 Vercel 项目

1. Vercel → **Add New Project** → 导入 `hkhk792/obsidian-vapor-zen`
2. 项目名称建议：`obsidian-vapor-zen-lanatw1`
3. **不要**改 Build 命令：仍为 `npm run build`（会按环境变量生成该域名的 sitemap / robots）

## 2. 环境变量（Production）

从 `.env.lanatw1.example` 复制，并填入与主站相同的 Supabase / 后台密钥：

```
SITE_CODE=lanatw1
VITE_SHOP_SITE_URL=https://lanatw1.com
VITE_SHOP_HOME_TITLE=...
VITE_SHOP_HOME_DESCRIPTION=...
VITE_SHOP_ORG_NAME=...
VITE_SHOP_WEBSITE_NAME=...
VITE_SHOP_JSON_LD_BRAND=LANA

SUPABASE_URL=（与主站相同）
SUPABASE_SERVICE_ROLE_KEY=（与主站相同）
ADMIN_SECRET=（与主站相同）
```

主站 `sp2spods.com` 项目可设 `SITE_CODE=sp2spods`（可选），便于后台区分来源。

## 3. 域名（Cloudflare）

删除指向旧 IP 的 A 记录，改为 Vercel 推荐记录，例如：

| 类型 | 名称 | 内容 | 代理 |
|------|------|------|------|
| CNAME | `@` | `cname.vercel-dns.com` | 已代理 |
| CNAME | `www` | `cname.vercel-dns.com` | 已代理 |

在 **lanatw1 的 Vercel 项目** → Domains 添加 `lanatw1.com`、`www.lanatw1.com`。

## 4. 部署与验证

1. Deploy 成功后打开 `https://lanatw1.com`
2. 查看页面源代码：`<link rel="canonical"` 应为 `https://lanatw1.com/...`
3. 打开 `https://lanatw1.com/sitemap.xml`、`robots.txt`，Sitemap 域名应为 `lanatw1.com`
4. 测试下单后，在 `https://sp2spods.com/admin2589` 登录，站点筛选选 **`lanatw1`**

## 5. Google Search Console

为 `lanatw1.com` **单独**添加资源并提交：

- `https://lanatw1.com/sitemap.xml`

与 `sp2spods.com` 分开收录，避免混在同一个 GSC 属性里 unless 使用域属性。

## 6. 超商 / 金流

`VITE_SHOP_SITE_URL` 会作为该部署的超商地图回调基址。若 7-11 地图仅登记了 `sp2spods.com`，需在金流/地图后台为 `lanatw1.com` 补登记回调 URL，或结账流程固定跳转主域（需另做产品决策）。

## 7. 后续改文案

仅改 Vercel 环境变量后 **Redeploy**，无需改代码。各商品页 title 仍在 `seoRoutes.ts`，若要整站 LANA 话术可再分批改路由 SEO 或加 `SITE_CODE` 分支。
