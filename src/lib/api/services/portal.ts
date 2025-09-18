import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePortalMenuRequest,
  PortalMenu,
  PortalMenuDetailResponse,
  PortalMenuListResponse,
  PortalMenuQueryParams,
  UpdatePortalMenuRequest,
} from "@/lib/api/types/portal.types";

const base = "/api/portal";

export const portalMenuService = createCrudService<
  PortalMenu,
  PortalMenuDetailResponse,
  CreatePortalMenuRequest,
  UpdatePortalMenuRequest
>(base);

/**
 * Mendapatkan daftar portal menu dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar portal menu dengan pagination
 * @endpoint GET /api/portal
 * @example
 * ```typescript
 * const response = await getPortalMenus({ page: 1, per_page: 10, search: 'OPD' });
 * console.log(response.data.data); // Array of portal menu
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPortalMenus = (params?: PortalMenuQueryParams): Promise<ApiResponse<PortalMenuListResponse>> => {
  return portalMenuService.get(params);
};

/**
 * Mendapatkan portal menu berdasarkan ID
 * @param id - ID portal menu
 * @returns Promise yang mengembalikan data portal menu
 * @endpoint GET /api/portal/{id}
 * @example
 * ```typescript
 * const response = await getPortalMenuById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getPortalMenuById = (id: number): Promise<ApiResponse<PortalMenuDetailResponse>> =>
  portalMenuService.getById(id);

/**
 * Membuat portal menu baru
 * @param payload - Data untuk membuat portal menu baru
 * @returns Promise yang mengembalikan data portal menu yang dibuat
 * @endpoint POST /api/portal
 * @example
 * ```typescript
 * const response = await createPortalMenu({
 *   judul: 'OPD',
 *   link: '#',
 *   icon: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPortalMenu = (payload: CreatePortalMenuRequest) => portalMenuService.create(payload);

/**
 * Memperbarui data portal menu
 * @param id - ID portal menu yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data portal menu yang diperbarui
 * @endpoint PUT /api/portal/{id}
 * @example
 * ```typescript
 * const response = await updatePortalMenu(123, {
 *   judul: 'OPD Updated',
 *   link: 'https://opd.kukarkab.go.id',
 *   icon: file
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePortalMenu = (
  id: number,
  payload: UpdatePortalMenuRequest,
): Promise<ApiResponse<PortalMenuDetailResponse>> => portalMenuService.update(id, payload);

/**
 * Menghapus portal menu
 * @param id - ID portal menu yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/portal/{id}
 * @example
 * ```typescript
 * await deletePortalMenu(123);
 * console.log('Portal menu berhasil dihapus');
 * ```
 */
export const deletePortalMenu = (id: number): Promise<ApiResponse<null>> => portalMenuService.remove(id);
