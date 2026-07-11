"use client";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useWatchlistStore } from "@/features/watchlist/store/watchlist-store";

type WatchlistToggleButtonProps = {
  ticker: string;
  className?: string;
};

export function WatchlistToggleButton({ ticker, className }: WatchlistToggleButtonProps) {
  const mounted = useMounted();
  const isTracked = useWatchlistStore((state) => state.isTracked(ticker));
  const toggleStock = useWatchlistStore((state) => state.toggleStock);

  return (
    <Button
      variant="secondary"
      onClick={() => toggleStock(ticker)}
      className={cn("rounded-2xl", className)}
      aria-pressed={mounted ? isTracked : false}
    >
      <Star className={cn("h-4 w-4", mounted && isTracked ? "fill-current text-amber-300" : "text-muted-foreground")} />
      {mounted && isTracked ? "Tracked" : "Add to watchlist"}
    </Button>
  );
}

