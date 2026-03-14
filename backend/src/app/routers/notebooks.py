from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.dependencies import NLMClientError, NLMClientWrapper, get_client
from app.schemas.notebooks import (
    BulkDeleteRequest,
    BulkDeleteResponse,
    CreateNotebookRequest,
    NotebookDetail,
    NotebookListResponse,
    QueryRequest,
    QueryResponse,
    UsageResponse,
)
from app.services import notebook_service

router = APIRouter(prefix="/api/notebooks", tags=["notebooks"])


@router.post("", status_code=201)
async def create_notebook(
    body: CreateNotebookRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.create_notebook(body.title)
        return result
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("", response_model=NotebookListResponse)
async def list_notebooks(
    search: Optional[str] = Query(None, description="Filter notebooks by title"),
    client: NLMClientWrapper = Depends(get_client),
):
    notebooks = await notebook_service.list_notebooks(client, search=search)
    return NotebookListResponse(notebooks=notebooks, total_count=len(notebooks))


@router.get("/usage", response_model=UsageResponse)
async def get_usage(
    threshold_days: int = Query(30, ge=1, le=365),
    client: NLMClientWrapper = Depends(get_client),
):
    return await notebook_service.get_usage(client, threshold_days=threshold_days)


@router.get("/{notebook_id}", response_model=NotebookDetail)
async def get_notebook(
    notebook_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        return await notebook_service.get_notebook(client, notebook_id)
    except NLMClientError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.post("/{notebook_id}/query", response_model=QueryResponse)
async def query_notebook(
    notebook_id: str,
    body: QueryRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        answer = await client.query_notebook(notebook_id, body.question)
        return QueryResponse(answer=answer)
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.delete("/{notebook_id}")
async def delete_notebook(
    notebook_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        await notebook_service.delete_notebook(client, notebook_id)
        return {"deleted": True, "notebook_id": notebook_id}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("/bulk-delete", response_model=BulkDeleteResponse)
async def bulk_delete(
    body: BulkDeleteRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    return await notebook_service.bulk_delete(client, body.notebook_ids)
