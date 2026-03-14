import type { ArtifactType } from "../types/studio";

interface ArtifactConfig {
  emoji: string;
  label: string;
  description: string;
}

export const ARTIFACT_CONFIGS: Record<ArtifactType, ArtifactConfig> = {
  audio: {
    emoji: "\uD83C\uDF99\uFE0F",
    label: "\uD314\uCE90\uC2A4\uD2B8",
    description: "\uB178\uD2B8\uBD81 \uB0B4\uC6A9\uC744 \uC624\uB514\uC624\uB85C \uBCC0\uD658\uD569\uB2C8\uB2E4",
  },
  video: {
    emoji: "\uD83C\uDFAC",
    label: "\uC601\uC0C1",
    description: "\uC601\uC0C1 \uCF58\uD150\uCE20\uB97C \uC0DD\uC131\uD569\uB2C8\uB2E4",
  },
  report: {
    emoji: "\uD83D\uDCDD",
    label: "\uB9AC\uD3EC\uD2B8",
    description: "\uC694\uC57D \uBCF4\uACE0\uC11C\uB97C \uC791\uC131\uD569\uB2C8\uB2E4",
  },
  quiz: {
    emoji: "\u2753",
    label: "\uD034\uC988",
    description: "\uD559\uC2B5 \uD034\uC988\uB97C \uC0DD\uC131\uD569\uB2C8\uB2E4",
  },
  flashcards: {
    emoji: "\uD83D\uDCC7",
    label: "\uD50C\uB798\uC2DC\uCE74\uB4DC",
    description: "\uC554\uAE30\uC6A9 \uD50C\uB798\uC2DC\uCE74\uB4DC\uB97C \uB9CC\uB4ED\uB2C8\uB2E4",
  },
  mind_map: {
    emoji: "\uD83E\uDDE0",
    label: "\uB9C8\uC778\uB4DC\uB9F5",
    description: "\uC2DC\uAC01\uC801 \uB9C8\uC778\uB4DC\uB9F5\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4",
  },
  slide_deck: {
    emoji: "\uD83D\uDCCA",
    label: "\uC2AC\uB77C\uC774\uB4DC",
    description: "\uD504\uB808\uC820\uD14C\uC774\uC158\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4",
  },
  infographic: {
    emoji: "\uD83D\uDCC8",
    label: "\uC778\uD3EC\uADF8\uB798\uD53D",
    description: "\uC778\uD3EC\uADF8\uB798\uD53D\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4",
  },
  data_table: {
    emoji: "\uD83D\uDCCB",
    label: "\uB370\uC774\uD130\uD14C\uC774\uBE14",
    description: "\uC815\uB9AC\uB41C \uB370\uC774\uD130 \uD14C\uC774\uBE14\uC744 \uC0DD\uC131\uD569\uB2C8\uB2E4",
  },
};
