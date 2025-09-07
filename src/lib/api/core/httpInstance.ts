import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";

import { useAuthStore } from "@/stores/authStore";

import type { ApiError } from "./apiResponse";

const authStore = useAuthStore();

/**
 * HTTP instance configuration
 * Creates a pre-configured Axios instance with default settings
 */
const httpInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor untuk menambahkan token
httpInstance.interceptors.request.use(
  (config) => {
    const token = authStore.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor untuk error handling
httpInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return handleError(error);
  },
);

const handleError = (error: any) => {
  const apiError: ApiError = {
    message: "Terjadi kesalahan yang tidak diketahui",
    status: 500,
    errors: {},
  };

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    apiError.status = status;
    apiError.message = data?.message || getDefaultErrorMessage(status);

    if (status === 422 && data?.errors) {
      // Validation errors
      apiError.errors = data.errors;
    }
  } else if (error.request) {
    // Network error
    apiError.message = "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    apiError.status = 0;
  } else {
    // Other error
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
