import { Link } from "react-router-dom";
import { Check, ArrowUpRight } from "lucide-react";
import { SERVICES, IMPORT_SUB } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { SectionLabel, Tag, CornerMarkers } from "@/components/site/Primitives";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

export default function Services() {
  const img = useSiteImages();

  return (
    <div data-testid={PAGE.services}>
      <PageHeader
        index="02"
        label="Services"
        title="Built around keeping your"
        shine="machines running"
        intro="Three areas where we've built deep capability — so you get the right people for the job, not a generalist workshop."
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 space-y-24 sm:space-y-32">
          {SERVICES.map((s, i) => (
            <div
              key={s.no}
              className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
            >
              <Reveal className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
                <div className="relative border border-slate-300 bg-white p-2">
                  <CornerMarkers />
                  <img
                    src={img[s.imageKey]}
                    alt={s.title}
                    className="w-full h-[320px] sm:h-[440px] object-cover"
                  />
                </div>
              </Reveal>
              <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : ""}`}>
                <Reveal>
                  <SectionLabel index={s.no}>{s.tag}</SectionLabel>
                  <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl leading-tight">
                    {s.title}
                  </h2>
                  <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed">
                    {s.summary}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {s.points.map((p) => (
                      <li key={p} className="flex gap-3 items-start">
                        <Check className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm md:text-base text-slate-700">{p}</span>
                      </li>
                    ))}
                  </ul>
                  {s.to && (
                    <Link
                      to={s.to}
                      className="mt-8 inline-flex items-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 py-3 hover:bg-slate-900 transition-colors duration-300 group"
                    >
                      Explore import substitution
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    </Link>
                  )}
                </Reveal>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel>Parts we make</SectionLabel>
            <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl leading-tight max-w-3xl">
              {IMPORT_SUB.parts.headline}
            </h2>
            <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
              {IMPORT_SUB.parts.subheadline}
            </p>
          </Reveal>
          <StaggerGroup className="mt-12 flex flex-wrap gap-3">
            {IMPORT_SUB.parts.list.map((p) => (
              <StaggerItem key={p}>
                <Tag>{p}</Tag>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <RfqSection />
    </div>
  );
}
