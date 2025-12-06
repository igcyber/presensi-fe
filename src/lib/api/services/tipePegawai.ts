import type { ApiResponse, PaginatedPayload, SearchParams } from "@/lib/api/core/apiResponse";
import http from "@/lib/api/core/httpInstance";
import { createCrudService } from "@/lib/api/factories/crudServiceFactory";
import type { TipePegawai } from "@/lib/api/types/tipePegawai.types";

const base = "/api/admin/tipe-pegawai";

export const tipePegawaiService = createCrudService<TipePegawai, TipePegawai, unknown, unknown>(base);

export const getTipePegawai = async (): Promise<ApiResponse<TipePegawai[]>> => {
  const { data } = await http.get<ApiResponse<TipePegawai[]>>("/api/admin/tipe-pegawai/list-tipe-pegawai");
  return data;
};

export const getTipePegawaiList = async (params?: SearchParams): Promise<ApiResponse<PaginatedPayload<TipePegawai>>> => {
  return tipePegawaiService.get(params);
};

export const getTipePegawaiById = (id: number): Promise<ApiResponse<TipePegawai>> => tipePegawaiService.getById(id);

export const createTipePegawai = (payload: { nama: string }): Promise<ApiResponse<TipePegawai>> =>
  tipePegawaiService.create(payload);

export const updateTipePegawai = (id: number, payload: { nama: string }): Promise<ApiResponse<TipePegawai>> =>
  tipePegawaiService.update(id, payload);

export const deleteTipePegawai = (id: number): Promise<ApiResponse<null>> => tipePegawaiService.remove(id);

