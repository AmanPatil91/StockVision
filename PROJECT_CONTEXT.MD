# StockVision Project Context

## Architecture Decisions

- **Frontend Framework**: Next.js 15 App Router is used for the web shell and routing.
- **State Management**: Zustand is used for client-side state (e.g., `useIndicatorStore` for technical indicators).
- **UI & Styling**: Tailwind CSS combined with shadcn-ui style primitives for a cohesive, dark-themed trading dashboard design. Charting is handled via TradingView Lightweight Charts.
- **Backend Framework**: FastAPI is used for high-performance Python API endpoints.
- **Data Layer**: The Repository Pattern (`StockRepository`, etc.) abstracts data access. Currently, a `MockStockRepository` is active to simulate market data.
- **Technical Analysis**: The backend handles complex calculations using the `ta` and `pandas` libraries, keeping the frontend lightweight and focused on presentation. The frontend fetches this via service layers (e.g., `technicalService`).