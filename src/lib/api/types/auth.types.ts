import type { User } from "./user.types";

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
 * UserAuth entity interface for login response
 * Represents the authenticated user data returned from login API
 */
export type UserAuth = Omit<User, "roles">;

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
  user: UserAuth;
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
 * Profile update request
 */
export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  username?: string;
}
