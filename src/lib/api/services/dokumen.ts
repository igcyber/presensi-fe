import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateDokumenRequest,
  Dokumen,
  DokumenDetailResponse,
  DokumenListPublicResponse,
  DokumenListResponse,
  DokumenQueryParams,
  UpdateDokumenRequest,
} from "@/lib/api/types/dokumen.types";

const base = "/api/documents";

export const dokumenService = createCrudService<Dokumen, Dokumen, CreateDokumenRequest, UpdateDokumenRequest>(base);

/**
 * Mendapatkan daftar dokumen dengan pagination dan custom filters
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar dokumen dengan pagination
 * @endpoint GET /api/documents
 * @example
 * ```typescript
 * const response = await getDokumens({ page: 1, per_page: 10, search: 'peraturan' });
 * console.log(response.data.data); // Array of dokumen
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getDokumens = (params?: DokumenQueryParams): Promise<ApiResponse<DokumenListResponse>> => {
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

    return dokumenService.get(finalParams);
  }

  return dokumenService.get(params);
};

/**
 * Mendapatkan dokumen berdasarkan ID
 * @param id - ID dokumen
 * @returns Promise yang mengembalikan data dokumen
 * @endpoint GET /api/documents/{id}
 * @example
 * ```typescript
 * const response = await getDokumenById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getDokumenById = (id: number): Promise<ApiResponse<DokumenDetailResponse>> => dokumenService.getById(id);

/**
 * Membuat dokumen baru
 * @param payload - Data untuk membuat dokumen baru
 * @returns Promise yang mengembalikan data dokumen yang dibuat
 * @endpoint POST /api/documents
 * @example
 * ```typescript
 * const response = await createDokumen({
 *   nama: 'Peraturan Bupati No. 1 Tahun 2024',
 *   file: pdfFile,
 *   isi: 'Deskripsi dokumen...'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createDokumen = (payload: CreateDokumenRequest) => dokumenService.create(payload);

/**
 * Memperbarui data dokumen
 * @param id - ID dokumen yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data dokumen yang diperbarui
 * @endpoint PUT /api/documents/{id}
 * @example
 * ```typescript
 * const response = await updateDokumen(123, {
 *   nama: 'Peraturan Bupati No. 1 Tahun 2024 (Revised)',
 *   isi: 'Deskripsi dokumen yang diperbarui...'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateDokumen = (id: number, payload: UpdateDokumenRequest): Promise<ApiResponse<Dokumen>> =>
  dokumenService.update(id, payload);

/**
 * Menghapus dokumen
 * @param id - ID dokumen yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/documents/{id}
 * @example
 * ```typescript
 * await deleteDokumen(123);
 * console.log('Dokumen berhasil dihapus');
 * ```
 */
export const deleteDokumen = (id: number): Promise<ApiResponse<null>> => dokumenService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar dokumen untuk public display
 * @returns Promise yang mengembalikan daftar dokumen public
 * @endpoint GET /media/dokumen
 * @example
 * ```typescript
 * const response = await getDokumenPublic();
 * console.log(response.data); // Array of Dokumen
 * ```
 */
export const getDokumenPublic = async (
  params?: DokumenQueryParams,
): Promise<ApiResponse<DokumenListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<DokumenListPublicResponse>>("/media/dokumen", { params });
  return data;
};
