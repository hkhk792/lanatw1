import { useReveal } from "@/hooks/useReveal";

const stats = [
  { v: "2.5", u: "毫升容量" },
  { v: "380", u: "毫安電池" },
  { v: "8W", u: "功率輸出" },
  { v: "13", u: "獨特外觀" },
];

const Manifesto = () => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="technology" className="relative py-28 md:py-40 border-y hairline">
      <div className="container">
        <div ref={ref} className="reveal max-w-4xl mx-auto text-center">
          <p className="text-[10px] uppercase tracking-luxury text-gold mb-6">— 品牌宣言 —</p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl leading-[1.15]">
            "我們不製造配件。<br />
            我們精心打造<span className="italic text-gradient-gold">時刻</span> — 沉穩、從容，
            令人難忘。"
          </h2>
          <p className="mt-10 text-sm uppercase tracking-luxury text-muted-foreground">
            — NOIRE 工坊，東京
          </p>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {stats.map((s) => (
            <div
              key={s.u}
              className="bg-background p-8 md:p-10 text-center group hover:bg-card transition-colors duration-500"
            >
              <p className="font-serif text-4xl md:text-5xl text-gold group-hover:scale-105 transition-transform duration-500">
                {s.v}
              </p>
              <p className="mt-3 text-[10px] uppercase tracking-luxury text-muted-foreground">
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
