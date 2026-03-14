import { useState } from "react";
import type { ArtifactType } from "../../types/studio";
import { useStudioStatus, useCreateArtifact, useDeleteArtifact } from "../../hooks/useStudio";
import { ARTIFACT_CONFIGS } from "../../utils/constants";
import ArtifactTypeCard from "./ArtifactTypeCard";
import CreateArtifactForm from "./CreateArtifactForm";
import ArtifactList from "./ArtifactList";

interface ContentStudioProps {
  notebookId: string;
}

const ARTIFACT_TYPES = Object.keys(ARTIFACT_CONFIGS) as ArtifactType[];

export default function ContentStudio({ notebookId }: ContentStudioProps) {
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null);
  const { data: studioData, isLoading } = useStudioStatus(notebookId);
  const createMutation = useCreateArtifact(notebookId);
  const deleteMutation = useDeleteArtifact(notebookId);

  const handleCreate = (options: Record<string, unknown>) => {
    if (!selectedType) return;
    createMutation.mutate(
      { artifact_type: selectedType, options },
      { onSuccess: () => setSelectedType(null) }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Content Studio</h2>
        <p className="mt-1 text-sm text-gray-500">
          노트북의 내용을 다양한 형태로 변환합니다
        </p>
      </div>

      {selectedType ? (
        <CreateArtifactForm
          type={selectedType}
          onSubmit={handleCreate}
          onCancel={() => setSelectedType(null)}
          isCreating={createMutation.isPending}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
          {ARTIFACT_TYPES.map((type) => (
            <ArtifactTypeCard
              key={type}
              type={type}
              onClick={setSelectedType}
            />
          ))}
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          생성된 콘텐츠
        </h3>
        <ArtifactList
          artifacts={studioData?.artifacts ?? []}
          notebookId={notebookId}
          onDelete={(id) => deleteMutation.mutate(id)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
