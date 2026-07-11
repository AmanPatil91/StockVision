import { StatCard } from "@/components/shared/stat-card";
import type { StockDetail } from "@/types/stock";
import { formatCompactNumber, formatCurrency, formatNumber } from "@/utils/formatters";

type CompanySummaryGridProps = {
  stock: StockDetail;
};

export function CompanySummaryGrid({ stock }: CompanySummaryGridProps) {
  const cards = [
    { label: "Market Cap", value: formatCompactNumber(stock.summary.marketCap) },
    { label: "PE Ratio", value: formatNumber(stock.summary.peRatio) },
    { label: "EPS", value: formatNumber(stock.summary.eps) },
    { label: "Dividend Yield", value: `${formatNumber(stock.summary.dividendYield)}%` },
    { label: "52W High", value: formatCurrency(stock.quote.week52High, stock.profile.currency) },
    { label: "52W Low", value: formatCurrency(stock.quote.week52Low, stock.profile.currency) },
    { label: "Volume", value: formatCompactNumber(stock.quote.volume) },
    { label: "Avg Volume", value: formatCompactNumber(stock.quote.averageVolume) },
    { label: "Sector", value: stock.summary.sector },
    { label: "Industry", value: stock.summary.industry },
    { label: "Beta", value: formatNumber(stock.summary.beta) }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <StatCard key={card.label} label={card.label} value={card.value} />
      ))}
    </div>
  );
}

