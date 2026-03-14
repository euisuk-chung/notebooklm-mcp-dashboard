from __future__ import annotations

from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException

from app.dependencies import NLMClientError, NLMClientWrapper, get_client

router = APIRouter(prefix="/api/notebooks/{notebook_id}/sources", tags=["sources"])


class AddSourceURLRequest(BaseModel):
    url: str
    wait: bool = True


class AddSourceTextRequest(BaseModel):
    text: str
    title: str = ""


class AddSourceYoutubeRequest(BaseModel):
    url: str


class AddSourceBatchURLRequest(BaseModel):
    urls: list[str]
    wait: bool = True


class PipelineRequest(BaseModel):
    url: str
    pipeline: str = "ingest-and-podcast"


class ResearchStartRequest(BaseModel):
    query: str
    mode: str = "fast"
    source: str = "web"


@router.post("/url")
async def add_source_url(
    notebook_id: str,
    body: AddSourceURLRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.add_source_url(notebook_id, body.url, body.wait)
        return {"status": "added", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/text")
async def add_source_text(
    notebook_id: str,
    body: AddSourceTextRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.add_source_text(notebook_id, body.text, body.title)
        return {"status": "added", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/youtube")
async def add_source_youtube(
    notebook_id: str,
    body: AddSourceYoutubeRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.add_source_youtube(notebook_id, body.url)
        return {"status": "added", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/research")
async def start_research(
    notebook_id: str,
    body: ResearchStartRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.research_start(notebook_id, body.query, body.mode, body.source)
        return {"status": "started", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/research/status")
async def research_status(
    notebook_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.research_status(notebook_id)
        return {"status": "ok", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/research/import")
async def research_import(
    notebook_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.research_import(notebook_id)
        return {"status": "imported", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/batch-url")
async def add_source_batch_url(
    notebook_id: str,
    body: AddSourceBatchURLRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    added = 0
    failed = 0
    results = []
    for url in body.urls:
        try:
            result = await client.add_source_url(notebook_id, url, body.wait)
            added += 1
            results.append({"url": url, "status": "added", "message": result})
        except NLMClientError as exc:
            failed += 1
            results.append({"url": url, "status": "failed", "message": str(exc)})
    return {"added": added, "failed": failed, "results": results}


@router.post("/pipeline")
async def run_pipeline(
    notebook_id: str,
    body: PipelineRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.run_pipeline(notebook_id, body.pipeline, body.url)
        return {"status": "started", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
