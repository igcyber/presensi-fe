import type { ApiResponse } from "../core/apiResponse";
import httpInstance from "../core/httpInstance";
import type {
  ChangeUserPasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UserDetailResponse,
  UserListApiResponse,
  UserQueryParams,
} from "../types/user.types";

/**
 * Get paginated list of users
 * @param params - Query parameters for filtering and pagination
 * @returns Promise resolving to paginated user list
 * @endpoint GET /api/users
 * @example
 * ```typescript
 * const response = await getUsers({ page: 1, per_page: 10, search: 'admin' });
 * console.log(response.data.data); // Array of users
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getUsers = async (params?: UserQueryParams): Promise<UserListApiResponse> => {
  const response = await httpInstance.get<UserListApiResponse>("/api/users", { params });
  return response.data;
};

/**
 * Get user by ID
 * @param id - User ID
 * @returns Promise resolving to user detail
 * @endpoint GET /api/users/{id}
 * @example
 * ```typescript
 * const response = await getUserById(1);
 * console.log(response.data.fullName);
 * ```
 */
export const getUserById = async (id: number): Promise<UserDetailResponse> => {
  const response = await httpInstance.get<UserDetailResponse>(`/api/users/${id}`);
  return response.data;
};

/**
 * Create a new user
 * @param userData - User creation data
 * @returns Promise resolving to created user data
 * @endpoint POST /api/users
 * @example
 * ```typescript
 * const response = await createUser({
 *   fullName: 'John Doe',
 *   email: 'john@example.com',
 *   username: 'johndoe',
 *   nip: '123456789',
 *   password: 'password123',
 *   confirmPassword: 'password123',
 *   roleIds: [1, 2]
 * });
 * ```
 */
export const createUser = async (userData: CreateUserRequest): Promise<ApiResponse<User>> => {
  const response = await httpInstance.post<ApiResponse<User>>("/api/users", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Update user by ID
 * @param id - User ID
 * @param userData - User update data
 * @returns Promise resolving to updated user data
 * @endpoint PUT /api/users/{id}
 * @example
 * ```typescript
 * const response = await updateUser(1, {
 *   fullName: 'John Smith',
 *   email: 'johnsmith@example.com'
 * });
 * ```
 */
export const updateUser = async (id: number, userData: UpdateUserRequest): Promise<ApiResponse<User>> => {
  const response = await httpInstance.put<ApiResponse<User>>(`/api/users/${id}`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Delete user by ID
 * @param id - User ID
 * @returns Promise resolving to success response
 * @endpoint DELETE /api/users/{id}
 * @example
 * ```typescript
 * await deleteUser(1);
 * // User is now deleted
 * ```
 */
export const deleteUser = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/api/users/${id}`);
  return response.data;
};

/**
 * Change user password
 * @param id - User ID
 * @param passwordData - Password change data
 * @returns Promise resolving to success response
 * @endpoint PUT /api/users/{id}/password
 * @example
 * ```typescript
 * await changeUserPassword(1, {
 *   password: 'newpassword123',
 *   confirmPassword: 'newpassword123'
 * });
 * ```
 */
export const changeUserPassword = async (
  id: number,
  passwordData: ChangeUserPasswordRequest,
): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.put<ApiResponse<{ message: string }>>(`/api/users/${id}/password`, passwordData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Restore soft-deleted user
 * @param id - User ID
 * @returns Promise resolving to success response
 * @endpoint POST /api/users/{id}/restore
 * @example
 * ```typescript
 * await restoreUser(1);
 * // User is now restored
 * ```
 */
export const restoreUser = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.post<ApiResponse<{ message: string }>>(`/api/users/${id}/restore`);
  return response.data;
};

/**
 * Force delete user (permanent delete)
 * @param id - User ID
 * @returns Promise resolving to success response
 * @endpoint DELETE /api/users/{id}/force
 * @example
 * ```typescript
 * await forceDeleteUser(1);
 * // User is permanently deleted
 * ```
 */
export const forceDeleteUser = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/api/users/${id}/force`);
  return response.data;
};

/**
 * Get user roles
 * @returns Promise resolving to list of available roles
 * @endpoint GET /api/roles
 * @example
 * ```typescript
 * const response = await getRoles();
 * console.log(response.data); // Array of roles
 * ```
 */
export const getRoles = async (): Promise<ApiResponse<Array<{ id: number; name: string }>>> => {
  const response = await httpInstance.get<ApiResponse<Array<{ id: number; name: string }>>>("/api/roles");
  return response.data;
};
