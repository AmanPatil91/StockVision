# StockVision

AI stock intelligence platform foundation for professional market research and technical analysis.

## Progress

Overall roadmap progress: **20%**

Completed:

- Phase 1: Core dashboard, stock pages, watchlist, mock data layer, FastAPI foundation.
- Phase 2: Frontend technical-analysis experience connected to the backend technical-analysis API.

Remaining:

- Phase 3: News Intelligence
- Phase 4: Feature Engineering
- Phase 5: Machine Learning Predictions
- Phase 6: LLM Explanations
- Phase 7: Portfolio Analytics
- Phase 8: Backtesting
- Phase 9: Alerts
- Phase 10: AI Chat Assistant

## Completed Frontend Work

### Phase 1 Dashboard

- Built the Next.js 15 App Router frontend shell with a dark professional trading-dashboard UI.
- Added top navigation, search, market status, theme toggle, user menu, and sidebar navigation.
- Added stock detail pages, company summary cards, quick stats, watchlist persistence, and mock market data.
- Added reusable UI primitives, feature modules, services, repositories, hooks, and typed domain contracts.
- Added a TradingView Lightweight Charts candlestick/OHLC chart with volume, timeframes, zoom, pan, crosshair, and responsive resizing.

### Phase 2 Technical Indicators

- Added a responsive Indicator Panel using the existing shadcn-style UI components.
- Added enable/disable controls for EMA, SMA, VWAP, Bollinger Bands, RSI, MACD, ADX, MFI, and OBV.
- Added configurable parameters for EMA, SMA, Bollinger Bands, RSI, MACD, ADX, and MFI.
- Displayed active indicators with latest backend snapshot values from the technical-analysis service layer.
- Overlaid EMA, SMA, VWAP, and Bollinger Bands on the main candlestick chart.
- Added synchronized lower panels for RSI, MACD, ADX, MFI, and OBV.
- Connected frontend technical signals and indicator snapshots to backend APIs through `technicalService`.

## Local Development

Frontend:

```bash
npm run dev:web
```

Backend:

```bash
cd apps/api
.\.venv\Scripts\uvicorn app.main:app --reload
```

Verification:

```bash
npm run typecheck:web
npm run lint:web
npm run build:web
```

## Changelog

### 2026-07-12

- Conducted full project audit after AI handover.
- Verified that Phase 1 and Phase 2 are fully complete and functional.
- Verified frontend type safety, linting, and build pipeline.
- Synchronized technical indicators between frontend and backend.

### 2026-07-11

- Completed Phase 2 frontend technical indicators.
- Added reusable indicator definitions, expanded indicator settings, and backend-connected indicator hooks.
- Added EMA, SMA, VWAP, and Bollinger Bands chart overlays.
- Added RSI, MACD, ADX, MFI, and OBV synchronized lower chart panels.
- Reworked the Indicator Panel to support active indicator display, parameter editing, and backend snapshot status.
- Verified typecheck, lint, production build, backend TA endpoints, and browser rendering on `/stocks/RELIANCE`.

### 2026-06-27

- Completed Phase 1 project architecture and full-stack scaffold.
- Added the stock dashboard, stock detail pages, mock data layer, watchlist, search, layout shell, and FastAPI foundation.
