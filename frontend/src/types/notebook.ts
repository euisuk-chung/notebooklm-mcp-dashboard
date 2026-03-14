export interface Notebook {
  id: string;
  title: string;
  source_count: number;
  created_at: string | null;
  updated_at: string | null;
  tags: string[];
}

export interface Source {
  id: string;
  title: string;
  type: string;
  status?: string;
}

export interface NotebookDetail extends Notebook {
  sources: Source[];
  description: string | null;
}

export interface NotebookListResponse {
  notebooks: Notebook[];
  total_count: number;
}

export interface CleanupSuggestion {
  notebook_id: string;
  title: string;
  reason: string;
  last_accessed: string | null;
}

export interface UsageInfo {
  current_count: number;
  max_limit: number;
  cleanup_suggestions: CleanupSuggestion[];
}

export interface BulkDeleteRequest {
  notebook_ids: string[];
}

export interface BulkDeleteResponse {
  deleted_count: number;
  failed: string[];
}
