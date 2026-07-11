import type { MarketIndex } from "@/types/market";
import type { SearchSuggestion } from "@/types/search";
import type { PriceBar, StockDetail, StockOverview, Timeframe } from "@/types/stock";

type StockSeed = {
  ticker: string;
  name: string;
  exchange: "NSE" | "BSE";
  sector: string;
  industry: string;
  description: string;
  beta: number;
  marketCap: number;
  peRatio: number;
  eps: number;
  dividendYield: number;
  currency: string;
  currentPrice: number;
  change: number;
  volume: number;
  averageVolume: number;
  week52High: number;
  week52Low: number;
  chartSeed: number;
};

export const STOCK_SEEDS: StockSeed[] = [
  {
    ticker: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE",
    sector: "Energy",
    industry: "Oil, Gas & Petrochemicals",
    description: "Diversified conglomerate spanning energy, telecom, retail, and new energy infrastructure.",
    beta: 1.08,
    marketCap: 20100000000000,
    peRatio: 27.4,
    eps: 106.3,
    dividendYield: 0.36,
    currency: "INR",
    currentPrice: 2948.5,
    change: 34.8,
    volume: 7562000,
    averageVolume: 6823000,
    week52High: 3124.7,
    week52Low: 2220.3,
    chartSeed: 13
  },
  {
    ticker: "RPOWER",
    name: "Reliance Power",
    exchange: "NSE",
    sector: "Utilities",
    industry: "Power Generation",
    description: "Power generation and infrastructure operator focused on conventional and renewable assets.",
    beta: 1.42,
    marketCap: 126800000000,
    peRatio: 18.9,
    eps: 2.7,
    dividendYield: 0,
    currency: "INR",
    currentPrice: 42.75,
    change: -0.82,
    volume: 12842000,
    averageVolume: 10253000,
    week52High: 54.9,
    week52Low: 18.2,
    chartSeed: 7
  },
  {
    ticker: "RELINFRA",
    name: "Reliance Infrastructure",
    exchange: "NSE",
    sector: "Infrastructure",
    industry: "Engineering & Construction",
    description: "Engineering, EPC and infrastructure company with transportation and urban projects.",
    beta: 1.35,
    marketCap: 112400000000,
    peRatio: 21.3,
    eps: 11.2,
    dividendYield: 0,
    currency: "INR",
    currentPrice: 286.15,
    change: 4.55,
    volume: 4215000,
    averageVolume: 3641000,
    week52High: 352.4,
    week52Low: 145.9,
    chartSeed: 11
  },
  {
    ticker: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    sector: "Technology",
    industry: "IT Services & Consulting",
    description: "Large-cap global IT services, consulting, and business solutions provider.",
    beta: 0.88,
    marketCap: 14290000000000,
    peRatio: 31.5,
    eps: 126.2,
    dividendYield: 1.21,
    currency: "INR",
    currentPrice: 3988.65,
    change: 28.15,
    volume: 2584000,
    averageVolume: 2321000,
    week52High: 4268.3,
    week52Low: 3312.2,
    chartSeed: 17
  },
  {
    ticker: "INFY",
    name: "Infosys",
    exchange: "NSE",
    sector: "Technology",
    industry: "IT Services & Consulting",
    description: "Digital services leader with enterprise consulting, engineering, and transformation offerings.",
    beta: 0.94,
    marketCap: 7040000000000,
    peRatio: 29.2,
    eps: 57.9,
    dividendYield: 2.11,
    currency: "INR",
    currentPrice: 1736.35,
    change: -14.6,
    volume: 3928000,
    averageVolume: 4185000,
    week52High: 1890.8,
    week52Low: 1358.6,
    chartSeed: 19
  },
  {
    ticker: "HDFCBANK",
    name: "HDFC Bank",
    exchange: "NSE",
    sector: "Financial Services",
    industry: "Private Sector Bank",
    description: "Leading private bank with diversified lending, retail banking, and digital payments footprint.",
    beta: 0.82,
    marketCap: 13140000000000,
    peRatio: 20.8,
    eps: 81.5,
    dividendYield: 1.02,
    currency: "INR",
    currentPrice: 1708.4,
    change: 9.25,
    volume: 6157000,
    averageVolume: 5482000,
    week52High: 1880.5,
    week52Low: 1363.45,
    chartSeed: 23
  }
];

export const MARKET_INDICES: MarketIndex[] = [
  {
    symbol: "NIFTY 50",
    name: "Nifty 50",
    value: 24652.4,
    change: 168.7,
    percentChange: 0.69
  },
  {
    symbol: "SENSEX",
    name: "BSE Sensex",
    value: 80891.12,
    change: 451.55,
    percentChange: 0.56
  },
  {
    symbol: "BANKNIFTY",
    name: "Nifty Bank",
    value: 53212.6,
    change: -118.15,
    percentChange: -0.22
  }
];

function round(value: number, precision = 2) {
  return Number(value.toFixed(precision));
}

