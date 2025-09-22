import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateMajalahRequest,
  Majalah,
  MajalahDetailResponse,
  MajalahListPublicResponse,
  MajalahListResponse,
  MajalahQueryParams,
  UpdateMajalahRequest,
} from "@/lib/api/types/majalah.types";

const base = "/api/majalahs";

export const majalahService = createCrudService<Majalah, Majalah, CreateMajalahRequest, UpdateMajalahRequest>(base);

/**
 * Mendapatkan daftar majalah dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar majalah dengan pagination
 * @endpoint GET /api/majalahs
 * @example
 * ```typescript
 * const response = await getMajalahs({ page: 1, per_page: 10, bulan: 3, tahun: 2025 });
 * console.log(response.data.data); // Array of majalah
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getMajalahs = (params?: MajalahQueryParams): Promise<ApiResponse<MajalahListResponse>> => {
  // Destructure customFilters jika ada
  if (params?.customFilters && params.customFilters.length > 0) {
    const { customFilters, ...restParams } = params;

    // Gabungkan semua properti dari customFilters ke dalam params utama
    const flattenedCustomFilters = customFilters.reduce((acc, filter) => {
      return { ...acc, ...filter };
    }, {});

    const finalParams = {
      ...restParams,
      ...flattenedCustomFilters,
    };

    return majalahService.get(finalParams);
  }

  return majalahService.get(params);
};

/**
 * Mendapatkan majalah berdasarkan ID
 * @param id - ID majalah
 * @returns Promise yang mengembalikan data majalah
 * @endpoint GET /api/majalahs/{id}
 * @example
 * ```typescript
 * const response = await getMajalahById(123);
 * console.log(response.data.bulan);
 * ```
 */
export const getMajalahById = (id: number): Promise<ApiResponse<MajalahDetailResponse>> => majalahService.getById(id);

/**
 * Membuat majalah baru
 * @param payload - Data untuk membuat majalah baru
 * @returns Promise yang mengembalikan data majalah yang dibuat
 * @endpoint POST /api/majalahs
 * @example
 * ```typescript
 * const response = await createMajalah({
 *   bulan: 3,
 *   tahun: 2025,
 *   link: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createMajalah = (payload: CreateMajalahRequest) => majalahService.create(payload);

/**
 * Memperbarui data majalah
 * @param id - ID majalah yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data majalah yang diperbarui
 * @endpoint PUT /api/majalahs/{id}
 * @example
 * ```typescript
 * const response = await updateMajalah(123, {
 *   bulan: 4,
 *   tahun: 2025,
 *   link: file
 * });
 * console.log(response.data.bulan);
 * ```
 */
export const updateMajalah = (id: number, payload: UpdateMajalahRequest): Promise<ApiResponse<Majalah>> =>
  majalahService.update(id, payload);

/**
 * Menghapus majalah
 * @param id - ID majalah yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/majalahs/{id}
 * @example
 * ```typescript
 * await deleteMajalah(123);
 * console.log('Majalah berhasil dihapus');
 * ```
 */
export const deleteMajalah = (id: number): Promise<ApiResponse<null>> => majalahService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar majalah untuk public display
 * @returns Promise yang mengembalikan daftar majalah public
 * @endpoint GET /media/majalah
 * @example
 * ```typescript
 * const response = await getMajalahPublic();
 * console.log(response.data); // Array of Majalah
 * ```
 */
export const getMajalahPublic = async (
  params?: MajalahQueryParams,
): Promise<ApiResponse<MajalahListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<MajalahListPublicResponse>>("/media/majalah", { params });
  return data;
};
