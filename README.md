# MarketPulse — Full-Stack Indian Market Intelligence Dashboard

MarketPulse is a minimal full-stack Indian stock market intelligence dashboard where market data flows cleanly from provider adapters to normalized models, through pure market calculation engines, into a FastAPI REST service, and renders on a Next.js App Router frontend.

---

## 1. System Architecture

```text
┌─────────────────────────────────┐
│     MarketDataProvider          │  (Abstract Provider Interface)
│     - MockMarketDataProvider    │  (DATA_MODE=mock)
└────────────────┬────────────────┘
                 │ Normalized Pydantic Models (IndexQuote, Breadth, SectorPerformance)
                 ▼
┌─────────────────────────────────┐
│    build_market_summary()       │  (Pure Calculation Engine: Advance Ratio, Tone, Top/Bottom Sectors)
└────────────────┬────────────────┘
                 │ Normalized MarketOverviewResponse
                 ▼
┌─────────────────────────────────┐
│   FastAPI Backend (Port 8000)   │  GET /api/v1/market/overview, GET /health
└────────────────┬────────────────┘
                 │ JSON REST with CORS
                 ▼
┌─────────────────────────────────┐
│ Next.js App Router (Port 3000)  │  IndexCard, MarketDashboard, "DEVELOPMENT DATA" Banner
└─────────────────────────────────┘
```

- **Clean Decoupling**: Provider and network code are strictly excluded from calculation engines.
- **Normalized Contract**: Frontend consumes vendor-neutral TypeScript interfaces (`frontend/lib/types.ts`).
- **Resilience**: Client displays graceful error messages with retry actions rather than crashing on network faults.
- **Transparency**: Clear **“DEVELOPMENT DATA”** badge is prominently displayed whenever mock data is utilized.

---

## 2. Quickstart & Setup

### Prerequisites
- Python 3.9+
- Node.js 18+ & npm

---

### Step A: Start the FastAPI Backend

1. Navigate to the project root (or `backend/`):
   ```bash
   # Create virtual environment
   python3 -m venv backend/venv

   # Activate virtual environment
   source backend/venv/bin/activate

   # Install dependencies
   pip install -r backend/requirements.txt
   ```

2. (Optional) Configure environment variables:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Default settings:
   - `DATA_MODE=mock`
   - `PORT=8000`
   - `ALLOWED_ORIGINS=http://localhost:3000`

3. Start the FastAPI server:
   ```bash
   PYTHONPATH=./backend uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. Run automated test suite:
   ```bash
   PYTHONPATH=./backend backend/venv/bin/python -m unittest discover -s backend/tests -p "test_*.py"
   ```

5. Verify backend health and overview:
   - Health check: [http://localhost:8000/health](http://localhost:8000/health)
   - Market overview: [http://localhost:8000/api/v1/market/overview](http://localhost:8000/api/v1/market/overview)
   - Interactive OpenAPI docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Step B: Start the Next.js Frontend

1. In another terminal tab, install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Next.js development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000/overview](http://localhost:3000/overview) (or [http://localhost:3000](http://localhost:3000)) in your browser:
   - Displays the **MarketPulse** dashboard with live connection to the FastAPI backend.
   - Shows key Indian benchmarks (`NIFTY 50`, `NIFTY BANK`, `SENSEX`, `INDIA VIX`), exchange breadth, calculated market tone, and sector breakdown.
   - Includes full access to the multi-route terminal workspaces (`/overview`, `/dashboard`, `/stocks/[symbol]`, `/fno`, `/screener`, `/analysis`, etc.).

---

## 3. API Contract

### `GET /api/v1/market/overview`

```json
{
  "overview": {
    "status": "ok",
    "as_of": "2026-09-28T04:30:00Z",
    "indices": [
      {
        "symbol": "NIFTY",
        "name": "NIFTY 50",
        "value": 24584.20,
        "change": 142.60,
        "change_percent": 0.58,
        "as_of": "2026-09-28T04:30:00Z",
        "source": "mock",
        "delayed": true
      }
    ],
    "breadth": {
      "advances": 1485,
      "declines": 812,
      "unchanged": 98
    },
    "sectors": [
      {
        "name": "NIFTY AUTO",
        "change_percent": 2.14
      }
    ]
  },
  "summary": {
    "advance_ratio": 1.83,
    "market_tone": "positive",
    "top_sector": {
      "name": "NIFTY AUTO",
      "change_percent": 2.14
    },
    "bottom_sector": {
      "name": "NIFTY REALTY",
      "change_percent": -1.15
    }
  }
}
```

---

## 4. Project Directory Structure

```text
.
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app with CORS & health endpoint
│   │   ├── config.py                # Environment settings (DATA_MODE, PORT, CORS)
│   │   ├── api/
│   │   │   └── market.py            # GET /api/v1/market/overview route
│   │   ├── models/
│   │   │   └── market.py            # Pydantic models (IndexQuote, Breadth, SectorPerformance)
│   │   ├── providers/
│   │   │   ├── base.py              # Abstract MarketDataProvider interface
│   │   │   ├── mock.py              # MockMarketDataProvider implementation
│   │   │   └── factory.py           # Provider factory selecting on DATA_MODE
│   │   ├── engine/
│   │   │   └── market_summary.py    # Pure calculation engine (Advance Ratio, Tone)
│   │   └── services/
│   │       └── market_service.py    # Service orchestrating provider & engine
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Example backend environment variables
├── frontend/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with responsive dark theme
│   │   ├── page.tsx                 # Dashboard home page rendering MarketDashboard
│   │   └── globals.css              # Minimal dark styling
│   ├── components/
│   │   ├── IndexCard.tsx            # Benchmark card with delayed & source badges
│   │   └── MarketDashboard.tsx      # Dashboard container with "DEVELOPMENT DATA" label
│   ├── lib/
│   │   ├── types.ts                 # TypeScript types matching API schema
│   │   └── api.ts                   # Fetch client for /api/v1/market/overview
│   └── package.json                 # Standalone frontend package descriptor
├── app/                             # Active Next.js App Router (connects to MarketDashboard)
└── README.md                        # Project documentation & run guide
```
# analyser
