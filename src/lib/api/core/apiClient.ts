import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios";

import type { ApiError, ApiResponse } from "./apiResponse";

export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandling?: boolean;
}

/**
 * Main API Client class for handling HTTP requests
 * Provides a clean interface for making API calls with built-in error handling,
 * authentication, and response transformation.
 */
export class ApiClient {
  private instance: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   * - Request: Adds authentication token
   * - Response: Handles errors and transforms responses
   */
  private setupInterceptors(): void {
    // Request interceptor untuk menambahkan token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
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
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        return this.handleError(error);
      },
    );
  }

  /**
   * Get authentication token from localStorage
   * @returns Token string or null if not found
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  /**
   * Handle API errors and transform them into consistent format
   * @param error - Axios error object
   * @returns Promise rejection with ApiError
   */
  private handleError(error: any): Promise<never> {
    const apiError: ApiError = {
      message: "Terjadi kesalahan yang tidak diketahui",
      status: 500,
      errors: {},
    };

    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      apiError.status = status;
      apiError.message = data?.message || this.getDefaultErrorMessage(status);

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
  }

  /**
   * Get default error message based on HTTP status code
   * @param status - HTTP status code
   * @returns Error message string
   */
  private getDefaultErrorMessage(status: number): string {
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
  }

  /**
   * Make GET request
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Promise resolving to ApiResponse<T>
   */
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get(url, config);
    return this.transformResponse(response);
  }

  /**
   * Make POST request
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Request configuration
   * @returns Promise resolving to ApiResponse<T>
   */
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post(url, data, config);
    return this.transformResponse(response);
  }

  /**
   * Make PUT request
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Request configuration
   * @returns Promise resolving to ApiResponse<T>
   */
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config);
    return this.transformResponse(response);
  }

  /**
   * Make PATCH request
   * @param url - Request URL
   * @param data - Request payload
   * @param config - Request configuration
   * @returns Promise resolving to ApiResponse<T>
   */
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config);
    return this.transformResponse(response);
  }

  /**
   * Make DELETE request
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Promise resolving to ApiResponse<T>
   */
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete(url, config);
    return this.transformResponse(response);
  }

  /**
   * Transform Axios response to ApiResponse format
   * @param response - Axios response object
   * @returns Transformed ApiResponse
   */
  private transformResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      data: response.data,
      message: response.data?.message || "Success",
      status: response.status,
      success: response.status >= 200 && response.status < 300,
    };
  }

  /**
   * Set authentication token
   * @param token - JWT token string
   */
  setAuthToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  /**
   * Remove authentication token
   */
  removeAuthToken(): void {
    localStorage.removeItem("auth_token");
  }

  /**
   * Update base URL for API requests
   * @param baseURL - New base URL
   */
  updateBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }
}

// Create default instance
const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  timeout: 10000,
});

export default apiClient;
