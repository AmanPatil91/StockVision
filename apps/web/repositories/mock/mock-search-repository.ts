import type { SearchRepository } from "@/repositories/search-repository";
import { getMockSearchSuggestions } from "@/repositories/mock/mock-source";
import type { SearchSuggestion } from "@/types/search";

export class MockSearchRepository implements SearchRepository {
  async searchStocks(query: string): Promise<SearchSuggestion[]> {
    return getMockSearchSuggestions(query);
  }
}

