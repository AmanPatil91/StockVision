"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Building2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, startTransition, useDeferredValue, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { useStockSearch } from "@/features/search/hooks/use-stock-search";
import { cn } from "@/lib/utils";

type StockSearchProps = {
  className?: string;
};

export function StockSearch({ className }: StockSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);
  const { data = [], isFetching } = useStockSearch(deferredQuery);

  const suggestions = useMemo(() => data, [data]);
  const isOpen = isFocused && query.trim().length > 0;

  const navigateToTicker = (ticker: string) => {
    setQuery("");
    setIsFocused(false);
    startTransition(() => {
      router.push(`/stocks/${ticker}`);
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === "Enter" && query.trim()) {
        startTransition(() => {
          router.push(`/stocks/${query.trim().toUpperCase()}`);
        });
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((current) => (current + 1) % suggestions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((current) => (current - 1 + suggestions.length) % suggestions.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      navigateToTicker(suggestions[highlightedIndex]?.ticker ?? query.trim().toUpperCase());
    }

    if (event.key === "Escape") {
      setIsFocused(false);
    }
  };

  return (
    <div className={cn("relative w-full max-w-xl", className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setHighlightedIndex(0);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search stocks, sectors, or tickers"
          className="h-12 rounded-2xl border-white/10 bg-white/[0.04] pl-11"
        />
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-[calc(100%+12px)] z-50 overflow-hidden rounded-3xl border border-white/10 bg-surface-elevated/95 p-2 shadow-panel backdrop-blur-xl"
          >
            {suggestions.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                {isFetching ? "Searching…" : "No matching stocks found."}
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.ticker}
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    navigateToTicker(suggestion.ticker);
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors",
                    highlightedIndex === index ? "bg-white/[0.06]" : "hover:bg-white/[0.04]"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{suggestion.name}</span>
                      <span className="text-xs uppercase tracking-[0.16em] text-primary">{suggestion.ticker}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {suggestion.exchange} • {suggestion.industry}
                    </div>
                  </div>
                </button>
              ))
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
