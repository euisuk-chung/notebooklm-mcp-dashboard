import { useState } from "react";
import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import { ARTIFACT_CONFIGS } from "../../utils/constants";

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

  if (selectedCount === 0) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount}개 선택됨
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSelectAll}>
              전체 선택
            </Button>
            <Button variant="ghost" size="sm" onClick={onDeselectAll}>
              선택 해제
            </Button>
            {onBulkCreate && (
              <div className="relative">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowArtifactMenu(!showArtifactMenu)}
                  loading={isBulkCreating}
                >
                  콘텐츠 생성
                </Button>
                {showArtifactMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    {Object.entries(ARTIFACT_CONFIGS).map(([type, config]) => (
                      <button
                        key={type}
                        onClick={() => {
                          onBulkCreate(type);
                          setShowArtifactMenu(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                      >
                        {config.emoji} {config.label}
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
              선택 삭제
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
        title="노트북 삭제"
        message={`선택한 ${selectedCount}개의 노트북을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        loading={isDeleting}
      />
    </>
  );
}
