import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  CreatePengaduanRequest,
  CreatePengaduanResponse,
  KategoriPengaduan,
  Pengaduan,
  PengaduanDetailResponse,
  PengaduanListResponse,
  PengaduanQueryParams,
  UpdateKategoriRequest,
  UpdateStatusRequest,
} from "@/lib/api/types/pengaduan.types";

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
export const createPengaduanPublic = async (
  payload: CreatePengaduanRequest,
): Promise<ApiResponse<CreatePengaduanResponse>> => {
  const { data } = await httpInstance.post<ApiResponse<CreatePengaduanResponse>>("/pengaduan", payload);
  return data;
};

// ==================== Admin API ====================

/**
 * Mendapatkan daftar pengaduan dengan pagination dan filter (admin)
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar pengaduan dengan pagination
 * @endpoint GET /api/pengaduan
 * @example
 * ```typescript
 * const response = await getPengaduans({ page: 1, limit: 10, status: 'belum' });
 * console.log(response.data.data); // Array of pengaduan
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPengaduans = (params?: PengaduanQueryParams): Promise<ApiResponse<PengaduanListResponse>> => {
  return httpInstance.get<ApiResponse<PengaduanListResponse>>("/api/pengaduan", { params }).then((res) => res.data);
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
export const getPengaduanById = (id: number): Promise<ApiResponse<PengaduanDetailResponse>> => {
  return httpInstance.get<ApiResponse<PengaduanDetailResponse>>(`/api/pengaduan/${id}`);
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
export const updatePengaduanStatus = (id: number, payload: UpdateStatusRequest): Promise<ApiResponse<Pengaduan>> => {
  return httpInstance.put<ApiResponse<Pengaduan>>(`/api/pengaduan/${id}/status`, payload);
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
export const updatePengaduanKategori = (
  id: number,
  payload: UpdateKategoriRequest,
): Promise<ApiResponse<Pengaduan>> => {
  return httpInstance.put<ApiResponse<Pengaduan>>(`/api/pengaduan/${id}/kategori`, payload);
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
export const getKategoriPengaduan = (): Promise<ApiResponse<KategoriPengaduan[]>> => {
  return httpInstance.get<ApiResponse<KategoriPengaduan[]>>("/api/pengaduan/kategori");
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
export const exportPengaduanExcel = (params?: PengaduanQueryParams): Promise<Blob> => {
  return httpInstance.get("/api/pengaduan/export", {
    params,
    responseType: "blob",
  });
};
