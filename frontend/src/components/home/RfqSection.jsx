import { Phone, Mail, MapPin } from "lucide-react";
import { COMPANY, RFQ } from "@/data/company";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel } from "@/components/site/Primitives";
import { RfqForm } from "@/components/site/RfqForm";
import { BrochureButton } from "@/components/site/BrochureButton";
import { SECTION, BROCHURE } from "@/constants/testIds";

export const RfqSection = ({ compact = false }) => (
  <section
    data-testid={SECTION.rfq}
    className={`relative ${compact ? "py-16 sm:py-20" : "py-24 sm:py-32"} bg-slate-950 blueprint-grid-dark overflow-hidden`}
  >
    <div
      className="pointer-events-none absolute top-10 -left-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)" }}
    />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
      <div className="lg:col-span-5">
        <Reveal>
          {!compact && (
            <>
              <SectionLabel light>Request a quote</SectionLabel>
              <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.98]">
                {RFQ.headline}
              </h2>
              <p className="mt-6 text-sm md:text-base text-white/80 leading-relaxed">
                {RFQ.subheadline}
              </p>
            </>
          )}
          {compact && <SectionLabel light>Direct lines</SectionLabel>}

          <ul className={compact ? "space-y-6" : "mt-10 space-y-6"}>
            <li className="flex gap-4">
              <Phone className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="font-ibm-plex-mono text-white/80 hover:text-white transition-colors"
              >
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex gap-4">
              <Mail className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-ibm-plex-mono text-white/80 hover:text-white transition-colors break-all"
              >
                {COMPANY.email}
              </a>
            </li>
            <li className="flex gap-4">
              <MapPin className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base text-white/70 leading-relaxed">
                {COMPANY.address}
              </span>
            </li>
          </ul>

          <div className="mt-10">
            <BrochureButton testId={BROCHURE.rfqButton} />
          </div>
        </Reveal>
      </div>

      <div className="lg:col-span-7">
        <Reveal delay={0.1}>
          <div className="border border-white/12 bg-white/[0.03] backdrop-blur-sm p-6 sm:p-10">
            <RfqForm light />
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
