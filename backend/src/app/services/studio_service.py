from __future__ import annotations

import logging
import tempfile
from pathlib import Path
from typing import Optional

from app.dependencies import NLMClientWrapper
from app.schemas.studio import ArtifactStatus, ArtifactType, StudioStatusResponse

logger = logging.getLogger(__name__)


def _parse_artifact(data: dict) -> ArtifactStatus:
    from datetime import datetime

    created_raw = data.get("created_at") or data.get("create_time")
    created_at = None
    if created_raw:
        try:
            created_at = datetime.fromisoformat(created_raw.replace("Z", "+00:00"))
        except (ValueError, AttributeError):
            pass

    raw_type = data.get("artifact_type", data.get("type", "report"))
    try:
        artifact_type = ArtifactType(raw_type)
    except ValueError:
        artifact_type = ArtifactType.report

    return ArtifactStatus(
        id=data.get("id", data.get("artifact_id", "")),
        artifact_type=artifact_type,
        status=data.get("status", "unknown"),
        created_at=created_at,
    )


async def create_artifact(
    client: NLMClientWrapper,
    notebook_id: str,
    artifact_type: ArtifactType,
    options: Optional[dict] = None,
) -> ArtifactStatus:
    result = await client.create_artifact(
        notebook_id=notebook_id,
        artifact_type=artifact_type.value,
        options=options,
    )
    return _parse_artifact(result)


async def get_studio_status(
    client: NLMClientWrapper,
    notebook_id: str,
) -> StudioStatusResponse:
    result = await client.studio_status(notebook_id)
    # CLI returns a list directly, or a dict with "artifacts" key
    if isinstance(result, list):
        raw_artifacts = result
    elif isinstance(result, dict):
        raw_artifacts = result.get("artifacts", [])
    else:
        raw_artifacts = []
    artifacts = [_parse_artifact(a) for a in raw_artifacts if isinstance(a, dict)]
    return StudioStatusResponse(artifacts=artifacts)


async def delete_artifact(
    client: NLMClientWrapper,
    notebook_id: str,
    artifact_id: str,
) -> bool:
    return await client.delete_artifact(notebook_id, artifact_id)


async def download_artifact(
    client: NLMClientWrapper,
    notebook_id: str,
    artifact_id: str,
    artifact_type: str,
) -> Path:
    tmp_dir = Path(tempfile.mkdtemp(prefix="nlm_download_"))
    output_path = str(tmp_dir / f"{artifact_id}_{artifact_type}")

    result_path = await client.download_artifact(
        notebook_id=notebook_id,
        artifact_id=artifact_id,
        artifact_type=artifact_type,
        output_path=output_path,
    )

    downloaded = Path(result_path)
    if not downloaded.exists():
        possible = list(tmp_dir.iterdir())
        if possible:
            downloaded = possible[0]

    return downloaded
