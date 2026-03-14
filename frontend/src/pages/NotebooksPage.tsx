import { useState, useMemo, useCallback } from "react";
import AppShell from "../components/layout/AppShell";
import NotebookToolbar from "../components/notebooks/NotebookToolbar";
import NotebookList from "../components/notebooks/NotebookList";
import BulkActionsBar from "../components/notebooks/BulkActionsBar";
import UsageDisplay from "../components/notebooks/UsageDisplay";
import CleanupSuggestions from "../components/notebooks/CleanupSuggestions";
import CreateNotebookDialog from "../components/notebooks/CreateNotebookDialog";
import Dialog from "../components/ui/Dialog";
import {
  useNotebooks,
  useDeleteNotebook,
  useBulkDelete,
  useUsage,
} from "../hooks/useNotebooks";
import { useBulkSelect } from "../hooks/useBulkSelect";
import { useBulkCreateArtifact } from "../hooks/useStudio";
import Button from "../components/ui/Button";
import type { Notebook } from "../types/notebook";

type ViewMode = "card" | "table" | "list";
type SortKey = "title" | "created_at" | "updated_at" | "source_count";
type SortOrder = "asc" | "desc";

export default function NotebooksPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showCleanup, setShowCleanup] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const {
    data: notebooksData,
    isLoading: notebooksLoading,
    error: notebooksError,
    refetch: refetchNotebooks,
    isFetching: notebooksFetching,
  } = useNotebooks();
  const { data: usageData, isLoading: usageLoading, refetch: refetchUsage } = useUsage();
  const deleteMutation = useDeleteNotebook();
  const bulkDeleteMutation = useBulkDelete();
  const bulkCreateMutation = useBulkCreateArtifact();

  const notebooks = notebooksData?.notebooks ?? [];

  const filtered = useMemo(() => {
    let list = [...notebooks];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (nb) =>
          nb.title.toLowerCase().includes(q) ||
          nb.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "title":
          cmp = a.title.localeCompare(b.title);
          break;
        case "source_count":
          cmp = a.source_count - b.source_count;
          break;
        case "created_at":
          cmp = new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime();
          break;
        case "updated_at":
        default:
          cmp = new Date(a.updated_at ?? 0).getTime() - new Date(b.updated_at ?? 0).getTime();
          break;
      }
      return sortOrder === "desc" ? -cmp : cmp;
    });

    return list;
  }, [notebooks, search, sortKey, sortOrder]);

  const allIds = useMemo(() => filtered.map((nb) => nb.id), [filtered]);
  const bulk = useBulkSelect(allIds);

  const handleDeleteSingle = useCallback((id: string) => {
    setDeleteTarget(id);
  }, []);

  const confirmDeleteSingle = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleBulkDelete = () => {
    const ids = Array.from(bulk.selectedIds);
    bulkDeleteMutation.mutate(ids, {
      onSuccess: () => bulk.deselectAll(),
    });
  };

  const handleCleanupDelete = (notebookId: string) => {
    deleteMutation.mutate(notebookId);
  };

  const handleCleanupDeleteAll = (notebookIds: string[]) => {
    bulkDeleteMutation.mutate(notebookIds);
  };

  const handleRefresh = () => {
    refetchNotebooks();
    refetchUsage();
  };

  const handleBulkCreate = (artifactType: string) => {
    const ids = Array.from(bulk.selectedIds);
    bulkCreateMutation.mutate({ notebookIds: ids, artifactType });
  };

  return (
    <AppShell>
      <div className={`flex gap-6 ${bulk.selectedCount > 0 ? "pb-20" : ""}`}>
        <div className="min-w-0 flex-1 space-y-5">
          <UsageDisplay usage={usageData} isLoading={usageLoading} />

          <NotebookToolbar
            search={search}
            onSearchChange={setSearch}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortKey={sortKey}
            onSortChange={setSortKey}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            onRefresh={handleRefresh}
            isRefreshing={notebooksFetching}
            totalCount={notebooksData?.total_count}
            rangeMode={bulk.rangeMode}
            onToggleRangeMode={bulk.toggleRangeMode}
            onCreateNotebook={() => setShowCreateDialog(true)}
          />

          {notebooksError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">노트북을 불러올 수 없습니다</p>
                  <p className="mt-1 text-xs text-red-600">
                    인증이 만료되었을 수 있습니다. 터미널에서 <code className="rounded bg-red-100 px-1 py-0.5 font-mono">nlm login</code>을 실행한 후 새로고침하세요.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    className="mt-2 text-red-700 hover:text-red-900"
                  >
                    다시 시도
                  </Button>
                </div>
              </div>
            </div>
          )}

          <NotebookList
            notebooks={filtered}
            viewMode={viewMode}
            isLoading={notebooksLoading}
            isSelected={bulk.isSelected}
            onToggle={bulk.toggle}
            onDelete={handleDeleteSingle}
          />
        </div>

        {/* Cleanup sidebar */}
        <div className="hidden w-80 shrink-0 lg:block">
          <div className="sticky top-20">
            <button
              onClick={() => setShowCleanup(!showCleanup)}
              className="mb-3 flex w-full items-center justify-between rounded-lg px-1 text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <span>정리 제안</span>
              <svg
                className={`h-4 w-4 transition-transform ${showCleanup ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showCleanup && (
              <CleanupSuggestions
                suggestions={usageData?.cleanup_suggestions ?? []}
                onDelete={handleCleanupDelete}
                onDeleteAll={handleCleanupDeleteAll}
                isDeleting={deleteMutation.isPending || bulkDeleteMutation.isPending}
              />
            )}
          </div>
        </div>
      </div>

      <BulkActionsBar
        selectedCount={bulk.selectedCount}
        onSelectAll={bulk.selectAll}
        onDeselectAll={bulk.deselectAll}
        onDeleteSelected={handleBulkDelete}
        isDeleting={bulkDeleteMutation.isPending}
        onBulkCreate={handleBulkCreate}
        isBulkCreating={bulkCreateMutation.isPending}
      />

      <Dialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteSingle}
        title="노트북 삭제"
        message="이 노트북을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmLabel="삭제"
        loading={deleteMutation.isPending}
      />

      <CreateNotebookDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </AppShell>
  );
}
