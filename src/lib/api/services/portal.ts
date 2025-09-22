import type { ApiResponse } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePortalMenuKatRequest,
  CreatePortalMenuRequest,
  CreatePortalMenuSubRequest,
  PortalMenu,
  PortalMenuDetailResponse,
  PortalMenuKat,
  PortalMenuKatDetailResponse,
  PortalMenuKatListResponse,
  PortalMenuKatQueryParams,
  PortalMenuListPublicResponse,
  PortalMenuListResponse,
  PortalMenuQueryParams,
  PortalMenuSub,
  PortalMenuSubDetailResponse,
  PortalMenuSubListResponse,
  PortalMenuSubQueryParams,
  UpdatePortalMenuKatRequest,
  UpdatePortalMenuRequest,
  UpdatePortalMenuSubRequest,
} from "@/lib/api/types/portal.types";

import { httpInstance } from "../core";

const base = "/api/portal";
const baseKat = "/api/portal-kat";
const baseSub = "/api/portal-sub";

export const portalMenuService = createCrudService<
  PortalMenu,
  PortalMenuDetailResponse,
  CreatePortalMenuRequest,
  UpdatePortalMenuRequest
>(base);

export const portalMenuKatService = createCrudService<
  PortalMenuKat,
  PortalMenuKatDetailResponse,
  CreatePortalMenuKatRequest,
  UpdatePortalMenuKatRequest
>(baseKat);

export const portalMenuSubService = createCrudService<
  PortalMenuSub,
  PortalMenuSubDetailResponse,
  CreatePortalMenuSubRequest,
  UpdatePortalMenuSubRequest
>(baseSub);

// ===== PORTAL MENU SERVICES =====

/**
 * Mendapatkan daftar portal menu dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar portal menu dengan pagination
 * @endpoint GET /api/portal
 * @example
 * ```typescript
 * const response = await getPortalMenus({ page: 1, per_page: 10, search: 'OPD' });
 * console.log(response.data.data); // Array of portal menu
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPortalMenus = (params?: PortalMenuQueryParams): Promise<ApiResponse<PortalMenuListResponse>> => {
  return portalMenuService.get(params);
};

/**
 * Mendapatkan portal menu berdasarkan ID
 * @param id - ID portal menu
 * @returns Promise yang mengembalikan data portal menu
 * @endpoint GET /api/portal/{id}
 * @example
 * ```typescript
 * const response = await getPortalMenuById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getPortalMenuById = (id: number): Promise<ApiResponse<PortalMenuDetailResponse>> =>
  portalMenuService.getById(id);

/**
 * Membuat portal menu baru
 * @param payload - Data untuk membuat portal menu baru
 * @returns Promise yang mengembalikan data portal menu yang dibuat
 * @endpoint POST /api/portal
 * @example
 * ```typescript
 * const response = await createPortalMenu({
 *   judul: 'OPD',
 *   link: '#',
 *   icon: file
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPortalMenu = (payload: CreatePortalMenuRequest) => portalMenuService.create(payload);

/**
 * Memperbarui data portal menu
 * @param id - ID portal menu yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data portal menu yang diperbarui
 * @endpoint PUT /api/portal/{id}
 * @example
 * ```typescript
 * const response = await updatePortalMenu(123, {
 *   judul: 'OPD Updated',
 *   link: 'https://opd.kukarkab.go.id',
 *   icon: file
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePortalMenu = (
  id: number,
  payload: UpdatePortalMenuRequest,
): Promise<ApiResponse<PortalMenuDetailResponse>> => portalMenuService.update(id, payload);

/**
 * Menghapus portal menu
 * @param id - ID portal menu yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/portal/{id}
 * @example
 * ```typescript
 * await deletePortalMenu(123);
 * console.log('Portal menu berhasil dihapus');
 * ```
 */
export const deletePortalMenu = (id: number): Promise<ApiResponse<null>> => portalMenuService.remove(id);

// ===== PORTAL MENU KATEGORI SERVICES =====

