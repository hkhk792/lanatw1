import type { CSSProperties } from "react";
import { BrandSp2s } from "@/components/BrandSp2s";
import { SP2S_GALLERY_BOTTOM, SP2S_GALLERY_TOP } from "@/data/sp2sGalleryPhotos";

const COLS = 9;
/** 單排 9 張 + 8 個間距 = 100vw，滾動 -50% 剛好接上一輪，不留黑邊 */
const SLIDE_CLASS =
  "h-[clamp(5.5rem,22vw,11rem)] w-[calc((100vw-(var(--marquee-gap)*(var(--marquee-cols)-1)))/var(--marquee-cols))] shrink-0 rounded-2xl object-cover";

type MarqueeRowProps = {
  images: string[];
  direction: "left" | "right";
  rowLabel: string;
};

function MarqueeRow({ images, direction, rowLabel }: MarqueeRowProps) {
  const track = [...images, ...images];

  return (
    <div
      className="relative w-full overflow-hidden"
      aria-label={rowLabel}
      style={
        {
          "--marquee-cols": COLS,
          "--marquee-gap": "0.75rem",
        } as CSSProperties
      }
    >
      <div
        className={`flex w-max gap-[var(--marquee-gap)] ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } motion-reduce:animate-none`}
      >
        {track.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className={SLIDE_CLASS}
          />
        ))}
      </div>
    </div>
  );
}

/** 雙排無限滾動相簿：上 9 / 下 9 不重複，單圈寬度 = 100vw 無縫銜接。 */
const Sp2sFunGallery = () => (
  <section
    id="sp2s-fun-gallery"
    aria-labelledby="sp2s-fun-gallery-heading"
    className="scroll-mt-24 overflow-hidden border-y border-white/5 bg-black py-14 sm:py-16 md:py-20"
  >
    <h2
      id="sp2s-fun-gallery-heading"
      className="mb-10 px-4 text-center font-serif text-2xl tracking-wide text-white sm:mb-12 sm:text-3xl md:text-4xl"
    >
      Have Fun with <BrandSp2s className="text-white" />
    </h2>

    <div className="space-y-[var(--marquee-gap,0.75rem)]">
      <MarqueeRow images={SP2S_GALLERY_TOP} direction="left" rowLabel="SP2S 活動精彩瞬間（上排）" />
      <MarqueeRow images={SP2S_GALLERY_BOTTOM} direction="right" rowLabel="SP2S 活動精彩瞬間（下排）" />
    </div>
  </section>
);

export default Sp2sFunGallery;
