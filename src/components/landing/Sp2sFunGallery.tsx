import { BrandSp2s } from "@/components/BrandSp2s";
import { SP2S_GALLERY_BOTTOM, SP2S_GALLERY_TOP } from "@/data/sp2sGalleryPhotos";

type MarqueeRowProps = {
  images: string[];
  direction: "left" | "right";
  rowLabel: string;
};

function MarqueeRow({ images, direction, rowLabel }: MarqueeRowProps) {
  const track = [...images, ...images];

  return (
    <div className="relative overflow-hidden" aria-label={rowLabel}>
      <div
        className={`flex w-max gap-2.5 sm:gap-3 md:gap-4 ${
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
            className="h-[4.5rem] w-[6.75rem] shrink-0 rounded-xl object-cover sm:h-20 sm:w-[7.5rem] md:h-24 md:w-36 md:rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}

/** 雙排無限滾動相簿：上排 9 張、下排 9 張，方向相反。 */
const Sp2sFunGallery = () => (
  <section
    id="sp2s-fun-gallery"
    aria-labelledby="sp2s-fun-gallery-heading"
    className="scroll-mt-24 border-y border-white/5 bg-black py-14 sm:py-16 md:py-20"
  >
    <h2
      id="sp2s-fun-gallery-heading"
      className="mb-10 text-center font-serif text-2xl tracking-wide text-white sm:mb-12 sm:text-3xl md:text-4xl"
    >
      Have Fun with <BrandSp2s className="text-white" />
    </h2>

    <div className="space-y-3 sm:space-y-4">
      <MarqueeRow images={SP2S_GALLERY_TOP} direction="left" rowLabel="SP2S 活動精彩瞬間（上排）" />
      <MarqueeRow images={SP2S_GALLERY_BOTTOM} direction="right" rowLabel="SP2S 活動精彩瞬間（下排）" />
    </div>
  </section>
);

export default Sp2sFunGallery;
