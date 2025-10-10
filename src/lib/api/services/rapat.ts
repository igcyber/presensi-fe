import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateRapatRequest,
  Rapat,
  RapatDetailResponse,
  RapatListResponse,
  RapatQueryParams,
  UpdateRapatRequest,
} from "@/lib/api/types/rapat.types";

const base = "/api/rapat";

export const rapatService = createCrudService<Rapat, RapatDetailResponse, CreateRapatRequest, UpdateRapatRequest>(base);

/**
 * Mendapatkan daftar rapat dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar rapat dengan pagination
 * @endpoint GET /api/rapat
 * @example
 * ```typescript
 * const response = await getRapats({ page: 1, per_page: 10, search: 'paripurna' });
 * console.log(response.data.data); // Array of rapat
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getRapats = (params?: RapatQueryParams): Promise<ApiResponse<RapatListResponse>> => {
  return rapatService.get(params);
};

/**
 * Mendapatkan rapat berdasarkan ID
 * @param id - ID rapat
 * @returns Promise yang mengembalikan data rapat
 * @endpoint GET /api/rapat/{id}
 * @example
 * ```typescript
 * const response = await getRapatById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getRapatById = (id: number): Promise<ApiResponse<RapatDetailResponse>> => rapatService.getById(id);

/**
 * Membuat rapat baru
 * @param payload - Data untuk membuat rapat baru
 * @returns Promise yang mengembalikan data rapat yang dibuat
 * @endpoint POST /api/rapat
 * @example
 * ```typescript
 * const response = await createRapat({
 *   judul: 'Rapat Paripurna APBD 2024',
 *   lokasi: 'Ruang Paripurna DPRD',
 *   isi: 'Pembahasan APBD...',
 *   tanggal: '2024-09-15',
 *   waktuMulai: '09:00:00',
 *   waktuBerakhir: '12:00:00'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createRapat = (payload: CreateRapatRequest) => rapatService.create(payload);

/**
 * Memperbarui data rapat
 * @param id - ID rapat yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data rapat yang diperbarui
 * @endpoint PUT /api/rapat/{id}
 * @example
 * ```typescript
 * const response = await updateRapat(123, {
 *   judul: 'Rapat Paripurna APBD 2024 (Updated)',
 *   lokasi: 'Ruang Paripurna DPRD Lantai 2'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updateRapat = (id: number, payload: UpdateRapatRequest): Promise<ApiResponse<RapatDetailResponse>> =>
  rapatService.update(id, payload);

/**
 * Menghapus rapat
 * @param id - ID rapat yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/rapat/{id}
 * @example
 * ```typescript
 * await deleteRapat(123);
 * console.log('Rapat berhasil dihapus');
 * ```
 */
export const deleteRapat = (id: number): Promise<ApiResponse<null>> => rapatService.remove(id);
