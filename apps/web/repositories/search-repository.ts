import type { SearchSuggestion } from "@/types/search";

export interface SearchRepository {
  searchStocks(query: string): Promise<SearchSuggestion[]>;
}

