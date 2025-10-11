import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateJabatanAnggotaRequest,
  JabatanAnggota,
  JabatanAnggotaDetailResponse,
  JabatanAnggotaListResponse,
  JabatanAnggotaQueryParams,
  UpdateJabatanAnggotaRequest,
} from "@/lib/api/types/jabatanAnggota.types";

const base = "/api/jabatan-anggotas";

export const jabatanAnggotaService = createCrudService<
  JabatanAnggota,
  JabatanAnggotaDetailResponse,
  CreateJabatanAnggotaRequest,
  UpdateJabatanAnggotaRequest
>(base);

/**
 * Mendapatkan daftar jabatan anggota dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar jabatan anggota dengan pagination
 * @endpoint GET /api/jabatan-anggotas
 * @example
 * ```typescript
 * const response = await getJabatanAnggotas({ page: 1, per_page: 10, search: 'ketua' });
 * console.log(response.data.data); // Array of jabatan anggota
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getJabatanAnggotas = (
  params?: JabatanAnggotaQueryParams,
): Promise<ApiResponse<JabatanAnggotaListResponse>> => {
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

    return jabatanAnggotaService.get(finalParams);
  }
  return jabatanAnggotaService.get(params);
};

/**
 * Mendapatkan jabatan anggota berdasarkan ID
 * @param id - ID jabatan anggota
 * @returns Promise yang mengembalikan data jabatan anggota
 * @endpoint GET /api/jabatan-anggotas/{id}
 * @example
 * ```typescript
 * const response = await getJabatanAnggotaById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getJabatanAnggotaById = (id: number): Promise<ApiResponse<JabatanAnggotaDetailResponse>> =>
  jabatanAnggotaService.getById(id);

/**
 * Membuat jabatan anggota baru
 * @param payload - Data untuk membuat jabatan anggota baru
 * @returns Promise yang mengembalikan data jabatan anggota yang dibuat
 * @endpoint POST /api/jabatan-anggotas
 * @example
 * ```typescript
 * const response = await createJabatanAnggota({
 *   nama: 'H. Ahmad Fauzi, S.H.',
 *   jabatan: 'Ketua DPRD',
 *   foto: file,
 *   strukturId: 8,
 *   anggotaId: null
 * });
 * console.log(response.data.id);
 * ```
 */
export const createJabatanAnggota = (payload: CreateJabatanAnggotaRequest) => jabatanAnggotaService.create(payload);

/**
 * Memperbarui data jabatan anggota
 * @param id - ID jabatan anggota yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data jabatan anggota yang diperbarui
 * @endpoint PUT /api/jabatan-anggotas/{id}
 * @example
 * ```typescript
 * const response = await updateJabatanAnggota(123, {
 *   nama: 'H. Ahmad Fauzi, S.H., M.H.',
 *   jabatan: 'Ketua DPRD'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateJabatanAnggota = (
  id: number,
  payload: UpdateJabatanAnggotaRequest,
): Promise<ApiResponse<JabatanAnggotaDetailResponse>> => jabatanAnggotaService.update(id, payload);

/**
 * Menghapus jabatan anggota
 * @param id - ID jabatan anggota yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/jabatan-anggotas/{id}
 * @example
 * ```typescript
 * await deleteJabatanAnggota(123);
 * console.log('Jabatan anggota berhasil dihapus');
 * ```
 */
export const deleteJabatanAnggota = (id: number): Promise<ApiResponse<null>> => jabatanAnggotaService.remove(id);
