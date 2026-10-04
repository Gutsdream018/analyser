from __future__ import annotations
from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.market import MarketOverview
from app.models.stock import NormalizedStockQuote, SymbolSearchResult, MarketAgentPayload

class MarketDataProvider(ABC):
    """
    Abstract base class for replaceable market data providers.
    Implemented by IndianStockApiProvider, MockMarketDataProvider, and future providers.
    """

    @abstractmethod
    async def get_overview(self) -> MarketOverview:
        """Fetch and return a normalized MarketOverview model."""
        pass

    @abstractmethod
    async def get_quote(self, symbol: str) -> Optional[NormalizedStockQuote]:
        """Fetch and return a normalized single stock quote."""
        pass

    @abstractmethod
    async def get_quotes(self, symbols: List[str]) -> List[NormalizedStockQuote]:
        """Fetch and return a batch of normalized stock quotes."""
        pass

    @abstractmethod
    async def search(self, query: str) -> List[SymbolSearchResult]:
        """Search available symbols by query."""
        pass

    @abstractmethod
    async def get_market_payload(self) -> MarketAgentPayload:
        """Construct a normalized macro + equity snapshot for Market AI Agent ingestion."""
        pass
