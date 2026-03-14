import { useNavigate } from "react-router-dom";
import type { Notebook } from "../../types/notebook";
import Badge from "../ui/Badge";
import Checkbox from "../ui/Checkbox";
import Button from "../ui/Button";
import { formatDate } from "../../utils/formatters";
import { useLanguage } from "../../contexts/LanguageContext";

interface NotebookRowProps {
  notebook: Notebook;
  selected: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotebookRow({
  notebook,
  selected,
  onToggle,
  onDelete,
}: NotebookRowProps) {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();

  return (
    <tr className="group border-b border-gray-100 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800">
      <td className="py-3 pl-4 pr-2">
        <Checkbox
          checked={selected}
          onChange={() => onToggle(notebook.id)}
        />
      </td>
      <td
        className="cursor-pointer py-3 pr-4 font-medium text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400"
        onClick={() => navigate(`/notebooks/${notebook.id}`)}
      >
        {notebook.title}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-500 dark:text-gray-400">
        {notebook.source_count}
      </td>
      <td className="py-3 pr-4">
        <div className="flex flex-wrap gap-1">
          {notebook.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="tag" />
          ))}
        </div>
      </td>
      <td className="py-3 pr-4 text-sm text-gray-400 dark:text-gray-500">
        {notebook.created_at ? formatDate(notebook.created_at, lang) : "-"}
      </td>
      <td className="py-3 pr-4">
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
      </td>
    </tr>
  );
}
