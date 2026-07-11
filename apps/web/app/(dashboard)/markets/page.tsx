import { PageHeader } from "@/components/shared/page-header";
import { FeaturedStocksGrid } from "@/features/market-overview/components/featured-stocks-grid";
import { MarketSnapshotGrid } from "@/features/market-overview/components/market-snapshot-grid";

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Markets"
        title="Live market context at a glance"
        description="Track benchmark indices, follow featured large-cap names, and use this surface as the foundation for future sector heatmaps, breadth widgets, and technical overlays."
      />
      <MarketSnapshotGrid />
      <FeaturedStocksGrid />
    </div>
  );
}

