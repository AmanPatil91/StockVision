import { StockDetailScreen } from "@/features/stock-details/components/stock-detail-screen";

type StockDetailPageProps = {
  params: Promise<{
    ticker: string;
  }>;
};

export default async function StockDetailPage({ params }: StockDetailPageProps) {
  const { ticker } = await params;

  return <StockDetailScreen ticker={ticker.toUpperCase()} />;
}
