"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ColorType,
  CrosshairMode,
  createChart,
  type BarData,
  type CandlestickData,
  type HistogramData,
  type UTCTimestamp,
  type IChartApi,
  type ISeriesApi
} from "lightweight-charts";

import type { PriceBar } from "@/types/stock";
import { useIndicatorStore } from "@/features/indicators/store/indicator-store";
import { calculateEMA, calculateSMA, calculateVWAP, calculateBollingerBands, calculateRSI, calculateMACD } from "@/features/indicators/lib/calculations";

type ChartVariant = "candles" | "ohlc";

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
  const rsiContainerRef = useRef<HTMLDivElement | null>(null);
  const macdContainerRef = useRef<HTMLDivElement | null>(null);
  
  const mainChartRef = useRef<IChartApi | null>(null);
  const rsiChartRef = useRef<IChartApi | null>(null);
  const macdChartRef = useRef<IChartApi | null>(null);

  const { activeIndicators, settings } = useIndicatorStore();

  useEffect(() => {
    if (!containerRef.current || bars.length === 0) return;

    // --- MAIN CHART ---
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
      }
    });
    mainChartRef.current = chart;

    const candleData: CandlestickData[] = bars.map((bar) => ({
      time: bar.time as UTCTimestamp,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close
    }));

    const mainSeries = variant === "candles" 
      ? chart.addCandlestickSeries({ upColor: "#31C48D", downColor: "#F05252", borderVisible: false, wickUpColor: "#31C48D", wickDownColor: "#F05252" })
      : chart.addBarSeries({ upColor: "#31C48D", downColor: "#F05252" });
    
    mainSeries.setData(variant === "candles" ? candleData : bars.map(b => ({ ...b, time: b.time as UTCTimestamp })));

    if (showVolume) {
      const volSeries = chart.addHistogramSeries({ priceFormat: { type: "volume" }, color: "rgba(87, 117, 255, 0.55)" });
      volSeries.priceScale().applyOptions({ scaleMargins: { top: 0.74, bottom: 0 } });
      volSeries.setData(bars.map((bar) => ({
        time: bar.time as UTCTimestamp,
        value: bar.volume,
        color: bar.close >= bar.open ? "rgba(49, 196, 141, 0.35)" : "rgba(240, 82, 82, 0.35)"
      })));
    }

    // Overlays
    if (activeIndicators.has("EMA")) {
      const emaLine = chart.addLineSeries({ color: "#2962FF", lineWidth: 2 });
      emaLine.setData(calculateEMA(bars, settings.emaPeriod));
    }
    if (activeIndicators.has("SMA")) {
      const smaLine = chart.addLineSeries({ color: "#FF6D00", lineWidth: 2 });
      smaLine.setData(calculateSMA(bars, settings.smaPeriod));
    }
    if (activeIndicators.has("VWAP")) {
      const vwapLine = chart.addLineSeries({ color: "#9C27B0", lineWidth: 2, lineStyle: 2 });
      vwapLine.setData(calculateVWAP(bars));
    }
    if (activeIndicators.has("BB")) {
      const { upper, lower } = calculateBollingerBands(bars, settings.smaPeriod, 2);
      const upperLine = chart.addLineSeries({ color: "rgba(41, 98, 255, 0.5)", lineWidth: 1 });
      const lowerLine = chart.addLineSeries({ color: "rgba(41, 98, 255, 0.5)", lineWidth: 1 });
      upperLine.setData(upper);
      lowerLine.setData(lower);
    }

    // --- RSI CHART ---
    if (activeIndicators.has("RSI") && rsiContainerRef.current) {
      const rsiChart = createChart(rsiContainerRef.current, {
        width: rsiContainerRef.current.clientWidth,
        height: 150,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#95A2BF" },
        grid: { vertLines: { color: "rgba(148, 163, 184, 0.08)" }, horzLines: { color: "rgba(148, 163, 184, 0.08)" } },
        timeScale: { visible: false },
        rightPriceScale: { borderColor: "rgba(148, 163, 184, 0.18)" }
      });
      rsiChartRef.current = rsiChart;
      const rsiLine = rsiChart.addLineSeries({ color: "#FF9800", lineWidth: 2 });
      rsiLine.setData(calculateRSI(bars, settings.rsiPeriod));
      
      // Top and bottom boundary lines
      const topBoundary = rsiChart.addLineSeries({ color: "rgba(255,255,255,0.2)", lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false });
      const bottomBoundary = rsiChart.addLineSeries({ color: "rgba(255,255,255,0.2)", lineWidth: 1, lineStyle: 2, lastValueVisible: false, priceLineVisible: false });
      topBoundary.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: 70 })));
      bottomBoundary.setData(bars.map(b => ({ time: b.time as UTCTimestamp, value: 30 })));

      // Sync visible time range
      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (range) rsiChart.timeScale().setVisibleRange(range);
      });
      rsiChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (range) chart.timeScale().setVisibleRange(range);
      });
    }

    // --- MACD CHART ---
    if (activeIndicators.has("MACD") && macdContainerRef.current) {
      const macdChart = createChart(macdContainerRef.current, {
        width: macdContainerRef.current.clientWidth,
        height: 150,
        layout: { background: { type: ColorType.Solid, color: "transparent" }, textColor: "#95A2BF" },
        grid: { vertLines: { color: "rgba(148, 163, 184, 0.08)" }, horzLines: { color: "rgba(148, 163, 184, 0.08)" } },
        timeScale: { visible: false },
        rightPriceScale: { borderColor: "rgba(148, 163, 184, 0.18)" }
      });
      macdChartRef.current = macdChart;
      
      const { macdLine, signalLine, histogram } = calculateMACD(bars, settings.macdFast, settings.macdSlow, settings.macdSignal);
      
      const histSeries = macdChart.addHistogramSeries({ color: "#26a69a" });
      histSeries.setData(histogram);
      
      const mLine = macdChart.addLineSeries({ color: "#2962FF", lineWidth: 2 });
      const sLine = macdChart.addLineSeries({ color: "#FF6D00", lineWidth: 2 });
      mLine.setData(macdLine);
      sLine.setData(signalLine);

      chart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (range) macdChart.timeScale().setVisibleRange(range);
      });
      macdChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (range) chart.timeScale().setVisibleRange(range);
      });
    }

    chart.timeScale().fitContent();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) chart.applyOptions({ width: entry.contentRect.width });
        if (entry.target === rsiContainerRef.current && rsiChartRef.current) rsiChartRef.current.applyOptions({ width: entry.contentRect.width });
        if (entry.target === macdContainerRef.current && macdChartRef.current) macdChartRef.current.applyOptions({ width: entry.contentRect.width });
      }
    });

    resizeObserver.observe(containerRef.current);
    if (rsiContainerRef.current) resizeObserver.observe(rsiContainerRef.current);
    if (macdContainerRef.current) resizeObserver.observe(macdContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      if (rsiChartRef.current) rsiChartRef.current.remove();
      if (macdChartRef.current) macdChartRef.current.remove();
    };
  }, [bars, showVolume, timeVisible, variant, activeIndicators, settings]);

  if (bars.length === 0) {
    return <div className="h-[420px] rounded-3xl bg-white/[0.03]" />;
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <div ref={containerRef} className="h-[420px] w-full relative" />
      
      {activeIndicators.has("RSI") && (
        <div className="w-full relative border-t border-[#2A2E39] pt-2">
          <div className="absolute top-4 left-4 z-10 text-xs font-semibold text-slate-400">RSI ({settings.rsiPeriod})</div>
          <div ref={rsiContainerRef} className="h-[150px] w-full" />
        </div>
      )}
      
      {activeIndicators.has("MACD") && (
        <div className="w-full relative border-t border-[#2A2E39] pt-2">
          <div className="absolute top-4 left-4 z-10 text-xs font-semibold text-slate-400">MACD</div>
          <div ref={macdContainerRef} className="h-[150px] w-full" />
        </div>
      )}
    </div>
  );
});
