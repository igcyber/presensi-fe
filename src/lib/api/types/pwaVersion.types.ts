import type { BaseEntity, PaginatedPayload } from "@/lib/api/core/apiResponse";

export interface PwaVersion extends BaseEntity {
  version: string;
  key: string;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
}

export type PwaVersionListResponse = PaginatedPayload<PwaVersion>;

export interface PwaVersionQueryParams {
  page?: number;
  per_page?: number;
  search?: string;
}

export interface CreatePwaVersionRequest {
  version: string;
}

export interface PwaVersionLatest {
  version: string;
  key: string;
}
