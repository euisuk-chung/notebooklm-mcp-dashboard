const BASE_URL = "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text().catch(() => "Unknown error");
    throw new ApiError(response.status, body);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  return handleResponse<T>(response);
}

export async function post<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse<T>(response);
}

export async function del<T = void>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
  });
  return handleResponse<T>(response);
}

export function downloadUrl(path: string): string {
  return `${BASE_URL}${path}`;
}
