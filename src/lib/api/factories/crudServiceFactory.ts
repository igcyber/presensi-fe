// axios instance kamu
import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core/apiResponse";
import http from "@/lib/api/core/httpInstance";

type Id = number | string;

export type CrudService<TList, TDetail = TList, TCreate = unknown, TUpdate = Partial<TCreate>> = {
  get: (params?: SearchParams) => Promise<ApiResponse<PaginatedPayload<TList>>>;
  getById: (id: Id) => Promise<ApiResponse<TDetail>>;
  create: (payload: TCreate) => Promise<ApiResponse<TDetail>>;
  update: (id: Id, payload: TUpdate) => Promise<ApiResponse<TDetail>>;
  remove: (id: Id) => Promise<ApiResponse<null>>;
};

export function createCrudService<TList, TDetail = TList, TCreate = unknown, TUpdate = Partial<TCreate>>(
  resourcePath: string,
): CrudService<TList, TDetail, TCreate, TUpdate> {
  return {
    get: async (params) => {
      const { data } = await http.get<ApiResponse<PaginatedPayload<TList>>>(resourcePath, { params });
      return data;
    },
    getById: async (id) => {
      const { data } = await http.get<ApiResponse<TDetail>>(`${resourcePath}/${id}`);
      return data;
    },
    create: async (payload) => {
      const { data } = await http.post<ApiResponse<TDetail>>(resourcePath, payload);
      return data;
    },
    update: async (id, payload) => {
      const { data } = await http.put<ApiResponse<TDetail>>(`${resourcePath}/${id}`, payload);
      return data;
    },
    remove: async (id) => {
      const { data } = await http.delete<ApiResponse<null>>(`${resourcePath}/${id}`);
      return data;
    },
  };
}
