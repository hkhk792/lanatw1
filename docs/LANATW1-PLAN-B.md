# lanatw1.com 方案 B 部署说明

独立品牌与 SEO（`lanatw1.com`），订单与库存与 `sp2spods.com` **原**共用同一 Supabase；**现已迁到自建 ops**（见 [`OPS-SELFHOST.md`](./OPS-SELFHOST.md)）。后台目标地址：`https://ops.lanatw1.com/admin2589`。

## 架构

| 项目 | sp2spods.com | lanatw1.com |
|------|----------------|-------------|
| Vercel 项目 | 现有 `obsidian-vapor-zen` | **`sp2s-3`** |
| GitHub 仓库 | `hkhk792/obsidian-vapor-zen` | **`hkhk792/lanatw1`** |
| `SITE_CODE` | 不设或 `sp2spods` | **`lanatw1`** |
| `VITE_SHOP_SITE_URL` | `https://sp2spods.com` | `https://lanatw1.com` |
| 订单 API / DB | 自建 ops（Postgres + Node） | **相同** |
| 订单后台 | `https://ops.lanatw1.com/admin2589` | 同一后台，筛选站点 `lanatw1` |

> DNS 未加好前，生产可能仍临时走 Vercel + Supabase 回退；切流步骤见 OPS-SELFHOST.md。


## 1. 新建 Vercel 项目（推荐名：`sp2s-3`）

### 控制台（手动）

1. 打开 https://vercel.com/mpm4hndtbr-4652s-projects → **Add New** → **Project**
2. 导入 Git：`hkhk792/lanatw1`（或继续用 `obsidian-vapor-zen` 同代码）
3. **Project Name** 填 **`sp2s-3`**
4. Build 命令保持 **`npm run build`**

### CLI（登录后一键）

```powershell
cd D:\obsidian\obsidian-vapor-zen
npx vercel login
powershell -ExecutionPolicy Bypass -File scripts/setup-sp2s-3-vercel.ps1
```

脚本会：创建 `sp2s-3`、从 `obsidian-vapor-zen` 复制 Supabase/后台密钥、写入 `SITE_CODE=lanatw1` 与 `VITE_*`、绑定 `lanatw1.com`、执行 `deploy --prod`。

## 2. 环境变量（Production）

从 `.env.lanatw1.example` 复制，并填入与主站相同的 Supabase / 后台密钥。

**注意：** Vercel 的 **Sensitive** 变量在 UI 里 **不能 Copy to Clipboard**，API/CLI 也无法解密导出。不要从主站项目「复制」，请从**原始来源**抄同一套值，在 `sp2s-3` 里 **Add Environment Variable** 逐条添加（或写入本地 `.env.secrets.manual` 后运行 `node scripts/copy-vercel-secrets-browser.mjs`）。

| 变量 | 去哪里拿（与主站必须一致） |
|------|---------------------------|
| `SUPABASE_URL` | [Supabase](https://supabase.com/dashboard/project/zcaosonsvlaxtfqeoacv/settings/api) → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | 同上 → `service_role`（secret，只用于服务端） |
| `ADMIN_SECRET` | 后台 `/admin2589` 管理密钥；与主站 `obsidian-vapor-zen` 保持一致 |

```
SITE_CODE=lanatw1
VITE_SHOP_SITE_URL=https://lanatw1.com
（其余 VITE_SHOP_* 见 .env.lanatw1.example）

SUPABASE_URL=https://zcaosonsvlaxtfqeoacv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=（Supabase → API → Legacy service_role）
ADMIN_SECRET=（与主站相同）
```

本项目**不使用 Storyblok**，无需配置 `VITE_STORYBLOK_*`。

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
