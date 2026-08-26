import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/data/company";
import { ShinyText } from "./ShinyText";
import { BrochureButton } from "./BrochureButton";
import { FOOTER, BROCHURE } from "@/constants/testIds";

export const Footer = () => (
  <footer data-testid={FOOTER.section} className="bg-slate-950 text-slate-300 border-t border-white/10">
    <div className="mx-auto max-w-7xl px-5 sm:px-8">
      {/* CTA band */}
      <div className="py-20 border-b border-white/10">
        <p className="font-ibm-plex-mono text-xs tracking-[0.25em] uppercase text-blue-400 mb-6">
          Machine down? Part worn?
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <h2 className="font-oswald font-medium uppercase tracking-tighter text-white text-3xl sm:text-5xl leading-[0.95] max-w-3xl">
            Tell us what you need — we quote within{" "}
            <ShinyText className="font-bold">24 hours</ShinyText>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 self-start">
            <Link
              to="/contact"
              data-testid={FOOTER.contactCta}
              className="group inline-flex items-center gap-2 rounded-full bg-white text-slate-950 text-sm px-6 md:px-8 py-3 md:py-4 hover:bg-blue-600 hover:text-white transition-colors duration-300 whitespace-nowrap"
            >
              Request a quote
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </Link>
            <BrochureButton testId={BROCHURE.footerButton} className="whitespace-nowrap" />
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="relative h-9 w-9 rounded-full border-2 border-white flex items-center justify-center">
              <span className="h-3 w-3 rounded-full bg-white" />
            </span>
            <span className="font-oswald font-bold uppercase text-white text-lg tracking-tight">
              {COMPANY.fullName}
            </span>
          </div>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-md">
            Die casting machine servicing, precision spare manufacturing and import
            substitution — up to 2700T. ISO certified. Engineered in-house in Bidadi since{" "}
            {COMPANY.founded}.
          </p>
        </div>

        <div className="md:col-span-3">
          <p className="font-ibm-plex-mono text-[0.7rem] tracking-[0.2em] uppercase text-slate-500 mb-5">
            Navigate
          </p>
          <ul className="space-y-3">
            {[...NAV_LINKS, { label: "Founder", to: "/founder" }].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm md:text-base text-slate-300 hover:text-blue-400 transition-colors duration-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-ibm-plex-mono text-[0.7rem] tracking-[0.2em] uppercase text-slate-500 mb-5">
            Contact
          </p>
          <ul className="space-y-5">
            <li className="flex gap-3">
              <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <span className="text-sm md:text-base text-slate-300 leading-relaxed">
                {COMPANY.address}
              </span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="h-5 w-5 text-blue-500 shrink-0" />
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                className="font-ibm-plex-mono text-slate-300 hover:text-blue-400 transition-colors"
              >
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="h-5 w-5 text-blue-500 shrink-0" />
              <a
                href={`mailto:${COMPANY.email}`}
                className="font-ibm-plex-mono text-slate-300 hover:text-blue-400 transition-colors break-all"
              >
                {COMPANY.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="py-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-3">
        <p className="font-ibm-plex-mono text-xs tracking-wider uppercase text-slate-500">
          © {new Date().getFullYear()} {COMPANY.fullName}
        </p>
        <Link
          to="/admin"
          className="font-ibm-plex-mono text-xs tracking-wider uppercase text-slate-600 hover:text-blue-400 transition-colors"
        >
          Manage site images
        </Link>
      </div>
    </div>
  </footer>
);
