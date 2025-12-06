import type { ApiResponse, PaginationMeta, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type { TipePegawai, TipePegawaiListResponse } from "@/lib/api/types/tipePegawai.types";

const base = "/api/admin/tipe-pegawai";

export const tipePegawaiService = createCrudService<TipePegawai, TipePegawai, unknown, unknown>(base);

const transformPaginationMeta = (meta: any): PaginationMeta => {
  if (!meta) return meta;
  
  return {
    total: meta.total ?? 0,
    per_page: meta.perPage ?? meta.per_page ?? 10,
    current_page: meta.currentPage ?? meta.current_page ?? 1,
    last_page: meta.lastPage ?? meta.last_page ?? 1,
    first_page: meta.firstPage ?? meta.first_page ?? 1,
    from: meta.from ?? 0,
    to: meta.to ?? 0,
  };
};

export const getTipePegawai = async (params?: SearchParams | any): Promise<ApiResponse<TipePegawaiListResponse>> => {
  const queryParams: Record<string, any> = {};
  
  if (params) {
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.per_page = params.limit;
    } else if (params.per_page) {
      queryParams.per_page = params.per_page;
    }
    
    if (params.search) {
      queryParams.search = params.search;
    }
    
    if (params.orderBy) {
      queryParams.sort_by = params.orderBy;
    }
    if (params.sortBy) {
      queryParams.sort_order = params.sortBy;
    }
  }
  
  const response = await tipePegawaiService.get(queryParams);
  
  if (response.data?.meta) {
    response.data.meta = transformPaginationMeta(response.data.meta);
  }
  
  return response;
};

export const getTipePegawaiById = (id: number): Promise<ApiResponse<TipePegawai>> => tipePegawaiService.getById(id);

export const createTipePegawai = (payload: { nama: string }): Promise<ApiResponse<TipePegawai>> =>
  tipePegawaiService.create(payload);

export const updateTipePegawai = (id: number, payload: { nama: string }): Promise<ApiResponse<TipePegawai>> =>
  tipePegawaiService.update(id, payload);

export const deleteTipePegawai = (id: number): Promise<ApiResponse<null>> => tipePegawaiService.remove(id);

