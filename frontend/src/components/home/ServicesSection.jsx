import { Link } from "react-router-dom";
import { Wrench, Cog, Ship, ArrowRight } from "lucide-react";
import { SERVICES } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { SectionLabel, Tag } from "@/components/site/Primitives";
import { SECTION } from "@/constants/testIds";

const ICONS = { wrench: Wrench, cog: Cog, ship: Ship };

export const ServicesSection = () => {
  const img = useSiteImages();

  return (
    <section data-testid={SECTION.services} className="py-24 sm:py-32 bg-slate-50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionLabel>What we do</SectionLabel>
          <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.02] max-w-3xl">
            Built around keeping your machines running
          </h2>
          <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
            Three areas where we've built deep capability — so you get the right people
            for the job, not a generalist workshop.
          </p>
        </Reveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <StaggerItem key={s.no}>
                <Link
                  to={s.to || "/services"}
                  data-testid={SECTION.serviceCard(s.no)}
                  className="group block h-full bg-white border border-slate-200 hover:border-blue-600 transition-colors duration-500 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={img[s.imageKey]}
                      alt={s.title}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-slate-950/20 transition-colors duration-500" />
                    <span className="absolute top-4 left-4 font-oswald font-bold text-white/70 text-3xl leading-none">
                      {s.no}
                    </span>
                    <Icon
                      className="absolute bottom-4 right-4 h-7 w-7 text-blue-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="p-7">
                    <Tag>{s.tag}</Tag>
                    <h3 className="mt-4 font-oswald font-medium uppercase text-slate-900 text-xl sm:text-2xl tracking-tight">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
                      {s.summary}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-ibm-plex-mono text-xs tracking-[0.18em] uppercase text-blue-700">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
};
