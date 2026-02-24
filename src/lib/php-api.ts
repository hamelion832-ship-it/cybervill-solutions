/**
 * API-сервис для работы с PHP-бэкендом на своём хостинге.
 * 
 * Для переключения на PHP API:
 * 1. Замените API_BASE_URL на URL вашего хостинга
 * 2. Замените импорты supabase на вызовы из этого модуля
 * 
 * Пока что приложение работает через Lovable Cloud.
 * Этот файл — готовый слой для миграции на свой сервер.
 */

// Замените на URL вашего хостинга, например: https://kyberwheel.tech/api
const API_BASE_URL = "https://ВАШ-ДОМЕН.ru/api";

// --- Token management ---

function getToken(): string | null {
  return localStorage.getItem("auth_token");
}

function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
}

function removeToken(): void {
  localStorage.removeItem("auth_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// --- Auth API ---

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const phpAuth = {
  async signUp(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth.php?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
    setToken(data.token);
    return data;
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth.php?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка входа");
    setToken(data.token);
    return data;
  },

  async getSession(): Promise<AuthUser | null> {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth.php?action=session`, {
        headers: authHeaders(),
      });
      if (!res.ok) { removeToken(); return null; }
      const data = await res.json();
      return data.user;
    } catch {
      return null;
    }
  },

  signOut(): void {
    removeToken();
  },

  isLoggedIn(): boolean {
    return !!getToken();
  },
};

// --- Chat History API ---

export interface ChatEntry {
  id: string;
  user_message: string;
  assistant_message: string;
  created_at: string;
}

export const phpChatHistory = {
  async getAll(): Promise<ChatEntry[]> {
    const res = await fetch(`${API_BASE_URL}/chat-history.php`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error("Ошибка загрузки истории");
    return res.json();
  },

  async create(userMessage: string, assistantMessage: string): Promise<{ id: string }> {
    const res = await fetch(`${API_BASE_URL}/chat-history.php`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ user_message: userMessage, assistant_message: assistantMessage }),
    });
    if (!res.ok) throw new Error("Ошибка сохранения");
    return res.json();
  },

  async delete(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/chat-history.php?id=${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
  },
};
