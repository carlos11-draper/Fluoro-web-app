import { Link } from "react-router-dom";
import { Clock, IndianRupee, PackageX, ArrowUpRight, Phone } from "lucide-react";
import { IMPORT_SUB, COMPANY } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { SectionLabel, Tag, CornerMarkers } from "@/components/site/Primitives";
import { ShinyText } from "@/components/site/ShinyText";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

const PAIN_ICONS = [Clock, IndianRupee, PackageX];

export default function ImportSubstitution() {
  const img = useSiteImages();

  return (
    <div data-testid={PAGE.importSubstitution}>
      <PageHeader
        index="04"
        label={IMPORT_SUB.eyebrow}
        title="Stop waiting 10 weeks for"
        shine="imported spares"
        intro={IMPORT_SUB.subheadline}
      />

      <section className="bg-slate-950 pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-white hover:text-slate-950 transition-colors duration-300"
          >
            Send us a part to reverse-engineer
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
          </Link>
          <a
            href="#parts"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-white/10 transition-colors duration-300"
          >
            See parts we substitute →
          </a>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel>{IMPORT_SUB.problem.eyebrow}</SectionLabel>
            <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.02] max-w-3xl">
              {IMPORT_SUB.problem.headline}
            </h2>
            <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
              {IMPORT_SUB.problem.subheadline}
            </p>
          </Reveal>

          <StaggerGroup className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            {IMPORT_SUB.problem.points.map((p, i) => {
              const Icon = PAIN_ICONS[i];
              return (
                <StaggerItem key={p.title}>
                  <div className="h-full border border-slate-200 bg-white p-8 hover:border-blue-600 transition-colors duration-500">
                    <Icon className="h-7 w-7 text-blue-600" strokeWidth={1.5} />
                    <h3 className="mt-6 font-oswald font-medium uppercase text-slate-900 text-xl tracking-tight">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm md:text-base text-slate-600 leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 sm:py-32 bg-slate-900 blueprint-grid-dark">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel light>{IMPORT_SUB.process.eyebrow}</SectionLabel>
            <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.98] max-w-3xl">
              From worn part to{" "}
              <ShinyText className="font-bold">running machine</ShinyText> — in weeks
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {IMPORT_SUB.process.steps.map((s) => (
              <div
                key={s.no}
                className="bg-slate-900 p-8 sm:p-10 group hover:bg-slate-800 transition-colors duration-500"
              >
                <span className="font-oswald font-bold text-5xl text-white/10 leading-none group-hover:text-blue-500/40 transition-colors duration-500">
                  {s.no}
                </span>
                <h3 className="mt-6 font-oswald font-medium uppercase text-white text-xl sm:text-2xl tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-4 text-sm md:text-base text-white/70 leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parts */}
      <section id="parts" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel>{IMPORT_SUB.parts.eyebrow}</SectionLabel>
              <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-4xl leading-tight">
                {IMPORT_SUB.parts.headline}
              </h2>
              <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed">
                {IMPORT_SUB.parts.subheadline}
              </p>
            </Reveal>
            <StaggerGroup className="mt-10 flex flex-wrap gap-3">
              {IMPORT_SUB.parts.list.map((p) => (
                <StaggerItem key={p}>
                  <Tag>{p}</Tag>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            {img.importSubstitution && (
              <div className="relative border border-slate-300 bg-white p-2">
                <CornerMarkers />
                <img
                  src={img.importSubstitution}
                  alt="Reverse-engineered die casting spare on the boring machine"
                  className="w-full h-[320px] sm:h-[460px] object-cover"
                />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Why us */}
      <section className="py-24 sm:py-32 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel>{IMPORT_SUB.why.eyebrow}</SectionLabel>
            <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.02] max-w-3xl">
              {IMPORT_SUB.why.headline}
            </h2>
          </Reveal>
          <StaggerGroup className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {IMPORT_SUB.why.points.map((p, i) => (
              <StaggerItem key={p.title}>
                <div className="h-full bg-white border border-slate-200 p-8 hover:border-blue-600 transition-colors duration-500">
                  <span className="font-ibm-plex-mono text-xs tracking-[0.2em] uppercase text-blue-700">
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-oswald font-medium uppercase text-slate-900 text-xl sm:text-2xl tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
                    {p.text}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-24 bg-slate-950 blueprint-grid-dark">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.98] max-w-3xl">
              Ready to cut your{" "}
              <ShinyText className="font-bold">import dependency?</ShinyText>
            </h2>
            <p className="mt-6 text-sm md:text-base text-white/80 leading-relaxed max-w-2xl">
              {IMPORT_SUB.cta.subheadline}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-white hover:text-slate-950 transition-colors duration-300"
              >
                Send us a part to quote
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 text-white text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-white/10 transition-colors duration-300"
              >
                <Phone className="h-4 w-4" /> Call us instead
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <RfqSection />
    </div>
  );
}
