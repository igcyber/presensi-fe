import type { ApiResponse, PaginationMeta, SearchParams } from "@/lib/api/core/apiResponse";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type { Kantor, KantorListResponse } from "@/lib/api/types/kantor.types";

const base = "/api/admin/kantor";

export const kantorService = createCrudService<Kantor, Kantor, unknown, unknown>(base);

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

const transformKantorData = (kantor: any): Kantor => {
  return {
    ...kantor,
    radiusLimit: kantor.radiusLimit ?? kantor.radius_limit ?? 0,
    jamMasuk: kantor.jamMasuk ?? kantor.jam_masuk ?? "",
    jamPulang: kantor.jamPulang ?? kantor.jam_pulang ?? "",
  };
};

export const getKantor = async (params?: SearchParams | any): Promise<ApiResponse<KantorListResponse>> => {
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

  const response = await kantorService.get(queryParams);

  if (response.data?.meta) {
    response.data.meta = transformPaginationMeta(response.data.meta);
  }

  if (response.data?.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map(transformKantorData);
  }

  return response;
};

export const getKantorById = async (id: number): Promise<ApiResponse<Kantor>> => {
  const response = await kantorService.getById(id);
  if (response.data) {
    response.data = transformKantorData(response.data);
  }
  return response;
};

export const createKantor = (payload: {
  nama: string;
  alamat?: string;
  lat: string;
  long: string;
  deskripsi?: string;
  radius_limit: number;
  jam_masuk: string;
  jam_pulang: string;
}): Promise<ApiResponse<Kantor>> => kantorService.create(payload);

export const updateKantor = (id: number, payload: {
  nama?: string;
  alamat?: string;
  lat?: string;
  long?: string;
  deskripsi?: string;
  radius_limit?: number;
  jam_masuk?: string;
  jam_pulang?: string;
}): Promise<ApiResponse<Kantor>> => kantorService.update(id, payload);

export const deleteKantor = (id: number): Promise<ApiResponse<null>> => kantorService.remove(id);
