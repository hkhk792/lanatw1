import { pinkyCatalogPhoto } from "@/lib/productPhotos";

export interface PinkyCatalogItem {
  id: string;
  title: string;
  category: "主機系列" | "菸彈／通配系列" | "拋棄式／大口數系列" | "配件系列";
}

export const PINKY_IMPORTED_SOURCE_URL = "https://sites.google.com/view/product-catalogue-e" as const;

/**
 * 來源頁面已按需求過濾以下三項：
 * - LALA/LANA 一代通用系列
 * - SP2 一代通用系列
 * - 魔盒 Tokyomonoobox 系列
 *
 * 已下架單品（需重新上架時再加回陣列）：
 * - meha-titan-15000-host｜meha泰坦15000口(專用主機)
 */
export const pinkyImportedCatalog: readonly PinkyCatalogItem[] = [
  { id: "relx-pod-pro2-pods", title: "RELX悅刻 POD PRO 2 菸彈", category: "菸彈／通配系列" },
  { id: "relx-gen6-pods", title: "RELX六代菸彈", category: "菸彈／通配系列" },
  {
    id: "relx-infinity-pro2-host",
    title: "RELX悅刻六代 Infinity Pro 2 主機通用4-5-6代",
    category: "主機系列",
  },
  {
    id: "relx-phantom-gen5-host",
    title: "RELX悅刻幻影五代主機 (4代5代6代通用)",
    category: "主機系列",
  },
  { id: "ilia-gen4-6500", title: "哩亞四代拋棄式", category: "拋棄式／大口數系列" },
  { id: "ilia-gen1", title: "ILIA 一代系列", category: "菸彈／通配系列" },
  { id: "tutx-gen1", title: "TUTX一代系列", category: "菸彈／通配系列" },
  { id: "luckin-gen1", title: "Luckin一代通用系列", category: "主機系列" },
  { id: "lana-series-host", title: "LANA系列主機", category: "主機系列" },
  { id: "ilia-series-host", title: "ILIA系列主機", category: "主機系列" },
  { id: "ilia-gen5-host", title: "ILIA五代主機", category: "主機系列" },
  { id: "tokyo-magic-box-host", title: "東京魔盒主機", category: "主機系列" },
  { id: "sars-gen1", title: "殺小SARS 一代通用系列 買3送一隻主機", category: "主機系列" },
  { id: "ilia-gen5", title: "ILIA5代 5代系列 買4送一隻主機", category: "菸彈／通配系列" },
  { id: "ice-bear-gen5", title: "冰熊 5代系列", category: "菸彈／通配系列" },
  { id: "tisic-black-cat", title: "TISIC新版 黑騎士/萌貓派對", category: "拋棄式／大口數系列" },
  { id: "kis5-gen1", title: "Kis5一代", category: "主機系列" },
  { id: "kis5-disposable-6500", title: "Kis5拋棄式6500口", category: "拋棄式／大口數系列" },
  { id: "mehai-gen1", title: "魅嗨一代", category: "菸彈／通配系列" },
  { id: "mehai-gen5", title: "魅嗨五代", category: "菸彈／通配系列" },
  { id: "infinity-series", title: "無限", category: "菸彈／通配系列" },
  { id: "universal-sleeve", title: "通用保護套", category: "配件系列" },
  { id: "marbo-9000", title: "MARBO 9000口", category: "拋棄式／大口數系列" },
  { id: "obi-disposable-8000", title: "OBI拋棄式", category: "拋棄式／大口數系列" },
  { id: "chill-disposable-8800", title: "CHILL拋棄式8800口", category: "拋棄式／大口數系列" },
  { id: "dot-plus-8000", title: "Dot Plus 8000 Puffs", category: "拋棄式／大口數系列" },
  { id: "mistx-6500", title: "MISTX 鴨嘴獸 拋棄式", category: "拋棄式／大口數系列" },
] as const;

export const pinkyImportedCatalogCategories = [
  "主機系列",
  "菸彈／通配系列",
  "拋棄式／大口數系列",
  "配件系列",
] as const;

