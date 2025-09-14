import type { ApiResponse, ContentData, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  BupatiPayload,
  CreateTransparansiRequest,
  TransparansiKeuangan,
  TransparansiKeuanganListPayload,
  UpdateTransparansiRequest,
  VisiMisiData,
} from "@/lib/api/types/pemerintahan.types";

// Re-export types for convenience
export type {
  Bupati,
  BupatiPayload,
  ContentDataPayload,
  CreateTransparansiRequest,
  TransparansiKeuangan,
  TransparansiKeuanganListPayload,
  TransparansiSearchParams,
  UpdateTransparansiRequest,
  VisiMisiData,
  VisiMisiPayload,
  TugasFungsiData,
  StrukturOrganisasiData,
  StrategiDaerahData,
  ProgramStrategisData,
  BupatiContentData,
} from "@/lib/api/types/pemerintahan.types";

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

/**
 * Get regent content (biography, etc.)
 * @returns Promise resolving to regent content data
 * @endpoint GET /pemerintahan/bupati/content
 * @example
 * ```typescript
 * const response = await getBupatiContent();
 * console.log(response.data.isi);
 * ```
 */
export const getBupatiContent = async (): Promise<ApiResponse<PayloadData<ContentData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<ContentData>>>("/pemerintahan/bupati/content");
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
): Promise<ApiResponse<TransparansiKeuanganListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString
    ? `/pemerintahan/transparansi-keuangan?${queryString}`
    : "/pemerintahan/transparansi-keuangan";

  const response = await httpInstance.get<ApiResponse<TransparansiKeuanganListPayload>>(url);
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

/**
 * Create new financial transparency document
 * @param transparansiData - Financial transparency creation data
 * @returns Promise resolving to created document data
 * @endpoint POST /pemerintahan/transparansi-keuangan
 * @example
 * ```typescript
 * const response = await createTransparansiKeuangan({
 *   nama: 'Laporan APBD 2024',
 *   file: 'apbd-2024.pdf',
 *   keterangan: 'Laporan Anggaran Pendapatan dan Belanja Daerah 2024',
 *   tanggalPublikasi: '2024-01-01'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createTransparansiKeuangan = async (
  transparansiData: CreateTransparansiRequest,
): Promise<ApiResponse<PayloadData<TransparansiKeuangan>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<TransparansiKeuangan>>>(
    "/pemerintahan/transparansi-keuangan",
    transparansiData,
  );
  return response.data;
};

/**
 * Update financial transparency document
 * @param id - Document ID to update
 * @param transparansiData - Updated document data
 * @returns Promise resolving to updated document data
 * @endpoint PUT /pemerintahan/transparansi-keuangan/{id}
 * @example
 * ```typescript
 * const response = await updateTransparansiKeuangan(123, {
 *   nama: 'Laporan APBD 2024 - Updated',
 *   keterangan: 'Updated description'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateTransparansiKeuangan = async (
  id: number,
  transparansiData: UpdateTransparansiRequest,
): Promise<ApiResponse<PayloadData<TransparansiKeuangan>>> => {
  const response = await httpInstance.put<ApiResponse<PayloadData<TransparansiKeuangan>>>(
    `/pemerintahan/transparansi-keuangan/${id}`,
    transparansiData,
  );
  return response.data;
};

/**
 * Delete financial transparency document
 * @param id - Document ID to delete
 * @returns Promise resolving to success response
 * @endpoint DELETE /pemerintahan/transparansi-keuangan/{id}
 * @example
 * ```typescript
 * await deleteTransparansiKeuangan(123);
 * // Document deleted successfully
 * ```
 */
export const deleteTransparansiKeuangan = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(
    `/pemerintahan/transparansi-keuangan/${id}`,
  );
  return response.data;
};

/**
 * Get transparansi keuangan detail by ID
 * @param id - Document ID
 * @returns Promise resolving to transparansi keuangan detail
 * @endpoint GET /pemerintahan/transparansi-keuangan/{id}
 * @example
 * ```typescript
 * const response = await getTransparansiKeuanganDetail(123);
 * console.log(response.data.nama);
 * ```
 */
export const getTransparansiKeuanganDetail = async (
  id: number,
): Promise<ApiResponse<PayloadData<TransparansiKeuangan>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<TransparansiKeuangan>>>(
    `/pemerintahan/transparansi-keuangan/${id}`,
  );
  return response.data;
};
