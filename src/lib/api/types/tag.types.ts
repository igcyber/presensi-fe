import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * Tag entity interface
 * Represents tag/category for news
 */
export interface Tag extends BaseEntity {
  namaTag: string;
  creator: User;
  updater: User | null;
}

/**
 * Tag list response interface
 * Represents paginated tag data from API
 */
export type TagListResponse = PaginatedPayload<Tag>;

/**
 * Tag create request payload
 */
export interface CreateTagRequest {
  namaTag: string;
}

/**
 * Tag update request payload
 */
export interface UpdateTagRequest {
  namaTag?: string;
}

/**
 * Tag query parameters for listing
 */
export interface TagQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: "namaTag" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Tag detail response interface
 */
export type TagDetailResponse = Tag;
