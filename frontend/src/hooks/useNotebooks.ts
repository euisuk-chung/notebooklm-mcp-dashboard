import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotebooks,
  fetchNotebook,
  deleteNotebook,
  bulkDeleteNotebooks,
  fetchUsage,
  createNotebook,
  queryNotebook,
} from "../api/notebooks";

export function useNotebooks(refetchInterval?: number | false) {
  return useQuery({
    queryKey: ["notebooks"],
    queryFn: fetchNotebooks,
    refetchInterval,
  });
}

export function useNotebook(id: string) {
  return useQuery({
    queryKey: ["notebooks", id],
    queryFn: () => fetchNotebook(id),
    enabled: !!id,
  });
}

export function useDeleteNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotebook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    },
  });
}

export function useBulkDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteNotebooks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    },
  });
}

export function useUsage() {
  return useQuery({
    queryKey: ["usage"],
    queryFn: fetchUsage,
  });
}

export function useCreateNotebook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (title: string) => createNotebook(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks"] });
      queryClient.invalidateQueries({ queryKey: ["usage"] });
    },
  });
}

export function useQueryNotebook(notebookId: string) {
  return useMutation({
    mutationFn: (question: string) => queryNotebook(notebookId, question),
  });
}
