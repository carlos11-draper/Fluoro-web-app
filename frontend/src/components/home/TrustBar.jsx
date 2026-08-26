import { Gauge, Timer, ShieldCheck, Factory } from "lucide-react";
import { STATS } from "@/data/company";
import { StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { SECTION } from "@/constants/testIds";

const ICONS = { gauge: Gauge, timer: Timer, shield: ShieldCheck, factory: Factory };

export const TrustBar = () => (
  <section
    data-testid={SECTION.trustBar}
    className="bg-slate-900 border-y border-white/10"
  >
    <StaggerGroup className="mx-auto max-w-7xl px-5 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 lg:divide-x divide-white/10">
      {STATS.map((s, i) => {
        const Icon = ICONS[s.icon];
        return (
          <StaggerItem key={s.label}>
            <div
              data-testid={SECTION.stat(i + 1)}
              className="py-10 lg:px-8 first:lg:pl-0 group"
            >
              <Icon
                className="h-6 w-6 text-blue-500 mb-5 transition-transform duration-500 group-hover:scale-110"
                strokeWidth={1.5}
              />
              <div className="font-oswald font-bold uppercase text-white text-2xl sm:text-3xl tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 font-ibm-plex-mono text-[0.7rem] tracking-[0.18em] uppercase text-slate-400">
                {s.label}
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerGroup>
  </section>
);
