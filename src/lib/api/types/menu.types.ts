import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { Page } from "./page.types";
import type { User } from "./user.types";

/**
 * Menu entity interface (recursive/hierarchical)
 * Represents menu structure in the system with parent-child relationship
 */
export interface Menu extends BaseEntity {
  nama: string;
  slug: string;
  url: string | null;
  menuId: number | null;
  page: Page | null;
  parent: Menu | null;
  creator: User | null;
  updater: User | null;
  children: Menu[];
}

/**
 * Menu list response interface
 * Represents paginated menu data from API
 */
export type MenuListResponse = PaginatedPayload<Menu>;

/**
 * Menu create request payload
 */
export interface CreateMenuRequest {
  nama: string;
  url?: string;
  menuId?: number | null;
}

/**
 * Menu update request payload
 */
export interface UpdateMenuRequest {
  nama?: string;
  url?: string;
  menuId?: number | null;
}

/**
 * Menu query parameters for listing
 */
export interface MenuQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  sort_by?: "nama" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Menu detail response interface
 */
export type MenuDetailResponse = Menu;

/**
 * Simplified menu for dropdown/select options
 */
export interface MenuOption {
  label: string;
  value: number;
}
