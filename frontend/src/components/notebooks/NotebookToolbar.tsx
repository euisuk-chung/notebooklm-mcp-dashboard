import SearchInput from "../ui/SearchInput";

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
  const viewOptions: { mode: ViewMode; title: string; icon: React.ReactNode }[] = [
    {
      mode: "list",
      title: "리스트 보기",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      mode: "card",
      title: "카드 보기",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      mode: "table",
      title: "테이블 보기",
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="w-full max-w-sm">
          <SearchInput
            value={search}
            onChange={onSearchChange}
            placeholder="노트북 검색..."
          />
        </div>
        {totalCount !== undefined && (
          <span className="whitespace-nowrap text-sm text-gray-500">
            {totalCount}개
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onToggleRangeMode && (
          <button
            onClick={onToggleRangeMode}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
              rangeMode
                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            }`}
            title="구간 선택: 활성화 후 시작점 클릭 → 끝점 클릭으로 구간 전체 선택"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-8 5h8M5 7h.01M5 12h.01M5 17h.01" />
            </svg>
            {rangeMode ? "구간 선택 중..." : "구간 선택"}
          </button>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            title="노트북 목록 새로고침"
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
            {isRefreshing ? "불러오는 중..." : "새로고침"}
          </button>
        )}

        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="updated_at">수정일</option>
          <option value="created_at">생성일</option>
          <option value="title">이름</option>
          <option value="source_count">소스 수</option>
        </select>

        <button
          onClick={() => onSortOrderChange(sortOrder === "desc" ? "asc" : "desc")}
          className="flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          title={sortOrder === "desc" ? "내림차순 (최신/큰 값 먼저)" : "오름차순 (오래된/작은 값 먼저)"}
        >
          <svg
            className={`h-4 w-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <span className="text-xs">{sortOrder === "desc" ? "↓" : "↑"}</span>
        </button>

        <div className="flex rounded-lg border border-gray-300">
          {viewOptions.map(({ mode, title, icon }, idx) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={`px-3 py-2 text-sm transition-colors ${
                viewMode === mode
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              } ${idx === 0 ? "rounded-l-lg" : ""} ${idx === viewOptions.length - 1 ? "rounded-r-lg" : ""}`}
              title={title}
            >
              {icon}
            </button>
          ))}
        </div>

        {onCreateNotebook && (
          <button
            onClick={onCreateNotebook}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 노트북
          </button>
        )}
      </div>
    </div>
  );
}
