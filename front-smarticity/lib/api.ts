"use client";

import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/backend-api";

export type UserRole = "CIVIL" | "ADMIN";

export type ApiUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  date_joined: string;
  role: UserRole;
};

export type ApiImage = {
  id: number;
  image_url: string;
  signalement: number;
};

export type ApiSignalementStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export type ApiSignalement = {
  id: number;
  description: string;
  localisation: string | null;
  status: ApiSignalementStatus;
  created_at: string;
  user: number;
  uploaded_images: ApiImage[];
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

export type SmartCityTokenPayload = {
  user_id: number;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_superuser?: boolean;
};

const ACCESS_TOKEN_KEY = "smartcity_access_token";
const REFRESH_TOKEN_KEY = "smartcity_refresh_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getCurrentTokenPayload() {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<SmartCityTokenPayload>(token);
  } catch {
    return null;
  }
}

export function setTokens(tokens: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function getMediaUrl(url?: string | null) {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}

async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  const token = getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    let detail = "Une erreur est survenue.";
    const responseText = await response.text();
    try {
      const body = JSON.parse(responseText);
      detail = body.detail || JSON.stringify(body);
    } catch {
      detail = responseText;
    }
    throw new Error(detail || `Erreur HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function login(username: string, password: string) {
  return apiRequest<LoginResponse>("/api/token", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function registerUser(payload: {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) {
  return apiRequest<ApiUser>("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listUsers() {
  return apiRequest<ApiUser[]>("/api/v1/users");
}

export function listSignalements() {
  return apiRequest<ApiSignalement[]>("/api/v1/signalements");
}

export function createSignalement(payload: {
  description: string;
  localisation?: string;
  status?: ApiSignalementStatus;
  images?: File[];
}) {
  const formData = new FormData();
  formData.append("description", payload.description);
  if (payload.localisation) formData.append("localisation", payload.localisation);
  if (payload.status) formData.append("status", payload.status);
  payload.images?.forEach((image) => formData.append("images", image));

  return apiRequest<ApiSignalement>("/api/v1/signalements", {
    method: "POST",
    body: formData,
  });
}
