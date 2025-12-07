/**
 * Dashboard overview interface
 * Represents overview statistics for dashboard
 */
export interface DashboardOverview {
  total_pegawai: number;
  total_absen_masuk: number;
  total_absen_pulang: number;
  unique_pegawai_hadir: number;
  unique_pegawai_tidak_hadir: number;
}

/**
 * Daily breakdown item interface
 */
export interface DailyBreakdownItem {
  pegawaiHadir: number;
  pegawaiTidakHadir: number;
  totalAbsenMasuk: number;
  totalAbsenPulang: number;
}

/**
 * Dashboard summary data interface
 * Represents summary data from /api/admin/dashboard/summary
 */
export interface DashboardSummaryData {
  overview: DashboardOverview;
  daily_breakdown: Record<string, DailyBreakdownItem>;
}

/**
 * Chart data item interface
 */
export interface ChartDataItem {
  label: string;
  masuk: number;
  pulang: number;
  total: number;
}

/**
 * Dashboard chart data interface
 * Represents chart data from /api/admin/dashboard/chart
 */
export interface DashboardChartData {
  chart_data: Record<string, ChartDataItem>;
  type: "daily" | "weekly" | "monthly";
}

/**
 * Dashboard daily data interface
 * Represents daily data from /api/admin/dashboard/daily
 */
export interface DashboardDailyData {
  total_pegawai: number;
  pegawai_hadir: number;
  pegawai_tidak_hadir: number;
  total_absen_masuk: number;
  total_absen_pulang: number;
}

/**
 * Dashboard data interface (for backward compatibility)
 * @deprecated Use DashboardSummaryData instead
 */
export interface DashboardData {
  overview: DashboardOverview;
  daily_breakdown: Record<string, DailyBreakdownItem>;
}
