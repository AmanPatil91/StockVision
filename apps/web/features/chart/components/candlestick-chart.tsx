"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  ColorType,
  CrosshairMode,
  LineStyle,
  createChart,
  type BarData,
  type CandlestickData,
  type HistogramData,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";

import {
  PANE_INDICATORS,
  getIndicatorDefinition
} from "@/features/indicators/lib/indicator-definitions";
import {
  calculateADX,
  calculateBollingerBands,
  calculateEMA,
  calculateMACD,
  calculateMFI,
  calculateOBV,
  calculateRSI,
  calculateSMA,
  calculateVWAP
} from "@/features/indicators/lib/calculations";
import { useIndicatorStore } from "@/features/indicators/store/indicator-store";
import type { IndicatorType } from "@/features/indicators/store/indicator-store";
import { cn } from "@/lib/utils";
import type { PriceBar } from "@/types/stock";

type ChartVariant = "candles" | "ohlc";
type PaneIndicator = Extract<IndicatorType, "RSI" | "MACD" | "ADX" | "MFI" | "OBV">;

type CandlestickChartProps = {
  bars: PriceBar[];
  variant: ChartVariant;
  showVolume: boolean;
  timeVisible: boolean;
};

export const CandlestickChart = React.memo(function CandlestickChart({
  bars,
  variant,
  showVolume,
  timeVisible
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paneContainerRefs = useRef<Partial<Record<PaneIndicator, HTMLDivElement | null>>>({});

  const { activeIndicators, settings } = useIndicatorStore();
  const activePaneIndicators = useMemo(
    () => PANE_INDICATORS.filter((indicator) => activeIndicators.has(indicator.id)).map((indicator) => indicator.id as PaneIndicator),
    [activeIndicators]
  );

  useEffect(() => {
    if (!containerRef.current || bars.length === 0) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 420,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#95A2BF"
      },
      grid: {
        vertLines: { color: "rgba(148, 163, 184, 0.08)" },
        horzLines: { color: "rgba(148, 163, 184, 0.08)" }
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: "rgba(148, 163, 184, 0.18)" },
      timeScale: {
        borderColor: "rgba(148, 163, 184, 0.18)",
        timeVisible,
        secondsVisible: false
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true
      }
    });

    const candleData: CandlestickData[] = bars.map((bar) => ({
      time: bar.time as UTCTimestamp,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close
    }));

    const mainSeries = variant === "candles" 
      ? chart.addCandlestickSeries({
          upColor: "#31C48D",
          downColor: "#F05252",
          borderVisible: false,
          wickUpColor: "#31C48D",
          wickDownColor: "#F05252"
        })
      : chart.addBarSeries({ upColor: "#31C48D", downColor: "#F05252", thinBars: false });
    
    const barData: BarData[] = bars.map((bar) => ({
      time: bar.time as UTCTimestamp,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close
    }));

    mainSeries.setData(variant === "candles" ? candleData : barData);

    if (showVolume) {
      const volSeries = chart.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "",
        color: "rgba(87, 117, 255, 0.55)"
      });
      volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.74, bottom: 0 } });
      volSeries.setData(bars.map((bar) => ({
        time: bar.time as UTCTimestamp,
        value: bar.volume,
        color: bar.close >= bar.open ? "rgba(49, 196, 141, 0.35)" : "rgba(240, 82, 82, 0.35)"
      })));
    }

    if (activeIndicators.has("EMA")) {
      const emaLine = chart.addLineSeries({ color: "#5E8CFF", lineWidth: 2, title: `EMA ${settings.emaPeriod}` });
      emaLine.setData(calculateEMA(bars, settings.emaPeriod));
    }
    if (activeIndicators.has("SMA")) {
      const smaLine = chart.addLineSeries({ color: "#F59E0B", lineWidth: 2, title: `SMA ${settings.smaPeriod}` });
      smaLine.setData(calculateSMA(bars, settings.smaPeriod));
    }
    if (activeIndicators.has("VWAP")) {
      const vwapLine = chart.addLineSeries({ color: "#26D9A5", lineWidth: 2, lineStyle: LineStyle.Dashed, title: "VWAP" });
      vwapLine.setData(calculateVWAP(bars));
    }
    if (activeIndicators.has("BB")) {
      const { upper, middle, lower } = calculateBollingerBands(
        bars,
        settings.bollingerPeriod,
        settings.bollingerStdDev
      );
      const upperLine = chart.addLineSeries({ color: "rgba(167, 139, 250, 0.70)", lineWidth: 1, title: "BB Upper" });
      const middleLine = chart.addLineSeries({
        color: "rgba(167, 139, 250, 0.45)",
        lineWidth: 1,
        lineStyle: LineStyle.Dotted,
        title: "BB Mid"
      });
      const lowerLine = chart.addLineSeries({ color: "rgba(167, 139, 250, 0.70)", lineWidth: 1, title: "BB Lower" });
      upperLine.setData(upper);
      middleLine.setData(middle);
      lowerLine.setData(lower);
    }

    const paneCharts = activePaneIndicators
      .map((indicator) => {
        const container = paneContainerRefs.current[indicator];
        return container ? createPaneChart(container, indicator, bars, settings) : null;
      })
      .filter((paneChart): paneChart is IChartApi => Boolean(paneChart));

    chart.timeScale().fitContent();

    paneCharts.forEach((paneChart) => paneChart.timeScale().fitContent());

    const syncPanes = () => {
      const range = chart.timeScale().getVisibleRange();
      if (range) {
        paneCharts.forEach((paneChart) => paneChart.timeScale().setVisibleRange(range));
      }
    };

    chart.timeScale().subscribeVisibleTimeRangeChange(syncPanes);
    syncPanes();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) chart.applyOptions({ width: entry.contentRect.width });
        activePaneIndicators.forEach((indicator, index) => {
          if (entry.target === paneContainerRefs.current[indicator]) {
            paneCharts[index]?.applyOptions({ width: entry.contentRect.width });
          }
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    activePaneIndicators.forEach((indicator) => {
      const container = paneContainerRefs.current[indicator];
      if (container) {
        resizeObserver.observe(container);
      }
    });

    return () => {
      resizeObserver.disconnect();
      chart.timeScale().unsubscribeVisibleTimeRangeChange(syncPanes);
      chart.remove();
      paneCharts.forEach((paneChart) => paneChart.remove());
    };
  }, [bars, showVolume, timeVisible, variant, activeIndicators, settings, activePaneIndicators]);

  if (bars.length === 0) {
    return <div className="h-[420px] rounded-3xl bg-white/[0.03]" />;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div ref={containerRef} className="h-[420px] w-full" />

      {activePaneIndicators.map((indicator) => {
        const definition = getIndicatorDefinition(indicator);
        const label = getPaneLabel(indicator, settings);

        return (
          <div key={indicator} className="relative w-full border-t border-white/8 pt-2">
            <div
              className={cn(
                "pointer-events-none absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-background/80 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground backdrop-blur"
              )}
            >
              <span className="mr-2 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: definition?.color }} />
              {label}
            </div>
            <div
              ref={(element) => {
                paneContainerRefs.current[indicator] = element;
              }}
              className="h-[148px] w-full"
            />
          </div>
        );
      })}
    </div>
  );
});

