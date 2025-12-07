import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  DashboardChartData,
  DashboardDailyData,
  DashboardData,
  DashboardSummaryData,
} from "@/lib/api/types/dashboard.types";

/**
 * Get dashboard summary data including overview and daily breakdown
 * @returns Promise resolving to dashboard summary data
 * @endpoint GET /api/admin/dashboard/summary
 */
export const getDashboardSummary = async (): Promise<ApiResponse<DashboardSummaryData>> => {
  const response = await httpInstance.get<ApiResponse<DashboardSummaryData>>("/api/admin/dashboard/summary");
  return response.data;
};

/**
 * Get dashboard chart data
 * @param type - Chart type: daily, weekly, or monthly (default: daily)
 * @returns Promise resolving to dashboard chart data
 * @endpoint GET /api/admin/dashboard/chart
 */
export const getDashboardChart = async (
  type: "daily" | "weekly" | "monthly" = "daily",
): Promise<ApiResponse<DashboardChartData>> => {
  const response = await httpInstance.get<ApiResponse<DashboardChartData>>("/api/admin/dashboard/chart", {
    params: { type },
  });
  return response.data;
};

/**
 * Get dashboard daily data
 * @returns Promise resolving to dashboard daily data
 * @endpoint GET /api/admin/dashboard/daily
 */
export const getDashboardDaily = async (): Promise<ApiResponse<DashboardDailyData>> => {
  const response = await httpInstance.get<ApiResponse<DashboardDailyData>>("/api/admin/dashboard/daily");
  return response.data;
};

/**
 * Get dashboard data (alias for getDashboardSummary for backward compatibility)
 * @deprecated Use getDashboardSummary instead
 */
export const getDashboard = async (): Promise<ApiResponse<DashboardData>> => {
  const response = await getDashboardSummary();
  return response as ApiResponse<DashboardData>;
};
