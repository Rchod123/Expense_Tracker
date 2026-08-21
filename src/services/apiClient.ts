import { API_ENDPOINT, AI_API_ENDPOINT } from '../config/api';
import { getStoredToken } from './authStorage';

type ApiError = { error?: string; message?: string };

const request = async <T>(
  url: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> => {
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  const data = text ? (JSON.parse(text) as T & ApiError) : ({} as T & ApiError);

  if (!response.ok) {
    throw new Error(data.error ?? data.message ?? `Request failed (${response.status})`);
  }
  return data;
};

const authenticatedRequest = async <T>(
  path: string,
  options: RequestInit = {},
) => request<T>(`${API_ENDPOINT}${path}`, options, await getStoredToken());

export type AuthResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export type ChatResponse = { reply?: string };
export type TranscriptionResponse = { text?: string };
export type OcrResponse = {
  success: boolean;
  data?: {
    merchant?: string;
    date?: string;
    total_amount?: number;
    category_guess?: string;
    line_items?: Array<{ name: string; amount: number }>;
  };
};

export const authApi = {
  login: (email: string, password: string) =>
    request<AuthResponse>(`${API_ENDPOINT}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<AuthResponse>(`${API_ENDPOINT}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
};

export const aiApi = {
  chat: (body: { message: string; history: unknown[]; transaction: unknown }) =>
    request<ChatResponse>(`${AI_API_ENDPOINT}/chat`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  transcribe: (formData: FormData) =>
    request<TranscriptionResponse>(`${AI_API_ENDPOINT}/transcribe`, {
      method: 'POST',
      body: formData,
    }),
  ocrReceipt: (formData: FormData) =>
    request<OcrResponse>(`${AI_API_ENDPOINT}/ocr-receipt`, {
      method: 'POST',
      body: formData,
    }),
};

type SyncPayload = {
  _id: string;
  title: string;
  userId?: string;
  amount: number;
  type: string;
  ui: string;
  description?: string;
  date: string;
};

export const expensesApi = {
  sync: (expenses: SyncPayload[]) =>
    authenticatedRequest<{ syncedIds?: string[] }>('/expenses/sync', {
      method: 'POST',
      body: JSON.stringify({ expenses }),
    }),
  list: () => authenticatedRequest<SyncPayload[]>('/expenses'),
};

type CategoryPayload = {
  _id: string;
  name: string;
  ui: string;
  transactionType: string;
  type: string;
};

export const categoriesApi = {
  sync: (categories: CategoryPayload[]) =>
    authenticatedRequest<{ syncedIds?: string[] }>('/categories/sync', {
      method: 'POST',
      body: JSON.stringify({ categories }),
    }),
  list: () => request<CategoryPayload[]>(`${API_ENDPOINT}/categories`),
};
