import type { BaseEntity } from "../core/apiResponse";

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Role entity interface
 */
export interface Role extends BaseEntity {
  name: string;
}

/**
 * User entity interface for login response
 * Represents the authenticated user data returned from login API
 */
export interface User extends BaseEntity {
  fullName: string;
  email: string;
  username: string;
  nip: string;
}

/**
 * Token object interface for authentication
 * Contains the bearer token and its expiration information
 */
export interface Token {
  type: string;
  value: string;
  expiresAt: string;
}

/**
 * Auth response interface combining user and token
 * Represents the data payload in successful login response
 */
export interface AuthResponse {
  user: User;
  token: Token;
}

/**
 * Complete login response interface
 * Represents the full API response structure for successful login
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  timestamp: string;
  data: AuthResponse;
}

/**
 * Password change request
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Password reset request
 */
export interface ResetPasswordRequest {
  email: string;
}

/**
 * Password reset confirm request
 */
export interface ResetPasswordConfirmRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  username?: string;
}
