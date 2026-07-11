import { create } from "zustand";

export type IndicatorType = "EMA" | "SMA" | "VWAP" | "BB" | "RSI" | "MACD" | "ADX" | "MFI" | "OBV";

export interface IndicatorSettings {
  emaPeriod: number;
  smaPeriod: number;
  rsiPeriod: number;
  macdFast: number;
  macdSlow: number;
  macdSignal: number;
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
  rsiPeriod: 14,
  macdFast: 12,
  macdSlow: 26,
  macdSignal: 9,
};

export const useIndicatorStore = create<IndicatorState>((set, get) => ({
  activeIndicators: new Set<IndicatorType>(),
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
