from __future__ import annotations

from fastapi import APIRouter, Depends

from app.dependencies import NLMClientWrapper, get_client

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.get("/status")
async def auth_status(client: NLMClientWrapper = Depends(get_client)):
    result = await client.check_auth()
    return result


@router.post("/refresh")
async def auth_refresh(client: NLMClientWrapper = Depends(get_client)):
    result = await client.refresh_auth()
    return result
