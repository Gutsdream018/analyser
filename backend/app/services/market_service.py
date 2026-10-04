from typing import List, Optional
from app.providers.factory import get_market_data_provider
from app.engine.market_summary import build_market_summary
from app.models.market import MarketOverviewResponse
from app.models.stock import NormalizedStockQuote, SymbolSearchResult, MarketAgentPayload

class MarketService:
    """
    Market Data Service orchestrating data ingestion, analytics, and normalization.
    Decoupled from underlying provider (IndianStockApi, Mock, Broker, etc.).
    """

    def __init__(self):
        self.provider = get_market_data_provider()

    async def get_overview(self) -> MarketOverviewResponse:
        """
        Retrieves normalized market overview from the configured provider,
        applies pure summary analytics, and packages the final response.
        """
        overview = await self.provider.get_overview()
        summary = build_market_summary(overview)
        return MarketOverviewResponse(overview=overview, summary=summary)

    async def get_quote(self, symbol: str) -> Optional[NormalizedStockQuote]:
        """Fetch normalized single stock quote."""
        return await self.provider.get_quote(symbol)

    async def get_quotes(self, symbols: List[str]) -> List[NormalizedStockQuote]:
        """Fetch batch of normalized stock quotes."""
        return await self.provider.get_quotes(symbols)

    async def search(self, query: str) -> List[SymbolSearchResult]:
        """Search available symbols."""
        return await self.provider.search(query)

    async def get_market_payload(self) -> MarketAgentPayload:
        """Normalized market snapshot for Market AI Agent."""
        return await self.provider.get_market_payload()
