import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { resolveMediaUrl } from "@/context/SiteImages";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const EMPTY = { brochureUrl: "", brochureFilename: "" };
const Ctx = createContext(EMPTY);

export const useSiteSettings = () => useContext(Ctx);

export const SiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(EMPTY);

  useEffect(() => {
    axios
      .get(`${BACKEND}/api/site-settings`)
      .then(({ data }) =>
        setSettings({
          brochureUrl: resolveMediaUrl(data.brochure_url || ""),
          brochureFilename: data.brochure_filename || "",
        })
      )
      .catch(() => {});
  }, []);

  return <Ctx.Provider value={settings}>{children}</Ctx.Provider>;
};
