"use client";

import { Activity, ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTechnicalSignals } from "@/features/indicators/hooks/use-technical-signals";

type TechnicalSummaryCardProps = {
  ticker: string;
};

export function TechnicalSummaryCard({ ticker }: TechnicalSummaryCardProps) {
  const { data: snapshot, isLoading, error } = useTechnicalSignals(ticker);

  if (isLoading) {
    return <div className="h-[400px] animate-pulse rounded-3xl bg-white/[0.04]" />;
  }

  if (error || !snapshot || !snapshot.summary) {
    return (
      <Card className="w-full bg-[#1A1D24] border-[#2A2E39] text-white">
        <CardContent className="flex h-32 items-center justify-center">
          <p className="text-sm text-slate-400">Technical signals unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const { summary, signals } = snapshot;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "STRONG_BUY": return "text-emerald-400";
      case "BUY": return "text-emerald-300";
      case "STRONG_SELL": return "text-rose-400";
      case "SELL": return "text-rose-300";
      default: return "text-slate-400";
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "BUY": return <ArrowUp className="h-4 w-4 text-emerald-400" />;
      case "SELL": return <ArrowDown className="h-4 w-4 text-rose-400" />;
      default: return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <Card className="w-full bg-[#1A1D24] border-[#2A2E39] text-white">
      <CardHeader className="pb-4 border-b border-[#2A2E39]">
        <CardTitle className="text-sm font-semibold text-[#95A2BF] flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Technical Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col items-center justify-center p-4 bg-[#111318] rounded-xl border border-[#2A2E39]">
          <span className="text-xs text-slate-400 uppercase tracking-wider mb-1">Overall Rating</span>
          <span className={`text-2xl font-bold ${getRatingColor(summary.overall_rating)}`}>
            {summary.overall_rating.replace("_", " ")}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-400">Trend</div>
            <div className="text-sm font-medium">{summary.trend}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Momentum</div>
            <div className="text-sm font-medium">{summary.momentum}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Volatility</div>
            <div className="text-sm font-medium">{summary.volatility}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Volume</div>
            <div className="text-sm font-medium">{summary.volume}</div>
          </div>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#2A2E39]">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Signals</h4>
          {signals.length === 0 ? (
            <p className="text-xs text-slate-500">No active signals found.</p>
          ) : (
            <div className="space-y-3">
              {signals.map((sig, i) => (
                <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-[#111318] border border-[#2A2E39]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {getSignalIcon(sig.signal)} {sig.name}
                    </span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#2A2E39] text-slate-300">
                      {sig.strength}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{sig.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
