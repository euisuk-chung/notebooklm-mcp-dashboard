from __future__ import annotations

import mimetypes

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.dependencies import NLMClientError, NLMClientWrapper, get_client
from app.schemas.studio import (
    ArtifactStatus,
    BulkCreateArtifactRequest,
    CreateArtifactRequest,
    StudioStatusResponse,
)
from app.services import studio_service

router = APIRouter(prefix="/api/notebooks/{notebook_id}/studio", tags=["studio"])


@router.get("", response_model=StudioStatusResponse)
async def get_studio_status(
    notebook_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        return await studio_service.get_studio_status(client, notebook_id)
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.post("", response_model=ArtifactStatus, status_code=201)
async def create_artifact(
    notebook_id: str,
    body: CreateArtifactRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        return await studio_service.create_artifact(
            client,
            notebook_id=notebook_id,
            artifact_type=body.artifact_type,
            options=body.options,
        )
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.delete("/{artifact_id}")
async def delete_artifact(
    notebook_id: str,
    artifact_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        await studio_service.delete_artifact(client, notebook_id, artifact_id)
        return {"deleted": True, "artifact_id": artifact_id}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


bulk_router = APIRouter(prefix="/api/studio", tags=["studio"])


@bulk_router.post("/bulk-create")
async def bulk_create_artifacts(
    body: BulkCreateArtifactRequest,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        result = await client.batch_studio(body.notebook_ids, body.artifact_type.value)
        return {"status": "started", "message": result}
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@router.get("/{artifact_id}/download")
async def download_artifact(
    notebook_id: str,
    artifact_id: str,
    client: NLMClientWrapper = Depends(get_client),
):
    try:
        status_resp = await studio_service.get_studio_status(client, notebook_id)
        artifact_type = "report"
        for art in status_resp.artifacts:
            if art.id == artifact_id:
                artifact_type = art.artifact_type.value
                break

        file_path = await studio_service.download_artifact(
            client, notebook_id, artifact_id, artifact_type
        )

        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Downloaded file not found")

        media_type, _ = mimetypes.guess_type(str(file_path))
        if media_type is None:
            media_type = "application/octet-stream"

        def iter_file():
            with open(file_path, "rb") as f:
                while chunk := f.read(64 * 1024):
                    yield chunk

        return StreamingResponse(
            iter_file(),
            media_type=media_type,
            headers={
                "Content-Disposition": f'attachment; filename="{file_path.name}"'
            },
        )
    except NLMClientError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