function createPaneChart(
  container: HTMLDivElement,
  indicator: PaneIndicator,
  bars: PriceBar[],
  settings: ReturnType<typeof useIndicatorStore.getState>["settings"]
) {
  const chart = createChart(container, {
    width: container.clientWidth,
    height: 148,
    layout: {
      background: { type: ColorType.Solid, color: "transparent" },
      textColor: "#95A2BF"
    },
    grid: {
      vertLines: { color: "rgba(148, 163, 184, 0.08)" },
      horzLines: { color: "rgba(148, 163, 184, 0.08)" }
    },
    crosshair: {
      mode: CrosshairMode.Normal
    },
    rightPriceScale: {
      borderColor: "rgba(148, 163, 184, 0.18)"
    },
    timeScale: {
      borderColor: "rgba(148, 163, 184, 0.18)",
      visible: false
    },
    handleScroll: {
      mouseWheel: true,
      pressedMouseMove: true,
      horzTouchDrag: true,
      vertTouchDrag: false
    },
    handleScale: {
      axisPressedMouseMove: false,
      mouseWheel: true,
      pinch: true
    }
  });

  switch (indicator) {
    case "RSI": {
      const line = chart.addLineSeries({ color: "#F97316", lineWidth: 2, title: `RSI ${settings.rsiPeriod}` });
      line.setData(calculateRSI(bars, settings.rsiPeriod));
      addGuideLine(chart, bars, 70);
      addGuideLine(chart, bars, 30);
      break;
    }
    case "MACD": {
      const { macdLine, signalLine, histogram } = calculateMACD(
        bars,
        settings.macdFast,
        settings.macdSlow,
        settings.macdSignal
      );
      const histogramSeries = chart.addHistogramSeries({ color: "#26a69a", priceLineVisible: false });
      histogramSeries.setData(histogram);

      const macdSeries = chart.addLineSeries({ color: "#60A5FA", lineWidth: 2, title: "MACD" });
      const signalSeries = chart.addLineSeries({ color: "#F59E0B", lineWidth: 1, title: "Signal" });
      macdSeries.setData(macdLine);
      signalSeries.setData(signalLine);
      addGuideLine(chart, bars, 0);
      break;
    }
    case "ADX": {
      const line = chart.addLineSeries({ color: "#22D3EE", lineWidth: 2, title: `ADX ${settings.adxPeriod}` });
      line.setData(calculateADX(bars, settings.adxPeriod));
      addGuideLine(chart, bars, 25);
      break;
    }
    case "MFI": {
      const line = chart.addLineSeries({ color: "#34D399", lineWidth: 2, title: `MFI ${settings.mfiPeriod}` });
      line.setData(calculateMFI(bars, settings.mfiPeriod));
      addGuideLine(chart, bars, 80);
      addGuideLine(chart, bars, 20);
      break;
    }
    case "OBV": {
      const line = chart.addLineSeries({ color: "#F472B6", lineWidth: 2, title: "OBV" });
      line.setData(calculateOBV(bars));
      break;
    }
  }

  return chart;
}

function addGuideLine(chart: IChartApi, bars: PriceBar[], value: number) {
  const guideLine = chart.addLineSeries({
    color: "rgba(255,255,255,0.22)",
    lineWidth: 1,
    lineStyle: LineStyle.Dashed,
    lastValueVisible: false,
    priceLineVisible: false
  });

  guideLine.setData(
    bars.map((bar) => ({
      time: bar.time as UTCTimestamp,
      value
    }))
  );
}

function getPaneLabel(
  indicator: PaneIndicator,
  settings: ReturnType<typeof useIndicatorStore.getState>["settings"]
) {
  switch (indicator) {
    case "RSI":
      return `RSI ${settings.rsiPeriod}`;
    case "MACD":
      return `MACD ${settings.macdFast}/${settings.macdSlow}/${settings.macdSignal}`;
    case "ADX":
      return `ADX ${settings.adxPeriod}`;
    case "MFI":
      return `MFI ${settings.mfiPeriod}`;
    case "OBV":
      return "OBV";
  }
}
