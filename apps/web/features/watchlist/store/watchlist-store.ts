"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { WatchlistItem } from "@/types/watchlist";

type WatchlistStore = {
  items: WatchlistItem[];
  toggleStock: (ticker: string) => void;
  removeStock: (ticker: string) => void;
  toggleFavorite: (ticker: string) => void;
  isTracked: (ticker: string) => boolean;
};

const DEFAULT_ITEMS: WatchlistItem[] = [
  { ticker: "RELIANCE", addedAt: new Date().toISOString(), isFavorite: true },
  { ticker: "TCS", addedAt: new Date().toISOString(), isFavorite: false },
  { ticker: "INFY", addedAt: new Date().toISOString(), isFavorite: false }
];

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      items: DEFAULT_ITEMS,
      toggleStock: (ticker) =>
        set((state) => {
          const normalizedTicker = ticker.toUpperCase();
          const exists = state.items.some((item) => item.ticker === normalizedTicker);

          if (exists) {
            return {
              items: state.items.filter((item) => item.ticker !== normalizedTicker)
            };
          }

          return {
            items: [
              {
                ticker: normalizedTicker,
                addedAt: new Date().toISOString(),
                isFavorite: false
              },
              ...state.items
            ]
          };
        }),
      removeStock: (ticker) =>
        set((state) => ({
          items: state.items.filter((item) => item.ticker !== ticker.toUpperCase())
        })),
      toggleFavorite: (ticker) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.ticker === ticker.toUpperCase() ? { ...item, isFavorite: !item.isFavorite } : item
          )
        })),
      isTracked: (ticker) => get().items.some((item) => item.ticker === ticker.toUpperCase())
    }),
    {
      name: "stockvision-watchlist",
      storage: createJSONStorage(() => localStorage)
    }
  )
);

