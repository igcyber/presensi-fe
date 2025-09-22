import type { ApiResponse, ContentData, PaginatedPayload, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { BupatiPayload, TransparansiKeuangan, VisiMisiData } from "@/lib/api/types/pemerintahan.types";

// ==================== BUPATI SERVICES ====================

/**
 * Get current regent (Bupati) information
 * @returns Promise resolving to current regent data
 * @endpoint GET /pemerintahan/bupati
 * @example
 * ```typescript
 * const response = await getBupati();
 * console.log(response.data.namaBupati);
 * ```
 */
export const getBupati = async (): Promise<ApiResponse<BupatiPayload>> => {
  const response = await httpInstance.get<ApiResponse<BupatiPayload>>("/pemerintahan/bupati");
  return response.data;
};

// ==================== VISION & MISSION SERVICES ====================

/**
 * Get vision and mission data
 * @returns Promise resolving to vision and mission data
 * @endpoint GET /pemerintahan/visi-misi
 * @example
 * ```typescript
 * const response = await getVisiMisi();
 * console.log(response.data.visi.isi);
 * console.log(response.data.misi.isi);
 * ```
 */
export const getVisiMisi = async (): Promise<ApiResponse<VisiMisiData>> => {
  const response = await httpInstance.get<ApiResponse<VisiMisiData>>("/pemerintahan/visimisi");
  return response.data;
};

// ==================== CONTENT SERVICES ====================

/**
 * Get organizational structure content
 * @returns Promise resolving to organizational structure data
 * @endpoint GET /pemerintahan/struktur-organisasi
 * @example
 * ```typescript
 * const response = await getStrukturOrganisasi();
 * console.log(response.data.isi);
 * ```
 */
export const getStrukturOrganisasi = async (): Promise<ApiResponse<PayloadData<ContentData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<ContentData>>>("/pemerintahan/struktur-organisasi");
  return response.data;
};

/**
 * Get duties and functions content
 * @returns Promise resolving to duties and functions data
 * @endpoint GET /pemerintahan/tugas-fungsi
 * @example
 * ```typescript
 * const response = await getTugasFungsi();
 * console.log(response.data.isi);
 * ```
 */
export const getTugasFungsi = async (): Promise<ApiResponse<PayloadData<ContentData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<ContentData>>>("/pemerintahan/tugas-dan-fungsi");
  return response.data;
};

/**
 * Get regional strategy content
 * @returns Promise resolving to regional strategy data
 * @endpoint GET /pemerintahan/strategi
 * @example
 * ```typescript
 * const response = await getStrategiDaerah();
 * console.log(response.data.isi);
 * ```
 */
export const getStrategiDaerah = async (): Promise<ApiResponse<PayloadData<ContentData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<ContentData>>>("/pemerintahan/strategi");
  return response.data;
};

/**
 * Get strategic programs content
 * @returns Promise resolving to strategic programs data
 * @endpoint GET /pemerintahan/program
 * @example
 * ```typescript
 * const response = await getProgramStrategis();
 * console.log(response.data.isi);
 * ```
 */
export const getProgramStrategis = async (): Promise<ApiResponse<PayloadData<ContentData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<ContentData>>>("/pemerintahan/program");
  return response.data;
};

// ==================== FINANCIAL TRANSPARENCY SERVICES ====================

/**
 * Get paginated list of financial transparency documents
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to financial transparency list with pagination metadata
 * @endpoint GET /pemerintahan/transparansi-keuangan
 * @example
 * ```typescript
 * const response = await getTransparansiKeuangan({ page: 1, keyword: 'APBD' });
 * console.log(response.data.transparansiKeuangan);
 * ```
 */
export const getTransparansiKeuangan = async (
  page: number = 1,
): Promise<ApiResponse<PaginatedPayload<TransparansiKeuangan>>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString
    ? `/pemerintahan/transparansi-keuangan?${queryString}`
    : "/pemerintahan/transparansi-keuangan";

  const response = await httpInstance.get<ApiResponse<PaginatedPayload<TransparansiKeuangan>>>(url);
  return response.data;
};

/**
 * Get financial transparency document by ID
 * @param id - Document ID
 * @returns Promise resolving to financial transparency document data
 * @endpoint GET /pemerintahan/transparansi-keuangan/{id}
 * @example
 * ```typescript
 * const response = await getTransparansiKeuanganById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getTransparansiKeuanganById = async (
  id: number,
): Promise<ApiResponse<PayloadData<TransparansiKeuangan>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<TransparansiKeuangan>>>(
    `/pemerintahan/transparansi-keuangan/${id}`,
  );
  return response.data;
};
