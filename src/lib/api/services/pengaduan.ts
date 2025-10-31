import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  CreatePengaduanRequest,
  KategoriPengaduan,
  Pengaduan,
  PengaduanDetailResponse,
  PengaduanListResponse,
  PengaduanQueryParams,
  UpdateKategoriRequest,
  UpdateStatusRequest,
} from "@/lib/api/types/pengaduan.types";

/**
 * Mendapatkan daftar pengaduan dengan pagination dan filter (admin)
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar pengaduan dengan pagination
 * @endpoint GET /api/pengaduan
 * @example
 * ```typescript
 * const response = await getPengaduans({ page: 1, limit: 10, search: 'lampu jalan' });
 * console.log(response.data.data); // Array of pengaduan
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPengaduans = async (params?: PengaduanQueryParams): Promise<ApiResponse<PengaduanListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PengaduanListResponse>>("/api/pengaduan", { params });
  return data;
};

/**
 * Mendapatkan pengaduan berdasarkan ID (admin)
 * @param id - ID pengaduan
 * @returns Promise yang mengembalikan data pengaduan
 * @endpoint GET /api/pengaduan/{id}
 * @example
 * ```typescript
 * const response = await getPengaduanById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPengaduanById = async (id: number): Promise<ApiResponse<PengaduanDetailResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PengaduanDetailResponse>>(`/api/pengaduan/${id}`);
  return data;
};

/**
 * Update status pengaduan (admin)
 * @param id - ID pengaduan
 * @param payload - Data status yang akan diupdate
 * @returns Promise yang mengembalikan data pengaduan yang diupdate
 * @endpoint PUT /api/pengaduan/{id}/status
 * @example
 * ```typescript
 * const response = await updatePengaduanStatus(123, {
 *   status: 'diterima',
 *   kategori_aduan: 'Infrastruktur',
 *   keterangan: 'Diteruskan ke bidang terkait'
 * });
 * ```
 */
export const updatePengaduanStatus = async (
  id: number,
  payload: UpdateStatusRequest,
): Promise<ApiResponse<Pengaduan>> => {
  const { data } = await httpInstance.put<ApiResponse<Pengaduan>>(`/api/pengaduan/${id}/status`, payload);
  return data;
};

/**
 * Update kategori pengaduan (admin)
 * @param id - ID pengaduan
 * @param payload - Data kategori yang akan diupdate
 * @returns Promise yang mengembalikan data pengaduan yang diupdate
 * @endpoint PUT /api/pengaduan/{id}/kategori
 * @example
 * ```typescript
 * const response = await updatePengaduanKategori(123, {
 *   kategori_aduan: 'Pelayanan'
 * });
 * ```
 */
export const updatePengaduanKategori = async (
  id: number,
  payload: UpdateKategoriRequest,
): Promise<ApiResponse<Pengaduan>> => {
  const { data } = await httpInstance.put<ApiResponse<Pengaduan>>(`/api/pengaduan/${id}/kategori`, payload);
  return data;
};

/**
 * Mendapatkan daftar kategori pengaduan (admin)
 * @returns Promise yang mengembalikan daftar kategori
 * @endpoint GET /api/pengaduan/kategori
 * @example
 * ```typescript
 * const response = await getKategoriPengaduan();
 * console.log(response.data); // Array of kategori
 * ```
 */
export const getKategoriPengaduan = async (): Promise<ApiResponse<KategoriPengaduan[]>> => {
  const { data } = await httpInstance.get<ApiResponse<KategoriPengaduan[]>>("/api/pengaduan/kategori");
  return data;
};

/**
 * Export pengaduan ke Excel (admin)
 * @param params - Parameter filter untuk export
 * @returns Promise yang mengembalikan file Excel
 * @endpoint GET /api/pengaduan/export
 * @example
 * ```typescript
 * const response = await exportPengaduanExcel({
 *   tanggal_mulai: '2025-01-01',
 *   tanggal_akhir: '2025-12-31'
 * });
 * // File akan di-download otomatis
 * ```
 */
export const exportPengaduanExcel = async (params?: PengaduanQueryParams): Promise<Blob> => {
  const { data } = await httpInstance.get<Blob>("/api/pengaduan/export-excel", {
    params,
    responseType: "blob",
  });
  return data;
};

/**
 * Mark pengaduan as selesai (admin)
 * @param id - ID pengaduan
 * @returns Promise yang mengembalikan data pengaduan yang diupdate
 * @endpoint POST /api/pengaduan/{id}/mark-selesai
 * @example
 * ```typescript
 * const response = await markSelesai(123);
 * console.log(response.data.isSelesai); // true
 * ```
 */
export const markSelesai = async (id: number): Promise<ApiResponse<Pengaduan>> => {
  const { data } = await httpInstance.post<ApiResponse<Pengaduan>>(`/api/pengaduan/${id}/mark-selesai`);
  return data;
};

/**
 * Toggle publish DPRD status (admin)
 * @param id - ID pengaduan
 * @returns Promise yang mengembalikan data pengaduan yang diupdate
 * @endpoint POST /api/pengaduan/{id}/toggle-dprd
 * @example
 * ```typescript
 * const response = await toggleDprd(123);
 * console.log(response.data.isPublicDprd); // true/false
 * ```
 */
export const toggleDprd = async (id: number): Promise<ApiResponse<Pengaduan>> => {
  const { data } = await httpInstance.post<ApiResponse<Pengaduan>>(`/api/pengaduan/${id}/toggle-dprd`);
  return data;
};

// ==================== Public Api ====================
/**
 * Mendapatkan daftar pengaduan publik
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar pengaduan publik
 * @endpoint GET /pengaduan-publik
 * @example
 * ```typescript
 * const response = await getPengaduanPublic({ page: 1, limit: 10, search: 'lampu jalan' });
 * console.log(response.data.data); // Array of pengaduan publik
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPengaduanPublic = async (
  params?: PengaduanQueryParams,
): Promise<ApiResponse<PengaduanListResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PengaduanListResponse>>("/pengaduan-publik", { params });
  return data;
};

/**
 * Mendapatkan pengaduan publik berdasarkan ID
 * @param id - ID pengaduan
 * @returns Promise yang mengembalikan data pengaduan publik
 * @endpoint GET /pengaduan-publik/{id}
 * @example
 * ```typescript
 * const response = await getPengaduanPublicById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getPengaduanPublicById = async (id: number): Promise<ApiResponse<PengaduanDetailResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PengaduanDetailResponse>>(`/pengaduan-publik/${id}`);
  return data;
};

/**
 * Membuat pengaduan baru (public endpoint)
 * @param payload - Data pengaduan yang akan dibuat
 * @returns Promise yang mengembalikan response pengaduan
 * @endpoint POST /pengaduan
 * @example
 * ```typescript
 * const response = await createPengaduanPublic({
 *   nama: "Budi Santoso",
 *   nik: "6471012300000001",
 *   alamat: "Jl. Kenanga No. 12, Tenggarong",
 *   noHp: "081234567890",
 *   email: "contohemail@gmail.com",
 *   aduan: "Lampu jalan padam",
 *   deskripsi: "Lampu jalan di depan rumah padam sejak 3 hari lalu."
 * });
 * console.log(response.data.success);
 * ```
 */
export const createPengaduanPublic = async (payload: CreatePengaduanRequest): Promise<ApiResponse<Pengaduan>> => {
  const { data } = await httpInstance.post<ApiResponse<Pengaduan>>("/pengaduan", payload);
  return data;
};
