import type { Artifact } from "../../types/studio";
import { ARTIFACT_CONFIGS } from "../../utils/constants";
import Card from "../ui/Card";
import { StatusBadge } from "../ui/Badge";
import Button from "../ui/Button";
import Spinner from "../ui/Spinner";
import { formatRelativeTime } from "../../utils/formatters";
import { downloadArtifact } from "../../api/studio";

interface ArtifactCardProps {
  artifact: Artifact;
  notebookId: string;
  onDelete: (id: string) => void;
}

export default function ArtifactCard({
  artifact,
  notebookId,
  onDelete,
}: ArtifactCardProps) {
  const config = ARTIFACT_CONFIGS[artifact.artifact_type];
  const isGenerating =
    artifact.status === "pending" || artifact.status === "generating";
  const isComplete = artifact.status === "complete";

  return (
    <Card className="flex items-center gap-4">
      <span className="text-2xl">{config?.emoji ?? "?"}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {config?.label ?? artifact.artifact_type}
          </span>
          <StatusBadge status={artifact.status} />
        </div>
        <p className="mt-0.5 text-xs text-gray-400">
          {artifact.created_at
            ? formatRelativeTime(artifact.created_at)
            : ""}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isGenerating && <Spinner size="sm" />}
        {isComplete && (
          <a
            href={downloadArtifact(notebookId, artifact.id)}
            download
            className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
          >
            다운로드
          </a>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(artifact.id)}
          className="text-red-500"
        >
          삭제
        </Button>
      </div>
    </Card>
  );
}
