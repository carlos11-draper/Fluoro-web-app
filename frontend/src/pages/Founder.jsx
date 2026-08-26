import { Quote } from "lucide-react";
import { FOUNDER, STORY } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel, SpecTable, CornerMarkers } from "@/components/site/Primitives";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

export default function Founder() {
  const img = useSiteImages();

  return (
    <div data-testid={PAGE.founder}>
      <PageHeader
        index="07"
        label="Founder"
        title="K.K. Nanjappa"
        shine="Founder & MD"
        intro={FOUNDER.quote}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <Reveal className="lg:col-span-5">
            {img.founder && (
              <div className="relative border border-slate-300 bg-white p-2">
                <CornerMarkers />
                <img
                  src={img.founder}
                  alt={FOUNDER.name}
                  className="w-full h-[380px] sm:h-[520px] object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/90 backdrop-blur px-5 py-3">
                  <div className="font-oswald font-medium uppercase text-white text-lg leading-tight">
                    {FOUNDER.name}
                  </div>
                  <div className="font-ibm-plex-mono text-[0.6rem] tracking-[0.2em] uppercase text-blue-400">
                    {FOUNDER.role}
                  </div>
                </div>
              </div>
            )}
            <div className="mt-10">
              <SpecTable rows={STORY.specs} />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="01">In his own words</SectionLabel>
              <blockquote className="relative border-l-2 border-blue-600 pl-6">
                <Quote className="h-6 w-6 text-blue-600 mb-4" strokeWidth={1.5} />
                <p className="font-oswald uppercase text-slate-900 text-xl sm:text-2xl leading-snug tracking-tight">
                  {FOUNDER.quote}
                </p>
              </blockquote>
              {FOUNDER.bio.map((p) => (
                <p key={p} className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <RfqSection />
    </div>
  );
}
