from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class NotebookSummary(BaseModel):
    id: str
    title: str
    source_count: int = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    tags: list[str] = Field(default_factory=list)


class Source(BaseModel):
    id: str
    title: str
    type: str = "unknown"


class NotebookDetail(NotebookSummary):
    sources: list[Source] = Field(default_factory=list)
    description: Optional[str] = None


class NotebookListResponse(BaseModel):
    notebooks: list[NotebookSummary]
    total_count: int


class CleanupSuggestion(BaseModel):
    notebook_id: str
    title: str
    reason: str
    last_accessed: Optional[datetime] = None


class UsageResponse(BaseModel):
    current_count: int
    max_limit: int = 500
    cleanup_suggestions: list[CleanupSuggestion] = Field(default_factory=list)


class BulkDeleteRequest(BaseModel):
    notebook_ids: list[str]


class BulkDeleteResponse(BaseModel):
    deleted_count: int
    failed: list[str] = Field(default_factory=list)


class CreateNotebookRequest(BaseModel):
    title: str


class QueryRequest(BaseModel):
    question: str


class QueryResponse(BaseModel):
    answer: str
