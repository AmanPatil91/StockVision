import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StockDetail } from "@/types/stock";
import { formatCompactNumber, formatCurrency, formatRange } from "@/utils/formatters";

type QuickStatsPanelProps = {
  stock: StockDetail;
};

export function QuickStatsPanel({ stock }: QuickStatsPanelProps) {
  const rows = [
    { label: "Open", value: formatCurrency(stock.quote.open, stock.profile.currency) },
    { label: "High", value: formatCurrency(stock.quote.high, stock.profile.currency) },
    { label: "Low", value: formatCurrency(stock.quote.low, stock.profile.currency) },
    { label: "Close", value: formatCurrency(stock.quote.close, stock.profile.currency) },
    { label: "VWAP", value: formatCurrency(stock.quote.vwap, stock.profile.currency) },
    { label: "Previous Close", value: formatCurrency(stock.quote.previousClose, stock.profile.currency) },
    { label: "Volume", value: formatCompactNumber(stock.quote.volume) },
    { label: "Average Volume", value: formatCompactNumber(stock.quote.averageVolume) },
    {
      label: "52 Week Range",
      value: formatRange(stock.quote.week52Low, stock.quote.week52High, stock.profile.currency)
    }
  ];

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Quick Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{row.label}</div>
            <div className="mt-2 text-sm font-medium leading-6 text-white">{row.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

