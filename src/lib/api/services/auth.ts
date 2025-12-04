import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  AuthResponse,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  UserAuth,
} from "@/lib/api/types/auth.types";
import { useAuthStore } from "@/stores/authStore";

/**
 * Authenticate user with username and password
 * @param credentials - Login credentials containing username and password
 * @returns Promise resolving to complete login response with user data and token
 * @endpoint POST /api/auth/login
 * @example
 * ```typescript
 * const response = await login({ username: 'admin', password: 'password123' });
 * console.log(response.data.user.fullName);
 * console.log(response.data.token.value);
 * ```
 */
export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await httpInstance.post<LoginResponse>("/api/auth/login", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Register a new user account
 * @param userData - Registration data containing email and password
 * @returns Promise resolving to authentication response with user data and token
 * @endpoint POST /api/auth/register
 * @example
 * ```typescript
 * const response = await register({ email: 'user@example.com', password: 'password123' });
 * console.log(response.data.user.email);
 * ```
 */
export const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await httpInstance.post<ApiResponse<AuthResponse>>("/api/auth/register", userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

/**
 * Logout current user and invalidate token
 * @returns Promise resolving to success response
 * @endpoint POST /api/auth/logout
 * @example
 * ```typescript
 * await logout();
 * // User is now logged out
 * ```
 */
export const logout = async (): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.post<ApiResponse<{ message: string }>>("/api/auth/logout", {
    refresh_token: useAuthStore().refreshToken,
  });
  return response.data;
};

/**
 * Get current authenticated user profile
 * @returns Promise resolving to user profile data
 * @endpoint GET /api/auth/me
 * @example
 * ```typescript
 * const response = await getCurrentUser();
 * console.log(response.data.username);
 * ```
 */
export const getCurrentUser = async (): Promise<ApiResponse<UserAuth>> => {
  const response = await httpInstance.get<ApiResponse<UserAuth>>("/api/auth/profile");
  return response.data;
};

/**
 * Update user profile information
 * @param profileData - Profile data to update
 * @returns Promise resolving to updated user data
 * @endpoint PUT /api/auth/profile
 * @example
 * ```typescript
 * const response = await updateProfile({ name: 'John Doe', email: 'john@example.com' });
 * console.log(response.data.name);
 * ```
 */
export const updateProfile = async (profileData: UpdateProfileRequest): Promise<ApiResponse<UserAuth>> => {
  const response = await httpInstance.put<ApiResponse<UserAuth>>("/api/auth/profile", profileData);
  return response.data;
};

/**
 * Change user password
 * @param passwordData - Password change data containing old and new passwords
 * @returns Promise resolving to success response
 * @endpoint PUT /api/auth/password
 * @example
 * ```typescript
 * await changePassword({
 *   oldPassword: 'oldpass',
 *   password: 'newpass',
 *   confirmPassword: 'newpass'
 * });
 * ```
 */
export const changePassword = async (
  passwordData: ChangePasswordRequest,
): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.put<ApiResponse<{ message: string }>>("/api/auth/password", passwordData);
  return response.data;
};

/**
 * Refresh authentication token
 * @returns Promise resolving to new authentication response
 * @endpoint POST /api/auth/refresh
 * @example
 * ```typescript
 * const response = await refreshToken();
 * console.log(response.data.token);
 * ```
 */
export const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  const response = await httpInstance.post<ApiResponse<AuthResponse>>("/api/auth/refresh");
  return response.data;
};
