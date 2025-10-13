import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateTagRequest,
  Tag,
  TagDetailResponse,
  TagListResponse,
  TagQueryParams,
  UpdateTagRequest,
} from "@/lib/api/types/tag.types";

const base = "/api/tags";

export const tagService = createCrudService<Tag, TagDetailResponse, CreateTagRequest, UpdateTagRequest>(base);

/**
 * Mendapatkan daftar tags dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar tags dengan pagination
 * @endpoint GET /api/tags
 * @example
 * ```typescript
 * const response = await getTags({ page: 1, per_page: 10, search: 'berita' });
 * console.log(response.data.data); // Array of tags
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getTags = (params?: TagQueryParams): Promise<ApiResponse<TagListResponse>> => tagService.get(params);

/**
 * Mendapatkan tag berdasarkan ID
 * @param id - ID tag
 * @returns Promise yang mengembalikan data tag
 * @endpoint GET /api/tags/{id}
 * @example
 * ```typescript
 * const response = await getTagById(123);
 * console.log(response.data.namaTag);
 * ```
 */
export const getTagById = (id: number): Promise<ApiResponse<TagDetailResponse>> => tagService.getById(id);

/**
 * Membuat tag baru
 * @param payload - Data untuk membuat tag baru
 * @returns Promise yang mengembalikan data tag yang dibuat
 * @endpoint POST /api/tags
 * @example
 * ```typescript
 * const response = await createTag({
 *   namaTag: 'Berita Utama'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createTag = (payload: CreateTagRequest) => tagService.create(payload);

/**
 * Memperbarui data tag
 * @param id - ID tag yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data tag yang diperbarui
 * @endpoint PUT /api/tags/{id}
 * @example
 * ```typescript
 * const response = await updateTag(123, {
 *   namaTag: 'Berita Utama (Updated)'
 * });
 * console.log(response.data.namaTag);
 * ```
 */
export const updateTag = (id: number, payload: UpdateTagRequest): Promise<ApiResponse<TagDetailResponse>> =>
  tagService.update(id, payload);

/**
 * Menghapus tag
 * @param id - ID tag yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/tags/{id}
 * @example
 * ```typescript
 * await deleteTag(123);
 * console.log('Tag berhasil dihapus');
 * ```
 */
export const deleteTag = (id: number): Promise<ApiResponse<null>> => tagService.remove(id);