export const pinkyImportedCatalogImageById: Record<string, string> = {
  "relx-pod-pro2-pods":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUBXOHw37Al_uMkloKI9AVj5_-JJGwtk7O0wcxeJiUl-kxGkVZObdVjZcMelUhNuWgbrbd33IWqMv47ZAXO7k4x4q3-NDYh38129N5P5unwg14dXUn2j2fKVuPr33Gj3LeUOF8TJs-szEdBSQxkjcujqsMlxkkkrUMQSiKFXDbLvDWhQvcoXwNOzClMkpjKafMlkz2O5gZwlcQJZI6k-ka1h9cyzKaZ5NEtmpd4=w1280",
  "relx-infinity-pro2-host":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCzijAPSZR0um9tFT2ITc1zJFK8sof8_r0eywXCiTtXPC2k3H6t3Xz0a9qOEeu-TW9MlQTFgiU-ASrl9PasB4XZgccg9Ux8wIh8ZpcNmY_zBNTJ6br5GOKxhWsukiCLQEKHlltFMuitI910cRlNY-hGEnSRzofyqsO_N_NKBQ_z5FnPmhVFUA=w1280",
  "relx-phantom-gen5-host":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUBz5KRwqIzEt-iFWfjd8lZLIHZG-GMzKaeKVrzdJmRxEQegSK9R5xLxAMGCMPwyG4ba--niGgA4VSD78YI0Z-aPKKCLU-WWU7BopXVG0ZuUGRbyUMy9AcsBFLJvs3A77kP3-S5wsW-w68sA3L8N9ShW8PgSEz8b0Dti9PrVDB6ByZbZCXzyS9ueUQGVdJUnPDeuIEzz-msfJqa-YiXmimMJfg4ot90f_kizS_E=w1280",
  "relx-ga8000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUAJ_iCUkFTjJhWqYIYq5GQwVYTpMTE4CoOGaRRkIBVfDKzyxdut1_wmkJUD4AHxPoH2RLDouh5evgSlzFgtwfFd3JWO2ZILlNu1YHLLhP1WgHlqFp_Kmct8mTdQ8LMmXneQ1BDo815A57Wfswyx-qjwXHyYrzjlaBYDVSYqKuyY5H25It5E7qbi=w1280",
  "ilia-gen4-6500":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCuxGOcM77ThfAKpu1mTfPLTAmZI6Nhfn5HOaqAT3HWFupkKqUiT_0udhWWkEa6NbFAktk8WfG-6lz5shgOwjla0-ft9xJZtNxFI2VRVPZFiGaYBEWc6keENQYuljDlw_MTdzE4TKgfKruHybjI9lntrk_5rXdPJpOOeld6muxnt5jCBV9P_Qim81cHXP5uEq9Io0Vjo7LRE2g5YYIILl-9sfBxuIfpNh-wxuo=w1280",
  "meel-boost-10000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUA5twhsnJqWej8Bs88nqtiRaYArDEwldcU7jGwVdZhkwvfUSJc2Ulve-GStwQn08a89laQ8vp6Z3irM-4Ypk241GHDqVKfNgcrvVpwX3UStSfWpqJlntZ21h3Ln3SdvxHYg5jFeO8gXzHAJ8Jduzdh3Klor403HlJRLhjQXigqLz7Ql_LTBf-KuQZJgMzvjalwpfda6OJlBmpYVDHO82r94dt2pwT_XuSBQx0E=w1280",
  "meel-max-6000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUD7WvOTN_HzedJr6nnEHgZfPXv6jKCq2g84_91drUK9w470eHjVjJw_fhA2xs_2xSQml6wEskNUVtl4A0C1lvG-cSk0VGAlJVS4pIii-pl1tsz7RSehxs8wRQij60Jr3y2paJijWaG9qichklvW_9LaytedRCXaL6JH91gtl8r1F1SEbLD3Cv0mbvPE52AeQ1OzeROMyXKcGzOC35ous2mwVC1tRn9LYxDl=w1280",
  "meel-marbo-9000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUANrkVlF7W06Mf0GNkYUQQJtLiNLKgQhezzhI52XJQhy8oG5GGqfRoAd_gxX-922a6QtGDhw3mIBOPBbdIL4LmmO5TCf0RVq6QDPd7hQm3_agqHkQKI2RCU4ULb3ql6ry563ZeIRlbSmKlQ9UZG_AKnBnpFumDsOBCcjBSkzhrSwZ_mRI7BaKTL3X8jCJk05CtXl3psuFEA8-bglFAZrCbJ9qiQTM7zYg=w1280",
  "max-g-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUDBzvrXa84RJhFZWndIPRuLiB8RbIw4oo6gsudAu_aSvdlM7k2Wtm8OjMlKUDxaPJaFTMSpSu860yq4Z91GBNuJdQKL50GyCKHXX0myBFZVgCj0Cvf61RwZ3gX8kEhL9fiAjG1iCm_ncaqUdw0abxkJlDAZd7D1_C4BmiA7OKsknqd8lQRZgClRNnLpA8BraXwmWyQOoraxWHRpu_YtJ13UOYooNHVF3jZ3mbw=w1280",
  "ilia-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCnLsQCfEO6UN3mRP6kHMShbyWgDJJ5w2sRCjIX77VO7K0L5DH7JTuPfA1kMtBigSrEPCnOLkXDoWHkb1Tcw41B7BoIdw3sqVoTSqTsUQWFZGQHQLsKczNNJPWMjygEkxLkXa_cOsJehcMzHUOF4b4aCJ5Ek-4XBfuw8Dhz33wNvQe9_rcPuBmZ4f4=w1280",
  "tutx-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUD4ya5Iuz_Be_TqDQoeitRwDw1HvaYr5NaqjzGkc8OA-Pn6MjIOt1osaUPVizaIFHeEefs_bNtUIZq1aav7g8TJQktAiQ7wBxvs7UP6NrVTMZKMpjkaABUx35laTdIAynVDGGVUpz_hEUmYa6x-qPZxSMD5uFtCmX3mfQ7XXDf01pS7swULHzDV=w1280",
  "luckin-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUDmnKDp99IQUisgtOoipqL8MdEdyAhFHmS3RpETMrEbwxMEkcG-UJC6oZZbWzBFO19srFgc1qkqKPgOgYBhAiztcPdizcqnrGH8c6PbuyfuYBW81Rk-YglrVAGZlfMc7oHFO9pv_ZaJfzdnp1d3LL4Ami6_YLrVAAewL5xEi6PnwX01n3EGciP_jCSCPdH6BiAYJ7HrxmvBdAedjomn7azQVnXEHk4k9CoJA2o=w1280",
  "sars-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUBBpiXpsAuQ8AO6GJD9wlFV0fd5KOhAQiROH2mgm6CbeXJGmxd84dJdh1eaXoX5kToUPQ1YXNYqCNmm6Apbske4fN3L8BlM9Jij4aleES0aUgJrlYTzKiPMNC6u87BiaPNTNGG9zdHVsiS6KzISjdBbK5_U-hviJeb78XweWar3avAJm2qYhUE5=w1280",
  "ilia-gen5":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUAbDsnXcI6FSTAnO3RCOvEl5FD34nqK5iaPcz_NfLXltwweNmQbtN35ImQ3nDOz-GIlGpPCJDrCbnr0of-rvoBTJjDqCccYXyfmE-Z7MlyDBiMSKr5X9JX_aItlwpyGycB7jQSkFtGFmk1yQrMXH4esFYNcdfXYu1zKMoMu1kiWg51l5XGQQDSJpP7NdHjajUuMgC7W2pkwRljBeJFMXQiIw7SaGA4D9NyhXtI=w1280",
  "ice-bear-gen5":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUB0o26Dl0rMxJWYLE6DMTLvuNU-QvFR7CL7SXqK-10Dbv3KEnEXhCe6N4C--M49I33-bSMn5sOYo3GW2V0_VNBQHUbNNkIdIZX11Tw6S1bnUxbVJTHB27vyCjL2x-Zj1r3q0l-uN73DqqnHNljhUqTPjvSM7f2SD-BCuhExdV5SByfYD2CrMXx31Ks=w1280",
  "tisic-cola-bottle":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUAw85pIk4Zk68rmU9QQgQPAEYugOVtqP0M6-jzFSZ1UTa-nPlOT9C-9NwSGHwCQsNZnJaPNWC3ZeQWFvquQ_dUJWorWuXFnf-lv-MGiO0KPuZpTyAxgzV1foPwIhmTQ-FdzaKjAtGLrmjQ_OM18rCh0vsBpLVemHRDttbNCpU9ZmqWf9iYiAlWvVCYFURNxqwf-uHU8jwAez1ag1KieM3qSt5rN5Uxi2JAU=w1280",
  "tisic-black-cat":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUBOX_txPHEgeyRR3TwOkUY53-YQqsbvTroFjpx5KIt5d6OGH8IOyJQYgA-vbWFRgjlGwWCAocm8a0UnK5170Y51v7DvFUK8XEIx0n2mLxiq_cfrqsXjSgtRT7O5HCDfohvxqxa0sHJP1jJLqdSn2g27ez3jnvE6sHA0GcG3JOAkLRt5s34PYZr6aDzjK63BZhYSBWPOsstwDXFgyd0MtmhH9m9EFleEvUqGZQc=w1280",
  "kis5-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCPr56VvXtEORFEfJurDRHng0yqChvOKm5Ba1-Feg_OJ6ZlSHEkpWQtVMbF4G5U3rOe79D4VFkaRfkt9T-pzNcz9TzKbJL32QwN9wtmt9uC2RHDeT22y0Uzdf9iJTyIKer-wsH3EOJli3aDmCXzqbJtmEc3O2Qganes-ceIDpdMMQCrGYGIyC5o7iQ=w1280",
  "kis5-disposable-6500":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUDZErp4Hx-scilB45-EMRswVJhzvHsPqNzKj4snQI72LPOpzxdOkZYeTKQCskIalA5VA70usGU60-wJL7uVp9BWAWcGhO3cRKJuGoin3rgBpm4IOiiJBHOHz5EE5CRQjxlKzQzQ4F14HQJfvqnEiOvDlrbBTe6rnyAJ6086YyIn9jTXnpBhqo8b=w1280",
  "mehai-gen1":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUD26j5nZjK04AsyDanwLP6dovPhgRMUa4oykPi_ZCyYapzmdoc5rflRS5h_Swmd-AVrpmbjmefXenHcw5TWCck9H8SaTpvB66c6CEX-lo9ATjAccybijv9ILCdTMNWaGAfM-ZNL3IZUWXmsW6l0d0jRWtWDvCTcupBRtKLmcf-D_rF65a0rYC2hxbo=w1280",
  "mehai-gen5":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCwUEbJbR2rbxtsM1R9BRSqySYjxH9mf8AiS0Q621YrK7q9aoKm9dkZscBG7m-iZXSXvANcR0qo6YHqskyz6UaIrNhIeJif0b7yrERTVlot8pO_TwzMorqs42Mw8M2_k7A18XB58Un9aOfx9Zb2loiPOqIOvY-Ag4yeXRXgkZAWBaP9Uk-fuTH_6-C24vrqKMjJ5pAJ5zoK0V39m70W4oFN90GXftIyWMRekuc=w1280",
  "infinity-series":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUC-ETBYipBEo168CObs7YfSmjAn_vWEtMdEkYcTWYik3FlkeIPX2U4BdhKPFdLZVtylQ-W64xHtEFRwFAazDUx42gnjGVp3zW19tj3C6gJ35dI1JBWvxAst84U6G8YQ4whPPFwzQuf8nM2qtSd9YvEvC6t98XmPiV9jz41TeDng11YUV178lTvzhA9wGnEukfXxsD13BefV7u9VT_IfkUdKewp-l6I_hh43=w1280",
  "universal-sleeve":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUADdc9SCUS3ReVMdPdkHT5nPhWS0wDZlfCvOiRmzKWObGnfyiCHgZ4wGn7SCHf2ZM_rA8yheZWcvpwF2xYAQFuFWO1Fgj2O5QDDh7JFwoHN5TrWfvei83eP_g_nz8ubaL0tQz_LMnKAVajqaOoowkPu1vDPrXjlWX4Kvusg3F8rSssqL_-qUTSs5zdn4oobZpYqRnGZfQOyCet-8TTEN8GfE2CElLDoThrA=w1280",
  "marbo-9000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUDl--BR9jQbmqR2Hy_YkG2eobHXTy3jY6Do5Rq1CrhHdzRPoZSUduM4RDFP4779cLuT0fVDlB540l6XFGg-iAl5iI9p3WUCq-MFJSzizEmuMQZp_9gcvN-bQKzh4wG2lAh2KkDj9RIZ_u14O6_9nrDfwHXzHVpNdTH956_-juxVrko6gsOmAWegnQq0nMP0uZ9e2d4Nj22nQ4tVnur166762w7CuAakxcUYC4E=w1280",
  "obi-disposable-8000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCfL2R0DwpJb6Pu5mPKW3waCoKpXNa-bZpMJUehVtWOu6RtrR62PdXIWkvAEd6osOelfPqn1HmJqjLa36IRX-XArdH57ty1i4E6OnTwHkNxN3RB0fZqOpTZcHM2Wkp0u2Ynl3Q-z9drshLKY0700JpjZJiJucNBXUaZzXfV2ul-CtVcfBbrghNsqbKyaWGj0ZrV6Ez1q1BqiqOIKAxLMZahQi4A8LKZ7o4Dwps=w1280",
  "chill-disposable-8800":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUAMTvStoey0n6uktOR8E9wr8ZOX6SIb_MiaqoHWLfznvU2l_BP2A2LOsghGW7_MmcPZmefPfZsr2YGL61Lx03fQn6MPybPXA9e04gQg1B5UK8mIVDKDJIsoCqgj-EdgnC4JATmrNjN2PheFwaMGeg1R60RLmmHDI7RD1VOgWBVCYZSP1FMKmX65j3xtln6OvMjL-ESlF69kQ_t-xHkPjA5m37sVZvLLiQ=w1280",
  "relx-smash-go-12k":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUAYB74OFCAyhbH74gqj42x6Y_dKPPE6vMw1qXctqcdWQOHdtDTPdnYvAZNPwvcCkw8rXPo7wutwUd-Br6Am80_WxM7fXI194VC4j_uErlbf97dAfMuQ7E6c9289PQO43IF_xlg5EP8VhJlBu2bDgRyzQaBLN1p4pLEueZXcFsRwThUHFDBQF-nbzPlbkUi5KHUUqtUa_Mh4ivR9Y2t8rLIKEnM5osjmJ_TBIlQ=w1280",
  "dot-plus-8000":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUCPUZQ7feEHITOAzCzCg3RgG_JuzKascP6WKl_EOaW6cGF4VmuR_ioBocyZ5rY1YyJKE4RVVbrxmahwwtFDGboYHtRf0CkGLX6yAwtoB3-7n5FZGSMd50O4aM87GTuj4H8iB6R8wbUdN89dbLfLBfWgdbgHomKg5UheTKY-0Kq9q-R8zweWqFkk_uRuguXccVy4v2ALJLmkKpkXs89w7wopv2v9Ymr3-Dckb1Y=w1280",
  "mistx-6500":
    "https://lh3.googleusercontent.com/sitesv/AA5AbUD_OIJtNobNDU9Jo5qTLSLA98XidthYYd7Xp_NJPUlW7jw1AOKwcuN0zQ9IrasM8-0BTzZpuMdV7fzJekX_ZOccadTA07KwD5tFJCpO5C0QMrk5BDzn3icZdP3B-2a7Yvflw7p84jnHiKBSfj78m-URRsKjgsyGh0lXvhtzf5OGNu-ILjCmnLw1mvgRUO2_SytIgDJPl2sp6nQG5abLn3P39Myhb6UH8GEMYA0=w1280",
};

export const getPinkyImportedCatalogImage = (id: string) => pinkyCatalogPhoto(id);

export const findPinkyCatalogItemById = (id?: string) =>
  pinkyImportedCatalog.find((item) => item.id === id);
