# MarketPulse — Master Agent Instructions & Specification (`agent.md`)

> **Product Vision**: "Open the site and understand the Indian market in 60 seconds."  
> A personal Indian stock-market intelligence terminal and command center turning raw market data into:  
> **Signal → Context → AI Explanation → What to Watch.**  
> **Strict Mandate**: No buy/sell recommendations or calls ever. Screening categories, factual observations, data-driven synthesis, and risk factors only. All mock states must display a visible `DEMO DATA` badge.

---

## 1. System & Architecture Overview

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS with custom CSS variable mapping
- **UI Components**: shadcn/ui design patterns, Lucide React icons
- **Data Visualization**: Recharts (area, bar, composition charts) and Lightweight Charts (candlestick & technical views)
- **Architecture**:
  - **Server Components**: Static page shells, metadata, layout framing, SEO headers.
  - **Client Components**: Interactive charts, live ticker updates, tabs, filter panels, data tables.
  - **Lazy Loading**: Dynamic imports (`next/dynamic`) for heavy charting libraries.

### Directory Structure
```
analyser/
├── app/
│   ├── layout.tsx                 # Root layout with topbar, sidebar, global providers
│   ├── page.tsx                   # Redirects to /dashboard
│   ├── dashboard/
│   │   └── page.tsx               # Primary 60-second command center
│   ├── markets/
│   │   └── page.tsx               # Indices, breadth, sector heatmap, 52W hi/lo
│   ├── stocks/
│   │   └── [symbol]/
│   │       └── page.tsx           # Comprehensive stock technical/fundamental overview
│   ├── fno/
│   │   └── page.tsx               # Futures, full option chain, Max Pain, PCR, OI
│   ├── screener/
│   │   └── page.tsx               # Multi-metric scanner with rule-based presets
│   ├── news/
│   │   └── page.tsx               # Filterable live news feed + contextual market impact
│   ├── analysis/
│   │   └── page.tsx               # AI daily brief, attribution engine ("Why NIFTY moved")
│   ├── watchlist/
│   │   └── page.tsx               # Multi-watchlist management & performance tracking
│   ├── alerts/
│   │   └── page.tsx               # Price, volume, percent, index alert management (UI)
│   ├── calendar/
│   │   └── page.tsx               # Earnings, dividends, splits, RBI policy & macro events
│   └── settings/
│       └── page.tsx               # Terminal configuration, AI preferences, data sources
├── components/
│   ├── layout/
│   │   ├── topbar.tsx             # Search (⌘K), market status dot, DEMO badge, clock
│   │   ├── sidebar.tsx            # Compact icon navigation with tooltips
│   │   └── command-palette.tsx    # Global instant search modal (⌘K)
│   ├── dashboard/
│   │   ├── index-strip.tsx        # NIFTY, BANKNIFTY, SENSEX, INDIA VIX + sparklines
│   │   ├── ai-brief-card.tsx      # "Today in 60 Seconds" signal-context-watch brief
│   │   ├── market-breadth.tsx     # Advances/declines gauge & ratio bar
│   │   ├── sector-heatmap.tsx     # Heatmap shaded by magnitude
│   │   ├── movers-tabs.tsx        # Gainers, losers, volume shockers
│   │   ├── global-strip.tsx       # Gift Nifty, Dow, Nasdaq, Brent Crude, US 10Y
│   │   └── fno-snapshot.tsx       # Quick PCR, Max Pain, ATM strikes snapshot
│   ├── charts/
│   │   ├── sparkline.tsx          # Lightweight SVG polyline with directional color
│   │   ├── mini-area-chart.tsx    # Intraday mini index chart
│   │   ├── candle-chart.tsx       # Lightweight Charts candlestick wrapper
│   │   └── oi-bar-chart.tsx       # Dual-color Call/Put Open Interest bar chart
│   ├── stocks/
│   │   ├── stock-header.tsx       # Price, change, day range, 52W range
│   │   ├── technical-summary.tsx  # RSI(14), 20/50/200 DMA, MACD status, ATR
│   │   └── fundamentals-grid.tsx  # Market cap, P/E, P/B, EPS, Div yield, Sector P/E
│   ├── fno/
│   │   ├── option-chain-table.tsx # Full option chain with highlighted ATM strike
│   │   └── oi-analyzer.tsx        # Call/Put build-up analysis cards
│   ├── screener/
│   │   ├── filter-sidebar.tsx     # Sliders, dropdowns, sector multi-select
│   │   └── screener-results.tsx   # Sortable tabular results with sparklines
│   └── common/
│       ├── badge.tsx              # Status, sector, and DEMO DATA badges
│       ├── terminal-card.tsx      # Hairline border panel container
│       ├── metric-value.tsx       # Mono-formatted numbers with color semantics
│       └── skeleton-loader.tsx    # Pulsing skeletons for loading state
├── lib/
│   ├── api/                       # Abstracted service layer (mock now, real APIs later)
│   │   ├── market.ts              # getMarketIndices(), getMarketBreadth(), getSectorHeatmap()
│   │   ├── stocks.ts              # getStockQuote(), getHistoricalPrices(), getStockDetails()
│   │   ├── fno.ts                 # getOptionChain(), getFnoSnapshot(), getOiData()
│   │   ├── news.ts                # getNewsFeed(), getMarketSentiment()
│   │   ├── macro.ts               # getGlobalMarkets(), getCommodities(), getFiiDii()
│   │   └── analysis.ts            # getAiDailyBrief(), getMarketAttribution()
│   ├── mock-data/                 # High-fidelity realistic Indian market data fixtures
│   │   ├── market.ts
│   │   ├── stocks.ts
│   │   ├── fno.ts
│   │   ├── news.ts
│   │   └── macro.ts
│   ├── formatters/
│   │   ├── currency.ts            # Indian numbering: ₹1,42,500.50, ₹14.5 Cr, ₹2.3 L
│   │   ├── numbers.ts             # Percentage signs, decimals, abbreviations
│   │   └── date.ts                # Market timestamps, IST formatting, relative time
│   └── calculations/
│       ├── technicals.ts          # RSI, moving averages, standard deviation
│       └── options.ts             # Max pain calculation, PCR ratio
└── types/
    ├── market.ts                  # MarketIndex, SectorPerformance, MarketBreadth
    ├── stock.ts                   # StockQuote, StockDetails, TechnicalIndicator
    ├── fno.ts                     # OptionChain, OptionStrike, FnoSnapshot
    ├── news.ts                    # NewsArticle, SentimentScore
    ├── analysis.ts                # AiDailyBrief, AttributionFactor
    ├── screener.ts                # ScreenerFilter, PresetQuery
    └── user.ts                    # Watchlist, AlertRule, UserPreferences
```

