import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateRadioRequest,
  Radio,
  RadioDetailResponse,
  RadioListPublicResponse,
  RadioListResponse,
  RadioQueryParams,
  UpdateRadioRequest,
} from "@/lib/api/types/radio.types";

const base = "/api/radios";

export const radioService = createCrudService<Radio, RadioDetailResponse, CreateRadioRequest, UpdateRadioRequest>(base);

/**
 * Mendapatkan daftar radio dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar radio dengan pagination
 * @endpoint GET /api/radios
 * @example
 * ```typescript
 * const response = await getRadios({ page: 1, per_page: 10, search: 'radio' });
 * console.log(response.data.data); // Array of radio
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getRadios = (params?: RadioQueryParams): Promise<ApiResponse<RadioListResponse>> => {
  return radioService.get(params);
};

/**
 * Mendapatkan radio berdasarkan ID
 * @param id - ID radio
 * @returns Promise yang mengembalikan data radio
 * @endpoint GET /api/radios/{id}
 * @example
 * ```typescript
 * const response = await getRadioById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getRadioById = (id: number): Promise<ApiResponse<RadioDetailResponse>> => radioService.getById(id);

/**
 * Membuat radio baru
 * @param payload - Data untuk membuat radio baru
 * @returns Promise yang mengembalikan data radio yang dibuat
 * @endpoint POST /api/radios
 * @example
 * ```typescript
 * const response = await createRadio({
 *   judul: 'Radio Kukar FM',
 *   isi: 'Radio resmi Kabupaten Kutai Kartanegara',
 *   link: 'https://radio.kukarkab.go.id'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createRadio = (payload: CreateRadioRequest) => radioService.create(payload);

/**
 * Memperbarui data radio
 * @param id - ID radio yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data radio yang diperbarui
 * @endpoint PUT /api/radios/{id}
 * @example
 * ```typescript
 * const response = await updateRadio(123, {
 *   judul: 'Radio Kukar FM Updated',
 *   isi: 'Radio resmi Kabupaten Kutai Kartanegara - Updated',
 *   link: 'https://radio-updated.kukarkab.go.id'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updateRadio = (id: number, payload: UpdateRadioRequest): Promise<ApiResponse<RadioDetailResponse>> =>
  radioService.update(id, payload);

/**
 * Menghapus radio
 * @param id - ID radio yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/radios/{id}
 * @example
 * ```typescript
 * await deleteRadio(123);
 * console.log('Radio berhasil dihapus');
 * ```
 */
export const deleteRadio = (id: number): Promise<ApiResponse<null>> => radioService.remove(id);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar radio untuk public display
 * @returns Promise yang mengembalikan daftar radio public
 * @endpoint GET /media/radio
 * @example
 * ```typescript
 * const response = await getRadioPublic({ page: 1 });
 * console.log(response.data); // Array of RadioPublic
 * ```
 */
export const getRadioPublic = async (params?: RadioQueryParams): Promise<ApiResponse<RadioListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<RadioListPublicResponse>>("/media/radio", { params });
  return data;
};
