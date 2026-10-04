from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.api.market import router as market_router

settings = get_settings()

app = FastAPI(
    title="MarketPulse API",
    description="Backend market intelligence API providing normalized market indices, breadth, sector performance, and summary analytics.",
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "marketpulse-backend",
        "data_mode": settings.DATA_MODE,
    }

# Mount API Routers under /api/v1 and /api
app.include_router(market_router, prefix="/api/v1")
app.include_router(market_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
