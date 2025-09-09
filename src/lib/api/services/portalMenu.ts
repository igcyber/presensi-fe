import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type {
  BgVideo,
  CreatePortalMenuRequest,
  CreatePortalMenuSubRequest,
  PortalMenu,
  PortalMenuPayload,
  PortalMenuSub,
  UpdatePortalMenuRequest,
  UpdatePortalMenuSubRequest,
} from "@/lib/api/types/portalMenu.types";

// Re-export types for convenience
export type {
  BgVideo,
  CreatePortalMenuRequest,
  CreatePortalMenuSubRequest,
  PortalMenu,
  PortalMenuPayload,
  PortalMenuSub,
  UpdatePortalMenuRequest,
  UpdatePortalMenuSubRequest,
} from "@/lib/api/types/portalMenu.types";

/**
 * Get portal menu data including main menu, sub menus, and background video
 * @returns Promise resolving to portal menu data with navigation structure
 * @endpoint GET /
 * @example
 * ```typescript
 * const response = await getPortalMenu();
 * console.log(response.data.menu);
 * console.log(response.data.bgVideo);
 * ```
 */
export const getPortalMenu = async (): Promise<ApiResponse<PortalMenuPayload>> => {
  const response = await httpInstance.get<ApiResponse<PortalMenuPayload>>("/");
  return response.data;
};

/**
 * Get all portal menu items
 * @returns Promise resolving to array of portal menu items
 * @endpoint GET /portal-menu
 * @example
 * ```typescript
 * const response = await getPortalMenus();
 * console.log(response.data.length);
 * ```
 */
export const getPortalMenus = async (): Promise<ApiResponse<PortalMenu[]>> => {
  const response = await httpInstance.get<ApiResponse<PortalMenu[]>>("/portal-menu");
  return response.data;
};

/**
 * Get portal menu by ID
 * @param id - Portal menu ID
 * @returns Promise resolving to portal menu data
 * @endpoint GET /portal-menu/{id}
 * @example
 * ```typescript
 * const response = await getPortalMenuById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getPortalMenuById = async (id: number): Promise<ApiResponse<PortalMenu>> => {
  const response = await httpInstance.get<ApiResponse<PortalMenu>>(`/portal-menu/${id}`);
  return response.data;
};

/**
 * Create new portal menu
 * @param menuData - Portal menu creation data
 * @returns Promise resolving to created portal menu data
 * @endpoint POST /portal-menu
 * @example
 * ```typescript
 * const response = await createPortalMenu({
 *   judul: 'Menu Baru',
 *   link: '/menu-baru',
 *   icon: 'icon-menu.png',
 *   description: 'Deskripsi menu'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPortalMenu = async (menuData: CreatePortalMenuRequest): Promise<ApiResponse<PortalMenu>> => {
  const response = await httpInstance.post<ApiResponse<PortalMenu>>("/portal-menu", menuData);
  return response.data;
};

/**
 * Update portal menu
 * @param id - Portal menu ID to update
 * @param menuData - Updated portal menu data
 * @returns Promise resolving to updated portal menu data
 * @endpoint PUT /portal-menu/{id}
 * @example
 * ```typescript
 * const response = await updatePortalMenu(123, {
 *   judul: 'Menu yang Diperbarui',
 *   description: 'Deskripsi yang diperbarui'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePortalMenu = async (
  id: number,
  menuData: UpdatePortalMenuRequest,
): Promise<ApiResponse<PortalMenu>> => {
  const response = await httpInstance.put<ApiResponse<PortalMenu>>(`/portal-menu/${id}`, menuData);
  return response.data;
};

/**
 * Delete portal menu
 * @param id - Portal menu ID to delete
 * @returns Promise resolving to success response
 * @endpoint DELETE /portal-menu/{id}
 * @example
 * ```typescript
 * await deletePortalMenu(123);
 * // Portal menu deleted successfully
 * ```
 */
