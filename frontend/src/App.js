import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/site/Layout";
import { SiteImagesProvider } from "@/context/SiteImages";
import { SiteSettingsProvider } from "@/context/SiteSettings";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Founder from "@/pages/Founder";
import Services from "@/pages/Services";
import Capabilities from "@/pages/Capabilities";
import ImportSubstitution from "@/pages/ImportSubstitution";
import Projects from "@/pages/Projects";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <SiteImagesProvider>
          <SiteSettingsProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/founder" element={<Founder />} />
              <Route path="/services" element={<Services />} />
              <Route path="/capabilities" element={<Capabilities />} />
              <Route path="/import-substitution" element={<ImportSubstitution />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
          </SiteSettingsProvider>
        </SiteImagesProvider>
      </BrowserRouter>
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

export default App;
