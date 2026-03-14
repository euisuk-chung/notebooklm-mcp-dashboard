import { useState } from "react";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import { ARTIFACT_CONFIGS } from "../../utils/constants";
import { useLanguage } from "../../contexts/LanguageContext";

interface BulkActionsBarProps {
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  isDeleting: boolean;
  onBulkCreate?: (artifactType: string) => void;
  isBulkCreating?: boolean;
}

export default function BulkActionsBar({
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onDeleteSelected,
  isDeleting,
  onBulkCreate,
  isBulkCreating,
}: BulkActionsBarProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showArtifactMenu, setShowArtifactMenu] = useState(false);
  const { t } = useLanguage();

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("bulk.selected", { count: selectedCount })}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSelectAll}>
              {t("bulk.selectAll")}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDeselectAll}>
              {t("bulk.deselectAll")}
            </Button>
            {onBulkCreate && (
              <div className="relative">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowArtifactMenu(!showArtifactMenu)}
                  loading={isBulkCreating}
                >
                  {t("bulk.createContent")}
                </Button>
                {showArtifactMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                    {Object.entries(ARTIFACT_CONFIGS).map(([type, config]) => (
                      <button
                        key={type}
                        onClick={() => {
                          onBulkCreate(type);
                          setShowArtifactMenu(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {config.emoji} {t(config.labelKey)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowConfirm(true)}
              loading={isDeleting}
            >
              {t("bulk.deleteSelected")}
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onDeleteSelected();
          setShowConfirm(false);
        }}
        title={t("bulk.deleteTitle")}
        message={t("bulk.deleteMessage", { count: selectedCount })}
        confirmLabel={t("common.delete")}
        loading={isDeleting}
      />
    </>
  );
}
