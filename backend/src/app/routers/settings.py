from __future__ import annotations

from fastapi import APIRouter

from app.schemas.settings import DashboardSettings, DashboardSettingsUpdate
from app.services import settings_service

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("", response_model=DashboardSettings)
async def get_settings():
    return settings_service.load_settings()


@router.patch("", response_model=DashboardSettings)
async def update_settings(body: DashboardSettingsUpdate):
    current = settings_service.load_settings()
    update_data = body.model_dump(exclude_unset=True)
    updated = current.model_copy(update=update_data)
    settings_service.save_settings(updated)
    return updated
