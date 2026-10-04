"""
Pure calculation engine for Indian market summary analytics.
Strictly decoupled from network calls, databases, and third-party provider adapters.
"""
from typing import Literal
from app.models.market import MarketOverview, MarketSummary, SectorPerformance

def build_market_summary(overview: MarketOverview) -> MarketSummary:
    """
    Computes market summary metrics:
      - advance_ratio: advances / declines (rounded to 2 decimal places)
      - market_tone: 'positive' | 'mixed' | 'negative'
      - top_sector: SectorPerformance with highest positive percentage change
      - bottom_sector: SectorPerformance with lowest/negative percentage change
    """
    advances = overview.breadth.advances
    declines = overview.breadth.declines

    # Advance/decline ratio calculation
    if declines > 0:
        advance_ratio = round(advances / declines, 2)
    else:
        advance_ratio = float(advances)

    # Determine market tone
    # Positive: advances significantly exceed declines (> 1.25x)
    # Negative: declines significantly exceed advances (> 1.25x)
    # Mixed: relatively balanced breadth
    if advances > declines * 1.25:
        market_tone: Literal["positive", "mixed", "negative"] = "positive"
    elif declines > advances * 1.25:
        market_tone = "negative"
    else:
        market_tone = "mixed"

    # Identify top and bottom sectors
    if overview.sectors:
        sorted_sectors = sorted(overview.sectors, key=lambda s: s.change_percent, reverse=True)
        top_sector = sorted_sectors[0]
        bottom_sector = sorted_sectors[-1]
    else:
        top_sector = None
        bottom_sector = None

    return MarketSummary(
        advance_ratio=advance_ratio,
        market_tone=market_tone,
        top_sector=top_sector,
        bottom_sector=bottom_sector,
    )
