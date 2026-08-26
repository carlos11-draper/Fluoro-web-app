import { CAPABILITIES, FACILITIES } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel, SpecTable, CornerMarkers } from "@/components/site/Primitives";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

const PlantTable = ({ title, rows }) => (
  <Reveal className="mt-16 first:mt-0">
    <h3 className="font-oswald font-medium uppercase text-slate-900 text-xl sm:text-2xl tracking-tight">
      {title}
    </h3>
    <div className="mt-6 overflow-x-auto border border-slate-200">
      <table className="w-full text-left border-collapse min-w-[560px]">
        <thead>
          <tr className="bg-slate-900">
            {["Description", "Make / Capacity", "Qty"].map((h) => (
              <th
                key={h}
                className="font-ibm-plex-mono text-[0.65rem] tracking-[0.2em] uppercase text-blue-300 px-5 py-4"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.detail}-${i}`}
              className={`${i % 2 ? "bg-slate-50" : "bg-white"} hover:bg-blue-50/60 transition-colors`}
            >
              <td className="px-5 py-4 text-sm md:text-base text-slate-800">{r.detail}</td>
              <td className="px-5 py-4 font-ibm-plex-mono text-sm text-slate-600">{r.make}</td>
              <td className="px-5 py-4 font-ibm-plex-mono text-sm text-blue-700">{r.qty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Reveal>
);

export default function Capabilities() {
  const img = useSiteImages();

  return (
    <div data-testid={PAGE.capabilities}>
      <PageHeader
        index="03"
        label="Capabilities"
        title="Heavy-capacity machining"
        shine="you can count on"
        intro={CAPABILITIES.subheadline}
      />

      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <SectionLabel index="01">Beyond die casting</SectionLabel>
              {CAPABILITIES.body.map((p) => (
                <p key={p} className="mt-5 text-sm md:text-base text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10">
                <SpecTable rows={CAPABILITIES.specs} />
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15} className="lg:col-span-5">
            {img.capabilities && (
              <div className="relative border border-slate-300 bg-white p-2">
                <CornerMarkers />
                <img
                  src={img.capabilities}
                  alt="Heavy-capacity plano milling and boring plant"
                  className="w-full h-[360px] sm:h-[520px] object-cover"
                />
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal>
            <SectionLabel index="02">Plant & equipment</SectionLabel>
          </Reveal>
          <PlantTable title="Manufacturing facilities" rows={FACILITIES.manufacturing} />
          <PlantTable title="Inspection facilities" rows={FACILITIES.inspection} />
          <PlantTable title="Material handling" rows={FACILITIES.handling} />
        </div>
      </section>

      <RfqSection />
    </div>
  );
}
