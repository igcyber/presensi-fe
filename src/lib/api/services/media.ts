import type { ApiResponse, PayloadData } from "../core/apiResponse";
import httpInstance from "../core/httpInstance";
import type {
  CreateDokumenRequest,
  CreateFotoRequest,
  CreateInfografisRequest,
  CreateVideoRequest,
  DokumenData,
  DokumenListPayload,
  FotoData,
  FotoListPayload,
  InfografisData,
  InfografisListPayload,
  MajalahData,
  MajalahListPayload,
  RadioData,
  RadioListPayload,
  VideoData,
  VideoListPayload,
} from "../types/media.types";

// Re-export types for convenience
export type {
  CreateDokumenRequest,
  CreateFotoRequest,
  CreateInfografisRequest,
  CreateVideoRequest,
  DokumenData,
  DokumenListPayload,
  FotoData,
  FotoListPayload,
  InfografisData,
  InfografisListPayload,
  MajalahData,
  MajalahListPayload,
  MediaSearchParams,
  RadioData,
  RadioListPayload,
  VideoData,
  VideoListPayload,
} from "../types/media.types";

// ==================== FOTO SERVICES ====================

/**
 * Get paginated list of photos
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to foto list with pagination metadata
 * @endpoint GET /media/foto
 * @example
 * ```typescript
 * const response = await getFotos({ page: 1, keyword: 'pembangunan' });
 * console.log(response.data.fotos);
 * ```
 */
export const getFotos = async (page: number = 1): Promise<ApiResponse<FotoListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/foto?${queryString}` : "/media/foto";

  const response = await httpInstance.get<ApiResponse<FotoListPayload>>(url);
  return response.data;
};

/**
 * Get photo by ID
 * @param id - Photo ID
 * @returns Promise resolving to photo data
 * @endpoint GET /media/foto/{id}
 * @example
 * ```typescript
 * const response = await getFotoById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getFotoById = async (id: number): Promise<ApiResponse<PayloadData<FotoData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<FotoData>>>(`/media/foto/${id}`);
  return response.data;
};

/**
 * Create new photo
 * @param fotoData - Photo creation data
 * @returns Promise resolving to created photo data
 * @endpoint POST /media/foto
 * @example
 * ```typescript
 * const response = await createFoto({
 *   judul: 'Foto Baru',
 *   foto: 'image.jpg',
 *   description: 'Deskripsi foto'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createFoto = async (fotoData: CreateFotoRequest): Promise<ApiResponse<PayloadData<FotoData>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<FotoData>>>("/media/foto", fotoData);
  return response.data;
};

// ==================== VIDEO SERVICES ====================

/**
 * Get paginated list of videos
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to video list with pagination metadata
 * @endpoint GET /media/video
 * @example
 * ```typescript
 * const response = await getVideos({ page: 1, category: 'pembangunan' });
 * console.log(response.data.videos);
 * ```
 */
export const getVideos = async (page: number = 1): Promise<ApiResponse<VideoListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/video?${queryString}` : "/media/video";

  const response = await httpInstance.get<ApiResponse<VideoListPayload>>(url);
  return response.data;
};

/**
 * Get video by ID
 * @param id - Video ID
 * @returns Promise resolving to video data
 * @endpoint GET /media/video/{id}
 * @example
 * ```typescript
 * const response = await getVideoById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getVideoById = async (id: number): Promise<ApiResponse<PayloadData<VideoData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<VideoData>>>(`/media/video/${id}`);
  return response.data;
};

/**
 * Create new video
 * @param videoData - Video creation data
 * @returns Promise resolving to created video data
 * @endpoint POST /media/video
 * @example
 * ```typescript
 * const response = await createVideo({
 *   judul: 'Video Baru',
 *   link: 'https://youtube.com/watch?v=123',
 *   isi: 'Deskripsi video'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createVideo = async (videoData: CreateVideoRequest): Promise<ApiResponse<PayloadData<VideoData>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<VideoData>>>("/media/video", videoData);
  return response.data;
};

// ==================== RADIO SERVICES ====================

/**
 * Get paginated list of radio programs
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to radio list with pagination metadata
 * @endpoint GET /media/radio
 * @example
 * ```typescript
 * const response = await getRadios({ page: 1, keyword: 'berita' });
 * console.log(response.data.radios);
 * ```
 */
export const getRadios = async (page: number = 1): Promise<ApiResponse<RadioListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/radio?${queryString}` : "/media/radio";

  const response = await httpInstance.get<ApiResponse<RadioListPayload>>(url);
  return response.data;
};

/**
 * Get radio program by ID
 * @param id - Radio ID
 * @returns Promise resolving to radio data
 * @endpoint GET /media/radio/{id}
 * @example
 * ```typescript
 * const response = await getRadioById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getRadioById = async (id: number): Promise<ApiResponse<PayloadData<RadioData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<RadioData>>>(`/media/radio/${id}`);
  return response.data;
};

