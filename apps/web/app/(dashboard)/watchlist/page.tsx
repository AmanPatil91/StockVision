import { PageHeader } from "@/components/shared/page-header";
import { WatchlistPanel } from "@/features/watchlist/components/watchlist-panel";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Watchlist"
        title="Your tracked high-conviction stocks"
        description="Persisted locally for Phase 1, ready to move behind user accounts and synchronized watchlist APIs in future backend iterations."
      />
      <WatchlistPanel />
    </div>
  );
}

