import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core/apiResponse";
import http from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type { CreatePwaVersionRequest, PwaVersion, PwaVersionLatest, PwaVersionQueryParams } from "@/lib/api/types/pwaVersion.types";

const base = "/api/admin/pwa-version";

export const pwaVersionService = createCrudService<PwaVersion, PwaVersion, CreatePwaVersionRequest, never>(base);

export const getPwaVersionList = async (params?: SearchParams): Promise<ApiResponse<PaginatedPayload<PwaVersion>>> => {
  const queryParams: Record<string, any> = {
    page: params?.page || 1,
    per_page: params?.limit || 10,
  };

  if (params?.search) {
    queryParams.search = params.search;
  }

  return pwaVersionService.get(queryParams);
};

export const getPwaVersionLatest = async (): Promise<ApiResponse<PwaVersionLatest>> => {
  const { data } = await http.get<ApiResponse<PwaVersionLatest>>(`${base}/latest`);
  return data;
};

export const createPwaVersion = (payload: CreatePwaVersionRequest): Promise<ApiResponse<PwaVersion>> =>
  pwaVersionService.create(payload);
