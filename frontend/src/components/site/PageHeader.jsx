import { motion } from "framer-motion";
import { ShinyText } from "./ShinyText";

// Dark steel-navy inner-page header, consistent across all pages.
export const PageHeader = ({ label, title, shine, intro }) => (
  <section className="relative pt-[76px] bg-slate-950 blueprint-grid-dark overflow-hidden">
    <div
      className="pointer-events-none absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
      style={{ background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)" }}
    />
    <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-14 sm:pt-20 sm:pb-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-6"
      >
        <span className="h-px w-10 bg-blue-500" />
        <span className="font-ibm-plex-mono text-xs tracking-[0.25em] uppercase text-blue-300 font-semibold">
          {label}
        </span>
      </motion.div>

      <div className="overflow-hidden pb-2">
        <motion.h1
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-oswald font-medium uppercase tracking-tighter text-white text-4xl sm:text-5xl md:text-6xl leading-[0.9] max-w-4xl"
        >
          {title}{" "}
          {shine && <ShinyText className="font-bold">{shine}</ShinyText>}
        </motion.h1>
      </div>

      {intro && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-8 font-ibm-plex-sans text-sm md:text-base text-white/80 leading-relaxed max-w-2xl"
        >
          {intro}
        </motion.p>
      )}
    </div>
  </section>
);