// ==================== DOKUMEN SERVICES ====================

/**
 * Get paginated list of documents
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to document list with pagination metadata
 * @endpoint GET /media/dokumen
 * @example
 * ```typescript
 * const response = await getDokumens({ page: 1, category: 'laporan' });
 * console.log(response.data.dokumens);
 * ```
 */
export const getDokumens = async (page: number = 1): Promise<ApiResponse<DokumenListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/dokumen?${queryString}` : "/media/dokumen";

  const response = await httpInstance.get<ApiResponse<DokumenListPayload>>(url);
  return response.data;
};

/**
 * Get document by ID
 * @param id - Document ID
 * @returns Promise resolving to document data
 * @endpoint GET /media/dokumen/{id}
 * @example
 * ```typescript
 * const response = await getDokumenById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getDokumenById = async (id: number): Promise<ApiResponse<PayloadData<DokumenData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<DokumenData>>>(`/media/dokumen/${id}`);
  return response.data;
};

/**
 * Create new document
 * @param dokumenData - Document creation data
 * @returns Promise resolving to created document data
 * @endpoint POST /media/dokumen
 * @example
 * ```typescript
 * const response = await createDokumen({
 *   nama: 'Laporan Tahunan',
 *   file: 'laporan.pdf',
 *   category: 'laporan'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createDokumen = async (
  dokumenData: CreateDokumenRequest,
): Promise<ApiResponse<PayloadData<DokumenData>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<DokumenData>>>("/media/dokumen", dokumenData);
  return response.data;
};

// ==================== INFOGRAFIS SERVICES ====================

/**
 * Get paginated list of infographics
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to infographic list with pagination metadata
 * @endpoint GET /media/infografis
 * @example
 * ```typescript
 * const response = await getInfografis({ page: 1, keyword: 'statistik' });
 * console.log(response.data.infografis);
 * ```
 */
export const getInfografis = async (page: number = 1): Promise<ApiResponse<InfografisListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/infografis?${queryString}` : "/media/infografis";

  const response = await httpInstance.get<ApiResponse<InfografisListPayload>>(url);
  return response.data;
};

/**
 * Get infographic by ID
 * @param id - Infographic ID
 * @returns Promise resolving to infographic data
 * @endpoint GET /media/infografis/{id}
 * @example
 * ```typescript
 * const response = await getInfografisById(123);
 * console.log(response.data.nama);
 * ```
 */
export const getInfografisById = async (id: number): Promise<ApiResponse<PayloadData<InfografisData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<InfografisData>>>(`/media/infografis/${id}`);
  return response.data;
};

/**
 * Create new infographic
 * @param infografisData - Infographic creation data
 * @returns Promise resolving to created infographic data
 * @endpoint POST /media/infografis
 * @example
 * ```typescript
 * const response = await createInfografis({
 *   nama: 'Infografis Baru',
 *   foto: 'infografis.jpg',
 *   url: 'https://example.com',
 *   status: 'active'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createInfografis = async (
  infografisData: CreateInfografisRequest,
): Promise<ApiResponse<PayloadData<InfografisData>>> => {
  const response = await httpInstance.post<ApiResponse<PayloadData<InfografisData>>>(
    "/media/infografis",
    infografisData,
  );
  return response.data;
};

// ==================== MAJALAH SERVICES ====================

/**
 * Get paginated list of magazines
 * @param params - Search parameters including page, keyword, and filters
 * @returns Promise resolving to magazine list with pagination metadata
 * @endpoint GET /media/majalah
 * @example
 * ```typescript
 * const response = await getMajalahs({ page: 1, keyword: '2024' });
 * console.log(response.data.majalahs);
 * ```
 */
export const getMajalahs = async (page: number = 1): Promise<ApiResponse<MajalahListPayload>> => {
  const searchParams = new URLSearchParams();

  if (page) searchParams.append("page", page.toString());

  const queryString = searchParams.toString();
  const url = queryString ? `/media/majalah?${queryString}` : "/media/majalah";

  const response = await httpInstance.get<ApiResponse<MajalahListPayload>>(url);
  return response.data;
};

/**
 * Get magazine by ID
 * @param id - Magazine ID
 * @returns Promise resolving to magazine data
 * @endpoint GET /media/majalah/{id}
 * @example
 * ```typescript
 * const response = await getMajalahById(123);
 * console.log(response.data.tahun);
 * ```
 */
export const getMajalahById = async (id: number): Promise<ApiResponse<PayloadData<MajalahData>>> => {
  const response = await httpInstance.get<ApiResponse<PayloadData<MajalahData>>>(`/media/majalah/${id}`);
  return response.data;
};
