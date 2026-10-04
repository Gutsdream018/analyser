import unittest
import os
from fastapi.testclient import TestClient
from app.main import app
from app.config import get_settings

class TestApiEndpoints(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")
        self.assertEqual(data["service"], "marketpulse-backend")
        self.assertIn("data_mode", data)

    def test_get_market_overview_mock_mode(self):
        old_val = os.environ.get("DATA_MODE")
        try:
            os.environ["DATA_MODE"] = "mock"
            get_settings.cache_clear()
            response = self.client.get("/api/v1/market/overview")
            self.assertEqual(response.status_code, 200)
            data = response.json()

            # Check structure
            self.assertIn("overview", data)
            self.assertIn("summary", data)

            overview = data["overview"]
            self.assertEqual(overview["status"], "ok")
            self.assertIsInstance(overview["indices"], list)
            self.assertGreaterEqual(len(overview["indices"]), 4)
            
            # Verify delayed and mock indicators
            for idx in overview["indices"]:
                self.assertEqual(idx["source"], "mock")
                self.assertTrue(idx["delayed"])

            # Check breadth
            breadth = overview["breadth"]
            self.assertIn("advances", breadth)
            self.assertIn("declines", breadth)
            self.assertIn("unchanged", breadth)

            # Check sectors
            self.assertIsInstance(overview["sectors"], list)
            self.assertGreater(len(overview["sectors"]), 0)

            # Check summary calculation
            summary = data["summary"]
            self.assertIn(summary["market_tone"], ["positive", "mixed", "negative"])
            self.assertIsInstance(summary["advance_ratio"], (int, float))
            self.assertIn("top_sector", summary)
            self.assertIn("bottom_sector", summary)
        finally:
            if old_val is not None:
                os.environ["DATA_MODE"] = old_val
            else:
                os.environ.pop("DATA_MODE", None)
            get_settings.cache_clear()

    def test_get_quote_invalid_symbol_returns_404(self):
        response = self.client.get("/api/market/quote?symbol=INVALID_SYMBOL_XYZ")
        self.assertEqual(response.status_code, 404)
        data = response.json()
        self.assertFalse(data["success"])
        self.assertIn("not found", data["error"].lower())

    def test_get_quote_empty_symbol_returns_400(self):
        response = self.client.get("/api/market/quote?symbol=")
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data["success"])

    def test_get_quotes_batch_empty_returns_400(self):
        response = self.client.get("/api/market/quotes?symbols=")
        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertFalse(data["success"])

    def test_cors_headers_present(self):
        response = self.client.get(
            "/health",
            headers={"Origin": "http://localhost:3000"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get("access-control-allow-origin"), "http://localhost:3000")

    def test_unsupported_mode_returns_501(self):
        old_val = os.environ.get("DATA_MODE")
        try:
            os.environ["DATA_MODE"] = "unknown_provider"
            get_settings.cache_clear()
            response = self.client.get("/api/v1/market/overview")
            self.assertEqual(response.status_code, 501)
            self.assertIn("not supported", response.json()["detail"])
        finally:
            if old_val is not None:
                os.environ["DATA_MODE"] = old_val
            else:
                os.environ.pop("DATA_MODE", None)
            get_settings.cache_clear()

if __name__ == "__main__":
    unittest.main()
