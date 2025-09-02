/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ASSET_BASE_URL: string;
  readonly VITE_ICON_PATH: string;
  readonly VITE_IMAGE_PATH: string;
  readonly VITE_UPLOAD_PATH: string;
  readonly VITE_PORTAL_NAME: string;
  readonly VITE_PORTAL_TAGLINE: string;
  readonly VITE_WEBSITE_URL: string;
  readonly VITE_PENGADUAN_URL: string;
  readonly VITE_DEBUG_MODE: string;
  readonly VITE_GA_TRACKING_ID: string;
  readonly VITE_GTM_ID: string;
}

declare module "*.css" {
  const content: string;
  export default content;
}

declare module "lightbox2/dist/css/lightbox.min.css";

declare module "lightbox2/dist/js/lightbox.js" {
  const lightbox: any;
  export default lightbox;
}
