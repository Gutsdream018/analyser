from typing import Optional, List
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.responses import JSONResponse
from app.services.market_service import MarketService
from app.services.market_data.indian_stock_api import IndianStockApiException
from app.models.market import MarketOverviewResponse
from app.models.stock import (
    NormalizedStockQuote,
    QuoteResponse,
    QuotesBatchResponse,
    SymbolSearchResult,
    MarketAgentPayload,
    MarketDataErrorResponse,
)

router = APIRouter(prefix="/market", tags=["Market Data"])

@router.get(
    "/overview",
    response_model=MarketOverviewResponse,
    summary="Get Market Overview & Summary Analytics",
    description="Returns normalized market overview (indices, breadth, sectors) and derived summary metrics.",
)
async def get_market_overview():
    try:
        service = MarketService()
        return await service.get_overview()
    except IndianStockApiException as ie:
        return JSONResponse(
            status_code=ie.status_code,
            content={"success": False, "error": ie.message},
        )
    except NotImplementedError as nie:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(nie),
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"success": False, "error": f"Market data temporarily unavailable: {str(e)}"},
        )

@router.get(
    "/quote",
    response_model=QuoteResponse,
    responses={
        400: {"model": MarketDataErrorResponse},
        404: {"model": MarketDataErrorResponse},
        503: {"model": MarketDataErrorResponse},
        504: {"model": MarketDataErrorResponse},
    },
    summary="Get Single Normalized Stock / Index Quote",
    description="Fetches live market quote for a given equity or index symbol (e.g. RELIANCE.NS, TCS.NS, ^NSEI, ^NSEBANK).",
)
async def get_quote(symbol: str = Query(..., description="Stock symbol or index ticker (e.g. RELIANCE.NS, TCS.NS, ^NSEI)")):
    clean_sym = symbol.strip()
    if not clean_sym:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Symbol parameter cannot be empty"},
        )

    try:
        service = MarketService()
        quote = await service.get_quote(clean_sym)
        if not quote:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"success": False, "error": f"Symbol '{clean_sym}' not found"},
            )
        return QuoteResponse(success=True, data=quote)
    except IndianStockApiException as ie:
        return JSONResponse(
            status_code=ie.status_code,
            content={"success": False, "error": ie.message},
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"success": False, "error": "Market data temporarily unavailable"},
        )

@router.get(
    "/quotes",
    response_model=QuotesBatchResponse,
    responses={
        400: {"model": MarketDataErrorResponse},
        503: {"model": MarketDataErrorResponse},
    },
    summary="Get Batch Normalized Stock Quotes",
    description="Fetches batch of live stock quotes given comma-separated symbols (e.g. symbols=RELIANCE.NS,TCS.NS,INFY.NS).",
)
async def get_quotes(symbols: str = Query(..., description="Comma-separated symbols list (e.g. RELIANCE.NS,TCS.NS,INFY.NS)")):
    symbol_list = [s.strip() for s in symbols.split(",") if s.strip()]
    if not symbol_list:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "error": "Symbols parameter must contain at least one symbol"},
        )

    try:
        service = MarketService()
        quotes = await service.get_quotes(symbol_list)
        return QuotesBatchResponse(success=True, count=len(quotes), data=quotes)
    except IndianStockApiException as ie:
        return JSONResponse(
            status_code=ie.status_code,
            content={"success": False, "error": ie.message},
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"success": False, "error": "Market data temporarily unavailable"},
        )

@router.get(
    "/search",
    response_model=List[SymbolSearchResult],
    summary="Search Equities / Symbols",
    description="Searches Indian stock symbols by company name or ticker prefix.",
)
async def search_symbols(q: str = Query(..., description="Search query string")):
    clean_q = q.strip()
    if not clean_q:
        return []
    try:
        service = MarketService()
        return await service.search(clean_q)
    except Exception:
        return []

@router.get(
    "/agent-payload",
    response_model=MarketAgentPayload,
    summary="Get Normalized Market Snapshot for AI Agent",
    description="Returns verified market data (Nifty 50, Bank Nifty, and benchmark stocks) formatted for Market AI Agent ingestion.",
)
async def get_agent_payload():
    try:
        service = MarketService()
        return await service.get_market_payload()
    except IndianStockApiException as ie:
        return JSONResponse(
            status_code=ie.status_code,
            content={"success": False, "error": ie.message},
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"success": False, "error": "Market data temporarily unavailable"},
        )
