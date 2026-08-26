import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STORY } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel, SpecTable } from "@/components/site/Primitives";
import { SECTION } from "@/constants/testIds";

export const StorySection = () => {
  const img = useSiteImages();

  return (
    <section
      data-testid={SECTION.story}
      className="py-24 sm:py-32 bg-slate-900 blueprint-grid-dark"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
        <Reveal className="lg:col-span-5 order-2 lg:order-1">
          <div className="relative">
            {img.story && (
              <img
                src={img.story}
                alt="Precision machined die casting component"
                className="w-full h-[340px] sm:h-[460px] object-cover"
              />
            )}
            <div className="absolute -bottom-5 -right-3 bg-blue-600 px-5 py-4">
              <div className="font-ibm-plex-mono text-[0.6rem] tracking-[0.2em] uppercase text-white/70">
                Founded
              </div>
              <div className="font-oswald font-bold text-white text-2xl leading-none">1998</div>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7 order-1 lg:order-2">
          <Reveal>
            <SectionLabel light>{STORY.eyebrow}</SectionLabel>
            <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.98]">
              {STORY.headline}
            </h2>
            {STORY.body.map((p) => (
              <p key={p} className="mt-6 text-sm md:text-base text-white/80 leading-relaxed">
                {p}
              </p>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-10">
              <SpecTable rows={STORY.specs} light />
            </div>
            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-2 font-ibm-plex-mono text-xs tracking-[0.2em] uppercase text-blue-300 hover:text-white transition-colors group"
            >
              Read the full story
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
