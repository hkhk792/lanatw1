/** 官方 LINE 客服／加好友連結（首頁門檻、浮動按鈕等共用） */
export const LINE_OFFICIAL_CUSTOMER_URL = "https://line.me/ti/p/2_fR9iUP_1";

/** 客服 LINE ID（結帳、詳情頁、專賣店區塊共用；不含 @） */
export const LINE_CUSTOMER_ID = "kao28992";

/** 商品詳情頁：購物／下單前添加客服的標準說明 */
export const LINE_CUSTOMER_SHOPPING_REMINDER =
  `購物／加入購物車後，請添加客服 LINE ID：${LINE_CUSTOMER_ID}，確認口味、規格、現貨與售後諮詢。`;

export const lineCustomerIdLabel = () => `LINE ID：${LINE_CUSTOMER_ID}`;
