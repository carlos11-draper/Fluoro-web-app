import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ImportStrip } from "@/components/home/ImportStrip";
import { CapabilitiesSection } from "@/components/home/CapabilitiesSection";
import { StorySection } from "@/components/home/StorySection";
import { ClientsSection } from "@/components/home/ClientsSection";
import { ProofSection } from "@/components/home/ProofSection";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

export default function Home() {
  return (
    <div data-testid={PAGE.home}>
      <Hero />
      <TrustBar />
      <ServicesSection />
      <ImportStrip />
      <CapabilitiesSection />
      <StorySection />
      <ClientsSection />
      <ProofSection />
      <RfqSection />
    </div>
  );
}
