import axios from "axios";
import { FileDown } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettings";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const STYLES = {
  outline: "border border-white/25 text-white hover:bg-white/10",
  solid: "bg-white text-slate-950 hover:bg-blue-600 hover:text-white",
};

// Auto-hides when no brochure PDF is configured in /admin.
export const BrochureButton = ({ variant = "outline", testId = "brochure-button", className = "" }) => {
  const { brochureUrl } = useSiteSettings();
  if (!brochureUrl) return null;

  const track = () => axios.post(`${BACKEND}/api/brochure/track-download`).catch(() => {});

  return (
    <a
      href={brochureUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      data-testid={testId}
      className={`group inline-flex items-center justify-center gap-2 rounded-full text-sm px-6 md:px-8 py-3 md:py-4 transition-colors duration-300 ${STYLES[variant]} ${className}`}
    >
      <FileDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
      Download portfolio
    </a>
  );
};
