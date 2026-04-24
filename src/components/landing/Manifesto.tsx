import { useReveal } from "@/hooks/useReveal";

const stats = [
  { v: "2.5", u: "ml 容量" },
  { v: "380", u: "mAh 電池" },
  { v: "8W", u: "功率輸出" },
  { v: "25", u: "經典外觀" },
];

const Manifesto = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="manifesto" className="relative py-44 md:py-60 border-y hairline">
      <div className="absolute inset-0 spotlight opacity-30 pointer-events-none" />
      <div className="container relative">
        <div ref={ref} className="reveal max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-luxury text-gold mb-8">— 品牌宣言 —</p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.15]">
            <span className="text-gradient-gold">"我們不生產配飾。</span><br />
            我們打造 <span className="italic text-foreground/70">時刻</span> — 精心構思，縝密考量，
            <span className="text-gradient-gold"> 難以忘懷。"</span>
          </h2>
          <p className="mt-12 text-sm uppercase tracking-luxury text-muted-foreground">
            — SP2S 工坊
          </p>
        </div>

        <div className="mt-28 md:mt-40 grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/15">
          {stats.map((s) => (
            <div
              key={s.u}
              className="bg-background p-10 md:p-14 text-center group hover:bg-card transition-colors duration-500"
            >
              <p className="font-serif text-5xl md:text-6xl text-gradient-gold group-hover:scale-105 transition-transform duration-500">
                {s.v}
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-luxury text-muted-foreground">
                {s.u}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
