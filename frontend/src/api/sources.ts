import { post, get } from "./client";

export function addSourceUrl(notebookId: string, url: string) {
  return post(`/notebooks/${notebookId}/sources/url`, { url, wait: true });
}

export function addSourceText(notebookId: string, text: string, title: string) {
  return post(`/notebooks/${notebookId}/sources/text`, { text, title });
}

export function addSourceYoutube(notebookId: string, url: string) {
  return post(`/notebooks/${notebookId}/sources/youtube`, { url });
}

export function startResearch(notebookId: string, query: string, mode: string = "fast", source: string = "web") {
  return post(`/notebooks/${notebookId}/sources/research`, { query, mode, source });
}

export function getResearchStatus(notebookId: string) {
  return get(`/notebooks/${notebookId}/sources/research/status`);
}

export function importResearch(notebookId: string) {
  return post(`/notebooks/${notebookId}/sources/research/import`);
}

export function addSourceBatchUrl(notebookId: string, urls: string[]) {
  return post(`/notebooks/${notebookId}/sources/batch-url`, { urls });
}

export function runPipeline(notebookId: string, url: string, pipeline: string = "ingest-and-podcast") {
  return post(`/notebooks/${notebookId}/pipeline`, { url, pipeline });
}