---

## 2. Locked Visual Design System

To ensure absolute visual consistency across all pages and components, adhere strictly to the following parameters without improvisation.

### Color Tokens
| Token | Variable | Hex | Applied Usage |
|---|---|---|---|
| Background | `--bg` | `#0A0B0D` | Canvas, window background, page base |
| Panel / Card | `--panel` | `#111318` | Cards, panels, modals, dropdowns, table headers |
| Border | `--border` | `#23262C` | 1px hairlines, table borders, dividers |
| Primary Text | `--text` | `#E7E9EC` | High-contrast body, headers, titles |
| Muted / Secondary | `--muted` | `#868C97` | Labels, captions, timestamps, column headers |
| Positive (Gain) | `--pos` | `#2FD675` | Gains, upward trends, call strikes ITM |
| Negative (Loss) | `--neg` | `#F2495C` | Losses, downward trends, put strikes ITM |
| Terminal Accent | `--accent` | `#D9A441` | Nav active states, key focus rings, badges (Warm Amber) |

*Important*: Never use generic AI teal or bright acid-green for UI accents. Reserve `#2FD675` and `#F2495C` strictly for directional financial data. Use Amber (`#D9A441`) for interactive focus and active navigation.

### Typography Rules
- **UI & Labels**: `IBM Plex Sans` (clean, ergonomic sans-serif for reading comprehension).
- **Financial Data & Tickers**: `IBM Plex Mono` (all prices, change values, percentages, index levels, timestamps, strike prices, and volumes).
- **Capitalization**: No artificial tracked-out `ALL-CAPS` eyebrow text. Ticker symbols (e.g., `RELIANCE`, `HDFCBANK`) remain uppercase as standard financial identifiers.
- **Tabular Figures**: Always apply `font-mono tabular-nums` to ensure numbers align vertically in tables and tickers.

