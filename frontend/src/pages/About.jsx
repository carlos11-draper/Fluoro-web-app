import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { STORY, TIMELINE } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { SectionLabel, SpecTable, CornerMarkers } from "@/components/site/Primitives";
import { ClientsSection } from "@/components/home/ClientsSection";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

export default function About() {
  const img = useSiteImages();

  return (
    <div data-testid={PAGE.about}>
      <PageHeader
        index="06"
        label={STORY.eyebrow}
        title="Founded by an engineer who"
        shine="builds what others import"
        intro="ISO certified. Engineered in-house in Bidadi, Karnataka since 1998."
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="01">The company</SectionLabel>
              {STORY.body.map((p) => (
                <p key={p} className="mt-5 text-sm md:text-base text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10">
                <SpecTable rows={STORY.specs} />
              </div>
              <Link
                to="/founder"
                className="mt-8 inline-flex items-center gap-2 font-ibm-plex-mono text-xs tracking-[0.2em] uppercase text-blue-700 hover:text-slate-900 transition-colors group"
              >
                Meet the founder
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="relative border border-slate-300 bg-white p-2">
              <CornerMarkers />
              <img
                src={img.story}
                alt="Fluoro Seals precision machining"
                className="w-full h-[360px] sm:h-[520px] object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24 sm:py-32 bg-slate-900 blueprint-grid-dark">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel light index="02">
              Timeline
            </SectionLabel>
            <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.98]">
              Twenty-five years of building in India
            </h2>
          </Reveal>
          <StaggerGroup className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {TIMELINE.map((t) => (
              <StaggerItem key={t.year}>
                <div className="bg-slate-900 h-full p-8 hover:bg-slate-800 transition-colors duration-500">
                  <div className="font-ibm-plex-mono text-xs tracking-[0.2em] uppercase text-blue-400">
                    {t.year}
                  </div>
                  <h3 className="mt-4 font-oswald font-medium uppercase text-white text-xl tracking-tight">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
                    {t.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <ClientsSection />
      <RfqSection />
    </div>
  );
}
