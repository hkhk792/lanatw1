/* eslint-disable */
// AUTO-GENERATED — run: node scripts/generate-responsive-variants.mjs

import { productPhoto } from "@/lib/productPhotos";
import HuanTaiwanVapeBanner_Full from "@/assets/huan-taiwan-vape-banner.webp";
import HuanTaiwanVapeBanner_R640 from "@/assets/huan-taiwan-vape-banner.r640.webp";
import LineWelcomeGate_Full from "@/assets/line-welcome-gate.webp";

export const Sp2sGen1PodsCatalog = {
  src: productPhoto("sp2s-gen1-pods-catalog.webp"),
  srcSet: `${productPhoto("sp2s-gen1-pods-catalog.r640.webp")} 640w, ${productPhoto("sp2s-gen1-pods-catalog.webp")} 1024w`,
  width: 1024,
  height: 1024,
} as const;

export const HuanTaiwanVapeBanner = {
  src: HuanTaiwanVapeBanner_Full,
  srcSet: `${HuanTaiwanVapeBanner_R640} 640w, ${HuanTaiwanVapeBanner_Full} 1024w`,
  width: 1024,
  height: 681,
} as const;

export const LineWelcomeGate = {
  src: LineWelcomeGate_Full,
  srcSet: `${LineWelcomeGate_Full} 536w`,
  width: 536,
  height: 536,
} as const;

export const AtomizerHostGemini = {
  src: productPhoto("atomizer-host-gemini.webp"),
  srcSet: `${productPhoto("atomizer-host-gemini.r640.webp")} 640w, ${productPhoto("atomizer-host-gemini.webp")} 768w`,
  width: 768,
  height: 1366,
} as const;

export const DiyaPodsShowcase = {
  src: productPhoto("diya-pods-showcase.webp"),
  srcSet: `${productPhoto("diya-pods-showcase.r640.webp")} 640w, ${productPhoto("diya-pods-showcase.webp")} 715w`,
  width: 715,
  height: 1024,
} as const;
