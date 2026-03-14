import type { ArtifactType } from "../types/studio";

interface ArtifactConfig {
  emoji: string;
  labelKey: string;
  descriptionKey: string;
}

export const ARTIFACT_CONFIGS: Record<ArtifactType, ArtifactConfig> = {
  audio: {
    emoji: "\uD83C\uDF99\uFE0F",
    labelKey: "artifact.audio",
    descriptionKey: "artifact.audio.desc",
  },
  video: {
    emoji: "\uD83C\uDFAC",
    labelKey: "artifact.video",
    descriptionKey: "artifact.video.desc",
  },
  report: {
    emoji: "\uD83D\uDCDD",
    labelKey: "artifact.report",
    descriptionKey: "artifact.report.desc",
  },
  quiz: {
    emoji: "\u2753",
    labelKey: "artifact.quiz",
    descriptionKey: "artifact.quiz.desc",
  },
  flashcards: {
    emoji: "\uD83D\uDCC7",
    labelKey: "artifact.flashcards",
    descriptionKey: "artifact.flashcards.desc",
  },
  mind_map: {
    emoji: "\uD83E\uDDE0",
    labelKey: "artifact.mind_map",
    descriptionKey: "artifact.mind_map.desc",
  },
  slide_deck: {
    emoji: "\uD83D\uDCCA",
    labelKey: "artifact.slide_deck",
    descriptionKey: "artifact.slide_deck.desc",
  },
  infographic: {
    emoji: "\uD83D\uDCC8",
    labelKey: "artifact.infographic",
    descriptionKey: "artifact.infographic.desc",
  },
  data_table: {
    emoji: "\uD83D\uDCCB",
    labelKey: "artifact.data_table",
    descriptionKey: "artifact.data_table.desc",
  },
};
