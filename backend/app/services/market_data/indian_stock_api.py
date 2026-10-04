import time
import logging
from typing import Optional, List, Dict, Any
import httpx
from app.config import get_settings
from app.models.stock import NormalizedStockQuote, SymbolSearchResult

logger = logging.getLogger("marketpulse.indian_stock_api")

class IndianStockApiException(Exception):
    """Base exception for Indian Stock Market API adapter errors."""
    def __init__(self, message: str, status_code: int = 503):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class IndianStockApiAdapter:
    """
    Adapter client for 0xramm/Indian-Stock-Market-API (v3).
    Communicates via HTTP to the documented endpoints:
      - GET /stock?symbol={SYMBOL}&res=num
      - GET /stock/list?symbols={SYM1,SYM2}&res=num
      - GET /search?q={query}
      - GET /symbols

    Features:
      - Clean symbol mapping (e.g. NIFTY 50 -> ^NSEI, RELIANCE -> RELIANCE.NS)
      - In-memory TTL caching to prevent redundant upstream pressure
      - Strict normalization (missing fields -> None/null, no fabrication)
      - Robust error handling (timeout, offline, 404, rate limit, malformed payloads)
    """

    KNOWN_SYMBOL_MAP = {
        "NIFTY": "^NSEI",
        "NIFTY 50": "^NSEI",
        "NIFTY50": "^NSEI",
        "^NSEI": "^NSEI",
        "BANKNIFTY": "^NSEBANK",
        "NIFTY BANK": "^NSEBANK",
        "BANK NIFTY": "^NSEBANK",
        "^NSEBANK": "^NSEBANK",
        "SENSEX": "^BSESN",
        "BSE SENSEX": "^BSESN",
        "^BSESN": "^BSESN",
    }

    def __init__(self, base_url: Optional[str] = None):
        settings = get_settings()
        self.base_url = (base_url or settings.INDIAN_STOCK_API_BASE_URL).rstrip("/")
        self.timeout = settings.INDIAN_STOCK_API_TIMEOUT_SECONDS
        self.cache_ttl = settings.INDIAN_STOCK_API_CACHE_TTL_SECONDS
        self._cache: Dict[str, Dict[str, Any]] = {}

    def map_symbol(self, raw_symbol: str) -> str:
        """
        Normalize incoming ticker symbols to format expected by the provider.
        E.g.:
          'NIFTY 50' -> '^NSEI'
          'BANKNIFTY' -> '^NSEBANK'
          'RELIANCE'  -> 'RELIANCE.NS'
          'TCS.BO'    -> 'TCS.BO'
        """
        cleaned = raw_symbol.strip().upper()
        if cleaned in self.KNOWN_SYMBOL_MAP:
            return self.KNOWN_SYMBOL_MAP[cleaned]
        
        if cleaned.startswith("^") or cleaned.endswith(".NS") or cleaned.endswith(".BO"):
            return cleaned
        
        # Default equity exchange is NSE (.NS)
        return f"{cleaned}.NS"

    def _get_cached(self, key: str) -> Optional[Any]:
        entry = self._cache.get(key)
        if entry and (time.time() - entry["timestamp"] < self.cache_ttl):
            return entry["data"]
        return None

    def _set_cached(self, key: str, data: Any):
        self._cache[key] = {
            "timestamp": time.time(),
            "data": data,
        }

    async def get_single_stock(self, symbol: str) -> NormalizedStockQuote:
        """
        Lookup single stock details with res=num.
        Endpoint: GET /stock?symbol={SYMBOL}&res=num
        """
        target_symbol = self.map_symbol(symbol)
        cache_key = f"single:{target_symbol}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        url = f"{self.base_url}/stock"
        params = {"symbol": target_symbol, "res": "num"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
        except httpx.TimeoutException:
            logger.error(f"Indian Stock Market API timed out for symbol {target_symbol}")
            raise IndianStockApiException("Market data request timed out", status_code=504)
        except httpx.RequestError as exc:
            logger.error(f"Indian Stock Market API unavailable: {exc}")
            raise IndianStockApiException("Market data temporarily unavailable", status_code=503)

        if response.status_code == 404:
            raise IndianStockApiException(f"Symbol '{symbol}' not found", status_code=404)
        elif response.status_code == 429:
            raise IndianStockApiException("Market data provider rate limit exceeded", status_code=429)
        elif response.status_code != 200:
            raise IndianStockApiException("Market data temporarily unavailable", status_code=503)

        try:
            payload = response.json()
        except Exception:
            raise IndianStockApiException("Malformed response received from market data provider", status_code=502)

        if payload.get("status") == "error":
            raise IndianStockApiException(payload.get("message", "Symbol not found"), status_code=404)

        data = payload.get("data", {})
        quote = self._normalize_quote_payload(payload, data)
        self._set_cached(cache_key, quote)
        return quote

    async def get_multiple_stocks(self, symbols: List[str]) -> List[NormalizedStockQuote]:
        """
        Batch lookup stock details with res=num.
        Endpoint: GET /stock/list?symbols={SYM1,SYM2}&res=num
        """
        if not symbols:
            return []

        mapped_symbols = [self.map_symbol(s) for s in symbols]
        
        # Check if any symbol starts with ^ (indices).
        # /stock/list in Yahoo batch quote may not resolve indices or sector,
        # so if indices are present or batch fails, fall back to parallel single quotes.
        has_index = any(s.startswith("^") for s in mapped_symbols)
        if has_index or len(mapped_symbols) <= 2:
            return [await self.get_single_stock(s) for s in symbols]

        cache_key = f"batch:{','.join(mapped_symbols)}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        url = f"{self.base_url}/stock/list"
        params = {"symbols": ",".join(mapped_symbols), "res": "num"}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
        except httpx.TimeoutException:
            logger.error(f"Indian Stock Market API batch timeout for {symbols}")
            raise IndianStockApiException("Market data request timed out", status_code=504)
        except httpx.RequestError as exc:
            logger.error(f"Indian Stock Market API unavailable: {exc}")
            raise IndianStockApiException("Market data temporarily unavailable", status_code=503)

        if response.status_code != 200:
            raise IndianStockApiException("Market data temporarily unavailable", status_code=503)

        try:
            payload = response.json()
        except Exception:
            raise IndianStockApiException("Malformed response received from market data provider", status_code=502)

        results: List[NormalizedStockQuote] = []
        for stock_raw in payload.get("stocks", []):
            if "error" in stock_raw:
                continue
            quote = NormalizedStockQuote(
                symbol=stock_raw.get("ticker") or stock_raw.get("symbol"),
                exchange=stock_raw.get("exchange") or "NSE",
                price=self._clean_float(stock_raw.get("last_price")),
                change=self._clean_float(stock_raw.get("change")),
                changePercent=self._clean_float(stock_raw.get("percent_change")),
                volume=self._clean_int(stock_raw.get("volume")),
                marketCap=self._clean_float(stock_raw.get("market_cap")),
                pe=self._clean_float(stock_raw.get("pe_ratio")),
                dividendYield=None,
                sector=None,
                timestamp=payload.get("timestamp"),
                companyName=stock_raw.get("company_name"),
            )
            results.append(quote)

        self._set_cached(cache_key, results)
        return results

    async def search(self, query: str) -> List[SymbolSearchResult]:
        """
        Search for symbols matching query.
        Endpoint: GET /search?q={query}
        """
        clean_q = query.strip()
        if not clean_q:
            return []

        cache_key = f"search:{clean_q}"
        cached = self._get_cached(cache_key)
        if cached:
            return cached

        url = f"{self.base_url}/search"
        params = {"q": clean_q}

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
        except Exception as exc:
            logger.warning(f"Search query '{clean_q}' failed: {exc}")
            return []

        if response.status_code != 200:
            return []

        try:
            payload = response.json()
            raw_results = payload.get("results", [])
            out = []
            for r in raw_results:
                out.append(
                    SymbolSearchResult(
                        symbol=r.get("symbol"),
                        company_name=r.get("company_name") or r.get("symbol"),
                        exchange="NSE",
                        sector=r.get("sector"),
                        industry=r.get("industry"),
                    )
                )
            self._set_cached(cache_key, out)
            return out
        except Exception:
            return []

    def _normalize_quote_payload(self, root: Dict[str, Any], data: Dict[str, Any]) -> NormalizedStockQuote:
        """
        Safely extracts real API fields into NormalizedStockQuote.
        If a field is missing, None (null) is preserved. No fabrication.
        """
        symbol_val = root.get("ticker") or root.get("symbol")
        exchange_val = root.get("exchange") or "NSE"

        return NormalizedStockQuote(
            symbol=symbol_val,
            exchange=exchange_val,
            price=self._clean_float(data.get("last_price")),
            change=self._clean_float(data.get("change")),
            changePercent=self._clean_float(data.get("percent_change")),
            volume=self._clean_int(data.get("volume")),
            marketCap=self._clean_float(data.get("market_cap")),
            pe=self._clean_float(data.get("pe_ratio")),
            dividendYield=self._clean_float(data.get("dividend_yield")),
            sector=self._clean_str(data.get("sector")),
            industry=self._clean_str(data.get("industry")),
            timestamp=data.get("timestamp") or root.get("timestamp"),
            companyName=data.get("company_name"),
            open=self._clean_float(data.get("open")),
            dayHigh=self._clean_float(data.get("day_high")),
            dayLow=self._clean_float(data.get("day_low")),
            yearHigh=self._clean_float(data.get("year_high")),
            yearLow=self._clean_float(data.get("year_low")),
            previousClose=self._clean_float(data.get("previous_close")),
        )

    @staticmethod
    def _clean_float(val: Any) -> Optional[float]:
        if val is None or val == "N/A" or val == "":
            return None
        try:
            return float(val)
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _clean_int(val: Any) -> Optional[int]:
        if val is None or val == "N/A" or val == "":
            return None
        try:
            return int(float(val))
        except (ValueError, TypeError):
            return None

    @staticmethod
    def _clean_str(val: Any) -> Optional[str]:
        if not val or val == "N/A":
            return None
        return str(val)
