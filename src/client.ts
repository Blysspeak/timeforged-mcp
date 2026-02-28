import { SERVER_URL, API_KEY } from "./config.js";

export async function tfFetch(
  path: string,
  options: RequestInit = {}
): Promise<unknown> {
  const url = `${SERVER_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(API_KEY ? { "X-Api-Key": API_KEY } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const resp = await fetch(url, {
    ...options,
    headers,
    signal: AbortSignal.timeout(10_000),
  });

  const body = await resp.text();
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}: ${body}`);
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}
