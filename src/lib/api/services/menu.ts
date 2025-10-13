import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateMenuRequest,
  Menu,
  MenuBySlugResponse,
  MenuDetailResponse,
  MenuListPublicResponse,
  MenuListResponse,
  MenuQueryParams,
  UpdateMenuRequest,
} from "@/lib/api/types/menu.types";

import { httpInstance } from "../core";

const base = "/api/menus";

export const menuService = createCrudService<Menu, MenuDetailResponse, CreateMenuRequest, UpdateMenuRequest>(base);

/**
 * Mendapatkan daftar menu dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar menu dengan pagination
 * @endpoint GET /api/menu
 * @example
 * ```typescript
 * const response = await getMenus({ page: 1, per_page: 10, search: 'profil' });
 * console.log(response.data.data); // Array of menu
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getMenus = (params?: MenuQueryParams): Promise<ApiResponse<MenuListResponse>> => {
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

    return menuService.get(finalParams);
  }
  return menuService.get(params);
};

/**
 * Mendapatkan menu berdasarkan ID
 * @param id - ID menu
 * @returns Promise yang mengembalikan data menu
 * @endpoint GET /api/menu/{id}
 * @example
 * ```typescript
 * const response = await getMenuById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getMenuById = (id: number): Promise<ApiResponse<MenuDetailResponse>> => menuService.getById(id);

/**
 * Membuat menu baru
 * @param payload - Data untuk membuat menu baru
 * @returns Promise yang mengembalikan data menu yang dibuat
 * @endpoint POST /api/menu
 * @example
 * ```typescript
 * const response = await createMenu({
 *   nama: 'Profil',
 *   url: '/profil',
 *   menuId: 1
 * });
 * console.log(response.data.id);
 * ```
 */
export const createMenu = (payload: CreateMenuRequest) => menuService.create(payload);

/**
 * Memperbarui data menu
 * @param id - ID menu yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data menu yang diperbarui
 * @endpoint PUT /api/menu/{id}
 * @example
 * ```typescript
 * const response = await updateMenu(123, {
 *   nama: 'Profil (Updated)',
 *   url: '/profil-dprd'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateMenu = (id: number, payload: UpdateMenuRequest): Promise<ApiResponse<MenuDetailResponse>> =>
  menuService.update(id, payload);

/**
 * Menghapus menu
 * @param id - ID menu yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/menu/{id}
 * @example
 * ```typescript
 * await deleteMenu(123);
 * console.log('Menu berhasil dihapus');
 * ```
 */
export const deleteMenu = (id: number): Promise<ApiResponse<null>> => menuService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar menu untuk public display
 * @returns Promise yang mengembalikan daftar menu public
 * @endpoint GET /api/menu
 * @example
 * ```typescript
 * const response = await getMenuPublic();
 * console.log(response.data.data); // Array of menu
 */
export const getMenuPublic = async (params?: MenuQueryParams): Promise<ApiResponse<MenuListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<MenuListPublicResponse>>(`/menu`, { params });
  return data;
};

/**
 * Mendapatkan menu berdasarkan slug untuk public display
 * @param slug - Slug menu yang akan diambil
 * @returns Promise yang mengembalikan data menu dengan page content
 * @endpoint GET /menu/{slug}
 * @example
 * ```typescript
 * const response = await getMenuBySlug('visi-misi');
 * console.log(response.data.page.content);
 * ```
 */
export const getMenuBySlug = async (slug: string): Promise<ApiResponse<MenuBySlugResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<MenuBySlugResponse>>(`/menu/${slug}`);
  return data;
};
