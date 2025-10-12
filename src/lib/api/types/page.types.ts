import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { Menu } from "./menu.types";
import type { User } from "./user.types";

/**
 * Page entity interface
 * Represents page/content with menu relation
 */
export interface Page extends BaseEntity {
  menuId: number;
  slug: string;
  nama: string;
  tipe: "file" | "page";
  content: string | null;
  menu: Menu;
  creator: User;
  updater: User | null;
}

/**
 * Page list response interface
 * Represents paginated page data from API
 */
export type PageListResponse = PaginatedPayload<Page>;

/**
 * Page create request payload
 */
export interface CreatePageRequest {
  nama: string;
  tipe: "file" | "page";
  content?: string;
  menuId?: number;
  temporaryFileNames?: string[];
}

/**
 * Page update request payload
 */
export interface UpdatePageRequest {
  nama?: string;
  tipe?: "file" | "page";
  content?: string;
  menuId?: number;
  temporaryFileNames?: string[];
}

/**
 * Page query parameters for listing
 */
export interface PageQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  date?: string;
  tipe?: "file" | "page";
  sort_by?: "nama" | "tipe" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
  customFilters?: Array<Record<string, any>>;
}

/**
 * Page detail response interface
 */
export type PageDetailResponse = Page;

/**
 * Tipe options for form select
 */
export const TIPE_OPTIONS = [
  { label: "Page", value: "page" },
  { label: "File", value: "file" },
];

/**
 * Allowed tipe values for validation
 */
export const ALLOWED_TIPE = ["file", "page"] as const;
