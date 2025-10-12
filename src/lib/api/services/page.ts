import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePageRequest,
  Page,
  PageDetailResponse,
  PageListResponse,
  PageQueryParams,
  UpdatePageRequest,
} from "@/lib/api/types/page.types";

const base = "/api/pages";

export const pageService = createCrudService<Page, PageDetailResponse, CreatePageRequest, UpdatePageRequest>(base);

/**
 * Mendapatkan daftar pages dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar pages dengan pagination
 * @endpoint GET /api/pages
 * @example
 * ```typescript
 * const response = await getPages({ page: 1, per_page: 10, search: 'profil' });
 * console.log(response.data.data); // Array of pages
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPages = (params?: PageQueryParams): Promise<ApiResponse<PageListResponse>> => {
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

    return pageService.get(finalParams);
  }
  return pageService.get(params);
};

/**
 * Mendapatkan page berdasarkan ID
 * @param id - ID page
 * @returns Promise yang mengembalikan data page
 * @endpoint GET /api/pages/{id}
 * @example
 * ```typescript
 * const response = await getPageById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPageById = (id: number): Promise<ApiResponse<PageDetailResponse>> => pageService.getById(id);

/**
 * Membuat page baru
 * @param payload - Data untuk membuat page baru
 * @returns Promise yang mengembalikan data page yang dibuat
 * @endpoint POST /api/pages
 * @example
 * ```typescript
 * const response = await createPage({
 *   nama: 'Tentang Kami',
 *   tipe: 'page',
 *   content: '<h1>Tentang DPRD</h1><p>...</p>',
 *   menuId: 1
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPage = (payload: CreatePageRequest) => pageService.create(payload);

/**
 * Memperbarui data page
 * @param id - ID page yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data page yang diperbarui
 * @endpoint PUT /api/pages/{id}
 * @example
 * ```typescript
 * const response = await updatePage(123, {
 *   nama: 'Tentang Kami (Updated)',
 *   content: '<h1>Updated content</h1>'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updatePage = (id: number, payload: UpdatePageRequest): Promise<ApiResponse<PageDetailResponse>> =>
  pageService.update(id, payload);

/**
 * Menghapus page
 * @param id - ID page yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/pages/{id}
 * @example
 * ```typescript
 * await deletePage(123);
 * console.log('Page berhasil dihapus');
 * ```
 */
export const deletePage = (id: number): Promise<ApiResponse<null>> => pageService.remove(id);
