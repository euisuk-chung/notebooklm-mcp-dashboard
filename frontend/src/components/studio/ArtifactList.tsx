import type { Artifact } from "../../types/studio";
import ArtifactCard from "./ArtifactCard";
import Spinner from "../ui/Spinner";
import { useLanguage } from "../../contexts/LanguageContext";

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
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (artifacts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-10 text-center dark:border-gray-600 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("studio.empty")}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {t("studio.emptyHint")}
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
