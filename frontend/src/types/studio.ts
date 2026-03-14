export type ArtifactType =
  | "audio"
  | "video"
  | "report"
  | "quiz"
  | "flashcards"
  | "mind_map"
  | "slide_deck"
  | "infographic"
  | "data_table";

export interface Artifact {
  id: string;
  artifact_type: ArtifactType;
  status: string;
  created_at: string | null;
}

export interface CreateArtifactRequest {
  artifact_type: ArtifactType;
  options?: Record<string, unknown>;
}

export interface StudioStatusResponse {
  artifacts: Artifact[];
}

export const ARTIFACT_OPTIONS: Record<string, Record<string, unknown>> = {
  audio: {
    formats: ["mp3", "wav", "ogg"],
    styles: ["podcast", "lecture", "summary", "conversation"],
    voice_count: [1, 2],
  },
  video: {
    formats: ["mp4", "webm"],
    styles: ["explainer", "presentation", "tutorial"],
    resolution: ["720p", "1080p"],
  },
  report: {
    formats: ["pdf", "docx", "html", "markdown"],
    styles: ["executive_summary", "detailed", "bullet_points"],
    length: ["short", "medium", "long"],
  },
  quiz: {
    formats: ["json", "pdf"],
    question_types: ["multiple_choice", "true_false", "short_answer", "mixed"],
    difficulty: ["easy", "medium", "hard"],
    question_count: [5, 10, 15, 20],
  },
  flashcards: {
    formats: ["json", "csv", "anki"],
    styles: ["term_definition", "question_answer", "cloze"],
    card_count: [10, 20, 30, 50],
  },
  mind_map: {
    formats: ["svg", "png", "json"],
    styles: ["radial", "hierarchical", "organic"],
    depth: [2, 3, 4, 5],
  },
  slide_deck: {
    formats: ["pptx", "pdf", "html"],
    styles: ["minimal", "professional", "academic"],
    slide_count: [5, 10, 15, 20],
  },
  infographic: {
    formats: ["svg", "png", "pdf"],
    styles: ["timeline", "comparison", "statistics", "process"],
    orientation: ["portrait", "landscape"],
  },
  data_table: {
    formats: ["csv", "json", "xlsx"],
    styles: ["summary", "detailed", "comparison"],
  },
};
