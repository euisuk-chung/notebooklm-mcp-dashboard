from __future__ import annotations

import asyncio
import json
import logging
import shutil
from typing import Any, Optional

logger = logging.getLogger(__name__)

_client_instance: Optional[NLMClientWrapper] = None


class NLMClientError(Exception):
    """Raised when a CLI command fails."""


class NLMClientWrapper:
    """Wrapper around the ``nlm`` CLI.

    All interactions go through ``asyncio.create_subprocess_exec`` so the
    server stays responsive while long-running CLI commands execute.
    """

    def __init__(self) -> None:
        self._nlm_bin: Optional[str] = None

    async def initialize(self) -> None:
        self._nlm_bin = shutil.which("nlm")
        if self._nlm_bin is None:
            logger.warning(
                "nlm CLI not found on PATH. Commands will fail until it is installed."
            )

    async def close(self) -> None:
        pass

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    async def _run(self, *args: str, parse_json: bool = True) -> Any:
        """Execute an ``nlm`` CLI command and return parsed output."""
        if self._nlm_bin is None:
            self._nlm_bin = shutil.which("nlm")
        bin_path = self._nlm_bin or "nlm"

        proc = await asyncio.create_subprocess_exec(
            bin_path,
            *args,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
        )
        stdout, stderr = await proc.communicate()

        if proc.returncode != 0:
            err_msg = stderr.decode().strip() if stderr else "unknown error"
            raise NLMClientError(
                f"nlm {' '.join(args)} failed (exit {proc.returncode}): {err_msg}"
            )

        raw = stdout.decode().strip()
        if not raw:
            return {} if parse_json else ""

        if parse_json:
            try:
                return json.loads(raw)
            except json.JSONDecodeError:
                return {"raw": raw}
        return raw

    # ------------------------------------------------------------------
    # Notebook operations
    # ------------------------------------------------------------------

    async def list_notebooks(self) -> list[dict]:
        result = await self._run("notebook", "list", "--json")
        if isinstance(result, list):
            return result
        if isinstance(result, dict):
            if "value" in result and isinstance(result["value"], list):
                return result["value"]
            if "notebooks" in result:
                return result["notebooks"]
        return []

    async def get_notebook(self, notebook_id: str) -> dict:
        result = await self._run("notebook", "get", notebook_id, "--json")
        if isinstance(result, dict):
            # CLI returns {"value": {...}} wrapper
            if "value" in result:
                return result["value"]
            return result
        return {"id": notebook_id, "raw": result}

    async def create_notebook(self, title: str) -> dict:
        result = await self._run("notebook", "create", title)
        if isinstance(result, dict):
            if "value" in result:
                return result["value"]
            return result
        return {"title": title, "raw": result}

    async def query_notebook(self, notebook_id: str, question: str) -> str:
        result = await self._run("notebook", "query", notebook_id, question)
        if isinstance(result, dict):
            value = result.get("value", result)
            answer = value.get("answer", "")
            if isinstance(answer, str):
                return answer
            return str(value)
        return result if isinstance(result, str) else str(result)

    async def run_pipeline(self, notebook_id: str, pipeline_name: str, url: str) -> str:
        return await self._run("pipeline", "run", notebook_id, pipeline_name, "--url", url, parse_json=False)

    async def batch_studio(self, notebook_ids: list[str], artifact_type: str) -> str:
        return await self._run("batch", "studio", "--type", artifact_type, "--notebooks", ",".join(notebook_ids), "--confirm", parse_json=False)

    async def delete_notebook(self, notebook_id: str) -> bool:
        await self._run("notebook", "delete", notebook_id, "--confirm", parse_json=False)
        return True

    async def describe_notebook(self, notebook_id: str) -> str:
        result = await self._run("notebook", "describe", notebook_id)
        if isinstance(result, dict):
            # CLI returns {"value": {"summary": [...], "suggested_topics": [...]}}
            value = result.get("value", result)
            summary_list = value.get("summary", [])
            if isinstance(summary_list, list) and summary_list:
                return "\n\n".join(summary_list)
            return str(value)
        return result if isinstance(result, str) else str(result)

    async def list_sources(self, notebook_id: str) -> list[dict]:
        result = await self._run("source", "list", notebook_id, "--json")
        if isinstance(result, list):
            return result
        if isinstance(result, dict):
            if "value" in result and isinstance(result["value"], list):
                return result["value"]
            if "sources" in result:
                return result["sources"]
        return []

    # ------------------------------------------------------------------
    # Studio / artifact operations
    # ------------------------------------------------------------------

    async def create_artifact(
        self,
        notebook_id: str,
        artifact_type: str,
        options: Optional[dict] = None,
    ) -> dict:
        # CLI uses separate commands per type:
        # nlm audio create, nlm video create, nlm report create, etc.
        type_to_cmd: dict[str, str] = {
            "audio": "audio",
            "video": "video",
            "report": "report",
            "quiz": "quiz",
            "flashcards": "flashcards",
            "mind_map": "mindmap",
            "slide_deck": "slides",
            "infographic": "infographic",
            "data_table": "data-table",
        }
        cli_type = type_to_cmd.get(artifact_type, artifact_type)
        cmd: list[str] = [cli_type, "create", notebook_id, "--confirm"]

        # Map option keys to CLI flags
        option_key_map: dict[str, str] = {
            "formats": "format",
            "styles": "style",
            "length": "length",
            "difficulty": "difficulty",
            "question_count": "count",
            "orientation": "orientation",
            "description": "description",
            "focus": "focus",
        }
        if options:
            for key, value in options.items():
                flag = option_key_map.get(key, key)
                cmd.extend([f"--{flag}", str(value)])

        result = await self._run(*cmd, parse_json=False)
        return {"status": "creating", "raw": result}

    async def studio_status(self, notebook_id: str) -> list | dict:
        result = await self._run("studio", "status", notebook_id, "--json")
        if isinstance(result, list):
            return result
        if isinstance(result, dict):
            if "value" in result:
                return result["value"]
            return result
        return []

    async def delete_artifact(
        self, notebook_id: str, artifact_id: str
    ) -> bool:
        await self._run(
            "studio", "delete", notebook_id, artifact_id, "--confirm",
            parse_json=False,
        )
        return True

    async def download_artifact(
        self,
        notebook_id: str,
        artifact_id: str,
        artifact_type: str,
        output_path: str,
    ) -> str:
        await self._run(
            "download",
            artifact_type,
            notebook_id,
            artifact_id,
            "--output",
            output_path,
            parse_json=False,
        )
        return output_path

    # ------------------------------------------------------------------
    # Source operations
    # ------------------------------------------------------------------

    async def add_source_url(self, notebook_id: str, url: str, wait: bool = True) -> str:
        cmd = ["source", "add", notebook_id, "--url", url]
        if wait:
            cmd.append("--wait")
        return await self._run(*cmd, parse_json=False)

    async def add_source_text(self, notebook_id: str, text: str, title: str = "") -> str:
        cmd = ["source", "add", notebook_id, "--text", text]
        if title:
            cmd.extend(["--title", title])
        cmd.append("--wait")
        return await self._run(*cmd, parse_json=False)

    async def add_source_youtube(self, notebook_id: str, url: str) -> str:
        cmd = ["source", "add", notebook_id, "--youtube", url, "--wait"]
        return await self._run(*cmd, parse_json=False)

    # ------------------------------------------------------------------
    # Research operations
    # ------------------------------------------------------------------

    async def research_start(self, notebook_id: str, query: str, mode: str = "fast", source: str = "web") -> str:
        cmd = ["research", "start", query, "--notebook-id", notebook_id, "--mode", mode, "--source", source]
        return await self._run(*cmd, parse_json=False)

    async def research_status(self, notebook_id: str) -> str:
        cmd = ["research", "status", notebook_id, "--max-wait", "0"]
        return await self._run(*cmd, parse_json=False)

    async def research_import(self, notebook_id: str) -> str:
        cmd = ["research", "import", notebook_id]
        return await self._run(*cmd, parse_json=False)

    # ------------------------------------------------------------------
    # Auth operations
    # ------------------------------------------------------------------

    async def check_auth(self) -> dict:
        try:
            result = await self._run("login", "--check", parse_json=False)
            return {"authenticated": True, "message": result}
        except NLMClientError:
            return {"authenticated": False, "message": "Not authenticated"}

    async def refresh_auth(self) -> dict:
        try:
            result = await self._run("login", "--refresh", parse_json=False)
            return {"refreshed": True, "message": result}
        except NLMClientError as exc:
            return {"refreshed": False, "message": str(exc)}


async def init_client() -> NLMClientWrapper:
    global _client_instance
    _client_instance = NLMClientWrapper()
    await _client_instance.initialize()
    return _client_instance


async def shutdown_client() -> None:
    global _client_instance
    if _client_instance is not None:
        await _client_instance.close()
        _client_instance = None


def get_client() -> NLMClientWrapper:
    if _client_instance is None:
        raise RuntimeError("NLMClientWrapper has not been initialized")
    return _client_instance
