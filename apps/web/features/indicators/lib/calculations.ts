import type { PriceBar } from "@/types/stock";
import type { HistogramData, UTCTimestamp } from "lightweight-charts";

export interface LineData {
  time: UTCTimestamp;
  value: number;
}

function round(value: number, precision = 4) {
  return Number(value.toFixed(precision));
}

export function calculateSMA(bars: PriceBar[], period: number): LineData[] {
  const result: LineData[] = [];
  for (let i = period - 1; i < bars.length; i++) {
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += bars[i - j].close;
    }
    result.push({
      time: bars[i].time as UTCTimestamp,
      value: round(sum / period),
    });
  }
  return result;
}

export function calculateEMA(bars: PriceBar[], period: number): LineData[] {
  const result: LineData[] = [];
  if (bars.length < period) return result;

  const k = 2 / (period + 1);
  let ema = bars[period - 1].close; // seed with simple closing price (simplification)
  // a more accurate seed is the SMA of the first 'period' elements
  let sum = 0;
  for (let i = 0; i < period; i++) sum += bars[i].close;
  ema = sum / period;

  result.push({ time: bars[period - 1].time as UTCTimestamp, value: round(ema) });

  for (let i = period; i < bars.length; i++) {
    ema = bars[i].close * k + ema * (1 - k);
    result.push({ time: bars[i].time as UTCTimestamp, value: round(ema) });
  }
  return result;
}

export function calculateVWAP(bars: PriceBar[]): LineData[] {
  const result: LineData[] = [];
  let cumVol = 0;
  let cumVolPrice = 0;
  
  for (let i = 0; i < bars.length; i++) {
    const typicalPrice = (bars[i].high + bars[i].low + bars[i].close) / 3;
    cumVol += bars[i].volume;
    cumVolPrice += typicalPrice * bars[i].volume;
    result.push({
      time: bars[i].time as UTCTimestamp,
      value: round(cumVol === 0 ? typicalPrice : cumVolPrice / cumVol),
    });
  }
  return result;
}

export function calculateBollingerBands(bars: PriceBar[], period: number = 20, multiplier: number = 2) {
  const upper: LineData[] = [];
  const lower: LineData[] = [];
  const middle = calculateSMA(bars, period);

  for (let i = period - 1; i < bars.length; i++) {
    let sumSq = 0;
    const mean = middle[i - (period - 1)].value;
    for (let j = 0; j < period; j++) {
      sumSq += Math.pow(bars[i - j].close - mean, 2);
    }
    const stdDev = Math.sqrt(sumSq / period);
    upper.push({ time: bars[i].time as UTCTimestamp, value: round(mean + multiplier * stdDev) });
    lower.push({ time: bars[i].time as UTCTimestamp, value: round(mean - multiplier * stdDev) });
  }
  return { upper, middle, lower };
}

export function calculateRSI(bars: PriceBar[], period: number): LineData[] {
  const result: LineData[] = [];
  if (bars.length <= period) return result;

  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = bars[i].close - bars[i - 1].close;
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;

  let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
  let rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
  
  result.push({ time: bars[period].time as UTCTimestamp, value: round(rsi) });

  for (let i = period + 1; i < bars.length; i++) {
    const change = bars[i].close - bars[i - 1].close;
    let gain = 0;
    let loss = 0;
    if (change > 0) gain = change;
    else loss = -change;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsi = avgLoss === 0 ? 100 : 100 - 100 / (1 + rs);
    result.push({ time: bars[i].time as UTCTimestamp, value: round(rsi) });
  }
  
  return result;
}

export function calculateMACD(bars: PriceBar[], fast: number = 12, slow: number = 26, signal: number = 9) {
  const macdLine: LineData[] = [];
  const signalLine: LineData[] = [];
  const histogram: HistogramData[] = [];
  
  const emaFast = calculateEMA(bars, fast);
  const emaSlow = calculateEMA(bars, slow);
  
  // Create aligned MACD line
  for (let i = 0; i < emaSlow.length; i++) {
    const time = emaSlow[i].time as number;
    const fastVal = emaFast.find(e => e.time === time)?.value;
    if (fastVal !== undefined) {
      macdLine.push({ time: time as UTCTimestamp, value: round(fastVal - emaSlow[i].value) });
    }
  }

  // Calculate Signal line (EMA of MACD line)
  if (macdLine.length >= signal) {
    const k = 2 / (signal + 1);
    let sum = 0;
    for (let i = 0; i < signal; i++) sum += macdLine[i].value;
    let ema = sum / signal;
    
    signalLine.push({ time: macdLine[signal - 1].time, value: round(ema) });
    
    for (let i = signal; i < macdLine.length; i++) {
      ema = macdLine[i].value * k + ema * (1 - k);
      signalLine.push({ time: macdLine[i].time, value: round(ema) });
    }
  }

  // Histogram
  for (let i = 0; i < signalLine.length; i++) {
    const s = signalLine[i];
    const m = macdLine.find(ml => ml.time === s.time);
    if (m) {
      const diff = m.value - s.value;
      const prevDiff = i > 0 ? (macdLine.find(ml => ml.time === signalLine[i-1].time)?.value || 0) - signalLine[i-1].value : 0;
      histogram.push({
        time: s.time,
        value: round(diff),
        color: diff >= 0 
          ? (diff >= prevDiff ? "#26a69a" : "#b2dfdb") 
          : (diff <= prevDiff ? "#ef5350" : "#ffcdd2")
      });
    }
  }
  
  return { macdLine, signalLine, histogram };
}

