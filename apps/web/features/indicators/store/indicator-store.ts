import { create } from "zustand";

export type IndicatorType = "EMA" | "SMA" | "VWAP" | "BB" | "RSI" | "MACD" | "ADX" | "MFI" | "OBV";

export interface IndicatorSettings {
  emaPeriod: number;
  smaPeriod: number;
  bollingerPeriod: number;
  bollingerStdDev: number;
  rsiPeriod: number;
  macdFast: number;
  macdSlow: number;
  macdSignal: number;
  adxPeriod: number;
  mfiPeriod: number;
}

interface IndicatorState {
  activeIndicators: Set<IndicatorType>;
  settings: IndicatorSettings;
  
  toggleIndicator: (indicator: IndicatorType) => void;
  updateSettings: (settings: Partial<IndicatorSettings>) => void;
  isIndicatorActive: (indicator: IndicatorType) => boolean;
}

const defaultSettings: IndicatorSettings = {
  emaPeriod: 20,
  smaPeriod: 20,
  bollingerPeriod: 20,
  bollingerStdDev: 2,
  rsiPeriod: 14,
  macdFast: 12,
  macdSlow: 26,
  macdSignal: 9,
  adxPeriod: 14,
  mfiPeriod: 14
};

const defaultActiveIndicators = new Set<IndicatorType>([
  "EMA",
  "SMA",
  "VWAP",
  "BB",
  "RSI",
  "MACD",
  "ADX",
  "MFI",
  "OBV"
]);

export const useIndicatorStore = create<IndicatorState>((set, get) => ({
  activeIndicators: defaultActiveIndicators,
  settings: defaultSettings,

  toggleIndicator: (indicator) => {
    set((state) => {
      const newActive = new Set(state.activeIndicators);
      if (newActive.has(indicator)) {
        newActive.delete(indicator);
      } else {
        newActive.add(indicator);
      }
      return { activeIndicators: newActive };
    });
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }));
  },

  isIndicatorActive: (indicator) => {
    return get().activeIndicators.has(indicator);
  }
}));
