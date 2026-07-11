import { BarChart3 } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { FeaturedStocksGrid } from "@/features/market-overview/components/featured-stocks-grid";
import { MarketSnapshotGrid } from "@/features/market-overview/components/market-snapshot-grid";
import { WatchlistPanel } from "@/features/watchlist/components/watchlist-panel";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Stock Intelligence Platform"
        title="Professional market dashboard for active investors"
        description="A premium Phase 1 shell inspired by modern trading terminals, built for extensibility into technical indicators, AI signal cards, and market intelligence workflows."
        action={
          <Button asChild className="rounded-2xl">
            <Link href="/stocks/RELIANCE">
              <BarChart3 className="h-4 w-4" />
              Open flagship stock view
            </Link>
          </Button>
        }
      />
      <MarketSnapshotGrid />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr),380px]">
        <FeaturedStocksGrid />
        <WatchlistPanel compact title="Tracked Convictions" />
      </div>
    </div>
  );
}