/**
 * Mendapatkan daftar portal menu kategori dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar portal menu kategori dengan pagination
 * @endpoint GET /api/portal-kat
 * @example
 * ```typescript
 * const response = await getPortalMenuKats({ page: 1, per_page: 10, search: 'Badan' });
 * console.log(response.data.data); // Array of portal menu kategori
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPortalMenuKats = (
  params?: PortalMenuKatQueryParams,
): Promise<ApiResponse<PortalMenuKatListResponse>> => {
  return portalMenuKatService.get(params);
};

/**
 * Mendapatkan portal menu kategori berdasarkan ID
 * @param id - ID portal menu kategori
 * @returns Promise yang mengembalikan data portal menu kategori
 * @endpoint GET /api/portal-kat/{id}
 * @example
 * ```typescript
 * const response = await getPortalMenuKatById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getPortalMenuKatById = (id: number): Promise<ApiResponse<PortalMenuKatDetailResponse>> =>
  portalMenuKatService.getById(id);

/**
 * Membuat portal menu kategori baru
 * @param payload - Data untuk membuat portal menu kategori baru
 * @returns Promise yang mengembalikan data portal menu kategori yang dibuat
 * @endpoint POST /api/portal-kat
 * @example
 * ```typescript
 * const response = await createPortalMenuKat({
 *   judul: 'Badan',
 *   portalMenuId: 2
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPortalMenuKat = (payload: CreatePortalMenuKatRequest) => portalMenuKatService.create(payload);

/**
 * Memperbarui data portal menu kategori
 * @param id - ID portal menu kategori yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data portal menu kategori yang diperbarui
 * @endpoint PUT /api/portal-kat/{id}
 * @example
 * ```typescript
 * const response = await updatePortalMenuKat(123, {
 *   judul: 'Badan Updated',
 *   portalMenuId: 2
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePortalMenuKat = (
  id: number,
  payload: UpdatePortalMenuKatRequest,
): Promise<ApiResponse<PortalMenuKatDetailResponse>> => portalMenuKatService.update(id, payload);

/**
 * Menghapus portal menu kategori
 * @param id - ID portal menu kategori yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/portal-kat/{id}
 * @example
 * ```typescript
 * await deletePortalMenuKat(123);
 * console.log('Portal menu kategori berhasil dihapus');
 * ```
 */
export const deletePortalMenuKat = (id: number): Promise<ApiResponse<null>> => portalMenuKatService.remove(id);

// ===== PORTAL MENU SUB SERVICES =====

/**
 * Mendapatkan daftar portal menu sub dengan pagination
 * @param params - Parameter query untuk filtering dan pagination
 * @returns Promise yang mengembalikan daftar portal menu sub dengan pagination
 * @endpoint GET /api/portal-sub
 * @example
 * ```typescript
 * const response = await getPortalMenuSubs({ page: 1, per_page: 10, search: 'Dinas' });
 * console.log(response.data.data); // Array of portal menu sub
 * console.log(response.data.meta.total); // Total count
 * ```
 */
export const getPortalMenuSubs = (
  params?: PortalMenuSubQueryParams,
): Promise<ApiResponse<PortalMenuSubListResponse>> => {
  return portalMenuSubService.get(params);
};

/**
 * Mendapatkan portal menu sub berdasarkan ID
 * @param id - ID portal menu sub
 * @returns Promise yang mengembalikan data portal menu sub
 * @endpoint GET /api/portal-sub/{id}
 * @example
 * ```typescript
 * const response = await getPortalMenuSubById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getPortalMenuSubById = (id: number): Promise<ApiResponse<PortalMenuSubDetailResponse>> =>
  portalMenuSubService.getById(id);

/**
 * Membuat portal menu sub baru
 * @param payload - Data untuk membuat portal menu sub baru
 * @returns Promise yang mengembalikan data portal menu sub yang dibuat
 * @endpoint POST /api/portal-sub
 * @example
 * ```typescript
 * const response = await createPortalMenuSub({
 *   judul: 'Dinas Komunikasi dan Informatika',
 *   link: 'https://diskominfo.kukarkab.go.id/',
 *   portalMenuId: 2
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPortalMenuSub = (payload: CreatePortalMenuSubRequest) => portalMenuSubService.create(payload);

/**
 * Memperbarui data portal menu sub
 * @param id - ID portal menu sub yang akan diperbarui
 * @param payload - Data yang akan diperbarui
 * @returns Promise yang mengembalikan data portal menu sub yang diperbarui
 * @endpoint PUT /api/portal-sub/{id}
 * @example
 * ```typescript
 * const response = await updatePortalMenuSub(123, {
 *   judul: 'Dinas Komunikasi dan Informatika Updated',
 *   link: 'https://diskominfo.kukarkab.go.id/',
 *   portalMenuId: 2
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePortalMenuSub = (
  id: number,
  payload: UpdatePortalMenuSubRequest,
): Promise<ApiResponse<PortalMenuSubDetailResponse>> => portalMenuSubService.update(id, payload);

/**
 * Menghapus portal menu sub
 * @param id - ID portal menu sub yang akan dihapus
 * @returns Promise yang mengembalikan null jika berhasil
 * @endpoint DELETE /api/portal-sub/{id}
 * @example
 * ```typescript
 * await deletePortalMenuSub(123);
 * console.log('Portal menu sub berhasil dihapus');
 * ```
 */
export const deletePortalMenuSub = (id: number): Promise<ApiResponse<null>> => portalMenuSubService.remove(id);

// ===== PORTAL MENU PUBLIC SERVICES =====

/**
 * Mendapatkan daftar portal menu public
 * @returns Promise yang mengembalikan daftar portal menu public
 * @endpoint GET /
 * @example
 * ```typescript
 * const response = await getPortalMenuPublic();
 * console.log(response.data.data); // Array of portal menu public
 * ```
 */
export const getPortalMenuPublic = async (): Promise<ApiResponse<PortalMenuListPublicResponse>> => {
  const { data } = await httpInstance.get<ApiResponse<PortalMenuListPublicResponse>>("/");
  return data;
};
