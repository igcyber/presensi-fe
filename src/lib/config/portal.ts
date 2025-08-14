// Konfigurasi Portal Kabupaten Kutai Kartanegara
import { ENV_CONFIG } from "@/lib/config/environment";

export const PORTAL_CONFIG = {
  // Informasi dasar portal
  name: ENV_CONFIG.portalName,
  tagline: ENV_CONFIG.portalTagline,
  websiteUrl: ENV_CONFIG.websiteUrl,

  // Asset paths
  assets: {
    logo: "images/kukar-logo.png",
    icons: "icon/portal-menu/",
    uploads: "uploads/",
    miniImg: "mini-img/",
  },

  // Video background
  backgroundVideo: {
    filename: "background-video.webm",
    fallback: "background-video.mp4",
  },

  // Footer
  footer: {
    copyright: "© 2024 Kabupaten Kutai Kartanegara All Rights Reserved",
    developer: "Developed by Diskominfo Kukar",
  },

  // Menu configuration
  menu: {
    // ID menu yang memiliki submenu
    hasSubmenu: [1, 2, 3, 5],

    // External links (akan dibuka di tab baru)
    externalLinks: [ENV_CONFIG.pengaduanUrl],
  },

  // Animation settings
  animation: {
    submenuSlideDuration: "0.5s",
    arrowAnimationDuration: "0.5s",
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: 450,
    tablet: 700,
    desktop: 1000,
  },

  // Colors (CSS variables)
  colors: {
    green: "#00A85F",
    green2: "#00884d",
    blue4: "rgba(13, 52, 85, 0.8)",
    blue5: "#0d3455",
    hr: "rgb(224, 224, 224)",
  },
};

// Helper functions
export const getAssetPath = (path: string): string => {
  return `/src/assets/${path}`;
};

export const isExternalLink = (link: string): boolean => {
  return link !== "#" && (link.startsWith("http://") || link.startsWith("https://"));
};

export const getTargetAttribute = (link: string): string | undefined => {
  return isExternalLink(link) ? "_blank" : undefined;
};

export const hasSubmenu = (menuId: number): boolean => {
  return PORTAL_CONFIG.menu.hasSubmenu.includes(menuId);
};
