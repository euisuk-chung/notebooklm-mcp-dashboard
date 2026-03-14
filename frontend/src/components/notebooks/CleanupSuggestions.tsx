import { useState } from "react";
import type { CleanupSuggestion } from "../../types/notebook";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Dialog from "../ui/Dialog";
import { formatRelativeTime } from "../../utils/formatters";

interface CleanupSuggestionsProps {
  suggestions: CleanupSuggestion[];
  onDelete: (notebookId: string) => void;
  onDeleteAll: (notebookIds: string[]) => void;
  isDeleting: boolean;
}

export default function CleanupSuggestions({
  suggestions,
  onDelete,
  onDeleteAll,
  isDeleting,
}: CleanupSuggestionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  if (suggestions.length === 0) return null;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">
            정리 제안
          </h3>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowConfirm(true)}
            loading={isDeleting}
          >
            전체 삭제
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          오랫동안 사용하지 않은 노트북입니다
        </p>
        <ul className="mt-3 divide-y divide-gray-100">
          {suggestions.map((s) => (
            <li
              key={s.notebook_id}
              className="flex items-center justify-between py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800">
                  {s.title}
                </p>
                <p className="text-xs text-gray-400">
                  {s.reason}
                  {s.last_accessed && (
                    <> &middot; {formatRelativeTime(s.last_accessed)}</>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(s.notebook_id)}
                className="ml-2 shrink-0 text-red-500"
              >
                삭제
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      <Dialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onDeleteAll(suggestions.map((s) => s.notebook_id));
          setShowConfirm(false);
        }}
        title="전체 정리"
        message={`제안된 ${suggestions.length}개의 노트북을 모두 삭제하시겠습니까?`}
        confirmLabel="전체 삭제"
        loading={isDeleting}
      />
    </>
  );
}