export function calculateADX(bars: PriceBar[], period = 14): LineData[] {
  if (bars.length <= period * 2) {
    return [];
  }

  const trueRanges: number[] = [];
  const plusDM: number[] = [];
  const minusDM: number[] = [];

  for (let i = 1; i < bars.length; i++) {
    const highDiff = bars[i].high - bars[i - 1].high;
    const lowDiff = bars[i - 1].low - bars[i].low;

    trueRanges.push(
      Math.max(
        bars[i].high - bars[i].low,
        Math.abs(bars[i].high - bars[i - 1].close),
        Math.abs(bars[i].low - bars[i - 1].close)
      )
    );
    plusDM.push(highDiff > lowDiff && highDiff > 0 ? highDiff : 0);
    minusDM.push(lowDiff > highDiff && lowDiff > 0 ? lowDiff : 0);
  }

  const dxValues: LineData[] = [];

  for (let i = period - 1; i < trueRanges.length; i++) {
    const tr = trueRanges.slice(i - period + 1, i + 1).reduce((sum, value) => sum + value, 0);
    const plus = plusDM.slice(i - period + 1, i + 1).reduce((sum, value) => sum + value, 0);
    const minus = minusDM.slice(i - period + 1, i + 1).reduce((sum, value) => sum + value, 0);

    if (tr === 0) {
      continue;
    }

    const plusDI = (plus / tr) * 100;
    const minusDI = (minus / tr) * 100;
    const denominator = plusDI + minusDI;

    if (denominator === 0) {
      continue;
    }

    dxValues.push({
      time: bars[i + 1].time as UTCTimestamp,
      value: Math.abs((plusDI - minusDI) / denominator) * 100
    });
  }

  return calculateSMAFromLine(dxValues, period);
}

export function calculateMFI(bars: PriceBar[], period = 14): LineData[] {
  if (bars.length <= period) {
    return [];
  }

  const moneyFlows = bars.map((bar, index) => {
    const typicalPrice = (bar.high + bar.low + bar.close) / 3;
    const previousTypicalPrice =
      index === 0 ? typicalPrice : (bars[index - 1].high + bars[index - 1].low + bars[index - 1].close) / 3;

    return {
      time: bar.time as UTCTimestamp,
      positive: typicalPrice > previousTypicalPrice ? typicalPrice * bar.volume : 0,
      negative: typicalPrice < previousTypicalPrice ? typicalPrice * bar.volume : 0
    };
  });

  const result: LineData[] = [];

  for (let i = period; i < moneyFlows.length; i++) {
    const window = moneyFlows.slice(i - period + 1, i + 1);
    const positiveFlow = window.reduce((sum, value) => sum + value.positive, 0);
    const negativeFlow = window.reduce((sum, value) => sum + value.negative, 0);
    const moneyFlowRatio = negativeFlow === 0 ? 100 : positiveFlow / negativeFlow;

    result.push({
      time: moneyFlows[i].time,
      value: round(100 - 100 / (1 + moneyFlowRatio))
    });
  }

  return result;
}

export function calculateOBV(bars: PriceBar[]): LineData[] {
  if (bars.length === 0) {
    return [];
  }

  let obv = 0;

  return bars.map((bar, index) => {
    if (index > 0) {
      if (bar.close > bars[index - 1].close) {
        obv += bar.volume;
      } else if (bar.close < bars[index - 1].close) {
        obv -= bar.volume;
      }
    }

    return {
      time: bar.time as UTCTimestamp,
      value: obv
    };
  });
}

function calculateSMAFromLine(values: LineData[], period: number): LineData[] {
  const result: LineData[] = [];

  for (let i = period - 1; i < values.length; i++) {
    const window = values.slice(i - period + 1, i + 1);
    const sum = window.reduce((total, item) => total + item.value, 0);

    result.push({
      time: values[i].time,
      value: round(sum / period)
    });
  }

  return result;
}
