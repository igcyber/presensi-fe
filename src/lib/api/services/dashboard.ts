import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { DashboardData } from "@/lib/api/types/dashboard.types";

/**
 * Get dashboard data including views statistics and popular content
 * @returns Promise resolving to complete dashboard data
 * @endpoint GET /api/dashboard
 * @example
 * ```typescript
 * const response = await getDashboard();
 * console.log(response.data.views);
 * console.log(response.data.popular);
 * ```
 */
export const getDashboard = async (): Promise<ApiResponse<DashboardData>> => {
  const response = await httpInstance.get<ApiResponse<DashboardData>>("/api/dashboard");
  return response.data;
};
