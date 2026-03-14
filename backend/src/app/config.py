from pathlib import Path

SETTINGS_PATH = Path.home() / ".notebooklm-mcp-dashboard" / "settings.json"

DEFAULT_SETTINGS: dict = {
    "view_mode": "grid",
    "sort_by": "updated_at",
    "sort_order": "desc",
    "items_per_page": 20,
    "cleanup_threshold_days": 30,
}
