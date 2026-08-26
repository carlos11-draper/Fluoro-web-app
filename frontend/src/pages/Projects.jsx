import { ProofSection } from "@/components/home/ProofSection";
import { PageHeader } from "@/components/site/PageHeader";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

export default function Projects() {
  return (
    <div data-testid={PAGE.projects}>
      <PageHeader
        index="05"
        label="Proof"
        title="What this looks like"
        shine="in practice"
        intro="Reconditioning, aerospace, import substitution and defence work — delivered from our own facility in Bidadi."
      />
      <ProofSection showHeader={false} />
      <RfqSection />
    </div>
  );
}
