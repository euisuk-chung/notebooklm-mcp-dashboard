import { get, post, del, downloadUrl } from "./client";
import type { StudioStatusResponse, CreateArtifactRequest, Artifact } from "../types/studio";

export function fetchStudioStatus(notebookId: string): Promise<StudioStatusResponse> {
  return get<StudioStatusResponse>(`/notebooks/${notebookId}/studio`);
}

export function createArtifact(
  notebookId: string,
  request: CreateArtifactRequest
): Promise<Artifact> {
  return post<Artifact>(`/notebooks/${notebookId}/studio/artifacts`, request);
}

export function deleteArtifact(
  notebookId: string,
  artifactId: string
): Promise<void> {
  return del(`/notebooks/${notebookId}/studio/artifacts/${artifactId}`);
}

export function downloadArtifact(
  notebookId: string,
  artifactId: string
): string {
  return downloadUrl(
    `/notebooks/${notebookId}/studio/artifacts/${artifactId}/download`
  );
}

export function bulkCreateArtifact(notebookIds: string[], artifactType: string) {
  return post("/studio/bulk-create", { notebook_ids: notebookIds, artifact_type: artifactType });
}
