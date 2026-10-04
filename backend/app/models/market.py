from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class IndexQuote(BaseModel):
    symbol: str = Field(..., description="Ticker or benchmark symbol (e.g. NIFTY, BANKNIFTY)")
    name: str = Field(..., description="Descriptive benchmark name")
    value: float = Field(..., description="Current index points value")
    change: float = Field(..., description="Net points change from previous close")
    change_percent: float = Field(..., description="Percentage change from previous close")
    as_of: str = Field(..., description="Timestamp of quote snapshot in ISO format")
    source: str = Field(..., description="Data provider or source identifier (e.g. mock)")
    delayed: bool = Field(..., description="True if quote is delayed or non-realtime")

class Breadth(BaseModel):
    advances: int = Field(..., description="Number of advancing equities")
    declines: int = Field(..., description="Number of declining equities")
    unchanged: int = Field(..., description="Number of unchanged equities")

class SectorPerformance(BaseModel):
    name: str = Field(..., description="Sector or thematic index name")
    change_percent: float = Field(..., description="Percentage performance of the sector")

class MarketOverview(BaseModel):
    status: str = Field("ok", description="Status of the market overview feed")
    as_of: str = Field(..., description="Timestamp of the overview generation in ISO format")
    indices: List[IndexQuote] = Field(..., description="List of primary market index quotes")
    breadth: Breadth = Field(..., description="Market breadth statistics across the exchange")
    sectors: List[SectorPerformance] = Field(..., description="Sectoral index performance breakdown")

class MarketSummary(BaseModel):
    advance_ratio: float = Field(..., description="Calculated advance to decline ratio")
    market_tone: Literal["positive", "mixed", "negative"] = Field(..., description="Derived market sentiment tone")
    top_sector: Optional[SectorPerformance] = Field(None, description="Best performing sector")
    bottom_sector: Optional[SectorPerformance] = Field(None, description="Worst performing sector")

class MarketOverviewResponse(BaseModel):
    overview: MarketOverview
    summary: MarketSummary
