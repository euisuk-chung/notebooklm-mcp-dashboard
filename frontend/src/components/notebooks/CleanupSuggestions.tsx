import { useState } from "react";
import type { CleanupSuggestion } from "../../types/notebook";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Dialog from "../ui/Dialog";
import { formatRelativeTimeI18n } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";

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
  const { t, lang } = useLanguage();

  if (suggestions.length === 0) return null;

  return (
    <>
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {t("cleanup.title")}
          </h3>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowConfirm(true)}
            loading={isDeleting}
          >
            {t("cleanup.deleteAll")}
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {t("cleanup.description")}
        </p>
        <ul className="mt-3 divide-y divide-gray-100 dark:divide-gray-800">
          {suggestions.map((s) => (
            <li
              key={s.notebook_id}
              className="flex items-center justify-between py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                  {s.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {s.reason}
                  {s.last_accessed && (
                    <> &middot; {formatRelativeTimeI18n(s.last_accessed, t, lang)}</>
                  )}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(s.notebook_id)}
                className="ml-2 shrink-0 text-red-500"
              >
                {t("common.delete")}
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
        title={t("cleanup.confirmTitle")}
        message={t("cleanup.confirmMessage", { count: suggestions.length })}
        confirmLabel={t("cleanup.deleteAll")}
        loading={isDeleting}
      />
    </>
  );
}
