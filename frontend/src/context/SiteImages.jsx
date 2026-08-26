import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DEFAULT_IMAGES } from "@/data/company";

const BACKEND = process.env.REACT_APP_BACKEND_URL;
const Ctx = createContext(DEFAULT_IMAGES);

export const useSiteImages = () => useContext(Ctx);

// Uploaded media is stored as "/api/files/..." — resolve against the backend origin.
export const resolveMediaUrl = (url) =>
  url && url.startsWith("/") ? `${BACKEND}${url}` : url;

export const SiteImagesProvider = ({ children }) => {
  const [images, setImages] = useState(DEFAULT_IMAGES);

  useEffect(() => {
    axios
      .get(`${BACKEND}/api/site-images`)
      .then(({ data }) => {
        const merged = { ...DEFAULT_IMAGES, ...(data.images || {}) };
        setImages(
          Object.fromEntries(
            Object.entries(merged).map(([k, v]) => [k, resolveMediaUrl(v)])
          )
        );
      })
      .catch(() => {});
  }, []);

  return <Ctx.Provider value={images}>{children}</Ctx.Provider>;
};
