import axios from "axios";
import type { AxiosInstance } from "axios";

/**
 * HTTP instance configuration
 * Creates a pre-configured Axios instance with default settings
 */
const httpInstance: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor untuk menambahkan token
httpInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
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
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default httpInstance;
