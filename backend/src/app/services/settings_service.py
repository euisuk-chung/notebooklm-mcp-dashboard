from __future__ import annotations

import json
import logging

from app.config import DEFAULT_SETTINGS, SETTINGS_PATH
from app.schemas.settings import DashboardSettings

logger = logging.getLogger(__name__)


def load_settings() -> DashboardSettings:
    if SETTINGS_PATH.exists():
        try:
            raw = json.loads(SETTINGS_PATH.read_text(encoding="utf-8"))
            merged = {**DEFAULT_SETTINGS, **raw}
            return DashboardSettings(**merged)
        except (json.JSONDecodeError, ValueError) as exc:
            logger.warning("Corrupt settings file, using defaults: %s", exc)

    return DashboardSettings(**DEFAULT_SETTINGS)


def save_settings(settings: DashboardSettings) -> None:
    SETTINGS_PATH.parent.mkdir(parents=True, exist_ok=True)
    SETTINGS_PATH.write_text(
        json.dumps(settings.model_dump(), indent=2),
        encoding="utf-8",
    )
