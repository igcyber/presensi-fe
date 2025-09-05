import apiClient from "@/lib/api/apiClient";
import type { ApiResponse } from "@/lib/api/apiResponse";
import type { User, UserChangePasswordData, UserFormData, UserLoginData, UserUpdateData } from "@/schemas/userSchema";

export interface UserListParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  is_active?: boolean;
}

export interface UserListMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export interface UserListLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

export interface UserListApiResponse {
  data: User[];
  meta: UserListMeta;
  links: UserListLinks;
}

/**
 * User Service - Menangani semua operasi CRUD untuk user
 */
export class UserService {
  private readonly baseUrl = "/users";

  /**
   * Mengambil daftar semua user dengan pagination dan filter
   */
  async getUsers(params: UserListParams = {}): Promise<ApiResponse<UserListApiResponse>> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.per_page) queryParams.append("per_page", params.per_page.toString());
    if (params.search) queryParams.append("search", params.search);
    if (params.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params.sort_order) queryParams.append("sort_order", params.sort_order);
    if (params.is_active !== undefined) queryParams.append("is_active", params.is_active.toString());

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return await apiClient.get<UserListApiResponse>(url);
  }

  /**
   * Mengambil detail user berdasarkan ID
   */
  async getUserById(id: number): Promise<ApiResponse<User>> {
    return await apiClient.get<User>(`${this.baseUrl}/${id}`);
  }

  /**
   * Membuat user baru
   */
  async createUser(userData: UserFormData): Promise<ApiResponse<User>> {
    return await apiClient.post<User>(this.baseUrl, userData);
  }

  /**
   * Mengupdate user berdasarkan ID
   */
  async updateUser(id: number, userData: UserUpdateData): Promise<ApiResponse<User>> {
    return await apiClient.put<User>(`${this.baseUrl}/${id}`, userData);
  }

  /**
   * Mengupdate sebagian data user berdasarkan ID
   */
  async patchUser(id: number, userData: Partial<UserUpdateData>): Promise<ApiResponse<User>> {
    return await apiClient.patch<User>(`${this.baseUrl}/${id}`, userData);
  }

  /**
   * Menghapus user berdasarkan ID
   */
  async deleteUser(id: number): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }

  /**
   * Login user
   */
  async login(credentials: UserLoginData): Promise<ApiResponse<{ user: User; token: string }>> {
    return await apiClient.post<{ user: User; token: string }>("/auth/login", credentials);
  }

  /**
   * Logout user
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>("/auth/logout");
  }

  /**
   * Mengubah password user
   */
  async changePassword(id: number, passwordData: UserChangePasswordData): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>(`${this.baseUrl}/${id}/change-password`, passwordData);
  }

  /**
   * Mengaktifkan/menonaktifkan user
   */
  async toggleUserStatus(id: number, isActive: boolean): Promise<ApiResponse<User>> {
    return await apiClient.patch<User>(`${this.baseUrl}/${id}/toggle-status`, { is_active: isActive });
  }

  /**
   * Mengambil profile user yang sedang login
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return await apiClient.get<User>("/auth/profile");
  }

  /**
   * Mengupdate profile user yang sedang login
   */
  async updateProfile(userData: Partial<UserUpdateData>): Promise<ApiResponse<User>> {
    return await apiClient.put<User>("/auth/profile", userData);
  }

  /**
   * Verifikasi email user
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>("/auth/verify-email", { token });
  }

  /**
   * Kirim ulang email verifikasi
   */
  async resendVerificationEmail(email: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>("/auth/resend-verification", { email });
  }

  /**
   * Reset password - kirim email reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
  }

  /**
   * Reset password - konfirmasi dengan token
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiClient.post<{ message: string }>("/auth/reset-password", {
      token,
      password: newPassword,
    });
  }
}

// Export instance default
export const userService = new UserService();

// Export individual functions untuk kemudahan penggunaan
export const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  login,
  logout,
  changePassword,
  toggleUserStatus,
  getProfile,
  updateProfile,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} = userService;
