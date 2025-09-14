import type { ApiResponse, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  CreatePrestasiRequest,
  KependudukanData,
  PotensiDaerahData,
  Prestasi,
  PrestasiListPayload,
  PrestasiPenghargaanDataPayload,
  PrestasiSearchParams,
  SejarahData,
  UpdatePrestasiRequest,
} from "@/lib/api/types/selayangPandang.types";

// ==================== CONTENT SERVICES ====================

/**
 * Get sejarah (history) content
 * @returns Promise resolving to sejarah content data
 * @endpoint GET /selayang-pandang/sejarah
 * @example
 * ```typescript
 * const response = await getSejarah();
 * console.log(response.data.isi);
 * ```
 */
export const getSejarah = async (): Promise<ApiResponse<PayloadData<SejarahData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<SejarahData>>>("/selayang-pandang/sejarah");
  return response.data;
};

/**
 * Get kependudukan (demographics) content
 * @returns Promise resolving to kependudukan content data
 * @endpoint GET /selayang-pandang/kependudukan
 * @example
 * ```typescript
 * const response = await getKependudukan();
 * console.log(response.data.isi);
 * ```
 */
export const getKependudukan = async (): Promise<ApiResponse<PayloadData<KependudukanData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<KependudukanData>>>("/selayang-pandang/kependudukan");
  return response.data;
};

/**
 * Get potensi daerah (regional potential) content
 * @returns Promise resolving to potensi daerah content data
 * @endpoint GET /selayang-pandang/potensi-daerah
 * @example
 * ```typescript
 * const response = await getPotensiDaerah();
 * console.log(response.data.isi);
 * ```
 */
export const getPotensiDaerah = async (): Promise<ApiResponse<PayloadData<PotensiDaerahData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<PotensiDaerahData>>>(
    "/selayang-pandang/potensi-daerah",
  );
  return response.data;
};

/**
 * Get prestasi penghargaan (achievements and awards) content with achievements list
 * @returns Promise resolving to prestasi penghargaan content data with achievements
 * @endpoint GET /selayang-pandang/prestasi-penghargaan
 * @example
 * ```typescript
 * const response = await getPrestasiPenghargaan();
 * console.log(response.data.data.isi);
 * console.log(response.data.prestasi);
 * ```
 */
export const getPrestasiPenghargaan = async (
  _page: number = 1,
): Promise<ApiResponse<PrestasiPenghargaanDataPayload>> => {
  const response = await httpInstance.get<ApiResponse<PrestasiPenghargaanDataPayload>>(
    "/selayang-pandang/prestasi-dan-penghargaan",
  );
  return response.data;
};

// ==================== PRESTASI SERVICES ====================

/**
 * Get paginated list of achievements
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to achievements list with pagination metadata
 * @endpoint GET /selayang-pandang/prestasi
 * @example
 * ```typescript
 * const response = await getPrestasiList({ page: 1, keyword: 'nasional' });
 * console.log(response.data.prestasi);
 * ```
 */
export const getPrestasiList = async (params: PrestasiSearchParams = {}): Promise<ApiResponse<PrestasiListPayload>> => {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.append("page", params.page.toString());
  if (params.keyword) searchParams.append("keyword", params.keyword);
  if (params.tahun) searchParams.append("tahun", params.tahun);
  if (params.tingkat) searchParams.append("tingkat", params.tingkat);
  if (params.kategori) searchParams.append("kategori", params.kategori);
  if (params.sort) searchParams.append("sort", params.sort);

  const queryString = searchParams.toString();
  const url = queryString ? `/selayang-pandang/prestasi?${queryString}` : "/selayang-pandang/prestasi";

  const response = await httpInstance.get<ApiResponse<PrestasiListPayload>>(url);
  return response.data;
};

