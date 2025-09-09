import type { BaseEntity } from "@/lib/api/core/apiResponse";

/**
 * Portal Menu Sub data structure
 */
export interface PortalMenuSub extends BaseEntity {
  judul: string;
  link: string;
  icon: string | null;
  portalMenuId: number;
  portalKatId: number;
  order?: number;
  isActive?: boolean;
}

/**
 * Portal Menu Kategori data structure
 */
export interface PortalMenuKat extends BaseEntity {
  judul: string;
  portalMenuId: number;
  portalMenuSubs: PortalMenuSub[];
  order?: number;
  isActive?: boolean;
}

/**
 * Portal Menu data structure
 */
export interface PortalMenu extends BaseEntity {
  judul: string;
  link: string;
  icon: string;
  portalMenuKats: PortalMenuKat[];
  portalMenuSubs: PortalMenuSub[];
  order?: number;
  isActive?: boolean;
  description?: string;
}

/**
 * Background Video data structure
 */
export interface BgVideo extends BaseEntity {
  nama: string;
  isi: string;
  jenis: string;
  icon: string | null;
  file?: string;
  thumbnail?: string;
}

/**
 * Portal Menu payload
 */
export interface PortalMenuPayload {
  menu: PortalMenu[];
  bgVideo: BgVideo;
  containermenu: PortalMenu[];
}

/**
 * Create portal menu request
 */
export interface CreatePortalMenuRequest {
  judul: string;
  link: string;
  icon: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

/**
 * Update portal menu request
 */
export interface UpdatePortalMenuRequest {
  judul?: string;
  link?: string;
  icon?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

/**
 * Create portal menu sub request
 */
export interface CreatePortalMenuSubRequest {
  judul: string;
  link: string;
  icon?: string;
  portalMenuId: number;
  portalKatId?: number;
  order?: number;
  isActive?: boolean;
}

/**
 * Update portal menu sub request
 */
export interface UpdatePortalMenuSubRequest {
  judul?: string;
  link?: string;
  icon?: string;
  portalMenuId?: number;
  portalKatId?: number;
  order?: number;
  isActive?: boolean;
}
