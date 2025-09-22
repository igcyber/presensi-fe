import type { ApiResponse, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  KependudukanData,
  PotensiDaerahData,
  PrestasiPenghargaanDataPayload,
  SejarahData,
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
  const { data } = await httpInstance.get<ApiResponse<PayloadData<SejarahData>>>("/selayang-pandang/sejarah");
  return data;
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
  const { data } = await httpInstance.get<ApiResponse<PayloadData<KependudukanData>>>("/selayang-pandang/kependudukan");
  return data;
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
  const { data } = await httpInstance.get<ApiResponse<PayloadData<PotensiDaerahData>>>(
    "/selayang-pandang/potensi-daerah",
  );
  return data;
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
  const { data } = await httpInstance.get<ApiResponse<PrestasiPenghargaanDataPayload>>(
    "/selayang-pandang/prestasi-dan-penghargaan",
  );
  return data;
};
