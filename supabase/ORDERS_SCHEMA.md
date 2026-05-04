# 訂單相關表（Supabase）

## `public.orders`（主檔）

| 欄位 | 說明 |
|------|------|
| `id` | UUID |
| `order_number` | 如 `SP2S-000001` |
| `status` | `待确认`（預設）\|`已发出`\|`已取消`\|`异常` |
| `batch_date` | 截單批次日期（依**台北時間**當日 **16:30** 前後分「當天 / 次日」） |
| `customer_name` | 姓名 |
| `phone` | 電話 |
| `shipping_address` | 收貨地址（可含超商敘述） |
| `pickup_store_code` | 收貨門市號 |
| `line_id` | LINE ID |
| `notes` | 備註 |
| `subtotal_twd` / `shipping_twd` / `total_twd` | 金額（TWD 整數） |
| `country` | 國家／地區 |
| `payment_method` | 付款方式代碼（如 `cod`） |
| `site_code` | 站點標識；與各部署的 `SITE_CODE` 一致，未設時 `default` |
| `created_at` | 伺服器寫入時間（`timestamptz`） |

## `public.order_items`（明細）

每筆一行商品：`product_id`, `product_model`, `variant`, `quantity`, `unit_price_twd`, `line_total_twd`, `image_url`。

## `public.orders_shippable_lines`（檢視 VIEW，唯讀）

由 `orders` ⋈ `order_items` 展開：**一行 = 一筆訂單裡的一件商品**，並帶上該單表頭（含 `site_code`、姓名、地址、單號等），方便在 **Table Editor** 裡用 `order_number` / `batch_date` / `site_code` 篩選發貨。  
**不要**在 VIEW 上直接改資料；變更狀態仍改 `orders.status`，庫存與明細仍走 `order_items`。

## 截單邏輯

在資料庫函數 `place_order` 內以 `now() AT TIME ZONE 'Asia/Taipei'` 判斷：

- **16:30 之前**（不含 16:30:00）→ `batch_date` = 當天日期  
- **16:30（含）之後** → `batch_date` = 次日日期  

與 `api/orders.js` 中 `computeBatchDateTaipei()`（Airtable 後備）一致。

## `place_order` RPC（站點寫入）

`api/orders.js` 呼叫 `place_order` 時除 `payload` 外會傳 **`p_site_code`**（值為 Vercel 的 `SITE_CODE`），資料庫優先使用該參數寫入 `orders.site_code`，避免僅依賴 jsonb 內欄位在部分環境遺失。請套用遷移 **`20250508100000_place_order_p_site_code.sql`**。