/**
 * Get achievement by ID
 * @param id - Achievement ID
 * @returns Promise resolving to achievement data
 * @endpoint GET /selayang-pandang/prestasi/{id}
 * @example
 * ```typescript
 * const response = await getPrestasiById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPrestasiById = async (id: number): Promise<ApiResponse<PayloadData<Prestasi>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<Prestasi>>>(`/selayang-pandang/prestasi/${id}`);
  return response.data;
};

/**
 * Create new achievement
 * @param prestasiData - Achievement creation data
 * @returns Promise resolving to created achievement data
 * @endpoint POST /selayang-pandang/prestasi
 * @example
 * ```typescript
 * const response = await createPrestasi({
 *   tahun: '2024',
 *   tingkat: 'Nasional',
 *   nama: 'Penghargaan Terbaik',
 *   keterangan: 'Deskripsi penghargaan'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPrestasi = async (
  prestasiData: CreatePrestasiRequest,
): Promise<ApiResponse<PayloadData<Prestasi>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<Prestasi>>>(
    "/selayang-pandang/prestasi",
    prestasiData,
  );
  return response.data;
};

/**
 * Update achievement
 * @param id - Achievement ID to update
 * @param prestasiData - Updated achievement data
 * @returns Promise resolving to updated achievement data
 * @endpoint PUT /selayang-pandang/prestasi/{id}
 * @example
 * ```typescript
 * const response = await updatePrestasi(123, {
 *   nama: 'Penghargaan Terbaik - Updated',
 *   keterangan: 'Deskripsi yang diperbarui'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updatePrestasi = async (
  id: number,
  prestasiData: UpdatePrestasiRequest,
): Promise<ApiResponse<PayloadData<Prestasi>>> => {
  const response = await httpInstance.put<ApiResponse<PayloadData<Prestasi>>>(
    `/selayang-pandang/prestasi/${id}`,
    prestasiData,
  );
  return response.data;
};

/**
 * Delete achievement
 * @param id - Achievement ID to delete
 * @returns Promise resolving to success response
 * @endpoint DELETE /selayang-pandang/prestasi/{id}
 * @example
 * ```typescript
 * await deletePrestasi(123);
 * // Achievement deleted successfully
 * ```
 */
export const deletePrestasi = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/selayang-pandang/prestasi/${id}`);
  return response.data;
};

/**
 * Get achievements by year
 * @param tahun - Year to filter achievements
 * @returns Promise resolving to achievements list for the specified year
 * @endpoint GET /selayang-pandang/prestasi/tahun/{tahun}
 * @example
 * ```typescript
 * const response = await getPrestasiByYear('2024');
 * console.log(response.data.prestasi);
 * ```
 */
export const getPrestasiByYear = async (tahun: string): Promise<ApiResponse<PrestasiListPayload>> => {
  const response = await httpInstance.get<ApiResponse<PrestasiListPayload>>(
    `/selayang-pandang/prestasi/tahun/${tahun}`,
  );
  return response.data;
};

/**
 * Get achievements by level
 * @param tingkat - Level to filter achievements (e.g., 'Nasional', 'Provinsi', 'Kabupaten')
 * @returns Promise resolving to achievements list for the specified level
 * @endpoint GET /selayang-pandang/prestasi/tingkat/{tingkat}
 * @example
 * ```typescript
 * const response = await getPrestasiByLevel('Nasional');
 * console.log(response.data.prestasi);
 * ```
 */
export const getPrestasiByLevel = async (tingkat: string): Promise<ApiResponse<PrestasiListPayload>> => {
  const response = await httpInstance.get<ApiResponse<PrestasiListPayload>>(
    `/selayang-pandang/prestasi/tingkat/${tingkat}`,
  );
  return response.data;
};

// Re-export types for convenience
export type {
  SejarahData,
  KependudukanData,
  PotensiDaerahData,
  PrestasiPenghargaanContentData,
  Prestasi,
  PrestasiPenghargaanDataPayload,
  PrestasiListPayload,
  PrestasiSearchParams,
  CreatePrestasiRequest,
  UpdatePrestasiRequest,
} from "@/lib/api/types/selayangPandang.types";
