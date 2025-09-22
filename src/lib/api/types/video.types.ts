import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

/**
 * Video entity interface
 * Represents a video in the system
 */
export interface Video extends BaseEntity {
  judul: string;
  isi: string;
  link: string;
  createdBy: number;
  updatedBy: number;
}

/**
 * Video list response interface
 * Represents paginated video data from API
 */
export type VideoListResponse = PaginatedPayload<Video>;

/**
 * Video list public response interface
 * Represents paginated video data from API
 */
export type VideoListPublicResponse = PaginatedPayload<Video>;

/**
 * Video create request payload
 */
export interface CreateVideoRequest {
  judul: string;
  isi: string;
  link: string;
}

/**
 * Video update request payload
 */
export interface UpdateVideoRequest {
  judul?: string;
  isi?: string;
  link?: string;
}

/**
 * Video query parameters for listing
 */
export interface VideoQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "judul" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Video detail response interface
 */
export type VideoDetailResponse = Video;
