import { ArrowDownRight, ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  caption?: string;
  tone?: "default" | "positive" | "negative";
  className?: string;
};

export function StatCard({ label, value, caption, tone = "default", className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span>{label}</span>
          {tone === "positive" ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
          ) : tone === "negative" ? (
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
          ) : null}
        </div>
        <div className="font-display text-2xl font-semibold text-white">{value}</div>
        {caption ? <p className="text-sm text-muted-foreground">{caption}</p> : null}
      </CardContent>
    </Card>
  );
}

