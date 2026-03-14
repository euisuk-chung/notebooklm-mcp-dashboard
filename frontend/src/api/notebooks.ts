import { get, del, post } from "./client";
import type {
  NotebookListResponse,
  NotebookDetail,
  UsageInfo,
  BulkDeleteResponse,
} from "../types/notebook";

export function fetchNotebooks(): Promise<NotebookListResponse> {
  return get<NotebookListResponse>("/notebooks");
}

export function fetchNotebook(id: string): Promise<NotebookDetail> {
  return get<NotebookDetail>(`/notebooks/${id}`);
}

export function deleteNotebook(id: string): Promise<void> {
  return del(`/notebooks/${id}`);
}

export function bulkDeleteNotebooks(
  notebookIds: string[]
): Promise<BulkDeleteResponse> {
  return post<BulkDeleteResponse>("/notebooks/bulk-delete", {
    notebook_ids: notebookIds,
  });
}

export function fetchUsage(): Promise<UsageInfo> {
  return get<UsageInfo>("/notebooks/usage");
}

export function createNotebook(title: string) {
  return post("/notebooks", { title });
}

export function queryNotebook(notebookId: string, question: string) {
  return post<{ answer: string }>(`/notebooks/${notebookId}/query`, { question });
}
