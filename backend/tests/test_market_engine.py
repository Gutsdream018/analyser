import unittest
import asyncio
import os
from app.models.market import (
    MarketOverview,
    IndexQuote,
    Breadth,
    SectorPerformance,
)
from app.engine.market_summary import build_market_summary
from app.providers.mock import MockMarketDataProvider
from app.providers.factory import get_market_data_provider
from app.config import get_settings

class TestMarketEngine(unittest.TestCase):
    def test_build_market_summary_positive(self):
        overview = MarketOverview(
            status="ok",
            as_of="2026-09-30T00:00:00Z",
            indices=[],
            breadth=Breadth(advances=1500, declines=800, unchanged=100),
            sectors=[
                SectorPerformance(name="AUTO", change_percent=2.5),
                SectorPerformance(name="IT", change_percent=-1.2),
                SectorPerformance(name="BANK", change_percent=0.8),
            ],
        )
        summary = build_market_summary(overview)
        self.assertEqual(summary.advance_ratio, 1.88)
        self.assertEqual(summary.market_tone, "positive")
        self.assertIsNotNone(summary.top_sector)
        self.assertEqual(summary.top_sector.name, "AUTO")
        self.assertIsNotNone(summary.bottom_sector)
        self.assertEqual(summary.bottom_sector.name, "IT")

    def test_build_market_summary_negative(self):
        overview = MarketOverview(
            status="ok",
            as_of="2026-09-30T00:00:00Z",
            indices=[],
            breadth=Breadth(advances=500, declines=1500, unchanged=50),
            sectors=[
                SectorPerformance(name="METAL", change_percent=-3.1),
                SectorPerformance(name="FMCG", change_percent=0.2),
            ],
        )
        summary = build_market_summary(overview)
        self.assertEqual(summary.advance_ratio, 0.33)
        self.assertEqual(summary.market_tone, "negative")
        self.assertEqual(summary.top_sector.name, "FMCG")
        self.assertEqual(summary.bottom_sector.name, "METAL")

    def test_build_market_summary_mixed(self):
        overview = MarketOverview(
            status="ok",
            as_of="2026-09-30T00:00:00Z",
            indices=[],
            breadth=Breadth(advances=1000, declines=950, unchanged=50),
            sectors=[],
        )
        summary = build_market_summary(overview)
        self.assertEqual(summary.advance_ratio, 1.05)
        self.assertEqual(summary.market_tone, "mixed")
        self.assertIsNone(summary.top_sector)
        self.assertIsNone(summary.bottom_sector)

    def test_mock_provider_returns_delayed_mock_data(self):
        async def run_test():
            provider = MockMarketDataProvider()
            overview = await provider.get_overview()

            self.assertEqual(overview.status, "ok")
            self.assertGreaterEqual(len(overview.indices), 4)
            for idx in overview.indices:
                self.assertEqual(idx.source, "mock")
                self.assertTrue(idx.delayed)

            symbols = [idx.symbol for idx in overview.indices]
            self.assertIn("NIFTY", symbols)
            self.assertIn("BANKNIFTY", symbols)
            self.assertIn("SENSEX", symbols)
            self.assertIn("INDIA VIX", symbols)

        asyncio.run(run_test())

    def test_provider_factory_unsupported_mode(self):
        old_val = os.environ.get("DATA_MODE")
        try:
            os.environ["DATA_MODE"] = "unsupported_provider"
            get_settings.cache_clear()
            with self.assertRaises(NotImplementedError):
                get_market_data_provider()
        finally:
            if old_val is not None:
                os.environ["DATA_MODE"] = old_val
            else:
                os.environ.pop("DATA_MODE", None)
            get_settings.cache_clear()

if __name__ == "__main__":
    unittest.main()
