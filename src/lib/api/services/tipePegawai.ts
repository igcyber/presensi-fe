import type { ApiResponse, PaginationMeta } from "@/lib/api/core/apiResponse";
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

export const getTipePegawai = async (): Promise<ApiResponse<TipePegawaiListResponse>> => {
  const response = await tipePegawaiService.get();
  
  if (response.data?.meta) {
    response.data.meta = transformPaginationMeta(response.data.meta);
  }
  
  return response;
};

