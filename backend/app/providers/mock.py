from __future__ import annotations
from datetime import datetime, timezone
from typing import List
from app.models.market import MarketOverview, IndexQuote, Breadth, SectorPerformance
from app.models.stock import NormalizedStockQuote, SymbolSearchResult, MarketAgentPayload
from app.providers.base import MarketDataProvider

class MockMarketDataProvider(MarketDataProvider):
    """
    Mock market data provider returning simulated Indian market metrics.
    Clearly marks all quotes with source='mock' and delayed=True.
    """

    async def get_overview(self) -> MarketOverview:
        now_iso = datetime.now(timezone.utc).isoformat()

        indices = [
            IndexQuote(
                symbol="NIFTY",
                name="NIFTY 50",
                value=24584.20,
                change=142.60,
                change_percent=0.58,
                as_of=now_iso,
                source="mock",
                delayed=True,
            ),
            IndexQuote(
                symbol="BANKNIFTY",
                name="NIFTY BANK",
                value=52410.85,
                change=412.30,
                change_percent=0.79,
                as_of=now_iso,
                source="mock",
                delayed=True,
            ),
            IndexQuote(
                symbol="SENSEX",
                name="BSE SENSEX",
                value=80436.84,
                change=395.20,
                change_percent=0.49,
                as_of=now_iso,
                source="mock",
                delayed=True,
            ),
            IndexQuote(
                symbol="INDIA VIX",
                name="India Volatility Index",
                value=12.82,
                change=-0.48,
                change_percent=-3.61,
                as_of=now_iso,
                source="mock",
                delayed=True,
            ),
        ]

        breadth = Breadth(
            advances=1485,
            declines=812,
            unchanged=98,
        )

        sectors = [
            SectorPerformance(name="NIFTY AUTO", change_percent=2.14),
            SectorPerformance(name="NIFTY METAL", change_percent=1.62),
            SectorPerformance(name="NIFTY BANK", change_percent=0.79),
            SectorPerformance(name="NIFTY PHARMA", change_percent=0.45),
            SectorPerformance(name="NIFTY FMCG", change_percent=-0.12),
            SectorPerformance(name="NIFTY IT", change_percent=-0.27),
            SectorPerformance(name="NIFTY REALTY", change_percent=-1.15),
        ]

        return MarketOverview(
            status="ok",
            as_of=now_iso,
            indices=indices,
            breadth=breadth,
            sectors=sectors,
        )

    async def get_quote(self, symbol: str) -> NormalizedStockQuote:
        from app.models.stock import NormalizedStockQuote
        clean = symbol.upper().replace(".NS", "").replace(".BO", "")
        prices = {"RELIANCE": 1187.0, "TCS": 2050.6, "INFY": 994.1}
        price = prices.get(clean, 1500.0)
        return NormalizedStockQuote(
            symbol=f"{clean}.NS" if not clean.startswith("^") else clean,
            exchange="NSE" if not clean.startswith("^") else "INDEX",
            price=price,
            change=5.2,
            changePercent=0.35,
            volume=2500000,
            marketCap=1500000000000.0,
            pe=24.5,
            dividendYield=1.2,
            sector="Technology" if clean in ["TCS", "INFY"] else "Energy",
            companyName=f"{clean} Limited",
            timestamp=datetime.now(timezone.utc).isoformat(),
        )

    async def get_quotes(self, symbols: list[str]) -> list[NormalizedStockQuote]:
        return [await self.get_quote(s) for s in symbols]

    async def search(self, query: str) -> list[SymbolSearchResult]:
        from app.models.stock import SymbolSearchResult
        return [
            SymbolSearchResult(symbol="RELIANCE", company_name="Reliance Industries", exchange="NSE"),
            SymbolSearchResult(symbol="TCS", company_name="Tata Consultancy Services", exchange="NSE"),
            SymbolSearchResult(symbol="INFY", company_name="Infosys", exchange="NSE"),
        ]

    async def get_market_payload(self) -> MarketAgentPayload:
        from app.models.stock import MarketAgentPayload
        now_iso = datetime.now(timezone.utc).isoformat()
        overview = await self.get_overview()
        nifty = next((i for i in overview.indices if "NIFTY" in i.symbol), None)
        bank = next((i for i in overview.indices if "BANK" in i.symbol), None)
        stocks = await self.get_quotes(["RELIANCE.NS", "TCS.NS", "INFY.NS"])
        return MarketAgentPayload(
            market={
                "nifty": nifty.model_dump() if nifty else {},
                "bankNifty": bank.model_dump() if bank else {},
            },
            stocks=stocks,
            timestamp=now_iso,
        )

