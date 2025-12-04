import type { ApiResponse } from "@/lib/api/core/apiResponse";
import httpInstance from "@/lib/api/core/httpInstance";

export interface MenuPublic {
  id: number;
  nama: string;
  url: string;
  children?: MenuPublic[];
}

/**
 * Get public menu
 * @returns Promise resolving to menu data
 * @endpoint GET /menu
 */
export const getMenuPublic = async (): Promise<ApiResponse<MenuPublic[]>> => {
  const response = await httpInstance.get<ApiResponse<MenuPublic[]>>("/menu");
  return response.data;
};