### Layout & Surface Styling
- **Corners**: `rounded-[4px]` or `rounded-[6px]`. Never use pill-shaped cards or high-radius container buttons.
- **Borders & Shadows**: Use clean `1px solid var(--border)` hairlines. Eliminate bulky box-shadows and blurred glow halos to maintain a dense, high-signal financial terminal aesthetic.
- **Spacing**: Dense financial density. Standard padding: `p-3` to `p-4` on cards, compact table cell padding `py-1.5 px-3`.
- **Top Bar**: Sticky top bar containing:
  - Global Search trigger (`⌘K` Command Palette)
  - Real-time IST Clock (`09:15 - 15:30 IST` status indicator)
  - Live Market Status Dot (Green = Open, Red = Closed, Amber = Pre-Open)
  - Persistent amber border badge: `DEMO DATA`
- **Navigation**: Compact, icon-driven sidebar with tooltips and active state indicator (`border-l-2 border-[#D9A441]`).
- **Motion Principle**: Exactly one subtle count-up moment or smooth skeleton-to-content transition upon page mount. Avoid hover bounce, card tilt, or distracting animations.

---

## 3. Core Page Specifications & Route Blueprint

### 1. `/dashboard` — 60-Second Command Center
- **Index Strip**: Horizontal bar displaying NIFTY 50, NIFTY BANK, SENSEX, and INDIA VIX. Each includes current level, absolute change, percentage change, and a 1D SVG sparkline colored by direction.
- **"Today in 60 Seconds" AI Brief**:
  - *Signal*: Core market action summary (e.g., "NIFTY tests 24,500 resistance on banking strength").
  - *Context*: Institutional drivers (FII/DII flow synthesis, crude oil dip, global cues).
  - *What to Watch*: Key inflection strikes (24,400 put support, 24,600 call wall), macro triggers.
  - *Timestamp & Confidence Indicator*.
- **Market Breadth**: Visual advance/decline ratio bar (e.g., 1,420 Advances vs 840 Declines), Nifty 500 advance-decline line.
- **Sector Heatmap**: Grid of Nifty sectoral indices (Auto, Bank, IT, Pharma, FMCG, Metal, Energy, Realty). Cells colored by magnitude of change with opacity scaling (e.g., +2.4% is vibrant green, +0.2% is subtle dark green).
- **Top Movers**: 3-tab panel:
  - *Top Gainers* (% increase)
  - *Top Losers* (% drop)
  - *Volume Shockers* (current volume vs 20-day average volume multiplier)
- **F&O Snapshot**: PCR (Put-Call Ratio), Max Pain level, Highest Call OI strike, Highest Put OI strike.
- **Global Markets Ticker**: Gift Nifty, S&P 500, Nasdaq, Dow Jones, Brent Crude ($/bbl), USD/INR, US 10-Year Yield.
- **Personal Watchlist Widget**: Quick view of user-pinned stocks with mini sparklines.

### 2. `/markets` — Comprehensive Market Depth
- Comprehensive indices table with 1D, 1W, 1M, 6M, 1Y, and YTD performance toggles.
- Sector performance breakdown table with weightage in Nifty 50.
- 52-Week High / Low monitor (stocks hitting 52W highs vs 52W lows today).
- FII / DII net cash investment trend chart over the last 15 trading sessions.
- Commodities (Crude Oil, Gold, Silver, Natural Gas) & Currencies (USD/INR, EUR/INR, GBP/INR).

### 3. `/stocks/[symbol]` — Stock Detail Command View
- **Header**: Ticker, Company Name, Exchange, Sector tag, Live Price, Day High/Low bar, 52W High/Low range indicator.
- **Chart Module**: Lightweight candlestick & area chart with timeframe toggles (`1D`, `5D`, `1M`, `6M`, `1Y`, `5Y`) and volume bars.
- **Technical Snapshot Card**:
  - RSI (14) with zone label (Overbought > 70 / Neutral / Oversold < 30)
  - Distance from 20 DMA, 50 DMA, and 200 DMA
  - MACD status (Bullish crossover / Bearish crossover / Neutral)
  - 20-day Beta & Historical Volatility
- **Fundamentals Grid**: Market Capitalization (in ₹ Cr), TTM P/E, Sector P/E, P/B, EPS (TTM), Dividend Yield, Return on Equity (ROE).
- **AI Executive Summary**: Instant 3-bullet breakdown:
  - *Catalyst*: Primary reason for current price momentum
  - *Risk Factor*: Key headwind (valuation, upcoming earnings, sector weakness)
  - *Key Levels*: Immediate technical support & resistance
