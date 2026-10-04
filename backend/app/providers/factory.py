from app.config import get_settings
from app.providers.base import MarketDataProvider
from app.providers.mock import MockMarketDataProvider
from app.providers.indian_stock_api import IndianStockApiProvider

def get_market_data_provider() -> MarketDataProvider:
    """
    Select and instantiate the market data provider based on DATA_MODE.
    Supports:
      - 'indian_stock_api': 0xramm/Indian-Stock-Market-API adapter
      - 'mock': deterministic mock simulation
    Replaceable with future providers (YahooProvider, BrokerProvider, etc.)
    """
    settings = get_settings()
    mode = (settings.DATA_MODE or "mock").strip().lower()

    if mode in ["indian_stock_api", "indianstockapi", "live"]:
        return IndianStockApiProvider()

    if mode == "mock":
        return MockMarketDataProvider()

    raise NotImplementedError(
        f"Data provider mode '{settings.DATA_MODE}' is not supported or not configured. "
        f"Available provider modes: ['indian_stock_api', 'mock']."
    )
