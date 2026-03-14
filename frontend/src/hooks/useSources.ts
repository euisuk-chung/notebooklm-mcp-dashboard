import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addSourceUrl, addSourceText, addSourceYoutube, startResearch, importResearch, addSourceBatchUrl, runPipeline } from "../api/sources";

export function useAddSourceUrl(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => addSourceUrl(notebookId, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId] });
    },
  });
}

export function useAddSourceText(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ text, title }: { text: string; title: string }) =>
      addSourceText(notebookId, text, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId] });
    },
  });
}

export function useAddSourceYoutube(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => addSourceYoutube(notebookId, url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId] });
    },
  });
}

export function useStartResearch(notebookId: string) {
  return useMutation({
    mutationFn: ({ query, mode, source }: { query: string; mode: string; source: string }) =>
      startResearch(notebookId, query, mode, source),
  });
}

export function useImportResearch(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => importResearch(notebookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId] });
    },
  });
}

export function useAddSourceBatchUrl(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (urls: string[]) => addSourceBatchUrl(notebookId, urls),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId] });
    },
  });
}

export function useRunPipeline(notebookId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ url, pipeline }: { url: string; pipeline: string }) =>
      runPipeline(notebookId, url, pipeline),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notebooks", notebookId] });
      queryClient.invalidateQueries({ queryKey: ["studio", notebookId] });
    },
  });
}