- **Related News & Upcoming Events**: Company-specific corporate filings, dividend ex-dates, and board meetings.

### 4. `/fno` — Futures & Options Intelligence
- **Spot & Futures Header**: Spot price, Future price, Basis (Premium/Discount), Cost of Carry, Overall PCR, and Current India VIX.
- **Full Option Chain**:
  - Expiry date dropdown selector (Current weekly, next weekly, monthly).
  - Strike price filter range (±5, ±10, ±15 strikes around ATM).
  - Columns:
    - *Calls*: OI, Change in OI, Volume, IV, LTP, Net Chg
    - *Strike Price*: Center column with prominent ATM highlighting
    - *Puts*: Net Chg, LTP, IV, Volume, Change in OI, OI
- **Open Interest Concentration Bar Chart**: Dual-colored visual chart highlighting Call OI vs Put OI at each strike to immediately reveal the Max Pain point and support/resistance walls.
- **F&O Build-Up Classification**: Long Build-up, Short Build-up, Short Covering, and Long Unwinding tables.

### 5. `/screener` — Metric-Driven Stock Scanner
- **Filter Panel**:
  - Market Cap: Large Cap (>₹20,000 Cr), Mid Cap (₹5,000–₹20,000 Cr), Small Cap (<₹5,000 Cr)
  - Price Range (₹ Min to ₹ Max)
  - % Change Range
  - Volume Multiplier (> 1.5x, > 2x, > 3x of 20-day average)
  - RSI Range (Slider from 0 to 100)
  - Distance from 52-Week High (Within 2%, 5%, 10%)
  - Sector multi-select
- **Saved Presets** (Strictly labeled as screening categories, never buy/sell tips):
  - *Unusual Volume Surges*
  - *Strong Momentum (RSI > 60 + Above 20 DMA)*
  - *Near 52-Week High Breakout*
  - *Large Cap Movers*
  - *Oversold Pullback Candidates (RSI < 30)*
- **Data Table**: Sortable by any column with inline sparkline, direct link to `/stocks/[symbol]`.

### 6. `/news` — Market Impact Newsfeed
- Categorized news feed: All, Corporate Actions, Earnings, Economy & Macro, Sector Specific.
- Impact Tagging: High, Medium, Low market significance.
- Market Context Side Panel: "What is moving the market today" — linking top news headlines directly to relevant sectors and indices.

### 7. `/analysis` — AI Daily Intelligence & Market Attribution
- **Daily Market Brief**:
  - Executive Overview
  - Breadth & Internal Health Analysis
  - Sector Leadership & Laggards
  - FII / DII Institutional Flows Analysis
  - Derivatives & Option Chain Sentiment
  - Global Cues & Macro Landscape
- **Attribution Engine ("Why did NIFTY move?")**:
  - Clear structural separation:
    - *Observed Data*: Points contributed to NIFTY by top 5 positive/negative stocks (e.g., RELIANCE +24 pts, INFY -18 pts).
    - *AI Interpretation*: Macro/fundamental context explaining the stock moves.
  - Disclaimer banner: "Generated by algorithmic synthesis. Not financial advice."

### 8. `/watchlist` — Multi-List Performance Tracker
- Multiple user watchlists: "Core Portfolio", "F&O Active", "High Momentum", "Value Candidates".
- Add, remove, and reorder stocks with live price updates.
- Quick sector allocation breakdown of the selected watchlist.

### 9. `/alerts` — Trigger Configuration (UI Shell)
- Rule-based alerts list: Price triggers, percentage moves, volume spikes, RSI threshold crossing.
- Status management: Active, Triggered, Disabled.
- Clean modal to configure new alerts with clear validation.

### 10. `/calendar` — Corporate Actions & Macro Schedule
- Filter tabs: Earnings Results, Dividends, Bonus/Splits, AGM/Board Meetings, Economic/RBI Policy Events.
- Calendar view / agenda list with date, company, event type, and details.

### 11. `/settings` — Terminal Preferences
- Default Index selection (NIFTY 50 vs BANKNIFTY vs SENSEX).
- Theme toggles (Terminal Dark locked as default).
- AI Summary tone & detail level (Executive concise vs Detailed breakdown).
- Data Source Configuration (Shows Mock Data active, slot for API Keys for Broker/NSE APIs).

