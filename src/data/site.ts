import { LINE_OFFICIAL_CUSTOMER_URL } from "@/constants/lineOfficial";
import { SHOP_SITE_URL } from "@/lib/domains";

/** Central site metadata for SEO schema and footer links. */
export const SITE_LOGO_PATH = "/favicon.svg";
export const SITE_LOGO_WIDTH = 512;
export const SITE_LOGO_HEIGHT = 512;

/** Knowledge hub cross-link (GEO entity graph). */
export const PODPICK_GUIDE_URL = "https://podpickguide.com";
export const PODPICK_GUIDE_TAIWAN_URL = "https://podpickguide.com/taiwan";

export const SITE_SAME_AS = [
  LINE_OFFICIAL_CUSTOMER_URL,
  PODPICK_GUIDE_URL,
  PODPICK_GUIDE_TAIWAN_URL,
].filter(Boolean);
