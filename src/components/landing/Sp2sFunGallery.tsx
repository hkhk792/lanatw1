import type { CSSProperties } from "react";
import { BrandSp2s } from "@/components/BrandSp2s";
import { SP2S_GALLERY_BOTTOM, SP2S_GALLERY_TOP } from "@/data/sp2sGalleryPhotos";

/**
 * 單排圖片寬度 = (100vw − gap×(cols−1)) / cols
 * 複製兩份後 translateX(-50%) 無縫銜接。
 * 手機端降低 cols，單張更大、更易看清。
 */
const SLIDE_CLASS =
  "h-[clamp(7rem,30vw,11rem)] w-[calc((100vw-(var(--marquee-gap)*(var(--marquee-cols)-1)))/var(--marquee-cols))] shrink-0 rounded-xl object-cover sm:h-[clamp(5.5rem,18vw,11rem)] sm:rounded-2xl";

type MarqueeRowProps = {
  images: string[];
  direction: "left" | "right";
  rowLabel: string;
};

function MarqueeRow({ images, direction, rowLabel }: MarqueeRowProps) {
  const track = [...images, ...images];

  return (
    <div className="relative w-full overflow-hidden" aria-label={rowLabel}>
      <div
        className={`flex w-max gap-[var(--marquee-gap)] will-change-transform ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } motion-reduce:animate-none`}
      >
        {track.map((src, index) => (
          <img
            key={`${src}-${index}`}
            src={src}
            alt=""
            loading={index < 6 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            className={SLIDE_CLASS}
          />
        ))}
      </div>
    </div>
  );
}

/** 雙排無限滾動相簿：上 9 / 下 9 不重複；手機端加大單圖、縮短動畫時長。 */
const Sp2sFunGallery = () => (
  <section
    id="sp2s-fun-gallery"
    aria-labelledby="sp2s-fun-gallery-heading"
    className="sp2s-fun-gallery scroll-mt-24 overflow-hidden border-y border-white/5 bg-black py-10 sm:py-14 md:py-20"
    style={
      {
        "--marquee-cols": 2.4,
        "--marquee-gap": "0.5rem",
      } as CSSProperties
    }
  >
    <style>{`
      .sp2s-fun-gallery {
        --marquee-cols: 2.4;
        --marquee-gap: 0.5rem;
      }
      .sp2s-fun-gallery .animate-marquee-left,
      .sp2s-fun-gallery .animate-marquee-right {
        animation-duration: 28s;
      }
      @media (min-width: 640px) {
        .sp2s-fun-gallery {
          --marquee-cols: 5;
          --marquee-gap: 0.65rem;
        }
        .sp2s-fun-gallery .animate-marquee-left,
        .sp2s-fun-gallery .animate-marquee-right {
          animation-duration: 42s;
        }
      }
      @media (min-width: 1024px) {
        .sp2s-fun-gallery {
          --marquee-cols: 9;
          --marquee-gap: 0.75rem;
        }
        .sp2s-fun-gallery .animate-marquee-left,
        .sp2s-fun-gallery .animate-marquee-right {
          animation-duration: 55s;
        }
      }
    `}</style>

    <h2
      id="sp2s-fun-gallery-heading"
      className="mb-8 px-4 text-center font-serif text-xl tracking-wide text-white sm:mb-12 sm:text-3xl md:text-4xl"
    >
      Have Fun with <BrandSp2s className="text-white" />
    </h2>

    <div className="space-y-[var(--marquee-gap)] touch-pan-y">
      <MarqueeRow images={SP2S_GALLERY_TOP} direction="left" rowLabel="SP2S 活動精彩瞬間（上排）" />
      <MarqueeRow images={SP2S_GALLERY_BOTTOM} direction="right" rowLabel="SP2S 活動精彩瞬間（下排）" />
    </div>
  </section>
);

export default Sp2sFunGallery;
