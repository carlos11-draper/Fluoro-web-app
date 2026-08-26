import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CAPABILITIES } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel, SpecTable, CornerMarkers } from "@/components/site/Primitives";
import { SECTION } from "@/constants/testIds";

export const CapabilitiesSection = () => {
  const img = useSiteImages();

  return (
    <section data-testid={SECTION.capabilities} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionLabel>{CAPABILITIES.eyebrow}</SectionLabel>
            <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.02]">
              {CAPABILITIES.headline}
            </h2>
            <p className="mt-6 text-sm md:text-base text-blue-700 leading-relaxed">
              {CAPABILITIES.subheadline}
            </p>
            {CAPABILITIES.body.map((p) => (
              <p key={p} className="mt-5 text-sm md:text-base text-slate-600 leading-relaxed">
                {p}
              </p>
            ))}
            <Link
              to="/capabilities"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-900 text-slate-900 text-sm px-6 py-3 hover:bg-slate-900 hover:text-white transition-colors duration-300 group"
            >
              Full plant list
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="lg:col-span-6 space-y-8">
          <Reveal delay={0.1}>
            {img.capabilities && (
              <div className="relative border border-slate-300 bg-white p-2">
                <CornerMarkers />
                <img
                  src={img.capabilities}
                  alt="Heavy-capacity boring and milling plant"
                  className="w-full h-[300px] sm:h-[380px] object-cover"
                />
              </div>
            )}
          </Reveal>
          <Reveal delay={0.2}>
            <SpecTable rows={CAPABILITIES.specs} />
          </Reveal>
        </div>
      </div>
    </section>
  );
};
