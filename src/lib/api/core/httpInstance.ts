import axios from "axios";
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { refreshToken } from "@/lib/api/services/auth";
// Import service refresh
import router from "@/router";
import { useAuthStore } from "@/stores/authStore";

import type { ApiError } from "./apiResponse";

// Import router untuk redirect

// Interface tambahan untuk flag retry
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// --- 1. KONFIGURASI DASAR
const httpInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// --- 2. REQUEST INTERCEPTOR ---
httpInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE INTERCEPTOR (MODIFIKASI UTAMA) ---
// Auto Refresh
httpInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const authStore = useAuthStore();

    // Deteksi Error 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Cek URL agar tidak loop di endpoint login/refresh
      if (originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/refresh-token")) {
        authStore.logout();
        router.push({ name: "login.index" });
        return Promise.reject(error); // Lempar ke handleError
      }

      originalRequest._retry = true;

      try {
        // Coba refresh token
        const response = await refreshToken();

        if (response.success) {
          // Update token di store
          authStore.setAccessToken({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          });

          // Update header request yang gagal
          httpInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access_token}`;
          originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;

          // Ulangi request awal
          return httpInstance(originalRequest);
        }
      } catch (refreshError) {
        // Jika refresh gagal, logout
        authStore.logout();
        router.push({ name: "login.index" });
        return Promise.reject(refreshError);
      }
    }

    return handleError(error);
  },
);

// --- 4. HELPER ERROR HANDLING (DARI BOILERPLATE - TETAP DIPERTAHANKAN) ---

/**
 * Transform AdonisJS validation errors
 */
const transformAdonisJSErrors = (errors: unknown): Record<string, string[]> => {
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const keys = Object.keys(errors);
    if (keys.length > 0 && Array.isArray(errors[keys[0] as keyof typeof errors])) {
      return errors as Record<string, string[]>;
    }
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(errors)) {
      result[key] = Array.isArray(value) ? value : [String(value)];
    }
    return result;
  }

  if (Array.isArray(errors)) {
    const result: Record<string, string[]> = {};
    for (const error of errors) {
      if (error && typeof error === "object" && "field" in error && "message" in error) {
        const field = String(error.field);
        const message = String(error.message);
        if (result[field]) {
          result[field].push(message);
        } else {
          result[field] = [message];
        }
      }
    }
    return result;
  }

  return {};
};

const handleError = (error: any) => {
  const apiError: ApiError = {
    message: "Terjadi kesalahan yang tidak diketahui",
    status: 500,
    errors: {},
  };

  if (error.response) {
    const { status, data } = error.response;
    apiError.status = status;
    apiError.message = data?.message || getDefaultErrorMessage(status);

    if (status === 422 && data?.errors) {
      apiError.errors = transformAdonisJSErrors(data.errors);
    }
  } else if (error.request) {
    apiError.message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    apiError.status = 0;
  } else {
    apiError.message = error.message || "Terjadi kesalahan yang tidak diketahui";
  }

  return Promise.reject(apiError);
};

const getDefaultErrorMessage = (status: number) => {
  const messages: Record<number, string> = {
    400: "Permintaan tidak valid",
    401: "Sesi Anda telah berakhir", // Update pesan agar lebih user friendly
    403: "Akses ditolak",
    404: "Resource tidak ditemukan",
    422: "Data yang dikirim tidak valid",
    500: "Terjadi kesalahan pada server",
    502: "Server tidak tersedia",
    503: "Server sedang maintenance",
  };
  return messages[status] || "Terjadi kesalahan yang tidak diketahui";
};

export default httpInstance;
