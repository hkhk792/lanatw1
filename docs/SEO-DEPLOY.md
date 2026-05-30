# SEO 双站部署说明

| 站点 | 域名 | 职责 |
|------|------|------|
| 商城 | sp2spods.com | 购物、结账 |
| 内容 | podpickguide.com | Google 长尾文章 |

## 商城已做（方案 A）

- `react-helmet-async` 按路由设置 title / description / canonical / OG
- 每页独立关键词 title（如「SP2S 煙彈｜二代通用菸彈 32 口味」）
- JSON-LD：Organization、WebSite、Product（商品页）
- `public/sitemap.xml`（build 时 `scripts/generate-sitemap.mjs` 从 `seoRoutes.ts` + catalog 生成）
- `robots.txt` 指向 sitemap，屏蔽 admin / checkout
- `/info/*` → podpickguide.com 的 301（`vercel.json`）
- Edge Middleware 放行 Googlebot / Bingbot
- 404 等未知路径 `noindex`

## GSC（Google Search Console）检查清单

部署后请在 [Search Console](https://search.google.com/search-console) 逐项确认：

1. **站点地图**：重新提交 `https://sp2spods.com/sitemap.xml`（现含 catalog 页，约 50+ URL）
2. **网址检查**：对以下 URL 点「请求编入索引」：
   - `https://sp2spods.com/`
   - `https://sp2spods.com/product/sp2s-universal-pods`
   - `https://sp2spods.com/product/sp2s-gen1-pods`
3. **网页**：查看「已编入索引」数量是否上升（需 1–4 周）
4. **效果**：关注「SP2S 煙彈」「SP2S 電子煙」等查询的展示与排名
5. **勿用 curl 测收录**：Middleware 会拦截非搜索引擎 UA；以 GSC「网址检查」为准

## 内容站（方案 B）

见仓库 `../podpick-guide/README.md`

## Cloudflare 操作顺序

1. **podpickguide.com**：NS 改到 CF → 按 Vercel 提示加 A/CNAME → 在 Vercel 绑定域名。
2. **sp2spods.com**：若已在 CF，部署商城后提交 Search Console：
   - https://search.google.com/search-console
   - 添加两个资源，分别提交 sitemap：
     - `https://sp2spods.com/sitemap.xml`
     - `https://podpickguide.com/sitemap-index.xml`

## 注意

中间件仍会拦截非搜索引擎的 `curl` 等 UA；测试收录请用 Search Console「网址检查」，不要用 curl 判断。
