# Phase 1 Architecture

## Objective

Build the production-ready foundation of an AI Stock Intelligence Platform with a premium market dashboard experience, while intentionally limiting scope to:

- market dashboard shell
- stock detail page
- watchlist management
- search and navigation
- mock market data integration
- extensible charting foundation

Out of scope for Phase 1:

- AI prediction
- machine learning pipelines
- news intelligence
- portfolio analytics
- alerts
- assistant/chat workflows

## Architecture Principles

- Feature-first design with clear domain boundaries.
- Replaceable data sources through service and repository abstractions.
- Thin UI components and isolated business logic.
- Server components by default; client components only for interaction-heavy surfaces.
- Strict typing across UI, data models, API contracts, and state.
- Chart engine designed to accept overlays, indicators, and annotations later.
- Pages designed to accept pluggable widgets without layout refactors.
- Backend structured for future real-time and background processing expansion.

## Repository Topology

Recommended repository layout:

- `apps/web`: Next.js 15 frontend
- `apps/api`: FastAPI backend
- `docs`: architecture and engineering decisions

This keeps frontend and backend independently deployable while preserving a single product repository.

## System Overview

```text
Next.js Web App
  -> feature hooks
  -> application services
  -> repository interfaces
  -> mock repository implementations (Phase 1)

FastAPI API
  -> routers
  -> application services
  -> repositories
  -> PostgreSQL / Redis / external providers

Future
  -> indicators engine
  -> news intelligence services
  -> model inference services
  -> alerting pipelines
  -> portfolio analytics
```

## Frontend Architecture

### Rendering Strategy

- Use App Router with nested layouts.
- Render static shell and non-interactive content on the server when possible.
- Use client components for:
  - watchlist actions
  - search autocomplete
  - chart interactions
  - theme toggle
  - dropdown menus
- Use TanStack Query for async data orchestration even with mocks so real APIs can replace them without refactoring consumers.

### Frontend Layers

#### 1. App Layer

Responsible for routing, layouts, metadata, and page composition.

Examples:

- `app/(dashboard)/layout.tsx`
- `app/(dashboard)/page.tsx`
- `app/stocks/[ticker]/page.tsx`

#### 2. Feature Layer

Encapsulates domain behavior and screen-level composition.

Phase 1 feature modules:

- `market-overview`
- `stock-details`
- `watchlist`
- `search`
- `layout-shell`

Each feature owns:

- components
- hooks
- mappers
- constants
- local state if needed

#### 3. Shared UI Layer

Reusable display primitives and layout building blocks.

Examples:

- navigation
- sidebar
- stat cards
- price badges
- ticker avatars
- section headers
- loading states
- empty states

#### 4. Data Layer

Abstracted behind contracts so data providers are replaceable.

Structure:

- `services/`: application-facing orchestration
- `repositories/`: repository interfaces and implementations
- `types/`: domain contracts
- `hooks/`: React Query hooks

Flow:

```text
UI -> feature hook -> service -> repository interface -> mock repository
```

### Frontend State Strategy

Use the smallest reasonable state boundary:

- TanStack Query: server-like async data
- Zustand: local product state such as watchlist preferences, pinned favorites, UI panel state
- URL state: active ticker, timeframe, view context
- localStorage: watchlist persistence

Avoid pushing derived UI state into global stores.

### Charting Strategy

Build a chart module as a standalone feature boundary, not a page-specific component.

Phase 1 chart responsibilities:

- candlesticks
- OHLC data support
- volume series
- timeframe switching
- crosshair
- zoom and pan
- responsive resize

Future extension points:

- technical indicators
- drawing tools
- AI signal overlays
- event markers
- comparison series

Recommended internal split:

- `ChartContainer`
- `ChartToolbar`
- `ChartLegend`
- `useChartSeries`
- `useChartResize`
- `chart-adapters/lightweight-charts`

This prevents lock-in to a single chart rendering detail.

## Backend Architecture

### API Layering

Use explicit application boundaries:

- `api/routers`: request routing
- `core/`: config, security, settings
- `schemas/`: Pydantic request/response models
- `models/`: SQLAlchemy ORM models
- `services/`: business logic
- `repositories/`: persistence logic
- `db/`: session and base setup

Flow:

```text
router -> service -> repository -> database/provider
```

### Backend Domain Modules for Phase 1

- `stocks`
- `market`
- `watchlist`
- `search`
- `health`

Initial endpoints should be designed around these capabilities:

- stock lookup by ticker
- stock summary
- price history
- market status
- search suggestions
- watchlist CRUD

### Persistence Strategy

Phase 1 can operate with mocks at the UI layer, but the backend should still be designed for real persistence:

- PostgreSQL for stock metadata, watchlists, and user-linked preferences
- Redis optional for caching search suggestions, market snapshots, and hot ticker summaries

### Backend Extensibility

Future modules can be added without restructuring Phase 1:

- `indicators`
- `news`
- `predictions`
- `portfolio`
- `alerts`
- `explanations`
- `backtesting`

Each future module should follow the same router/service/repository contract.

## Data Contract Design

Create stable domain-first interfaces instead of UI-shaped objects.

Core Phase 1 entities:

- `Stock`
- `StockQuote`
- `PriceBar`
- `StockSummary`
- `StockStatistic`
- `SearchSuggestion`
- `WatchlistItem`
- `MarketStatus`

Important rule:

- components never hardcode mock objects
- mock data lives in repositories or dedicated mock sources
- services map raw provider output into domain contracts

## Navigation and Routing Model

Primary routes for Phase 1:

- `/`
- `/markets`
- `/watchlist`
- `/stocks/[ticker]`
- `/news`
- `/settings`

Routing should support future additions without changing the shell:

- `/stocks/[ticker]/indicators`
- `/stocks/[ticker]/analysis`
- `/portfolio`
- `/alerts`

## UI Architecture

### Design Direction

- dark mode first
- premium terminal-inspired market dashboard
- glassmorphism only for selected surfaces such as overlays, search, and floating controls
- dense but readable information hierarchy
- expressive typography and spacing
- motion used for context and focus, not decoration

### Layout Composition

Three-column desktop composition:

- left: navigation sidebar
- center: content and chart
- right: contextual quick statistics

Mobile behavior:

- collapsible sidebar
- right panel stacks below chart
- search remains globally accessible

## Non-Functional Requirements

- strict TypeScript in frontend
- linting and formatting from the start
- reusable design tokens
- loading, empty, and error states for every data widget
- accessible keyboard navigation for search and watchlist actions
- responsive behavior from first implementation
- no component-level data hardcoding

## Phase 1 Implementation Order

1. Architecture approval
2. Folder structure scaffolding
3. Dependency baseline
4. App shell and layout system
5. Sidebar and top navigation
6. Mock domain data and repository contracts
7. Dashboard widgets and stock header
8. Search autocomplete flow
9. Watchlist state and persistence
10. Stock detail chart foundation
11. Right-side quick stats panel
12. Polish, responsive behavior, and cleanup

## Key Decisions

- Use a feature-based frontend structure instead of organizing by file type alone.
- Keep repository interfaces in place even when only mocks exist.
- Treat charting as a standalone platform module, not a one-off widget.
- Preserve backend module boundaries from day one, even if frontend ships first.
- Optimize current work for future indicators, AI cards, and pluggable widgets.
