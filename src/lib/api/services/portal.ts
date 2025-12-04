import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";
import type { PortalMenuPublic } from "@/lib/api/types/portal.types";

/**
 * Get public portal menu
 * @returns Promise resolving to portal menu data
 * @endpoint GET /portal/menu
 */
export const getPortalMenuPublic = async (): Promise<ApiResponse<{ data: PortalMenuPublic[] }>> => {
  const response = await httpInstance.get<ApiResponse<{ data: PortalMenuPublic[] }>>("/portal/menu");
  return response.data;
};