---

## 4. Data Layer & API Abstraction Blueprint

To guarantee zero rework when transitioning from mock data to real market data feeds, all pages and components must consume data through the `lib/api/*` abstraction functions.

### Core Domain Interfaces (`types/`)

```typescript
// types/market.ts
export interface MarketIndex {
  symbol: string;
  name: string;
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  sparkline: number[];
  timestamp: string;
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
  advanceDeclineRatio: number;
  totalTraded: number;
}

export interface SectorPerformance {
  sector: string;
  change: number;
  pe: number;
  marketCapCr: number;
  topContributor: string;
  status: 'bullish' | 'bearish' | 'neutral';
}

// types/stock.ts
export interface StockQuote {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  price: number;
  change: number;
  percentChange: number;
  volume: number;
  avgVolume20D: number;
  high: number;
  low: number;
  open: number;
  close: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  marketCapCr: number;
  pe: number;
  sector: string;
  sparkline: number[];
}

export interface StockDetails extends StockQuote {
  pb: number;
  eps: number;
  dividendYield: number;
  roe: number;
  rsi14: number;
  dma20: number;
  dma50: number;
  dma200: number;
  macdStatus: 'Bullish' | 'Bearish' | 'Neutral';
  aiSummary: {
    catalyst: string;
    riskFactor: string;
    keyLevels: { support: number; resistance: number };
  };
}

// types/fno.ts
export interface OptionStrike {
  strikePrice: number;
  callOi: number;
  callOiChange: number;
  callVolume: number;
  callIv: number;
  callLtp: number;
  callChange: number;
  putLtp: number;
  putChange: number;
  putIv: number;
  putVolume: number;
  putOiChange: number;
  putOi: number;
  isAtm: boolean;
}

export interface OptionChain {
  underlyingSymbol: string;
  underlyingPrice: number;
  expiryDate: string;
  availableExpiries: string[];
  strikes: OptionStrike[];
  pcr: number;
  maxPain: number;
  totalCallOi: number;
  totalPutOi: number;
}
```

### API Service Function Signatures (`lib/api/*`)

Every service function returns typed Promises. The implementation currently reads from `lib/mock-data/*` with simulated network delay (50–150ms).

```typescript
// lib/api/market.ts
export async function getMarketIndices(): Promise<MarketIndex[]>;
export async function getMarketBreadth(): Promise<MarketBreadth>;
export async function getSectorHeatmap(): Promise<SectorPerformance[]>;

// lib/api/stocks.ts
export async function getStockQuote(symbol: string): Promise<StockQuote>;
export async function getStockDetails(symbol: string): Promise<StockDetails>;
export async function getTopMovers(): Promise<{ gainers: StockQuote[]; losers: StockQuote[]; volumeShockers: StockQuote[] }>;
export async function getHistoricalPrices(symbol: string, range: '1D' | '1W' | '1M' | '6M' | '1Y'): Promise<{ time: string; open: number; high: number; low: number; close: number; volume: number }[]>;

// lib/api/fno.ts
export async function getOptionChain(symbol: string, expiry?: string): Promise<OptionChain>;
export async function getFnoSnapshot(): Promise<{ pcr: number; maxPain: number; indiaVix: number; vixChange: number }>;

// lib/api/macro.ts
export async function getGlobalMarkets(): Promise<{ name: string; value: number; change: number; percentChange: number }[]>;
export async function getFiiDiiData(): Promise<{ date: string; fiiNet: number; diiNet: number }[]>;

// lib/api/news.ts
export async function getNewsFeed(category?: string): Promise<NewsArticle[]>;

// lib/api/analysis.ts
export async function getAiDailyBrief(): Promise<AiDailyBrief>;
export async function getMarketAttribution(): Promise<AttributionReport>;
```

### Real API Migration Priority Order
When connecting real market data feeds (e.g., Upstox, Dhan, Zerodha Kite Connect, or NSE Python wrappers), swap the internals of `lib/api/*` in this exact sequence:
1. **`getMarketIndices()` & `getMarketBreadth()`**: Immediate live market heartbeat for Nifty, BankNifty, Sensex, VIX.
2. **`getTopMovers()` & `getStockQuote()`**: Live ticker updates, individual stock prices and sparklines.
3. **`getSectorHeatmap()` & `getFiiDiiData()`**: Sector trends and institutional money flow.
4. **`getOptionChain()` & `getFnoSnapshot()`**: Derivative chain, Max Pain, and Put-Call ratio computation.
5. **`getNewsFeed()` & AI Summaries**: RSS/financial news aggregation and LLM prompt pipelining.

