import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

import { useAuthStore } from "@/stores/authStore";

import type { ApiError } from "./apiResponse";

/**
 * HTTP instance configuration
 * Creates a pre-configured Axios instance with default settings
 */
const httpInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 20000, // 20 seconds
});

// ✅ Request interceptor: ambil store DI DALAM fungsi
httpInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // baru dipanggil di sini

    // Cek apakah token ada
    const token = authStore.accessToken;

    if (token) {
      // Tambahkan token ke header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Response interceptor untuk error handling
httpInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => handleError(error),
);

/**
 * Transform AdonisJS validation errors dari array format ke object format
 * AdonisJS format: [{ field: 'email', message: 'Invalid email' }]
 * Vee-Validate format: { email: 'Invalid email' }
 */
const transformAdonisJSErrors = (errors: unknown): Record<string, string[]> => {
  // Jika sudah object format, return as is (backward compatible)
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    // Check if it's already in the correct format
    const keys = Object.keys(errors);
    if (keys.length > 0 && Array.isArray(errors[keys[0] as keyof typeof errors])) {
      return errors as Record<string, string[]>;
    }
    // If it's object but not array values, convert to array format
    const result: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(errors)) {
      result[key] = Array.isArray(value) ? value : [String(value)];
    }
    return result;
  }

  // Jika array format (AdonisJS), transform ke object
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
    401: "Anda tidak memiliki izin untuk mengakses resource ini",
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
