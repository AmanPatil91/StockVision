import type { Exchange } from "@/types/stock";

export interface SearchSuggestion {
  ticker: string;
  name: string;
  exchange: Exchange;
  sector: string;
  industry: string;
}

