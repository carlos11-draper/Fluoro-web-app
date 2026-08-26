import { Plus } from "lucide-react";

// Technical-drawing corner crosshairs on section corners.
export const CornerMarkers = ({ className = "" }) => (
  <>
    <Plus className={`absolute -top-2.5 -left-2.5 h-5 w-5 text-blue-500/70 ${className}`} strokeWidth={1.25} />
    <Plus className={`absolute -top-2.5 -right-2.5 h-5 w-5 text-blue-500/70 ${className}`} strokeWidth={1.25} />
    <Plus className={`absolute -bottom-2.5 -left-2.5 h-5 w-5 text-blue-500/70 ${className}`} strokeWidth={1.25} />
    <Plus className={`absolute -bottom-2.5 -right-2.5 h-5 w-5 text-blue-500/70 ${className}`} strokeWidth={1.25} />
  </>
);

// Monospace eyebrow label: — WHAT WE DO
export const SectionLabel = ({ index, children, light = false }) => (
  <div className="flex items-center gap-3 mb-6">
    <span className={`h-px w-10 ${light ? "bg-blue-400" : "bg-blue-600"}`} />
    <span
      className={`font-ibm-plex-mono text-xs tracking-[0.25em] uppercase font-semibold ${
        light ? "text-blue-300" : "text-blue-700"
      }`}
    >
      {index ? `[ ${index} / ${children} ]` : children}
    </span>
  </div>
);

// Big statistic block.
export const StatBlock = ({ value, label, light = false }) => (
  <div className={`border-l-2 ${light ? "border-blue-500" : "border-blue-700"} pl-5`}>
    <div
      className={`font-oswald font-bold text-3xl sm:text-4xl tracking-tight ${
        light ? "text-white" : "text-slate-900"
      }`}
    >
      {value}
    </div>
    <div
      className={`font-ibm-plex-mono text-[0.7rem] tracking-[0.18em] uppercase mt-2 ${
        light ? "text-slate-400" : "text-slate-500"
      }`}
    >
      {label}
    </div>
  </div>
);

// Two-column technical specification table.
export const SpecTable = ({ rows, light = false, testId }) => (
  <dl
    data-testid={testId}
    className={`divide-y ${light ? "divide-white/10 border-white/15" : "divide-slate-200 border-slate-300"} border-t border-b`}
  >
    {rows.map((r) => (
      <div key={r.label} className="flex items-baseline justify-between gap-6 py-4">
        <dt
          className={`font-ibm-plex-mono text-[0.7rem] sm:text-xs tracking-[0.18em] uppercase ${
            light ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {r.label}
        </dt>
        <dd
          className={`font-oswald uppercase tracking-tight text-lg sm:text-xl text-right ${
            light ? "text-white" : "text-slate-900"
          }`}
        >
          {r.value}
        </dd>
      </div>
    ))}
  </dl>
);

// Small rounded tag chip.
export const Tag = ({ children, light = false }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 font-ibm-plex-mono text-[0.65rem] tracking-[0.15em] uppercase ${
      light
        ? "border-blue-400/40 bg-blue-400/10 text-blue-200"
        : "border-blue-700/25 bg-blue-50 text-blue-700"
    }`}
  >
    {children}
  </span>
);
