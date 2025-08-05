import axios from "axios";
import type { AxiosInstance } from "axios";

// Create a new axios instance
const httpInstance: AxiosInstance = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds
});

export default httpInstance;
