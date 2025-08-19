import { type ApiResponse, type BaseEntity } from "@/lib/api/apiResponse";
import httpInstance from "@/lib/api/httpInstance";

// Portal Menu Sub data structure
export interface PortalMenuSub extends BaseEntity {
  judul: string;
  link: string;
  icon: string | null;
  portalMenuId: number;
  portalKatId: number;
}

// Portal Menu Kategori data structure
export interface PortalMenuKat extends BaseEntity {
  judul: string;
  portalMenuId: number;
  portalMenuSubs: PortalMenuSub[];
}

// Portal Menu data structure
export interface PortalMenu extends BaseEntity {
  judul: string;
  link: string;
  icon: string;
  portalMenuKats: PortalMenuKat[];
}

// Background Video data structure
export interface BgVideo extends BaseEntity {
  nama: string;
  isi: string;
  jenis: string;
  icon: string | null;
}

// Portal Menu payload
export interface PortalMenuPayload {
  menu: PortalMenu[];
  bgVideo: BgVideo;
  containermenu: PortalMenu[];
}

// Portal Menu response
export type PortalMenuResponse = ApiResponse<PortalMenuPayload>;

// Get portal menu data
export const getPortalMenu = async (): Promise<PortalMenuResponse> => {
  const response = await httpInstance.get<PortalMenuResponse>("/");
  return response.data;
};
