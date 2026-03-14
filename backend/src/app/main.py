from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.dependencies import init_client, shutdown_client
from app.routers import auth, notebooks, settings, sources, studio

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info("Starting NotebookLM MCP Dashboard backend")
    await init_client()
    yield
    logger.info("Shutting down NotebookLM MCP Dashboard backend")
    await shutdown_client()


app = FastAPI(
    title="NotebookLM MCP Dashboard",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(notebooks.router)
app.include_router(sources.router)
app.include_router(studio.router)
app.include_router(studio.bulk_router)
app.include_router(settings.router)


@app.get("/")
async def root():
    return {"status": "ok", "service": "notebooklm-mcp-dashboard"}
