/**
 * frontend/src/lib/mongodb.ts
 *
 * ⚠️  THIS FILE DOES NOT CONNECT TO MONGODB.
 *
 * The actual MongoDB connection lives exclusively in:
 *   backend/src/lib/mongodb.js
 *
 * This file exists only to provide a typed API client for
 * Next.js API routes that optionally proxy requests to the
 * Express backend. All database logic runs server-side in
 * the backend package.
 *
 * If NEXT_PUBLIC_API_URL is not set, the frontend falls back
 * to localStorage for bookmarks and analytics — no backend
 * or database connection is needed.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? null;

/**
 * Returns true when the optional Express backend is configured.
 */
export function isBackendEnabled(): boolean {
  return Boolean(API_URL);
}

/**
 * Base fetch helper for backend API calls.
 * Throws if NEXT_PUBLIC_API_URL is not configured.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  sessionId?: string
): Promise<T> {
  if (!API_URL) {
    throw new Error(
      "Backend is not configured. Set NEXT_PUBLIC_API_URL in frontend/.env.local"
    );
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(sessionId ? { "x-session-id": sessionId } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error ${response.status}: ${error}`);
  }

  return response.json() as Promise<T>;
}
