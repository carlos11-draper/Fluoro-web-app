import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS, COMPANY } from "@/data/company";
import { NAV } from "@/constants/testIds";

const slug = (label) => label.toLowerCase().replace(/\s+/g, "-");

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-[76px] flex items-center justify-between gap-6">
        {/* Logo */}
        <Link to="/" data-testid={NAV.logo} className="flex items-center gap-3 group shrink-0">
          <span className="relative h-9 w-9 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-500 group-hover:rotate-90">
            <span className="h-3 w-3 rounded-full bg-white transition-colors duration-300 group-hover:bg-blue-400" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-oswald font-bold uppercase tracking-tight text-white text-lg">
              {COMPANY.name}
            </span>
            <span className="hidden sm:block font-ibm-plex-mono text-[0.55rem] tracking-[0.22em] uppercase text-white/50">
              Die Casting Machinery
            </span>
          </span>
        </Link>

        {/* Pill nav */}
        <div
          data-testid={NAV.pill}
          className="hidden lg:flex items-center gap-1 rounded-full border border-slate-700 bg-white/5 backdrop-blur-md px-2 py-1.5"
        >
          {NAV_LINKS.map((l, i) => {
            const active = location.pathname === l.to;
            const last = i === NAV_LINKS.length - 1;
            return (
              <Link
                key={l.to}
                to={l.to}
                data-testid={NAV.link(slug(l.label))}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-300 ${
                  active
                    ? "bg-white/12 text-white"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
                {last && <ArrowUpRight className="h-3.5 w-3.5" />}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to="/contact"
          data-testid={NAV.ctaContact}
          className="hidden lg:inline-flex items-center gap-2 rounded-full bg-white text-slate-950 text-sm px-5 py-2.5 hover:bg-blue-600 hover:text-white transition-colors duration-300 group shrink-0"
        >
          Request a quote
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>

        <button
          data-testid={NAV.mobileToggle}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden h-11 w-11 rounded-full flex items-center justify-center border border-slate-700 text-white"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-slate-950 border-b border-white/10"
          >
            <div className="px-5 py-6 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  data-testid={NAV.mobileLink(slug(l.label))}
                  className="font-oswald uppercase text-2xl tracking-tight text-white py-2 border-b border-white/10"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white text-sm px-6 py-4"
              >
                Request a quote <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
