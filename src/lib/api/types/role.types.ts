import type { BaseEntity, PaginatedPayload } from "../core/apiResponse";

/**
 * Role entity interface
 * Represents a role in the system
 */
export interface Role extends BaseEntity {
  name: string;
}

/**
 * Role list response interface
 * Represents paginated role data from API
 */
export type RoleListResponse = PaginatedPayload<Role>;

/**
 * Role create request payload
 */
export interface CreateRoleRequest {
  name: string;
}

/**
 * Role update request payload
 */
export interface UpdateRoleRequest {
  name?: string;
}

/**
 * Role query parameters for listing
 */
export interface RoleQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: "name" | "description" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * Role detail response interface
 */
export interface RoleDetailResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: Role;
}
