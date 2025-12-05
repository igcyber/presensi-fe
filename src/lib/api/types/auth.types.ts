// import type { User } from "./user.types";

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
 * Represents a user with roles in the system
 */
export interface User {
  id: number;
  email: string;
  username: string;
  nama: string;
  no_hp: string;
  roles: string[];
}

export interface UserAuth {
  id: number;
  email: string;
  username: string;
  nama: string;
  no_hp: string;
  roles: string[];
  permissions: string[];
  kantor: string;
  kantor_id: number;
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
  user: UserAuth;
  access_token: string;
  refresh_token: string;
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
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  fullName?: string;
  username?: string;
  nip?: string;
  email?: string;
}
