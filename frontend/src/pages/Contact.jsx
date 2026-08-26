import { RFQ } from "@/data/company";
import { PageHeader } from "@/components/site/PageHeader";
import { RfqSection } from "@/components/home/RfqSection";
import { PAGE } from "@/constants/testIds";

export default function Contact() {
  return (
    <div data-testid={PAGE.contact}>
      <PageHeader
        index="08"
        label="Request a quote"
        title="Send us your"
        shine="requirement"
        intro={RFQ.subheadline}
      />
      <RfqSection compact />
    </div>
  );
}
