// Environment Configuration
// Menggunakan import.meta.env untuk Vite environment variables

export const ENV_CONFIG = {
  // Application
  appTitle: import.meta.env.VITE_APP_TITLE || "Portal Admin - Kabupaten Kutai Kartanegara",
  appVersion: import.meta.env.VITE_APP_VERSION || "1.0.0",

  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),

  // Asset Configuration
  assetBaseUrl: import.meta.env.VITE_ASSET_BASE_URL || "/src/assets",
  iconPath: import.meta.env.VITE_ICON_PATH || "icon/portal-menu",
  imagePath: import.meta.env.VITE_IMAGE_PATH || "images",
  uploadPath: import.meta.env.VITE_UPLOAD_PATH || "uploads",

  // Portal Configuration
  portalName: import.meta.env.VITE_PORTAL_NAME || "Portal Resmi Kabupaten Kutai Kartanegara",
  portalTagline: import.meta.env.VITE_PORTAL_TAGLINE || "Kukar Idaman Mitra Pembangunan IKN",
  websiteUrl: import.meta.env.VITE_WEBSITE_URL || "/",

  // External Links
  pengaduanUrl:
    import.meta.env.VITE_PENGADUAN_URL || "https://www.lapor.go.id/instansi/pemerintah-kabupaten-kutai-kartanegara",

  // Development
  isDev: import.meta.env.DEV || false,
  isDebug: import.meta.env.VITE_DEBUG_MODE === "true",

  // Analytics
  gaTrackingId: import.meta.env.VITE_GA_TRACKING_ID || "",
  gtmId: import.meta.env.VITE_GTM_ID || "",
};

// Helper functions untuk environment
export const isDevelopment = (): boolean => {
  return ENV_CONFIG.isDev;
};

export const isProduction = (): boolean => {
  return import.meta.env.PROD;
};

export const isDebugMode = (): boolean => {
  return ENV_CONFIG.isDebug;
};

export const getAssetUrl = (path: string): string => {
  return `${ENV_CONFIG.assetBaseUrl}/${path}`;
};

export const getApiUrl = (endpoint: string): string => {
  return `${ENV_CONFIG.apiBaseUrl}/${endpoint.replace(/^\//, "")}`;
};
