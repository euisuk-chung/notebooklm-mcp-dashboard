import { useNavigate } from "react-router-dom";
import type { Notebook } from "../../types/notebook";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import Checkbox from "../ui/Checkbox";
import { formatRelativeTime } from "../../utils/formatters";

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

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-md"
      onClick={() => navigate(`/notebooks/${notebook.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-indigo-600">
            {notebook.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            소스 {notebook.source_count}개
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
      <p className="mt-3 text-xs text-gray-400">
        {notebook.created_at
          ? formatRelativeTime(notebook.created_at)
          : "날짜 없음"}
      </p>
    </Card>
  );
}
