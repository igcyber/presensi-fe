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
 * User entity interface
 */
export interface User extends BaseEntity {
  username: string;
  email: string;
  name?: string;
  role?: string;
  isActive?: boolean;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
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
