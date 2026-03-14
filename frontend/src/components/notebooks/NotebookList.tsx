import type { Notebook } from "../../types/notebook";
import NotebookCard from "./NotebookCard";
import NotebookRow from "./NotebookRow";
import NotebookListItem from "./NotebookListItem";
import { useLanguage } from "../../contexts/LanguageContext";

type ViewMode = "card" | "table" | "list";

interface NotebookListProps {
  notebooks: Notebook[];
  viewMode: ViewMode;
  isLoading: boolean;
  isSelected: (id: string) => boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-4 w-1/3 rounded bg-gray-100 dark:bg-gray-800" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
        <div className="h-5 w-14 rounded-full bg-gray-100 dark:bg-gray-800" />
      </div>
      <div className="mt-3 h-3 w-1/4 rounded bg-gray-100 dark:bg-gray-800" />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900">
      <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="flex-1">
        <div className="h-4 w-64 rounded bg-gray-200 dark:bg-gray-700" />
        <div className="mt-1 h-3 w-20 rounded bg-gray-100 dark:bg-gray-800" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <tr className="border-b border-gray-100 dark:border-gray-800">
      <td className="py-3 pl-4 pr-2">
        <div className="h-4 w-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </td>
      <td className="py-3 pr-4">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </td>
      <td className="py-3 pr-4">
        <div className="h-4 w-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </td>
      <td className="py-3 pr-4">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </td>
      <td className="py-3 pr-4">
        <div className="h-4 w-20 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
      </td>
      <td className="py-3 pr-4" />
    </tr>
  );
}

export default function NotebookList({
  notebooks,
  viewMode,
  isLoading,
  isSelected,
  onToggle,
  onDelete,
}: NotebookListProps) {
  const { t } = useLanguage();

  if (isLoading) {
    if (viewMode === "card") {
      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (viewMode === "list") {
      return (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListSkeleton key={i} />
          ))}
        </div>
      );
    }
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <TableSkeleton key={i} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (notebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 dark:border-gray-600 dark:bg-gray-900">
        <svg
          className="h-12 w-12 text-gray-300 dark:text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400">
          {t("notebooks.empty")}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {t("notebooks.emptyHint")}
        </p>
      </div>
    );
  }

  if (viewMode === "card") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notebooks.map((nb) => (
          <NotebookCard
            key={nb.id}
            notebook={nb}
            selected={isSelected(nb.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
        {notebooks.map((nb) => (
          <NotebookListItem
            key={nb.id}
            notebook={nb}
            selected={isSelected(nb.id)}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
            <th className="py-3 pl-4 pr-2 font-medium">
              <span className="sr-only">{t("table.select")}</span>
            </th>
            <th className="py-3 pr-4 font-medium">{t("table.title")}</th>
            <th className="py-3 pr-4 font-medium">{t("table.sources")}</th>
            <th className="py-3 pr-4 font-medium">{t("table.tags")}</th>
            <th className="py-3 pr-4 font-medium">{t("table.created")}</th>
            <th className="py-3 pr-4 font-medium">
              <span className="sr-only">{t("table.actions")}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {notebooks.map((nb) => (
            <NotebookRow
              key={nb.id}
              notebook={nb}
              selected={isSelected(nb.id)}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
