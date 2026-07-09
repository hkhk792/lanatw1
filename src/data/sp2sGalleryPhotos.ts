/** SP2S 品牌活動相簿（上 9 / 下 9，共 18 張不重複） */
export const SP2S_GALLERY_TOP = Array.from({ length: 9 }, (_, i) =>
  `/sp2s-gallery/${String(i + 1).padStart(2, "0")}.webp`,
);

export const SP2S_GALLERY_BOTTOM = Array.from({ length: 9 }, (_, i) =>
  `/sp2s-gallery/${String(i + 10).padStart(2, "0")}.webp`,
);
