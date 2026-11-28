import { supabase } from "./components/lib/supabase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
  } = options;

  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  const headers = {
    "Content-Type": "application/json",
  };

  if (data.session?.access_token) {
    headers.Authorization = `Bearer ${data.session.access_token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const apiError = new Error(
      result?.error || `HTTP error: ${response.status}`
    );

    apiError.status = response.status;
    apiError.code = result?.error;

    throw apiError;
  }

  return result;
}