function buildOverview(seed: StockSeed): StockOverview {
  const previousClose = seed.currentPrice - seed.change;
  const percentChange = round((seed.change / previousClose) * 100);
  const open = round(previousClose * (1 + Math.sign(seed.change || 1) * 0.0035));
  const intradaySpread = Math.max(seed.currentPrice * 0.013, 0.8);
  const high = round(Math.max(open, seed.currentPrice) + intradaySpread);
  const low = round(Math.min(open, seed.currentPrice) - intradaySpread * 0.75);
  const close = seed.currentPrice;
  const vwap = round((open + high + low + close) / 4);

  return {
    profile: {
      ticker: seed.ticker,
      name: seed.name,
      exchange: seed.exchange,
      sector: seed.sector,
      industry: seed.industry,
      beta: seed.beta,
      currency: seed.currency,
      description: seed.description
    },
    quote: {
      ticker: seed.ticker,
      currentPrice: seed.currentPrice,
      change: round(seed.change),
      percentChange,
      previousClose: round(previousClose),
      open,
      high,
      low,
      close,
      vwap,
      volume: seed.volume,
      averageVolume: seed.averageVolume,
      week52High: seed.week52High,
      week52Low: seed.week52Low,
      updatedAt: new Date().toISOString()
    },
    summary: {
      marketCap: seed.marketCap,
      peRatio: seed.peRatio,
      eps: seed.eps,
      dividendYield: seed.dividendYield,
      sector: seed.sector,
      industry: seed.industry,
      beta: seed.beta
    }
  };
}

const stockOverviewMap = new Map(STOCK_SEEDS.map((seed) => [seed.ticker, buildOverview(seed)]));

function getSeriesConfig(timeframe: Timeframe) {
  switch (timeframe) {
    case "1D":
      return { bars: 78, stepMinutes: 5, volatility: 0.0035, trend: 0.0006 };
    case "5D":
      return { bars: 65, stepMinutes: 30, volatility: 0.005, trend: 0.00045 };
    case "1M":
      return { bars: 22, stepMinutes: 60 * 24, volatility: 0.0105, trend: 0.0007 };
    case "3M":
      return { bars: 66, stepMinutes: 60 * 24, volatility: 0.0115, trend: 0.00055 };
    case "6M":
      return { bars: 132, stepMinutes: 60 * 24, volatility: 0.012, trend: 0.0005 };
    case "1Y":
      return { bars: 252, stepMinutes: 60 * 24, volatility: 0.0125, trend: 0.00045 };
    case "5Y":
      return { bars: 260, stepMinutes: 60 * 24 * 7, volatility: 0.017, trend: 0.00035 };
    case "MAX":
      return { bars: 420, stepMinutes: 60 * 24 * 7, volatility: 0.019, trend: 0.00025 };
    default:
      return { bars: 66, stepMinutes: 60 * 24, volatility: 0.0115, trend: 0.00055 };
  }
}

const historyCache = new Map<string, PriceBar[]>();

export function getMockStockList() {
  return STOCK_SEEDS.map((seed) => stockOverviewMap.get(seed.ticker) as StockOverview);
}

export function getMockStockDetail(ticker: string): StockDetail | null {
  return stockOverviewMap.get(ticker.toUpperCase()) ?? null;
}

export function getMockPriceHistory(ticker: string, timeframe: Timeframe): PriceBar[] {
  const cacheKey = `${ticker}:${timeframe}`;
  const cached = historyCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const seed = STOCK_SEEDS.find((item) => item.ticker === ticker.toUpperCase());

  if (!seed) {
    return [];
  }

  const { bars, stepMinutes, volatility, trend } = getSeriesConfig(timeframe);
  const endTime = Math.floor(Date.now() / 1000);
  const stepSeconds = stepMinutes * 60;
  let previousClose = seed.currentPrice * (1 - bars * trend * 0.4);

  const history = Array.from({ length: bars }, (_, index) => {
    const time = endTime - (bars - index - 1) * stepSeconds;
    const cycle = Math.sin((index + seed.chartSeed) / 4.2) * volatility;
    const slope = (index - bars / 2) * trend;
    const open = previousClose;
    const close = Math.max(1, open * (1 + cycle + slope));
    const wickHigh = Math.max(open, close) * (1 + volatility * 1.8);
    const wickLow = Math.min(open, close) * (1 - volatility * 1.6);
    const volume = Math.round(seed.averageVolume * (0.7 + Math.abs(Math.sin((index + seed.chartSeed) / 3))));

    previousClose = close;

    return {
      time,
      open: round(open),
      high: round(wickHigh),
      low: round(wickLow),
      close: round(close),
      volume
    };
  });

  if (history.length > 0) {
    const last = history[history.length - 1];
    last.close = seed.currentPrice;
    last.high = round(Math.max(last.high, seed.currentPrice));
    last.low = round(Math.min(last.low, seed.currentPrice));
  }

  historyCache.set(cacheKey, history);
  return history;
}

export function getMockSearchSuggestions(query: string): SearchSuggestion[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  return STOCK_SEEDS.filter(
    (seed) =>
      seed.ticker.toLowerCase().includes(normalized) ||
      seed.name.toLowerCase().includes(normalized) ||
      seed.industry.toLowerCase().includes(normalized)
  )
    .slice(0, 6)
    .map((seed) => ({
      ticker: seed.ticker,
      name: seed.name,
      exchange: seed.exchange,
      sector: seed.sector,
      industry: seed.industry
    }));
}

