import type { ApiResponse, PaginationMeta, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type {
  CreatePegawaiRequest,
  Pegawai,
  PegawaiListResponse,
  PegawaiQueryParams,
  UpdatePegawaiRequest,
} from "@/lib/api/types/pegawai.types";

const base = "/api/admin/pegawai";

export const pegawaiService = createCrudService<Pegawai, Pegawai, CreatePegawaiRequest, UpdatePegawaiRequest>(base);

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

export const getPegawai = async (params?: SearchParams | PegawaiQueryParams | any): Promise<ApiResponse<PegawaiListResponse>> => {
  // Konversi params dari SearchParams (limit) ke PegawaiQueryParams (per_page)
  const queryParams: PegawaiQueryParams = {};
  
  if (params) {
    // Handle pagination
    if (params.page) {
      queryParams.page = params.page;
    }
    if (params.limit) {
      queryParams.per_page = params.limit;
    } else if (params.per_page) {
      queryParams.per_page = params.per_page;
    }
    
    // Handle search
    if (params.search) {
      queryParams.search = params.search;
    }
    
    // Handle type filter (dari direct params atau custom filters)
    if (params.type) {
      queryParams.type = String(params.type);
    } else if (params.customFilters && Array.isArray(params.customFilters)) {
      const customFilters = params.customFilters;
      if (customFilters.length > 0 && customFilters[0].type) {
        queryParams.type = String(customFilters[0].type);
      }
    }
    
    // Handle sorting
    if (params.orderBy) {
      queryParams.sort_by = params.orderBy as any;
    }
    if (params.sortBy) {
      queryParams.sort_order = params.sortBy as "asc" | "desc";
    }
  }
  
  const response = await pegawaiService.get(queryParams);
  
  if (response.data?.meta) {
    response.data.meta = transformPaginationMeta(response.data.meta);
  }
  
  return response;
};

export const getPegawaiById = (id: number): Promise<ApiResponse<Pegawai>> => pegawaiService.getById(id);

export const createPegawai = (payload: CreatePegawaiRequest): Promise<ApiResponse<Pegawai>> =>
  pegawaiService.create(payload);

export const updatePegawai = (id: number, payload: UpdatePegawaiRequest): Promise<ApiResponse<Pegawai>> =>
  pegawaiService.update(id, payload);

export const deletePegawai = (id: number): Promise<ApiResponse<null>> => pegawaiService.remove(id);

