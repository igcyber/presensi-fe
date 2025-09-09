import type { BaseEntity, PaginatedPayload } from "../core/apiResponse";
import type { Role } from "./role.types";

/**
 * User entity interface
 * Represents a user with roles in the system
 */
export interface User extends BaseEntity {
  fullName: string;
  email: string;
  username: string;
  nip: string;
  roles: Role[];
}

/**
 * User list response interface
 * Represents paginated user data from API
 */
export type UserListResponse = PaginatedPayload<User>;

/**
 * User create request payload
 */
export interface CreateUserRequest {
  fullName: string;
  email: string;
  username: string;
  nip: string;
  password: string;
  confirmPassword?: string;
  roleIds: number[];
}

/**
 * User update request payload
 */
export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  username?: string;
  nip?: string;
  roleIds?: number[];
}

/**
 * User query parameters for listing
 */
export interface UserQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  sort_by?: "fullName" | "email" | "username" | "nip" | "createdAt" | "updatedAt";
  sort_order?: "asc" | "desc";
}

/**
 * User detail response interface
 */
export interface UserDetailResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: User;
}
