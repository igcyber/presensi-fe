/**
 * Chart Configuration Utilities
 * Default settings untuk Chart.js di seluruh aplikasi
 */

export interface ChartColor {
  main: string;
  light: string;
  dark: string;
}

/**
 * Color Palette untuk Charts
 * Konsisten dengan theme shadcn-ui
 */
export const chartColors = {
  berita: {
    main: "#3b82f6", // blue-500
    light: "#93c5fd", // blue-300
    dark: "#1e40af", // blue-800
  },
  dokumen: {
    main: "#22c55e", // green-500
    light: "#86efac", // green-300
    dark: "#15803d", // green-800
  },
  infografis: {
    main: "#f97316", // orange-500
    light: "#fdba74", // orange-300
    dark: "#c2410c", // orange-800
  },
  video: {
    main: "#a855f7", // purple-500
    light: "#d8b4fe", // purple-300
    dark: "#6b21a8", // purple-800
  },
  foto: {
    main: "#ec4899", // pink-500
    light: "#f9a8d4", // pink-300
    dark: "#be185d", // pink-800
  },
} as const;

/**
 * Get array of main colors untuk datasets
 */
export const getMainColors = (): string[] => {
  return [
    chartColors.berita.main,
    chartColors.dokumen.main,
    chartColors.infografis.main,
    chartColors.video.main,
    chartColors.foto.main,
  ];
};

/**
 * Get array of light colors untuk backgrounds
 */
export const getLightColors = (): string[] => {
  return [
    chartColors.berita.light,
    chartColors.dokumen.light,
    chartColors.infografis.light,
    chartColors.video.light,
    chartColors.foto.light,
  ];
};

/**
 * Default Chart Options
 */
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  font: {
    family: "'Inter', sans-serif",
  },
};

/**
 * Responsive Breakpoints untuk Charts
 */
export const chartBreakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
};

/**
 * Format number dengan locale Indonesia
 */
export const formatNumber = (value: number): string => {
  return value.toLocaleString("id-ID");
};

/**
 * Calculate percentage dari total
 */
export const calculatePercentage = (value: number, total: number): string => {
  if (total === 0) return "0.0";
  return ((value / total) * 100).toFixed(1);
};

/**
 * Content Type Labels
 */
export const contentTypeLabels = {
  berita: "Berita",
  dokumen: "Dokumen",
  infografis: "Infografis",
  video: "Video",
  foto: "Foto",
} as const;
