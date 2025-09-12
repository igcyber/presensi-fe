import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core/apiResponse";
import http from "@/lib/api/core/httpInstance";

type Id = number | string;

/**
 * Interface untuk CRUD service yang menyediakan operasi dasar
 * @template TList - Tipe data untuk list/array items
 * @template TDetail - Tipe data untuk detail item (default sama dengan TList)
 * @template TCreate - Tipe data untuk payload create
 * @template TUpdate - Tipe data untuk payload update (default Partial<TCreate>)
 */
export type CrudService<TList, TDetail = TList, TCreate = unknown, TUpdate = Partial<TCreate>> = {
  /** Mendapatkan daftar data dengan pagination dan search */
  get: (params?: SearchParams) => Promise<ApiResponse<PaginatedPayload<TList>>>;
  /** Mendapatkan data berdasarkan ID */
  getById: (id: Id) => Promise<ApiResponse<TDetail>>;
  /** Membuat data baru */
  create: (payload: TCreate) => Promise<ApiResponse<TDetail>>;
  /** Memperbarui data berdasarkan ID */
  update: (id: Id, payload: TUpdate) => Promise<ApiResponse<TDetail>>;
  /** Menghapus data berdasarkan ID */
  remove: (id: Id) => Promise<ApiResponse<null>>;
};

/**
 * Mengecek apakah payload mengandung file upload
 * @param payload - Data yang akan dicek
 * @returns true jika mengandung File atau FileList
 */
function hasFileUpload(payload: unknown): boolean {
  if (!payload || typeof payload !== "object") return false;

  for (const value of Object.values(payload)) {
    if (value instanceof File || value instanceof FileList) {
      return true;
    }
  }
  return false;
}

/**
 * Mengkonversi payload menjadi FormData untuk file upload
 * @param payload - Data yang akan dikonversi
 * @returns FormData object
 */
function createFormData(payload: unknown): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload as Record<string, unknown>)) {
    if (value instanceof File) {
      // Append single file
      formData.append(key, value);
    } else if (value instanceof FileList) {
      // Append multiple files dengan format array
      for (let i = 0; i < value.length; i++) {
        formData.append(`${key}[]`, value[i]);
      }
    } else if (value !== null && value !== undefined) {
      // Append nilai lain sebagai string
      formData.append(key, String(value));
    }
  }

  return formData;
}

/**
 * Factory function untuk membuat CRUD service
 * @template TList - Tipe data untuk list items
 * @template TDetail - Tipe data untuk detail item
 * @template TCreate - Tipe data untuk payload create
 * @template TUpdate - Tipe data untuk payload update
 * @param resourcePath - Base path untuk resource API (contoh: "/api/users")
 * @returns CrudService instance dengan semua operasi CRUD
 *
 * @example
 * ```typescript
 * // Membuat service untuk User
 * const userService = createCrudService<User, User, CreateUserRequest, UpdateUserRequest>("/api/users");
 *
 * // Menggunakan service
 * const users = await userService.get({ page: 1, per_page: 10 });
 * const user = await userService.getById(1);
 * const newUser = await userService.create({ name: "John", email: "john@example.com" });
 * ```
 */
export function createCrudService<TList, TDetail = TList, TCreate = unknown, TUpdate = Partial<TCreate>>(
  resourcePath: string,
): CrudService<TList, TDetail, TCreate, TUpdate> {
  return {
    /**
     * Mendapatkan daftar data dengan pagination
     * @param params - Parameter query untuk filtering dan pagination
     */
    get: async (params) => {
      const { data } = await http.get<ApiResponse<PaginatedPayload<TList>>>(resourcePath, { params });
      return data;
    },

    /**
     * Mendapatkan data berdasarkan ID
     * @param id - ID dari data yang ingin diambil
     */
    getById: async (id) => {
      const { data } = await http.get<ApiResponse<TDetail>>(`${resourcePath}/${id}`);
      return data;
    },

    /**
     * Membuat data baru
     * Otomatis mendeteksi jika ada file upload dan menggunakan multipart/form-data
     * @param payload - Data untuk membuat resource baru
     */
    create: async (payload: TCreate) => {
      const needsMultipart = hasFileUpload(payload);
      const requestData = needsMultipart ? createFormData(payload) : payload;
      const headers = needsMultipart ? { "Content-Type": "multipart/form-data" } : {};

      const { data } = await http.post<ApiResponse<TDetail>>(resourcePath, requestData, { headers });
      return data;
    },

    /**
     * Memperbarui data berdasarkan ID
     * Otomatis mendeteksi jika ada file upload dan menggunakan multipart/form-data
     * @param id - ID dari data yang ingin diupdate
     * @param payload - Data yang akan diupdate
     */
    update: async (id, payload: TUpdate) => {
      const needsMultipart = hasFileUpload(payload);
      const requestData = needsMultipart ? createFormData(payload) : payload;
      const headers = needsMultipart ? { "Content-Type": "multipart/form-data" } : {};

      const { data } = await http.put<ApiResponse<TDetail>>(`${resourcePath}/${id}`, requestData, { headers });
      return data;
    },

    /**
     * Menghapus data berdasarkan ID
     * @param id - ID dari data yang ingin dihapus
     */
    remove: async (id) => {
      const { data } = await http.delete<ApiResponse<null>>(`${resourcePath}/${id}`);
      return data;
    },
  };
}
