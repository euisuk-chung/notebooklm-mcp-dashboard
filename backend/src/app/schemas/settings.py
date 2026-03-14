from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, Field


class DashboardSettings(BaseModel):
    view_mode: Literal["grid", "list"] = "grid"
    sort_by: Literal["title", "created_at", "updated_at", "source_count"] = "updated_at"
    sort_order: Literal["asc", "desc"] = "desc"
    items_per_page: int = Field(default=20, ge=5, le=100)
    cleanup_threshold_days: int = Field(default=30, ge=1, le=365)


class DashboardSettingsUpdate(BaseModel):
    view_mode: Optional[Literal["grid", "list"]] = None
    sort_by: Optional[Literal["title", "created_at", "updated_at", "source_count"]] = None
    sort_order: Optional[Literal["asc", "desc"]] = None
    items_per_page: Optional[int] = Field(default=None, ge=5, le=100)
    cleanup_threshold_days: Optional[int] = Field(default=None, ge=1, le=365)
