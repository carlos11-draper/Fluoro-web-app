import Marquee from "react-fast-marquee";
import { CLIENTS } from "@/data/company";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { SectionLabel } from "@/components/site/Primitives";
import { SECTION } from "@/constants/testIds";

export const ClientsSection = () => (
  <section data-testid={SECTION.clients} className="py-24 sm:py-32 bg-slate-50">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      <Reveal>
        <SectionLabel>Trusted by</SectionLabel>
        <h2 className="font-oswald font-bold uppercase tracking-tight text-slate-900 text-3xl sm:text-5xl leading-[1.02]">
          Our clients
        </h2>
        <p className="mt-6 text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
          Manufacturers across automotive, die casting, and hydraulics rely on us for
          servicing and spares.
        </p>
      </Reveal>

      <StaggerGroup className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-200 border border-slate-200">
        {CLIENTS.map((c) => (
          <StaggerItem key={c}>
            <div className="bg-white h-full px-6 py-8 hover:bg-blue-600 group transition-colors duration-500">
              <span className="font-oswald uppercase tracking-tight text-slate-900 text-lg sm:text-xl group-hover:text-white transition-colors duration-500">
                {c}
              </span>
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>

    <div className="mt-16 bg-slate-950 py-5 border-y border-white/10">
      <Marquee gradient={false} speed={40} autoFill>
        {CLIENTS.map((c) => (
          <span
            key={c}
            className="mx-8 font-oswald uppercase tracking-wide text-slate-500 text-xl"
          >
            {c}
            <span className="text-blue-500 ml-8">/</span>
          </span>
        ))}
      </Marquee>
    </div>
  </section>
);
