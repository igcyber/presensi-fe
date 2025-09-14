import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreateVideoRequest,
  UpdateVideoRequest,
  Video,
  VideoDetailResponse,
  VideoListResponse,
  VideoQueryParams,
} from "@/lib/api/types/video.types";

const base = "/api/videos";

export const videoService = createCrudService<Video, Video, CreateVideoRequest, UpdateVideoRequest>(base);

/**
 * Mendapatkan daftar video dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar video dengan pagination
 * @endpoint GET /api/videos
 * @example
 * ```typescript
 * const response = await getVideos({ page: 1, per_page: 10, search: 'tutorial' });
 * console.log(response.data.data); // Array of videos
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getVideos = (params?: VideoQueryParams): Promise<ApiResponse<VideoListResponse>> =>
  videoService.get(params);

/**
 * Mendapatkan video berdasarkan ID
 * @param id - ID video
 * @returns Promise yang mengembalikan data video
 * @endpoint GET /api/videos/{id}
 * @example
 * ```typescript
 * const response = await getVideoById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getVideoById = (id: number): Promise<ApiResponse<VideoDetailResponse>> => videoService.getById(id);

/**
 * Membuat video baru
 * @param payload - Data untuk membuat video baru
 * @returns Promise yang mengembalikan data video yang dibuat
 * @endpoint POST /api/videos
 * @example
 * ```typescript
 * const response = await createVideo({
 *   judul: 'Tutorial Vue.js',
 *   isi: 'Video tutorial tentang Vue.js',
 *   link: 'https://www.youtube.com/embed/xyz123'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createVideo = (payload: CreateVideoRequest) => videoService.create(payload);

/**
 * Memperbarui data video
 * @param id - ID video yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data video yang diperbarui
 * @endpoint PUT /api/videos/{id}
 * @example
 * ```typescript
 * const response = await updateVideo(123, {
 *   judul: 'Tutorial Vue.js Updated',
 *   isi: 'Video tutorial Vue.js yang diperbarui'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updateVideo = (id: number, payload: UpdateVideoRequest): Promise<ApiResponse<Video>> =>
  videoService.update(id, payload);

/**
 * Menghapus video
 * @param id - ID video yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/videos/{id}
 * @example
 * ```typescript
 * await deleteVideo(123);
 * console.log('Video berhasil dihapus');
 * ```
 */
export const deleteVideo = (id: number): Promise<ApiResponse<null>> => videoService.remove(id);
