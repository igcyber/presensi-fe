import type { ApiResponse, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { OpdQueryParams } from "@/lib/api/types/opd.types";
import type {
  CreateLayananRequest,
  Layanan,
  LayananDetail,
  LayananListPayload,
  LayananSearchParams,
  OpdListPayload,
  UpdateLayananRequest,
} from "@/lib/api/types/unitKerja.types";

// ==================== LAYANAN SERVICES ====================

/**
 * Get paginated list of services
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to services list with pagination metadata
 * @endpoint GET /unit-kerja/layanan
 * @example
 * ```typescript
 * const response = await getLayananList({ page: 1, keyword: 'perizinan' });
 * console.log(response.data.layanans);
 * ```
 */
export const getLayananList = async (params: LayananSearchParams = {}): Promise<ApiResponse<LayananListPayload>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.keyword) searchParams.append("keyword", params.keyword);
  if (params.jenis) searchParams.append("jenis", params.jenis);
  if (params.opdId) searchParams.append("opd_id", params.opdId.toString());
  if (params.sort) searchParams.append("sort", params.sort);

  const queryString = searchParams.toString();
  const url = queryString ? `/unit-kerja/layanan?${queryString}` : "/unit-kerja/layanan";

  const response = await httpInstance.get<ApiResponse<LayananListPayload>>(url);
  return response.data;
};

/**
 * Get service by ID with full details
 * @param id - Service ID
 * @returns Promise resolving to service detail with related data
 * @endpoint GET /unit-kerja/layanan/{id}
 * @example
 * ```typescript
 * const response = await getLayananById(123);
 * console.log(response.data.nama);
 * console.log(response.data.opd);
 * ```
 */
export const getLayananById = async (id: number): Promise<ApiResponse<PayloadData<LayananDetail>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<LayananDetail>>>(`/unit-kerja/layanan/${id}`);
  return response.data;
};

/**
 * Create new service
 * @param layananData - Service creation data
 * @returns Promise resolving to created service data
 * @endpoint POST /unit-kerja/layanan
 * @example
 * ```typescript
 * const response = await createLayanan({
 *   logo: 'service-logo.png',
 *   nama: 'Layanan Perizinan',
 *   jenis: 'Perizinan',
 *   alamat: 'Jl. Layanan No. 1',
 *   keterangan: 'Deskripsi layanan'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createLayanan = async (layananData: CreateLayananRequest): Promise<ApiResponse<PayloadData<Layanan>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<Layanan>>>("/unit-kerja/layanan", layananData);
  return response.data;
};

/**
 * Update service
 * @param id - Service ID to update
 * @param layananData - Updated service data
 * @returns Promise resolving to updated service data
 * @endpoint PUT /unit-kerja/layanan/{id}
 * @example
 * ```typescript
 * const response = await updateLayanan(123, {
 *   nama: 'Layanan Perizinan - Updated',
 *   keterangan: 'Deskripsi yang diperbarui'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateLayanan = async (
  id: number,
  layananData: UpdateLayananRequest,
): Promise<ApiResponse<PayloadData<Layanan>>> => {
  const response = await httpInstance.put<ApiResponse<PayloadData<Layanan>>>(`/unit-kerja/layanan/${id}`, layananData);
  return response.data;
};

/**
 * Delete service
 * @param id - Service ID to delete
 * @returns Promise resolving to success response
 * @endpoint DELETE /unit-kerja/layanan/{id}
 * @example
 * ```typescript
 * await deleteLayanan(123);
 * // Service deleted successfully
 * ```
 */
export const deleteLayanan = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/unit-kerja/layanan/${id}`);
  return response.data;
};

/**
 * Get services by OPD ID
 * @param opdId - OPD ID to filter services
 * @param params - Additional search parameters
 * @returns Promise resolving to services list for the specified OPD
 * @endpoint GET /unit-kerja/opd/{opdId}/layanan
 * @example
 * ```typescript
 * const response = await getLayananByOpd(123, { page: 1 });
 * console.log(response.data.layanans);
 * ```
 */
export const getLayananByOpd = async (
  opdId: number,
  params: Omit<LayananSearchParams, "opdId"> = {},
): Promise<ApiResponse<LayananListPayload>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.keyword) searchParams.append("keyword", params.keyword);
  if (params.jenis) searchParams.append("jenis", params.jenis);
  if (params.sort) searchParams.append("sort", params.sort);

  const queryString = searchParams.toString();
  const url = queryString ? `/unit-kerja/opd/${opdId}/layanan?${queryString}` : `/unit-kerja/opd/${opdId}/layanan`;

  const response = await httpInstance.get<ApiResponse<LayananListPayload>>(url);
  return response.data;
};

/**
 * Get services by type
 * @param jenis - Service type to filter
 * @param params - Additional search parameters
 * @returns Promise resolving to services list for the specified type
 * @endpoint GET /unit-kerja/layanan/jenis/{jenis}
 * @example
 * ```typescript
 * const response = await getLayananByJenis('Perizinan', { page: 1 });
 * console.log(response.data.layanans);
 * ```
 */
export const getLayananByJenis = async (
  jenis: string,
  params: Omit<LayananSearchParams, "jenis"> = {},
): Promise<ApiResponse<LayananListPayload>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.keyword) searchParams.append("keyword", params.keyword);
  if (params.opdId) searchParams.append("opd_id", params.opdId.toString());
  if (params.sort) searchParams.append("sort", params.sort);

  const queryString = searchParams.toString();
  const url = queryString ? `/unit-kerja/layanan/jenis/${jenis}?${queryString}` : `/unit-kerja/layanan/jenis/${jenis}`;

  const response = await httpInstance.get<ApiResponse<LayananListPayload>>(url);
  return response.data;
};

/**
 * Get OPD list (alias for getOpdList)
 * @param params - Search parameters
 * @returns Promise resolving to OPD list
 * @endpoint GET /unit-kerja/opd
 * @example
 * ```typescript
 * const response = await getOpd({ page: 1 });
 * console.log(response.data.opds);
 * ```
 */
export const getOpd = async (params: OpdQueryParams = {}): Promise<ApiResponse<OpdListPayload>> => {
  return getOpd(params);
};

/**
 * Get perusahaan daerah list
 * @param params - Search parameters
 * @returns Promise resolving to perusahaan daerah list
 * @endpoint GET /unit-kerja/perusahaan-daerah
 * @example
 * ```typescript
 * const response = await getPerusahaanDaerah({ page: 1 });
 * console.log(response.data.perusahaanDaerah);
 * ```
 */
export const getPerusahaanDaerah = async (params: OpdQueryParams = {}): Promise<ApiResponse<OpdListPayload>> => {
  return getOpd(params);
};

// Re-export types for convenience
export type {
  OpdDetail,
  OpdListPayload,
  Layanan,
  LayananDetail,
  LayananListPayload,
  LayananSearchParams,
  CreateLayananRequest,
  UpdateLayananRequest,
} from "@/lib/api/types/unitKerja.types";
