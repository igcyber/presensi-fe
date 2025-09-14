import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  Berita,
  BeritaDetailPublicResponse,
  BeritaDetailResponse,
  BeritaListPublicResponse,
  BeritaListResponse,
  BeritaQueryParams,
  BeritaSidebar,
  CreateBeritaRequest,
  UpdateBeritaRequest,
} from "@/lib/api/types/berita.types";

const base = "/api/beritas";

export const beritaService = createCrudService<Berita, Berita, CreateBeritaRequest, UpdateBeritaRequest>(base);

/**
 * Mendapatkan daftar berita dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar berita dengan pagination
 * @endpoint GET /api/beritas
 * @example
 * ```typescript
 * const response = await getBeritas({ page: 1, per_page: 10, search: 'pembangunan' });
 * console.log(response.data.data); // Array of berita
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getBeritas = (params?: BeritaQueryParams): Promise<ApiResponse<BeritaListResponse>> => {
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

    console.log("params", finalParams);
    return beritaService.get(finalParams);
  }

  console.log("params", params);
  return beritaService.get(params);
};

/**
 * Mendapatkan berita berdasarkan ID
 * @param id - ID berita
 * @returns Promise yang mengembalikan data berita
 * @endpoint GET /api/beritas/{id}
 * @example
 * ```typescript
 * const response = await getBeritaById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getBeritaById = (id: number): Promise<ApiResponse<BeritaDetailResponse>> => beritaService.getById(id);

/**
 * Membuat berita baru
 * @param payload - Data untuk membuat berita baru
 * @returns Promise yang mengembalikan data berita yang dibuat
 * @endpoint POST /api/beritas
 * @example
 * ```typescript
 * const response = await createBerita({
 *   opdId: 1,
 *   judul: 'Berita Terbaru',
 *   isi: 'Isi berita...',
 *   foto: file,
 *   tag: 'berita, terbaru'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createBerita = (payload: CreateBeritaRequest) => beritaService.create(payload);

/**
 * Memperbarui data berita
 * @param id - ID berita yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data berita yang diperbarui
 * @endpoint PUT /api/beritas/{id}
 * @example
 * ```typescript
 * const response = await updateBerita(123, {
 *   judul: 'Berita Terbaru Updated',
 *   isi: 'Isi berita yang diperbarui...',
 *   tag: 'berita, update'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updateBerita = (id: number, payload: UpdateBeritaRequest): Promise<ApiResponse<Berita>> =>
  beritaService.update(id, payload);

/**
 * Menghapus berita
 * @param id - ID berita yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/beritas/{id}
 * @example
 * ```typescript
 * await deleteBerita(123);
 * console.log('Berita berhasil dihapus');
 * ```
 */
export const deleteBerita = (id: number): Promise<ApiResponse<null>> => beritaService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar berita untuk public display
 * @returns Promise yang mengembalikan daftar berita public
 * @endpoint GET /beritas
 * @example
 * ```typescript
 * const response = await getBeritaPublic();
 * console.log(response.data); // Array of BeritaPublic
 * ```
 */
export const getBeritaPublic = async (params?: BeritaQueryParams): Promise<ApiResponse<BeritaListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<BeritaListPublicResponse>>("/beritas/public", { params });
  return data;
};

/**
 * Mendapatkan berita berdasarkan ID untuk public display
 * @param id - ID berita
 * @returns Promise yang mengembalikan data berita public
 * @endpoint GET /beritas/{id}
 * @example
 * ```typescript
 * const response = await getBeritaByIdPublic(123);
 * console.log(response.data); // Detail Berita
 * ```
 */
export const getBeritaByIdPublic = async (id: number): Promise<ApiResponse<BeritaDetailPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<BeritaDetailPublicResponse>>(`/beritas/${id}`);
  return data;
};

/**
 * Mendapatkan daftar berita untuk sidebar
 * @returns Promise yang mengembalikan daftar berita sidebar
 * @endpoint GET /beritas/sidebar
 * @example
 * ```typescript
 * const response = await getBeritaSidebar();
 * console.log(response.data); // Array of BeritaSidebar
 * ```
 */
export const getBeritaSidebar = async (): Promise<ApiResponse<BeritaSidebar[]>> => {
  const { data } = await httpInstance.get<ApiResponse<BeritaSidebar[]>>("/beritas/sidebar");
  return data;
};
