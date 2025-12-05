// src/lib/api/types/auth.types.ts
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
 * Struktur Data Kantor (jika nanti ada relasi)
 */
export interface KantorData {
  id: number;
  nama: string;
  alamat?: string;
}

/**
 * Struktur Data Pegawai (nested object dari API)
 */
export interface UserPegawaiData {
  id: number;
  userId: number;
  tipePegawaiId: number;
  kantorId: number;
  nama: string; // Ini pengganti fullName
  checkRadius: string;
  lat: string;
  long: string;
  kantor?: KantorData; // Property ini mungkin ada jika di-preload backend
}

/**
 * UserAuth entity interface for login response
 * Represents the authenticated user data returned from login API
 * UPDATE: Disesuaikan dengan response API Presensi (CamelCase)
 */
export interface UserAuth {
  id: number;
  email: string;
  username: string;
  noHp: string;
  // Data Relasi
  userPegawai?: UserPegawaiData;
  roles?: string[];
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Token object interface for authentication
 */
export interface Token {
  type: string;
  value: string;
  expiresAt: string;
}

/**
 * Auth response interface
 */
export interface AuthResponse {
  user: UserAuth;
  access_token: string;
  refresh_token: string;
}

/**
 * Complete login response interface
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
  nama?: string;
  username?: string;
  no_hp?: string;
  email?: string;
}
