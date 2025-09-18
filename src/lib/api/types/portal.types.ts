import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Portal Menu entity interface
 * Represents portal menu in the system
 */
export interface PortalMenu extends BaseEntity {
  judul: string;
  link: string;
  icon: string;
  iconUrl: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
  portalMenuKats: PortalMenuKat[];
  portalMenuSubs: PortalMenuSub[];
}

/**
 * Portal Menu Kat entity interface
 * Represents portal menu category
 */
export interface PortalMenuKat extends BaseEntity {
  judul: string;
  portalMenuId: number;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
  portalMenuSubs?: PortalMenuSub[];
}

/**
 * Portal Menu Sub entity interface
 * Represents portal menu sub item
 */
export interface PortalMenuSub extends BaseEntity {
  judul: string;
  link: string;
  icon: string;
  iconUrl?: string | null;
  portalMenuId: number;
  createdBy: number;
  updatedBy: number;
  createdByUser: User;
  updatedByUser: User;
}

/**
 * Portal Menu list response interface
 * Represents paginated portal menu data from API
 */
export type PortalMenuListResponse = PaginatedPayload<PortalMenu>;

/**
 * Portal Menu create request payload
 */
export interface CreatePortalMenuRequest {
  judul: string;
  link?: string;
  icon?: File | string;
}

/**
 * Portal Menu update request payload
 */
export interface UpdatePortalMenuRequest {
  judul?: string;
  link?: string;
  icon?: File | string;
}

/**
 * Portal Menu query parameters for listing
 */
export interface PortalMenuQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "judul" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Portal Menu detail response interface
 */
export type PortalMenuDetailResponse = PortalMenu;
