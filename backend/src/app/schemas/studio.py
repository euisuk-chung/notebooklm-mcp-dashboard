from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class ArtifactType(str, Enum):
    audio = "audio"
    video = "video"
    report = "report"
    quiz = "quiz"
    flashcards = "flashcards"
    mind_map = "mind_map"
    slide_deck = "slide_deck"
    infographic = "infographic"
    data_table = "data_table"


class CreateArtifactRequest(BaseModel):
    artifact_type: ArtifactType
    options: Optional[dict] = None


class ArtifactStatus(BaseModel):
    id: str
    artifact_type: ArtifactType
    status: str = "pending"
    created_at: Optional[datetime] = None


class StudioStatusResponse(BaseModel):
    artifacts: list[ArtifactStatus] = Field(default_factory=list)


class BulkCreateArtifactRequest(BaseModel):
    notebook_ids: list[str]
    artifact_type: ArtifactType


ARTIFACT_OPTIONS: dict[str, dict] = {
    "audio": {
        "formats": ["mp3", "wav", "ogg"],
        "styles": ["podcast", "lecture", "summary", "conversation"],
        "voice_count": [1, 2],
    },
    "video": {
        "formats": ["mp4", "webm"],
        "styles": ["explainer", "presentation", "tutorial"],
        "resolution": ["720p", "1080p"],
    },
    "report": {
        "formats": ["pdf", "docx", "html", "markdown"],
        "styles": ["executive_summary", "detailed", "bullet_points"],
        "length": ["short", "medium", "long"],
    },
    "quiz": {
        "formats": ["json", "pdf"],
        "question_types": ["multiple_choice", "true_false", "short_answer", "mixed"],
        "difficulty": ["easy", "medium", "hard"],
        "question_count": [5, 10, 15, 20],
    },
    "flashcards": {
        "formats": ["json", "csv", "anki"],
        "styles": ["term_definition", "question_answer", "cloze"],
        "card_count": [10, 20, 30, 50],
    },
    "mind_map": {
        "formats": ["svg", "png", "json"],
        "styles": ["radial", "hierarchical", "organic"],
        "depth": [2, 3, 4, 5],
    },
    "slide_deck": {
        "formats": ["pptx", "pdf", "html"],
        "styles": ["minimal", "professional", "academic"],
        "slide_count": [5, 10, 15, 20],
    },
    "infographic": {
        "formats": ["svg", "png", "pdf"],
        "styles": ["timeline", "comparison", "statistics", "process"],
        "orientation": ["portrait", "landscape"],
    },
    "data_table": {
        "formats": ["csv", "json", "xlsx"],
        "styles": ["summary", "detailed", "comparison"],
    },
}
