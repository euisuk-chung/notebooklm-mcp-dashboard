import { useNavigate } from "react-router-dom";
import type { Notebook } from "../../types/notebook";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Checkbox from "../ui/Checkbox";
import { formatRelativeTimeI18n } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";

interface NotebookCardProps {
  notebook: Notebook;
  selected: boolean;
  onToggle: (id: string) => void;
}

export default function NotebookCard({
  notebook,
  selected,
  onToggle,
}: NotebookCardProps) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/notebooks/${notebook.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400">
            {notebook.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("common.sources", { count: notebook.source_count })}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={selected}
            onChange={() => onToggle(notebook.id)}
          />
        </div>
      </div>
      {notebook.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {notebook.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="tag" />
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        {notebook.created_at
          ? formatRelativeTimeI18n(notebook.created_at, t, lang)
          : t("common.noDate")}
      </p>
    </Card>
  );
}
