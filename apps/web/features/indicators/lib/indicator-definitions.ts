import {
  Activity,
  BarChart2,
  ChartNoAxesCombined,
  CircleDot,
  Gauge,
  LineChart,
  Waves
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { IndicatorType } from "@/features/indicators/store/indicator-store";

export type IndicatorPlacement = "overlay" | "pane";

export type IndicatorDefinition = {
  id: IndicatorType;
  label: string;
  shortLabel: string;
  placement: IndicatorPlacement;
  color: string;
  icon: LucideIcon;
};

export const INDICATOR_DEFINITIONS: IndicatorDefinition[] = [
  {
    id: "EMA",
    label: "Exponential Moving Average",
    shortLabel: "EMA",
    placement: "overlay",
    color: "#5E8CFF",
    icon: LineChart
  },
  {
    id: "SMA",
    label: "Simple Moving Average",
    shortLabel: "SMA",
    placement: "overlay",
    color: "#F59E0B",
    icon: LineChart
  },
  {
    id: "VWAP",
    label: "Volume Weighted Average Price",
    shortLabel: "VWAP",
    placement: "overlay",
    color: "#26D9A5",
    icon: Waves
  },
  {
    id: "BB",
    label: "Bollinger Bands",
    shortLabel: "BB",
    placement: "overlay",
    color: "#A78BFA",
    icon: ChartNoAxesCombined
  },
  {
    id: "RSI",
    label: "Relative Strength Index",
    shortLabel: "RSI",
    placement: "pane",
    color: "#F97316",
    icon: Gauge
  },
  {
    id: "MACD",
    label: "Moving Average Convergence Divergence",
    shortLabel: "MACD",
    placement: "pane",
    color: "#60A5FA",
    icon: Activity
  },
  {
    id: "ADX",
    label: "Average Directional Index",
    shortLabel: "ADX",
    placement: "pane",
    color: "#22D3EE",
    icon: CircleDot
  },
  {
    id: "MFI",
    label: "Money Flow Index",
    shortLabel: "MFI",
    placement: "pane",
    color: "#34D399",
    icon: Gauge
  },
  {
    id: "OBV",
    label: "On-Balance Volume",
    shortLabel: "OBV",
    placement: "pane",
    color: "#F472B6",
    icon: BarChart2
  }
];

export const OVERLAY_INDICATORS = INDICATOR_DEFINITIONS.filter(
  (indicator) => indicator.placement === "overlay"
);

export const PANE_INDICATORS = INDICATOR_DEFINITIONS.filter(
  (indicator) => indicator.placement === "pane"
);

export function getIndicatorDefinition(id: IndicatorType) {
  return INDICATOR_DEFINITIONS.find((indicator) => indicator.id === id);
}
