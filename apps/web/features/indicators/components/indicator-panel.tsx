"use client";

import { SlidersHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  OVERLAY_INDICATORS,
  PANE_INDICATORS,
  getIndicatorDefinition
} from "@/features/indicators/lib/indicator-definitions";
import { useTechnicalIndicators } from "@/features/indicators/hooks/use-technical-indicators";
import { useIndicatorStore, type IndicatorType } from "@/features/indicators/store/indicator-store";
import { cn } from "@/lib/utils";
import type { IndicatorSnapshot } from "@/types/technical";
import { formatCompactNumber, formatNumber } from "@/utils/formatters";

type IndicatorPanelProps = {
  ticker: string;
};

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

export function IndicatorPanel({ ticker }: IndicatorPanelProps) {
  const { activeIndicators, settings, toggleIndicator, updateSettings } = useIndicatorStore();
  const { data: snapshot, isLoading } = useTechnicalIndicators(ticker);
  const activeIds = Array.from(activeIndicators);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          Indicator Panel
        </CardTitle>
        <div className="flex flex-wrap gap-2">
          {activeIds.length === 0 ? (
            <span className="text-xs text-muted-foreground">No active indicators</span>
          ) : (
            activeIds.map((indicatorId) => {
              const definition = getIndicatorDefinition(indicatorId);

              return definition ? (
                <Badge key={indicatorId} variant="secondary" className="gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: definition.color }} />
                  {definition.shortLabel}
                  {snapshot ? <span className="text-muted-foreground">{getLatestValue(snapshot, indicatorId)}</span> : null}
                </Badge>
              ) : null;
            })
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Chart Overlays</h4>
          <div className="grid grid-cols-2 gap-2">
            {OVERLAY_INDICATORS.map((indicator) => {
              const isActive = activeIndicators.has(indicator.id);
              const Icon = indicator.icon;

              return (
                <Button
                  key={indicator.id}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator.id)}
                  className="justify-start rounded-xl"
                >
                  <Icon className="h-4 w-4" />
                  {indicator.shortLabel}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Lower Panels</h4>
          <div className="grid grid-cols-2 gap-2">
            {PANE_INDICATORS.map((indicator) => {
              const isActive = activeIndicators.has(indicator.id);
              const Icon = indicator.icon;

              return (
                <Button
                  key={indicator.id}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator.id)}
                  className="justify-start rounded-xl"
                >
                  <Icon className="h-4 w-4" />
                  {indicator.shortLabel}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-white/8 pt-4">
          <h4 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Parameters</h4>

          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="EMA" min={2} max={200} value={settings.emaPeriod} onChange={(emaPeriod) => updateSettings({ emaPeriod })} />
            <NumberInput label="SMA" min={2} max={200} value={settings.smaPeriod} onChange={(smaPeriod) => updateSettings({ smaPeriod })} />
            <NumberInput
              label="BB Period"
              min={2}
              max={200}
              value={settings.bollingerPeriod}
              onChange={(bollingerPeriod) => updateSettings({ bollingerPeriod })}
            />
            <NumberInput
              label="BB Dev"
              min={0.5}
              max={5}
              step={0.5}
              value={settings.bollingerStdDev}
              onChange={(bollingerStdDev) => updateSettings({ bollingerStdDev })}
            />
            <NumberInput label="RSI" min={2} max={100} value={settings.rsiPeriod} onChange={(rsiPeriod) => updateSettings({ rsiPeriod })} />
            <NumberInput label="ADX" min={2} max={100} value={settings.adxPeriod} onChange={(adxPeriod) => updateSettings({ adxPeriod })} />
            <NumberInput label="MFI" min={2} max={100} value={settings.mfiPeriod} onChange={(mfiPeriod) => updateSettings({ mfiPeriod })} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <NumberInput label="MACD F" min={2} max={100} value={settings.macdFast} onChange={(macdFast) => updateSettings({ macdFast })} />
            <NumberInput label="MACD S" min={2} max={200} value={settings.macdSlow} onChange={(macdSlow) => updateSettings({ macdSlow })} />
            <NumberInput
              label="Signal"
              min={2}
              max={100}
              value={settings.macdSignal}
              onChange={(macdSignal) => updateSettings({ macdSignal })}
            />
          </div>
        </div>

        <div className={cn("rounded-2xl border border-white/8 bg-white/[0.03] p-4", isLoading && "animate-pulse")}>
          <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Backend Snapshot</div>
          <div className="mt-2 text-sm text-white">
            {snapshot ? `${ticker.toUpperCase()} indicators synced` : "Waiting for technical engine"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NumberInput({ label, value, min = 1, max = 300, step = 1, onChange }: NumberInputProps) {
  return (
    <label className="space-y-1.5">
      <span className="block text-xs text-muted-foreground">{label}</span>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);

          if (Number.isFinite(nextValue)) {
            onChange(Math.min(max, Math.max(min, nextValue)));
          }
        }}
        className="h-9 rounded-xl text-xs"
      />
    </label>
  );
}

function getLatestValue(snapshot: IndicatorSnapshot, indicator: IndicatorType) {
  switch (indicator) {
    case "EMA":
      return formatNullable(snapshot.ema.ema_20);
    case "SMA":
      return formatNullable(snapshot.sma.sma_20);
    case "VWAP":
      return formatNullable(snapshot.vwap);
    case "BB":
      return formatNullable(snapshot.bollinger_bands.mid_band);
    case "RSI":
      return formatNullable(snapshot.rsi);
    case "MACD":
      return formatNullable(snapshot.macd.macd);
    case "ADX":
      return formatNullable(snapshot.adx);
    case "MFI":
      return formatNullable(snapshot.mfi);
    case "OBV":
      return snapshot.obv === null ? "-" : formatCompactNumber(snapshot.obv);
    default:
      return "-";
  }
}

function formatNullable(value: number | null) {
  return value === null ? "-" : formatNumber(value);
}
