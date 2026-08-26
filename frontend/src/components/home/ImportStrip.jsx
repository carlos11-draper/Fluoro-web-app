import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { STRIP_CTA } from "@/data/company";
import { Reveal } from "@/components/site/Reveal";
import { ShinyText } from "@/components/site/ShinyText";
import { SECTION } from "@/constants/testIds";

export const ImportStrip = () => (
  <section
    data-testid={SECTION.importStrip}
    className="relative bg-slate-950 blueprint-grid-dark overflow-hidden"
  >
    <div
      className="pointer-events-none absolute -bottom-32 left-1/3 h-[380px] w-[380px] rounded-full opacity-30 blur-3xl"
      style={{ background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)" }}
    />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
      <Reveal className="lg:col-span-7">
        <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.95]">
          Tired of waiting{" "}
          <ShinyText className="font-bold">10 weeks</ShinyText> for an imported spare?
        </h2>
        <p className="mt-6 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
          {STRIP_CTA.body}
        </p>
      </Reveal>
      <Reveal delay={0.15} className="lg:col-span-5 lg:justify-self-end">
        <Link
          to="/import-substitution"
          data-testid={SECTION.importStripCta}
          className="group inline-flex items-center gap-2 rounded-full bg-white text-slate-950 text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          See how import substitution works
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
        </Link>
      </Reveal>
    </div>
  </section>
);
