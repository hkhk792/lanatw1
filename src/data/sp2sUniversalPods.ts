import { sp2sUniversalPodHeroPhoto, sp2sUniversalPodPhoto } from "@/lib/productPhotos";

/** 與 `public/product-photos/sp2s-pod-{01..32}.webp` 對齊 */
export const SP2S_UNIVERSAL_POD_PRODUCT_ID = "sp2s-universal-pods";
export const SP2S_UNIVERSAL_POD_PRICE_TWD = 288;

export const SP2S_UNIVERSAL_PODS_FLAVORS: readonly { index: number; name: string }[] = [
  { index: 1, name: "芭樂星冰" },
  { index: 2, name: "白葡萄棟檸茶" },
  { index: 3, name: "百香果" },
  { index: 4, name: "冰礦泉" },
  { index: 5, name: "冰礦泉荔枝" },
  { index: 6, name: "超柔煙草" },
  { index: 7, name: "醇厚芒果" },
  { index: 8, name: "棟檸冰茶" },
  { index: 9, name: "哈密瓜" },
  { index: 10, name: "海鹽檸檬" },
  { index: 11, name: "紅顏知己（蔓越莓）" },
  { index: 12, name: "可樂" },
  { index: 13, name: "酷爽鳳梨" },
  { index: 14, name: "礦力冰飲" },
  { index: 15, name: "藍莓爆珠" },
  { index: 16, name: "老冰棍" },
  { index: 17, name: "利冰納（黑加侖）" },
  { index: 18, name: "綠豆" },
  { index: 19, name: "蜜桃烏龍" },
  { index: 20, name: "茗茶青梅" },
  { index: 21, name: "茉莉綠茶" },
  { index: 22, name: "南極冰" },
  { index: 23, name: "檸檬紅茶" },
  { index: 24, name: "葡萄" },
  { index: 25, name: "青蘋果" },
  { index: 26, name: "清涼薄荷" },
  { index: 27, name: "沙士啤酒" },
  { index: 28, name: "山竹荔枝" },
  { index: 29, name: "深林莓果" },
  { index: 30, name: "鐵觀音" },
  { index: 31, name: "西瓜" },
  { index: 32, name: "元氣蜜桃" },
] as const;

export function sp2sUniversalPodImageByIndex(index: number) {
  return sp2sUniversalPodPhoto(index);
}

export function sp2sUniversalPodHeroImage() {
  return sp2sUniversalPodHeroPhoto();
}
