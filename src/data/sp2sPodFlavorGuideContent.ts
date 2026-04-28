import sp2sHimalayaJasmine from "@/assets/sp2s-info-himalaya-jasmine.webp";

/** 首頁與內頁共用的內文資料 */
export const SP2S_POD_FLAVOR_GUIDE_ROUTE = "/info/sp2s-pod-flavor-guide" as const;

export const sp2sPodFlavorGuideContent = {
  heroImage: sp2sHimalayaJasmine,
  imageAlt: "SP2S 煙彈風味示意 — 思博瑞系列",
  eyebrow: "實測推薦 · 口味指南",
  title: "【SP2S 煙彈口味推薦】 煙彈口味解析，選出你的本命款！",
  date: "2026/4/3",
  intro: [
    "SP2S 煙彈（思博瑞）作為電子煙界的熱門品牌，其二代通用煙彈一直以「高還原度」與「細膩煙霧」深受好評。一盒 3 入的包裝，不僅性價比高，更能隨時變換心情。",
    "面對圖中整整 32 款口味，到底哪一款最適合你？我們根據涼度與甜度，整理了這份實測推薦指南！",
  ],
  sections: [
    {
      title: "1. SP2S煙彈是初學者首選：經典果香系列",
      lead: "如果你剛接觸 SP2S，從大眾接受度最高的熱門水果入手準沒錯：",
      flavors: [
        { name: "葡萄 (Grape)", text: "SP2S 的長青冠軍，甜度適中，帶著濃郁的葡萄果汁感。" },
        { name: "蜂蜜蜜桃 (Honey Peach)", text: "淡淡的蜂蜜香氣點綴著水蜜桃的清甜，是許多女性玩家的口袋名單。" },
        { name: "哈密瓜 (Cantaloupe)", text: "甜度較高，入口後滿滿的果肉香氣，適合喜歡重口味的朋友。" },
      ],
    },
    {
      title: "2. 極致酷涼：夏日消暑系列",
      lead: "對於追求「涼感」的玩家，這幾款絕對能讓你瞬間清醒：",
      flavors: [
        { name: "南極冰 (Antarctic Ice)", text: "純粹的薄荷冰感，沒有多餘甜味，擊喉感最強。" },
        { name: "冰礦泉 (Spring Mineral Water)", text: "像是在大熱天喝了一口冰鎮礦泉水，乾淨利落，不膩口。" },
        { name: "酷海鹽檸檬 (Cool Lemon)", text: "檸檬的酸爽配上微鹹的海鹽感，層次感極佳，涼度非常夠力。" },
      ],
    },
    {
      title: "3. 文青必備：茶飲與特調系列",
      lead: "不喜歡太甜的水果？那你可以試試這幾款層次豐富的茶香：",
      flavors: [
        { name: "鐵觀音 (Tea Guan Yin)", text: "還原了現泡茶的甘醇，茶韻悠長，是耐抽的首選。" },
        { name: "茉莉綠茶 (Jasmine Green Tea)", text: "清新的茉莉花香搭配淡淡綠茶味，適合當作整天的口糧。" },
        { name: "可樂 (Freezy Coke)", text: "經典的肥宅快樂水味道，帶點氣泡感的涼爽，非常過癮。" },
      ],
    },
    {
      title: "4. 獨特驚喜：小眾特色系列",
      lead: "",
      flavors: [
        { name: "老冰棍 (Old Popsicle)", text: "復古的兒時味道，帶有一種獨特的奶甜香。" },
        { name: "沙士啤酒精選 (Sarsae Beer)", text: "獨特的沙士風味，推薦給喜歡挑戰不同味蕾體驗的玩家。" },
      ],
    },
  ],
} as const;