---

## 5. UI/UX Rules & Polish Checklist

- [ ] **DEMO DATA Badge**: Top bar must persistently render the `DEMO DATA` badge with amber styling (`bg-[#D9A441]/10 text-[#D9A441] border border-[#D9A441]/30 font-mono text-xs`).
- [ ] **Responsive Tables**: All financial tables must be housed in horizontal overflow containers (`overflow-x-auto`) with sticky headers (`sticky top-0 bg-[#111318] z-10`). No page-level layout breakage.
- [ ] **Skeleton Screens**: Every card and table component must have a matching skeleton state with exact dimension parity to prevent Cumulative Layout Shift (CLS).
- [ ] **Empty & Error Boundaries**: Components must handle zero-result filters (e.g., in screener or watchlist) with actionable empty states.
- [ ] **Formatters**:
  - Currency: `₹` symbol prefix with Indian numbering commas (`1,00,000`).
  - Values over ₹1 Crore: Format as `₹XX.X Cr`.
  - Percentage: Always show sign prefix (`+1.24%` or `-0.85%`) with `font-mono`.
- [ ] **Keyboard Navigation**: Pressing `⌘K` or `Ctrl+K` from any route must open the command palette for quick navigation to any stock, sector, or route.

---

## 6. Build Order & Execution Plan

Follow this sequential pipeline to scaffold and build the entire application:

1. **Phase 1: Foundation & Theme**
   - Initialize Next.js project with Tailwind CSS and Lucide icons.
   - Configure `tailwind.config.js` with locked hex tokens (`--bg`, `--panel`, `--border`, `--text`, `--muted`, `--pos`, `--neg`, `--accent`).
   - Setup Google Fonts for `IBM Plex Sans` and `IBM Plex Mono` in `app/layout.tsx`.
   - Build layout shell: Sticky Topbar, Nav Sidebar, and Command Palette.
2. **Phase 2: Types, Mock Data & API Layer**
   - Implement domain models in `types/`.
   - Populate realistic Indian market fixtures in `lib/mock-data/` (Nifty 50, top stocks like Reliance, TCS, HDFC Bank, Infosys, option chain).
   - Implement `lib/formatters/` and `lib/api/` facade functions with Promise resolution.
3. **Phase 3: The 60-Second Dashboard**
   - Build Index Strip with SVG sparklines.
   - Build "Today in 60 Seconds" AI brief card.
   - Build Advance/Decline breadth gauge.
   - Build Sector Heatmap with magnitude-dependent opacity.
   - Build Gainers / Losers / Volume Shockers tabs.
   - Build Global Markets & F&O snapshot modules.
4. **Phase 4: Stocks Detail & Markets Depth**
   - Implement `/markets` page with sector weights, breadth timeline, and FII/DII chart.
   - Implement `/stocks/[symbol]` with interactive Lightweight Charts, technical indicators (RSI, DMAs), fundamental ratios, and AI risk summary.
5. **Phase 5: F&O Terminal & Screener**
   - Build `/fno` with full option chain, ATM highlighting, strike range filtering, and OI bar chart.
   - Build `/screener` with multi-filter sidebar and one-click screening presets.
6. **Phase 6: News & AI Attribution**
   - Build `/news` with category filtering and market impact side panel.
   - Build `/analysis` featuring the daily market brief and NIFTY point attribution engine.
7. **Phase 7: Watchlist, Alerts, Calendar & Settings**
   - Build `/watchlist` multi-tab manager.
   - Build `/alerts` trigger rule builder.
   - Build `/calendar` for earnings, corporate actions, and macro dates.
   - Build `/settings` for terminal customization.
8. **Phase 8: Final Review & Quality Assurance**
   - Verify terminal typography (`IBM Plex Mono` on all figures).
   - Confirm zero buy/sell calls in all copy.
   - Verify `DEMO DATA` badge visibility.
   - Ensure responsive layout across desktop and mobile.

---

## 7. Run & Development Instructions

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm start
```
Terminal interface will be accessible at: `http://localhost:3000`
