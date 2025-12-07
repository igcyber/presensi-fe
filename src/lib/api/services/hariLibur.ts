import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core/apiResponse";
import http from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type { CreateHariLiburRequest, HariLibur, HariLiburQueryParams, UpdateHariLiburRequest } from "@/lib/api/types/hariLibur.types";

const base = "/api/admin/hari-libur";

export const hariLiburService = createCrudService<HariLibur, HariLibur, CreateHariLiburRequest, UpdateHariLiburRequest>(base);

export const getHariLiburList = async (params?: SearchParams & { date?: string }): Promise<ApiResponse<PaginatedPayload<HariLibur>>> => {
  const queryParams: Record<string, any> = {
    page: params?.page || 1,
    per_page: params?.limit || 10,
  };

  if (params?.search) {
    queryParams.search = params.search;
  }

  if (params?.date) {
    queryParams.date = params.date;
  }

  return hariLiburService.get(queryParams);
};

export const getHariLiburById = (id: number): Promise<ApiResponse<HariLibur>> => hariLiburService.getById(id);

export const createHariLibur = (payload: CreateHariLiburRequest): Promise<ApiResponse<HariLibur>> =>
  hariLiburService.create(payload);

export const updateHariLibur = (id: number, payload: UpdateHariLiburRequest): Promise<ApiResponse<HariLibur>> =>
  hariLiburService.update(id, payload);

export const deleteHariLibur = (id: number): Promise<ApiResponse<null>> => hariLiburService.remove(id);
