import type { ApiResponse, PayloadData } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  Berita,
  BeritaDetail,
  BeritaListPayload,
  BeritaSidebar,
  CreateBeritaRequest,
  UpdateBeritaRequest,
} from "@/lib/api/types/berita.types";

// Re-export types for convenience
export type {
  Berita,
  BeritaDetail,
  BeritaListPayload,
  BeritaSearchParams,
  BeritaSidebar,
  CreateBeritaRequest,
  UpdateBeritaRequest,
} from "@/lib/api/types/berita.types";

/**
 * Get paginated list of berita articles
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to berita list with pagination metadata
 * @endpoint GET /berita
 * @example
 * ```typescript
 * const response = await getBeritaList({ page: 1, keyword: 'pembangunan' });
 * console.log(response.data.beritas);
 * ```
 */
export const getBeritaList = async (page: number = 1, keyword?: string): Promise<ApiResponse<BeritaListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());
  if (keyword) searchParams.append("keyword", keyword);

  const queryString = searchParams.toString();
  const url = queryString ? `/berita?${queryString}` : "/berita";

  const response = await httpInstance.get<ApiResponse<BeritaListPayload>>(url);
  return response.data;
};

/**
 * Get berita article by ID with full details
 * @param id - Berita article ID
 * @returns Promise resolving to berita detail with related data
 * @endpoint GET /berita/{id}
 * @example
 * ```typescript
 * const response = await getBeritaById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getBeritaById = async (id: number): Promise<ApiResponse<PayloadData<BeritaDetail>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<BeritaDetail>>>(`/berita/${id}`);
  return response.data;
};

/**
 * Get berita article by slug
 * @param slug - Berita article slug
 * @returns Promise resolving to berita detail with related data
 * @endpoint GET /berita/slug/{slug}
 * @example
 * ```typescript
 * const response = await getBeritaBySlug('pembangunan-jembatan-baru');
 * console.log(response.data.judul);
 * ```
 */
export const getBeritaBySlug = async (slug: string): Promise<ApiResponse<PayloadData<BeritaDetail>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<BeritaDetail>>>(`/berita/slug/${slug}`);
  return response.data;
};

/**
 * Get berita articles for sidebar (simplified list)
 * @param limit - Maximum number of articles to return (default: 5)
 * @returns Promise resolving to array of berita sidebar items
 * @endpoint GET /berita/sidebar
 * @example
 * ```typescript
 * const response = await getBeritaSidebar(10);
 * console.log(response.data.length);
 * ```
 */
export const getBeritaSidebar = async (limit: number = 5): Promise<ApiResponse<BeritaSidebar[]>> => {
  const response = await httpInstance.get<ApiResponse<BeritaSidebar[]>>(`/berita/sidebar?limit=${limit}`);
  return response.data;
};

/**
 * Get related berita articles
 * @param id - Current berita ID
 * @param limit - Maximum number of related articles (default: 4)
 * @returns Promise resolving to array of related berita articles
 * @endpoint GET /berita/{id}/related
 * @example
 * ```typescript
 * const response = await getRelatedBerita(123, 6);
 * console.log(response.data.length);
 * ```
 */
export const getRelatedBerita = async (id: number, limit: number = 4): Promise<ApiResponse<Berita[]>> => {
  const response = await httpInstance.get<ApiResponse<Berita[]>>(`/berita/${id}/related?limit=${limit}`);
  return response.data;
};

/**
 * Create new berita article
 * @param beritaData - Berita creation data
 * @returns Promise resolving to created berita data
 * @endpoint POST /berita
 * @example
 * ```typescript
 * const response = await createBerita({
 *   opdId: 1,
 *   judul: 'Berita Baru',
 *   isi: 'Konten berita...',
 *   foto: 'image.jpg'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createBerita = async (beritaData: CreateBeritaRequest): Promise<ApiResponse<PayloadData<Berita>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<Berita>>>("/berita", beritaData);
  return response.data;
};

/**
 * Update existing berita article
 * @param id - Berita ID to update
 * @param beritaData - Updated berita data
 * @returns Promise resolving to updated berita data
 * @endpoint PUT /berita/{id}
 * @example
 * ```typescript
 * const response = await updateBerita(123, {
 *   judul: 'Judul yang Diperbarui',
 *   isi: 'Konten yang diperbarui...'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updateBerita = async (
  id: number,
  beritaData: UpdateBeritaRequest,
): Promise<ApiResponse<PayloadData<Berita>>> => {
  const response = await httpInstance.put<ApiResponse<PayloadData<Berita>>>(`/berita/${id}`, beritaData);
  return response.data;
};

/**
 * Delete berita article
 * @param id - Berita ID to delete
 * @returns Promise resolving to success response
 * @endpoint DELETE /berita/{id}
 * @example
 * ```typescript
 * await deleteBerita(123);
 * // Berita deleted successfully
 * ```
 */
export const deleteBerita = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/berita/${id}`);
  return response.data;
};

/**
 * Publish berita article
 * @param id - Berita ID to publish
 * @returns Promise resolving to updated berita data
 * @endpoint PATCH /berita/{id}/publish
 * @example
 * ```typescript
 * const response = await publishBerita(123);
 * console.log(response.data.isPublished);
 * ```
 */
export const publishBerita = async (id: number): Promise<ApiResponse<PayloadData<Berita>>> => {
  const response = await httpInstance.patch<ApiResponse<PayloadData<Berita>>>(`/berita/${id}/publish`);
  return response.data;
};

/**
 * Unpublish berita article
 * @param id - Berita ID to unpublish
 * @returns Promise resolving to updated berita data
 * @endpoint PATCH /berita/{id}/unpublish
 * @example
 * ```typescript
 * const response = await unpublishBerita(123);
 * console.log(response.data.isPublished);
 * ```
 */
export const unpublishBerita = async (id: number): Promise<ApiResponse<PayloadData<Berita>>> => {
  const response = await httpInstance.patch<ApiResponse<PayloadData<Berita>>>(`/berita/${id}/unpublish`);
  return response.data;
};
