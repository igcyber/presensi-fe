import type { BaseEntity, PaginatedPayload, PaginatedPayloadPublic } from "@/lib/api/core/apiResponse";

import type { User } from "./user.types";

/**
 * OPD entity interface
 */
export interface Opd extends BaseEntity {
  nama: string;
  alamat: string;
  maps?: string | null;
  keterangan?: string | null;
  foto: string;
  website: string;
  createdBy: number;
  updatedBy: number;
  createdByUser: Omit<User, "id,nip,roles">;
  updatedByUser: Omit<User, "id,nip,roles">;
  fotoUrl: string;
}

/**
 * OPD list response interface
 * Represents paginated OPD data from API
 */
export type OpdListResponse = PaginatedPayload<Opd>;

/**
 * OPD list public response interface
 * Represents paginated OPD data from API
 */
export type OpdListPublicResponse = PaginatedPayloadPublic<Omit<Opd, "createdByUser,updatedByUser">, { opds: Opd[] }>;

/**
 * OPD create request payload
 */
export interface CreateOpdRequest {
  nama: string;
  alamat: string;
  maps: string;
  keterangan: string;
  foto: string;
  website: string;
}

/**
 * OPD update request payload
 */
export interface UpdateOpdRequest {
  nama: string;
  alamat: string;
  maps: string;
  keterangan: string;
  foto: string;
  website: string;
}

/**
 * OPD query parameters for listing
 */
export interface OpdQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * OPD detail response interface
 */
export type OpdDetailResponse = Opd;

/**
 * OPD detail public response interface
 */
export type OpdDetailPublicResponse = Omit<Opd, "createdByUser,updatedByUser"> & { layanans: any[] };
