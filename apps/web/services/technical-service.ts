import type { IndicatorSnapshot, SignalsSnapshot } from "@/types/technical";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const technicalService = {
  async getIndicators(ticker: string): Promise<IndicatorSnapshot> {
    const response = await fetch(`${API_BASE_URL}/technical/${ticker}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch indicators for ${ticker}`);
    }
    return response.json();
  },

  async getSignals(ticker: string): Promise<SignalsSnapshot> {
    const response = await fetch(`${API_BASE_URL}/technical/signals/${ticker}`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to fetch signals for ${ticker}`);
    }
    return response.json();
  }
};
