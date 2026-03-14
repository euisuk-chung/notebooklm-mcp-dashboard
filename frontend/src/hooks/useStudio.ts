import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchStudioStatus,
  createArtifact,
  deleteArtifact,
  bulkCreateArtifact,
} from "../api/studio";
import type { CreateArtifactRequest } from "../types/studio";

export function useStudioStatus(notebookId: string) {
  const query = useQuery({
    queryKey: ["studio", notebookId],
    queryFn: () => fetchStudioStatus(notebookId),
    enabled: !!notebookId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return false;
      const hasGenerating = data.artifacts.some(
        (a) => a.status === "pending" || a.status === "generating"
      );
      return hasGenerating ? 3000 : false;
    },
  });
  return query;
}

export function useCreateArtifact(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateArtifactRequest) =>
      createArtifact(notebookId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio", notebookId] });
    },
  });
}

export function useDeleteArtifact(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artifactId: string) => deleteArtifact(notebookId, artifactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studio", notebookId] });
    },
  });
}

export function useBulkCreateArtifact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ notebookIds, artifactType }: { notebookIds: string[]; artifactType: string }) =>
      bulkCreateArtifact(notebookIds, artifactType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
    },
  });
}
