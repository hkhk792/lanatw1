# SEO 双站部署说明

| 站点 | 域名 | 职责 |
|------|------|------|
| 商城 | sp2spods.com | 购物、结账 |
| 内容 | podpickguide.com | Google 长尾文章 |

## 商城已做（方案 A）

- `react-helmet-async` 按路由设置 title / description / canonical
- `public/sitemap.xml`（build 时 `scripts/generate-sitemap.mjs` 生成）
- `robots.txt` 指向 sitemap，屏蔽 admin / checkout
- `/info/*` → podpickguide.com 的 301（`vercel.json`）
- Edge Middleware 放行 Googlebot / Bingbot

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
