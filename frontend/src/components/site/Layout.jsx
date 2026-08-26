import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ReactLenis } from "lenis/react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const Layout = ({ children }) => (
  <ReactLenis root options={{ lerp: 0.09, smoothWheel: true }}>
    <ScrollToTop />
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </ReactLenis>
);
