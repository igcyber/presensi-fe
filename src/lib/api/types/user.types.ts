import type { BaseEntity } from "../core/apiResponse";

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
 * Role entity interface
 */
export interface Role extends BaseEntity {
  name: string;
}

/**
 * User list response interface
 * Represents paginated user data from API
 */
export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    first_page: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    next: string | null;
    prev: string | null;
  };
}

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
 * User password change request
 */
export interface ChangeUserPasswordRequest {
  password: string;
  confirmPassword: string;
}

/**
 * User query parameters for listing
 */
export interface UserQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  sort_by?: string;
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

/**
 * User list API response interface
 */
export interface UserListApiResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: UserListResponse;
}
