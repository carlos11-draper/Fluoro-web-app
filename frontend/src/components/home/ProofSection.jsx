import { CASES } from "@/data/company";
import { useSiteImages } from "@/context/SiteImages";
import { Reveal } from "@/components/site/Reveal";
import { SectionLabel, Tag } from "@/components/site/Primitives";
import { SECTION } from "@/constants/testIds";

export const ProofSection = ({ limit = 4, showHeader = true }) => {
  const img = useSiteImages();
  const items = CASES.slice(0, limit);

  return (
    <section data-testid={SECTION.proof} className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {showHeader && (
          <Reveal>
            <SectionLabel>Proof</SectionLabel>
            <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.02] max-w-3xl">
              What this looks like in practice
            </h2>
          </Reveal>
        )}

        <div className="mt-14 space-y-6">
          {items.map((c, i) => (
            <Reveal key={c.no} delay={0.05 * i}>
              <article
                data-testid={SECTION.caseCard(c.no)}
                className={`group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-200 bg-white p-5 sm:p-7 hover:border-blue-600 transition-colors duration-500 ${
                  i % 2 === 1 ? "lg:[direction:rtl]" : ""
                }`}
              >
                <div className="lg:col-span-5 overflow-hidden [direction:ltr]">
                  {img[c.imageKey] && (
                    <img
                      src={img[c.imageKey]}
                      alt={c.title}
                      className="w-full h-[240px] sm:h-[300px] object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="lg:col-span-7 [direction:ltr]">
                  <div className="flex items-center gap-4">
                    <span className="font-oswald font-bold text-slate-200 text-4xl leading-none">
                      {c.no}
                    </span>
                    <span className="font-ibm-plex-mono text-[0.7rem] tracking-[0.2em] uppercase text-blue-700">
                      {c.kicker}
                    </span>
                  </div>
                  <h3 className="mt-5 font-oswald font-medium uppercase text-slate-900 text-xl sm:text-3xl tracking-tight leading-[1.05]">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-sm md:text-base text-slate-600 leading-relaxed">
                    {c.description}
                  </p>
                  <div className="mt-6">
                    <Tag>{c.result}</Tag>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
