import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateFotoRequest,
  Foto,
  FotoDetailResponse,
  FotoListPublicResponse,
  FotoListResponse,
  FotoQueryParams,
  UpdateFotoRequest,
} from "@/lib/api/types/foto.types";

const base = "/api/foto";

export const fotoService = createCrudService<Foto, Foto, CreateFotoRequest, UpdateFotoRequest>(base);

/**
 * Mendapatkan daftar foto dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar foto dengan pagination
 * @endpoint GET /api/fotos
 * @example
 * ```typescript
 * const response = await getFotos({ page: 1, per_page: 10, search: 'gallery' });
 * console.log(response.data.data); // Array of fotos
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getFotos = (params?: FotoQueryParams): Promise<ApiResponse<FotoListResponse>> => fotoService.get(params);

/**
 * Mendapatkan foto berdasarkan ID
 * @param id - ID foto
 * @returns Promise yang mengembalikan data foto
 * @endpoint GET /api/fotos/{id}
 * @example
 * ```typescript
 * const response = await getFotoById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getFotoById = (id: number): Promise<ApiResponse<FotoDetailResponse>> => fotoService.getById(id);

/**
 * Membuat foto baru
 * @param payload - Data untuk membuat foto baru
 * @returns Promise yang mengembalikan data foto yang dibuat
 * @endpoint POST /api/fotos
 * @example
 * ```typescript
 * const response = await createFoto({
 *   judul: 'Galeri Foto',
 *   foto: fileInput
 * });
 * console.log(response.data.id);
 * ```
 */
export const createFoto = (payload: CreateFotoRequest) => fotoService.create(payload);

/**
 * Memperbarui data foto
 * @param id - ID foto yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data foto yang diperbarui
 * @endpoint PUT /api/fotos/{id}
 * @example
 * ```typescript
 * const response = await updateFoto(123, {
 *   judul: 'Galeri Foto Updated',
 *   foto: newFileInput
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updateFoto = (id: number, payload: UpdateFotoRequest): Promise<ApiResponse<Foto>> =>
  fotoService.update(id, payload);

/**
 * Menghapus foto
 * @param id - ID foto yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/fotos/{id}
 * @example
 * ```typescript
 * await deleteFoto(123);
 * console.log('Foto berhasil dihapus');
 * ```
 */
export const deleteFoto = (id: number): Promise<ApiResponse<null>> => fotoService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar foto untuk public display
 * @returns Promise yang mengembalikan daftar foto public
 * @endpoint GET /fotos
 * @example
 * ```typescript
 * const response = await getFotoPublic();
 * console.log(response.data); // Array of FotoPublic
 * ```
 */
export const getFotoPublic = async (params?: FotoQueryParams): Promise<ApiResponse<FotoListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<FotoListPublicResponse>>("/media/foto", { params });
  return data;
};
