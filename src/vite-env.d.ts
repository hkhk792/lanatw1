/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SHOP_SITE_URL?: string;
  readonly VITE_SHOP_HOME_TITLE?: string;
  readonly VITE_SHOP_HOME_DESCRIPTION?: string;
  readonly VITE_SHOP_ORG_NAME?: string;
  readonly VITE_SHOP_WEBSITE_NAME?: string;
  readonly VITE_SHOP_JSON_LD_BRAND?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
