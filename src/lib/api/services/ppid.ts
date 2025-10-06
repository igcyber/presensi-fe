import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePPIDRequest,
  PPID,
  PPIDDetailResponse,
  PPIDListPublicResponse,
  PPIDListResponse,
  PPIDQueryParams,
  PPIDType,
  UpdatePPIDRequest,
} from "@/lib/api/types/ppid.types";

const base = "/ppid/list";

export const ppidService = createCrudService<PPID, PPID, CreatePPIDRequest, UpdatePPIDRequest>(base);

/**
 * Mendapatkan daftar PPID dengan pagination dan custom filters
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar PPID dengan pagination
 * @endpoint GET /ppid/list
 * @example
 * ```typescript
 * const response = await getPPIDs({ page: 1, per_page: 10, search: 'informasi' });
 * console.log(response.data.data); // Array of PPID
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPPIDs = (params?: PPIDQueryParams): Promise<ApiResponse<PPIDListResponse>> => {
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

    return ppidService.get(finalParams);
  }

  return ppidService.get(params);
};

/**
 * Mendapatkan PPID berdasarkan ID
 * @param id - ID PPID
 * @param ppidType - Type of PPID
 * @returns Promise yang mengembalikan data PPID
 * @endpoint GET /api/ppid/external/{ppidType}/{id}
 * @example
 * ```typescript
 * const response = await getPPIDById(123, 'informasiberkala');
 * console.log(response.data.judul);
 * ```
 */
export const getPPIDById = (id: number, ppidType: PPIDType): Promise<ApiResponse<PPIDDetailResponse>> =>
  ppidService.getById(id, `/api/ppid/external/${ppidType}`);

/**
 * Membuat PPID baru
 * @param payload - Data untuk membuat PPID baru
 * @param ppidType - Type of PPID
 * @returns Promise yang mengembalikan data PPID yang dibuat
 * @endpoint POST /api/ppid/external/{ppidType}
 * @example
 * ```typescript
 * const response = await createPPID({
 *   judul: 'Informasi Berkala 2024',
 *   keterangan: 'Laporan Hasil RUP Kecamatan Muara Jawa tahun 2024',
 *   kategori: 'Profile Badan Publik',
 *   date: '2024',
 *   jenisfile: 'dokumen',
 *   file: pdfFile
 * }, 'informasiberkala');
 * console.log(response.data.id);
 * ```
 */
export const createPPID = (payload: CreatePPIDRequest, ppidType: PPIDType) =>
  ppidService.create(payload, `/api/ppid/external/${ppidType}`);

/**
 * Memperbarui data PPID
 * @param id - ID PPID yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @param ppidType - Type of PPID
 * @returns Promise yang mengembalikan data PPID yang diperbarui
 * @endpoint PUT /api/ppid/external/{ppidType}/{id}
 * @example
 * ```typescript
 * const response = await updatePPID(123, {
 *   judul: 'Informasi Berkala 2024 (Updated)',
 *   keterangan: 'Laporan Hasil RUP Kecamatan Muara Jawa tahun 2024 - Updated'
 * }, 'informasiberkala');
 * console.log(response.data.judul);
 * ```
 */
export const updatePPID = (id: number, payload: UpdatePPIDRequest, ppidType: PPIDType): Promise<ApiResponse<PPID>> =>
  ppidService.update(id, payload, `/api/ppid/external/${ppidType}`);

/**
 * Menghapus PPID
 * @param id - ID PPID yang akan dihapus
 * @param ppidType - Type of PPID
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/ppid/external/{ppidType}/{id}
 * @example
 * ```typescript
 * await deletePPID(123, 'informasiberkala');
 * console.log('PPID berhasil dihapus');
 * ```
 */
export const deletePPID = (id: number, ppidType: PPIDType): Promise<ApiResponse<null>> =>
  ppidService.remove(id, `/api/ppid/external/${ppidType}`);

// ==================== Public Api ====================
/**
 * Mendapatkan daftar PPID untuk public display
 * @returns Promise yang mengembalikan daftar PPID public
 * @endpoint GET /media/ppid
 * @example
 * ```typescript
 * const response = await getPPIDPublic();
 * console.log(response.data); // Array of PPID
 * ```
 */
export const getPPIDPublic = async (params?: PPIDQueryParams): Promise<ApiResponse<PPIDListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PPIDListPublicResponse>>("/media/ppid", { params });
  return data;
};

/**
 * Mendapatkan daftar kategori PPID untuk public display
 * @param ppidType - Type of PPID
 * @returns Promise yang mengembalikan daftar kategori PPID public
 * @endpoint GET /ppid/external/{ppidType}/kategori
 * @example
 * ```typescript
 * const response = await getExternalPPIDKategori('informasiberkala');
 * console.log(response.data); // Array of PPIDKategori
 * ```
 */
export const getExternalPPIDKategori = async (ppidType: PPIDType): Promise<ApiResponse<[]>> => {
  const { data } = await httpInstance.get<ApiResponse<[]>>(`/ppid/external/${ppidType}/kategori`);
  return data;
};

/**
 * Mendapatkan daftar PPID berdasarkan kategori untuk public display
 * @param ppidType - Type of PPID (informasiberkala, informasisetiapsaat, informasisertamerta, informasidikecualikan)
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar PPID public
 * @endpoint GET /ppid/kategori/{ppidType}
 * @example
 * ```typescript
 * const response = await getPPIDKategoriPublic('informasisertamerta', { page: 1, per_page: 10 });
 * console.log(response.data); // Array of PPID
 * ```
 */
export const getPPIDKategoriPublic = async (
  ppidType: PPIDType,
  params?: PPIDQueryParams,
): Promise<ApiResponse<PPID[]>> => {
  const { data } = await httpInstance.get<ApiResponse<PPID[]>>(`/ppid/kategori/${ppidType}`, {
    params,
  });
  return data;
};
