"use client";

import { useIndicatorStore, type IndicatorType } from "../store/indicator-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const OVERLAY_INDICATORS: { label: string; value: IndicatorType }[] = [
  { label: "EMA", value: "EMA" },
  { label: "SMA", value: "SMA" },
  { label: "VWAP", value: "VWAP" },
  { label: "Bollinger Bands", value: "BB" }
];

const OSCILLATOR_INDICATORS: { label: string; value: IndicatorType }[] = [
  { label: "RSI", value: "RSI" },
  { label: "MACD", value: "MACD" }
];

export function IndicatorPanel() {
  const { activeIndicators, settings, toggleIndicator, updateSettings } = useIndicatorStore();

  return (
    <Card className="w-full bg-[#1A1D24] border-[#2A2E39] text-white">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-[#95A2BF]">Technical Indicators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Overlay Indicators */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Chart Overlays</h4>
          <div className="grid grid-cols-2 gap-2">
            {OVERLAY_INDICATORS.map((indicator) => {
              const isActive = activeIndicators.has(indicator.value);
              return (
                <Button
                  key={indicator.value}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator.value)}
                  className={`justify-start ${isActive ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-[#2A2E39] text-slate-300 hover:bg-[#343B4A]"}`}
                >
                  {indicator.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Oscillators */}
        <div className="space-y-3">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Lower Panels</h4>
          <div className="grid grid-cols-2 gap-2">
            {OSCILLATOR_INDICATORS.map((indicator) => {
              const isActive = activeIndicators.has(indicator.value);
              return (
                <Button
                  key={indicator.value}
                  variant={isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() => toggleIndicator(indicator.value)}
                  className={`justify-start ${isActive ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-[#2A2E39] text-slate-300 hover:bg-[#343B4A]"}`}
                >
                  {indicator.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-3 pt-4 border-t border-[#2A2E39]">
          <h4 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Settings</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">EMA Period</label>
              <Input 
                type="number" 
                value={settings.emaPeriod} 
                onChange={(e) => updateSettings({ emaPeriod: Number(e.target.value) || 20 })}
                className="h-8 bg-[#111318] border-[#2A2E39] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">SMA Period</label>
              <Input 
                type="number" 
                value={settings.smaPeriod} 
                onChange={(e) => updateSettings({ smaPeriod: Number(e.target.value) || 20 })}
                className="h-8 bg-[#111318] border-[#2A2E39] text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">RSI Period</label>
              <Input 
                type="number" 
                value={settings.rsiPeriod} 
                onChange={(e) => updateSettings({ rsiPeriod: Number(e.target.value) || 14 })}
                className="h-8 bg-[#111318] border-[#2A2E39] text-xs"
              />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
