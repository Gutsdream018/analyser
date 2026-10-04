from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class NormalizedStockQuote(BaseModel):
    symbol: str = Field(..., description="Normalized ticker symbol (e.g. RELIANCE.NS, ^NSEI)")
    exchange: str = Field(..., description="Exchange identifier (NSE, BSE, or INDEX)")
    price: Optional[float] = Field(None, description="Last traded market price")
    change: Optional[float] = Field(None, description="Absolute points change")
    changePercent: Optional[float] = Field(None, description="Percentage change")
    volume: Optional[int] = Field(None, description="Traded volume in shares")
    marketCap: Optional[float] = Field(None, description="Market capitalization in INR")
    pe: Optional[float] = Field(None, description="Price to Earnings ratio")
    dividendYield: Optional[float] = Field(None, description="Dividend yield percentage")
    sector: Optional[str] = Field(None, description="Industry sector classification")
    industry: Optional[str] = Field(None, description="Specific industry classification")
    timestamp: Optional[str] = Field(None, description="Quote timestamp or last update date")
    companyName: Optional[str] = Field(None, description="Registered company or index name")
    open: Optional[float] = Field(None, description="Day open price")
    dayHigh: Optional[float] = Field(None, description="Day high price")
    dayLow: Optional[float] = Field(None, description="Day low price")
    yearHigh: Optional[float] = Field(None, description="52-week high price")
    yearLow: Optional[float] = Field(None, description="52-week low price")
    previousClose: Optional[float] = Field(None, description="Previous session closing price")

class SymbolSearchResult(BaseModel):
    symbol: str
    company_name: str
    exchange: Optional[str] = "NSE"
    sector: Optional[str] = None
    industry: Optional[str] = None

class QuoteResponse(BaseModel):
    success: bool = True
    data: Optional[NormalizedStockQuote] = None
    error: Optional[str] = None

class QuotesBatchResponse(BaseModel):
    success: bool = True
    count: int = 0
    data: List[NormalizedStockQuote] = []
    error: Optional[str] = None

class MarketDataErrorResponse(BaseModel):
    success: bool = False
    error: str

class MarketAgentPayload(BaseModel):
    """Normalized market data object structured for AI agent ingestion."""
    market: Dict[str, Any] = Field(..., description="Macro benchmarks (e.g. nifty, bankNifty)")
    stocks: List[NormalizedStockQuote] = Field(default_factory=list, description="Watched or active equities")
    timestamp: str = Field(..., description="ISO generation timestamp")
