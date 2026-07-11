import { Newspaper } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default function NewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="News"
        title="Pluggable news intelligence surface"
        description="Reserved for future market-moving headlines, sentiment analysis, sector narratives, and AI summarization workflows."
      />
      <EmptyState
        icon={Newspaper}
        title="News intelligence is intentionally deferred"
        description="Phase 1 keeps this area ready for later integration without introducing premature complexity."
      />
    </div>
  );
}

