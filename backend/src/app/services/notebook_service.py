from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

from app.dependencies import NLMClientWrapper
from app.schemas.notebooks import (
    BulkDeleteResponse,
    CleanupSuggestion,
    NotebookDetail,
    NotebookSummary,
    Source,
    UsageResponse,
)

logger = logging.getLogger(__name__)


def _parse_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (ValueError, AttributeError):
        return None


def _notebook_summary_from_dict(data: dict) -> NotebookSummary:
    return NotebookSummary(
        id=data.get("id", data.get("notebook_id", "")),
        title=data.get("title", data.get("name", "Untitled")),
        source_count=data.get("source_count", data.get("num_sources", 0)),
        created_at=_parse_datetime(data.get("created_at") or data.get("create_time")),
        updated_at=_parse_datetime(data.get("updated_at") or data.get("update_time")),
        tags=data.get("tags", []),
    )


async def list_notebooks(
    client: NLMClientWrapper,
    search: Optional[str] = None,
) -> list[NotebookSummary]:
    raw_notebooks = await client.list_notebooks()
    notebooks = [_notebook_summary_from_dict(nb) for nb in raw_notebooks]
    if search:
        query = search.lower()
        notebooks = [
            nb for nb in notebooks if query in nb.title.lower()
        ]
    return notebooks


async def get_notebook(
    client: NLMClientWrapper,
    notebook_id: str,
) -> NotebookDetail:
    raw = await client.get_notebook(notebook_id)
    summary = _notebook_summary_from_dict(raw)

    raw_sources = await client.list_sources(notebook_id)
    sources = [
        Source(
            id=s.get("id", s.get("source_id", "")),
            title=s.get("title", s.get("name", "Untitled")),
            type=s.get("type", "unknown"),
        )
        for s in raw_sources
    ]

    description: Optional[str] = raw.get("description")
    if description is None:
        try:
            description = await client.describe_notebook(notebook_id)
        except Exception:
            description = None

    return NotebookDetail(
        id=summary.id,
        title=summary.title,
        source_count=summary.source_count,
        created_at=summary.created_at,
        updated_at=summary.updated_at,
        tags=summary.tags,
        sources=sources,
        description=description,
    )


async def delete_notebook(
    client: NLMClientWrapper,
    notebook_id: str,
) -> bool:
    return await client.delete_notebook(notebook_id)


async def bulk_delete(
    client: NLMClientWrapper,
    notebook_ids: list[str],
) -> BulkDeleteResponse:
    deleted = 0
    failed: list[str] = []
    for nid in notebook_ids:
        try:
            await client.delete_notebook(nid)
            deleted += 1
        except Exception as exc:
            logger.warning("Failed to delete notebook %s: %s", nid, exc)
            failed.append(nid)
    return BulkDeleteResponse(deleted_count=deleted, failed=failed)


async def get_usage(
    client: NLMClientWrapper,
    threshold_days: int = 30,
) -> UsageResponse:
    raw_notebooks = await client.list_notebooks()
    notebooks = [_notebook_summary_from_dict(nb) for nb in raw_notebooks]
    current_count = len(notebooks)

    cutoff = datetime.now(timezone.utc) - timedelta(days=threshold_days)
    suggestions: list[CleanupSuggestion] = []

    for nb in notebooks:
        last_accessed = nb.updated_at or nb.created_at
        if last_accessed is not None and last_accessed < cutoff:
            suggestions.append(
                CleanupSuggestion(
                    notebook_id=nb.id,
                    title=nb.title,
                    reason=f"Not accessed in over {threshold_days} days",
                    last_accessed=last_accessed,
                )
            )
        elif nb.source_count == 0:
            suggestions.append(
                CleanupSuggestion(
                    notebook_id=nb.id,
                    title=nb.title,
                    reason="Notebook has no sources",
                    last_accessed=last_accessed,
                )
            )

    return UsageResponse(
        current_count=current_count,
        max_limit=500,
        cleanup_suggestions=suggestions,
    )
