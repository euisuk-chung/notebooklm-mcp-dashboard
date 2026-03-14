import { useNavigate } from "react-router-dom";
import type { Notebook } from "../../types/notebook";
import Badge from "../ui/Badge";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { formatDate, formatRelativeTimeI18n } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";

interface NotebookListItemProps {
  notebook: Notebook;
  selected: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotebookListItem({
  notebook,
  selected,
  onToggle,
  onDelete,
}: NotebookListItemProps) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const dateStr = notebook.updated_at ?? notebook.created_at;

  return (
    <div
      className={`group flex items-center gap-4 border-b border-gray-100 bg-white px-4 py-3 transition-colors hover:bg-indigo-50/40 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-indigo-950/40 ${
        selected ? "bg-indigo-50/60 dark:bg-indigo-950/60" : ""
      }`}
    >
      {/* Checkbox */}
      <div className="shrink-0">
        <Checkbox
          checked={selected}
          onChange={() => onToggle(notebook.id)}
        />
      </div>

      {/* Date column */}
      <div className="w-28 shrink-0 text-center">
        <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {dateStr ? formatDate(dateStr, lang) : "-"}
        </div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500">
          {dateStr ? formatRelativeTimeI18n(dateStr, t, lang) : ""}
        </div>
      </div>

      {/* Dot connector */}
      <div className="flex shrink-0 flex-col items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${
          notebook.source_count > 0 ? "bg-indigo-500" : "bg-gray-300 dark:bg-gray-600"
        }`} />
      </div>

      {/* Content - clickable */}
      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => navigate(`/notebooks/${notebook.id}`)}
      >
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
            {notebook.title || t("common.untitled")}
          </h3>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {t("common.sources", { count: notebook.source_count })}
          </span>
        </div>
        {notebook.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {notebook.tags.map((tag) => (
              <Badge key={tag} label={tag} variant="tag" />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notebook.id);
          }}
          className="text-red-500 opacity-0 group-hover:opacity-100"
        >
          {t("common.delete")}
        </Button>
      </div>
    </div>
  );
}
