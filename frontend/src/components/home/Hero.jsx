import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { HERO as HERO_COPY } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { ShinyText } from "@/components/site/ShinyText";
import { BrochureButton } from "@/components/site/BrochureButton";
import { HERO, BROCHURE } from "@/constants/testIds";

const fade = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
});

export const Hero = () => {
  const img = useSiteImages();

  return (
    <section
      data-testid={HERO.section}
      className="relative h-screen min-h-[680px] w-full overflow-hidden bg-black"
    >
      {/* Backdrop: still with Ken-Burns drift, video layered over it */}
      <img
        src={img.heroBackdrop}
        alt="Fluoro Seals factory floor"
        className="absolute inset-0 h-full w-full object-cover ken-burns"
      />
      <video
        data-testid={HERO.video}
        className="absolute inset-0 h-full w-full object-cover"
        src={img.heroVideo}
        poster={img.heroBackdrop}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Steel-navy grading */}
      <div className="absolute inset-0 bg-slate-950/72" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
      <div className="absolute inset-0 blueprint-grid-dark opacity-70" />

      <div className="relative z-10 h-full mx-auto max-w-7xl px-5 sm:px-8 pt-[76px] flex flex-col">
        {/* Intro row under the nav */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-8 lg:pt-12">
          <motion.p
            data-testid={HERO.intro}
            {...fade(0.15)}
            className="text-white/80 text-sm md:text-base leading-relaxed max-w-xl"
          >
            {HERO_COPY.subheadline}
          </motion.p>
          <motion.p
            data-testid={HERO.trust}
            {...fade(0.25)}
            className="text-white/80 text-sm md:text-base leading-relaxed lg:text-right"
          >
            {HERO_COPY.trustLine}
          </motion.p>
        </div>

        {/* Headline block */}
        <div className="flex-1 flex flex-col justify-center pb-14">
          <motion.p
            data-testid={HERO.eyebrow}
            {...fade(0.35)}
            className="font-ibm-plex-mono uppercase text-white/80 text-xs md:text-sm tracking-tight"
          >
            {HERO_COPY.eyebrow}
          </motion.p>

          <motion.h1
            data-testid={HERO.heading}
            {...fade(0.45)}
            className="mt-5 font-oswald uppercase tracking-tighter text-4xl sm:text-6xl lg:text-7xl xl:text-8xl"
            style={{ lineHeight: 0.85 }}
          >
            <span className="block font-medium text-white">{HERO_COPY.headlineLead}</span>
            <ShinyText className="font-bold" speed={3} spread={100}>
              {HERO_COPY.headlineShine}
            </ShinyText>
          </motion.h1>

          <motion.div {...fade(0.6)} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              data-testid={HERO.primaryCta}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-white hover:text-slate-950 transition-colors duration-300"
            >
              Request a quote
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/import-substitution"
              data-testid={HERO.secondaryCta}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/25 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-white/10 transition-colors duration-300"
            >
              Import substitutes
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <BrochureButton testId={BROCHURE.heroButton} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
