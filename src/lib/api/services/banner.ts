import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  Banner,
  BannerDetailResponse,
  BannerListResponse,
  BannerQueryParams,
  CreateBannerRequest,
  UpdateBannerRequest,
} from "@/lib/api/types/banner.types";

const base = "/api/banners";

export const bannerService = createCrudService<Banner, BannerDetailResponse, CreateBannerRequest, UpdateBannerRequest>(
  base,
);

/**
 * Mendapatkan daftar banner dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar banner dengan pagination
 * @endpoint GET /api/banners
 * @example
 * ```typescript
 * const response = await getBanners({ page: 1, per_page: 10, search: 'SP4N' });
 * console.log(response.data.data); // Array of banner
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getBanners = (params?: BannerQueryParams): Promise<ApiResponse<BannerListResponse>> => {
  return bannerService.get(params);
};

/**
 * Mendapatkan banner berdasarkan ID
 * @param id - ID banner
 * @returns Promise yang mengembalikan data banner
 * @endpoint GET /api/banners/{id}
 * @example
 * ```typescript
 * const response = await getBannerById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getBannerById = (id: number): Promise<ApiResponse<BannerDetailResponse>> => bannerService.getById(id);

/**
 * Membuat banner baru
 * @param payload - Data untuk membuat banner baru
 * @returns Promise yang mengembalikan data banner yang dibuat
 * @endpoint POST /api/banners
 * @example
 * ```typescript
 * const response = await createBanner({
 *   nama: 'SP4N Lapor',
 *   url: 'https://lapor.go.id',
 *   status: 'active',
 *   foto: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createBanner = (payload: CreateBannerRequest) => bannerService.create(payload);

/**
 * Memperbarui data banner
 * @param id - ID banner yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data banner yang diperbarui
 * @endpoint PUT /api/banners/{id}
 * @example
 * ```typescript
 * const response = await updateBanner(123, {
 *   nama: 'SP4N Lapor Updated',
 *   status: 'inactive',
 *   foto: file
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateBanner = (id: number, payload: UpdateBannerRequest): Promise<ApiResponse<BannerDetailResponse>> =>
  bannerService.update(id, payload);

/**
 * Menghapus banner
 * @param id - ID banner yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/banners/{id}
 * @example
 * ```typescript
 * await deleteBanner(123);
 * console.log('Banner berhasil dihapus');
 * ```
 */
export const deleteBanner = (id: number): Promise<ApiResponse<null>> => bannerService.remove(id);
