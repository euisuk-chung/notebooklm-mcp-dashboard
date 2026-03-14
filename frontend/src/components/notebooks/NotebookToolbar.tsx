import SearchInput from "../ui/SearchInput";
import { useLanguage } from "../../contexts/LanguageContext";

type ViewMode = "card" | "table" | "list";
type SortKey = "title" | "created_at" | "updated_at" | "source_count";
type SortOrder = "asc" | "desc";

interface NotebookToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  totalCount?: number;
  rangeMode?: boolean;
  onToggleRangeMode?: () => void;
  onCreateNotebook?: () => void;
}

export default function NotebookToolbar({
  search,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortKey,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  onRefresh,
  isRefreshing,
  totalCount,
  rangeMode,
  onToggleRangeMode,
  onCreateNotebook,
}: NotebookToolbarProps) {
  const { t } = useLanguage();

  const viewOptions: { mode: ViewMode; titleKey: string; icon: React.ReactNode }[] = [
    {
      mode: "list",
      titleKey: "toolbar.list",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      mode: "card",
      titleKey: "toolbar.card",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      mode: "table",
      titleKey: "toolbar.table",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {/* Row 1: Search + Create */}
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder={t("toolbar.search")}
          />
        </div>
        {totalCount !== undefined && (
          <span className="whitespace-nowrap text-sm tabular-nums text-gray-400 dark:text-gray-500">
            {t("notebooks.count", { count: totalCount })}
          </span>
        )}
        {onCreateNotebook && (
          <button
            onClick={onCreateNotebook}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t("toolbar.newNotebook")}
          </button>
        )}
      </div>

      {/* Row 2: Tools - icon buttons in a compact row */}
      <div className="flex items-center gap-1.5">
        {/* Range select */}
        {onToggleRangeMode && (
          <button
            onClick={onToggleRangeMode}
            className={`rounded-lg border p-2 transition-colors ${
              rangeMode
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            }`}
            title={rangeMode ? t("toolbar.rangeSelecting") : t("toolbar.rangeSelect")}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-8 5h8M5 7h.01M5 12h.01M5 17h.01" />
            </svg>
          </button>
        )}

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            title={t("toolbar.refresh")}
          >
            <svg
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        )}

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />

        {/* Sort */}
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="updated_at">{t("toolbar.sortModified")}</option>
          <option value="created_at">{t("toolbar.sortCreated")}</option>
          <option value="title">{t("toolbar.sortName")}</option>
          <option value="source_count">{t("toolbar.sortSources")}</option>
        </select>

        <button
          onClick={() => onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")}
          className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          title={sortOrder === "desc" ? t("toolbar.descending") : t("toolbar.ascending")}
        >
          <svg
            className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
        </button>

        {/* Divider */}
        <div className="mx-1 h-5 w-px bg-gray-200 dark:bg-gray-700" />

        {/* View toggle */}
        <div className="flex rounded-lg border border-gray-200 dark:border-gray-600">
          {viewOptions.map(({ mode, titleKey, icon }, idx) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`p-2 transition-colors ${
                viewMode === mode
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              } ${idx === 0 ? "rounded-l-lg" : ""} ${idx === viewOptions.length - 1 ? "rounded-r-lg" : ""}`}
              title={t(titleKey)}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* Range mode indicator */}
        {rangeMode && (
          <span className="ml-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {t("toolbar.rangeSelecting")}
          </span>
        )}
      </div>
    </div>
  );
}