export const deletePortalMenu = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/portal-menu/${id}`);
  return response.data;
};

// ==================== PORTAL MENU SUB SERVICES ====================

/**
 * Get portal menu sub by ID
 * @param id - Portal menu sub ID
 * @returns Promise resolving to portal menu sub data
 * @endpoint GET /portal-menu-sub/{id}
 * @example
 * ```typescript
 * const response = await getPortalMenuSubById(123);
 * console.log(response.data.judul);
 * ```
 */
export const getPortalMenuSubById = async (id: number): Promise<ApiResponse<PortalMenuSub>> => {
  const response = await httpInstance.get<ApiResponse<PortalMenuSub>>(`/portal-menu-sub/${id}`);
  return response.data;
};

/**
 * Create new portal menu sub
 * @param subData - Portal menu sub creation data
 * @returns Promise resolving to created portal menu sub data
 * @endpoint POST /portal-menu-sub
 * @example
 * ```typescript
 * const response = await createPortalMenuSub({
 *   judul: 'Sub Menu Baru',
 *   link: '/sub-menu-baru',
 *   portalMenuId: 1,
 *   icon: 'icon-sub.png'
 * });
 * console.log(response.data.id);
 * ```
 */
export const createPortalMenuSub = async (subData: CreatePortalMenuSubRequest): Promise<ApiResponse<PortalMenuSub>> => {
  const response = await httpInstance.post<ApiResponse<PortalMenuSub>>("/portal-menu-sub", subData);
  return response.data;
};

/**
 * Update portal menu sub
 * @param id - Portal menu sub ID to update
 * @param subData - Updated portal menu sub data
 * @returns Promise resolving to updated portal menu sub data
 * @endpoint PUT /portal-menu-sub/{id}
 * @example
 * ```typescript
 * const response = await updatePortalMenuSub(123, {
 *   judul: 'Sub Menu yang Diperbarui',
 *   link: '/sub-menu-updated'
 * });
 * console.log(response.data.judul);
 * ```
 */
export const updatePortalMenuSub = async (
  id: number,
  subData: UpdatePortalMenuSubRequest,
): Promise<ApiResponse<PortalMenuSub>> => {
  const response = await httpInstance.put<ApiResponse<PortalMenuSub>>(`/portal-menu-sub/${id}`, subData);
  return response.data;
};

/**
 * Delete portal menu sub
 * @param id - Portal menu sub ID to delete
 * @returns Promise resolving to success response
 * @endpoint DELETE /portal-menu-sub/{id}
 * @example
 * ```typescript
 * await deletePortalMenuSub(123);
 * // Portal menu sub deleted successfully
 * ```
 */
export const deletePortalMenuSub = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await httpInstance.delete<ApiResponse<{ message: string }>>(`/portal-menu-sub/${id}`);
  return response.data;
};

// ==================== BACKGROUND VIDEO SERVICES ====================

/**
 * Get background video data
 * @returns Promise resolving to background video data
 * @endpoint GET /bg-video
 * @example
 * ```typescript
 * const response = await getBgVideo();
 * console.log(response.data.nama);
 * ```
 */
export const getBgVideo = async (): Promise<ApiResponse<BgVideo>> => {
  const response = await httpInstance.get<ApiResponse<BgVideo>>("/bg-video");
  return response.data;
};

/**
 * Update background video
 * @param videoData - Background video data to update
 * @returns Promise resolving to updated background video data
 * @endpoint PUT /bg-video
 * @example
 * ```typescript
 * const response = await updateBgVideo({
 *   nama: 'Video Background Baru',
 *   isi: 'Deskripsi video',
 *   jenis: 'webm',
 *   file: 'new-background.webm'
 * });
 * console.log(response.data.nama);
 * ```
 */
export const updateBgVideo = async (videoData: Partial<BgVideo>): Promise<ApiResponse<BgVideo>> => {
  const response = await httpInstance.put<ApiResponse<BgVideo>>("/bg-video", videoData);
  return response.data;
};
