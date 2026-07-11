import { MockSearchRepository } from "@/repositories/mock/mock-search-repository";
import type { SearchSuggestion } from "@/types/search";

const searchRepository = new MockSearchRepository();

export const searchService = {
  searchStocks(query: string): Promise<SearchSuggestion[]> {
    return searchRepository.searchStocks(query);
  }
};

