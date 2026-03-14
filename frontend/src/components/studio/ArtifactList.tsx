import type { Artifact } from "../../types/studio";
import ArtifactCard from "./ArtifactCard";
import Spinner from "../ui/Spinner";

interface ArtifactListProps {
  artifacts: Artifact[];
  notebookId: string;
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function ArtifactList({
  artifacts,
  notebookId,
  onDelete,
  isLoading,
}: ArtifactListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center">
        <p className="text-sm text-gray-500">
          생성된 콘텐츠가 없습니다
        </p>
        <p className="mt-1 text-xs text-gray-400">
          위에서 유형을 선택하여 콘텐츠를 생성해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {artifacts.map((artifact) => (
        <ArtifactCard
          key={artifact.id}
          artifact={artifact}
          notebookId={notebookId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
