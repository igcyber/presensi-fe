import type { BaseEntity, ContentData } from "@/lib/api/core/apiResponse";
import type { Bupati } from "@/lib/api/types/bupati.types";

/**
 * Content data type aliases for better semantic naming
 */
export type TugasFungsiData = ContentData;
export type StrukturOrganisasiData = ContentData;
export type StrategiDaerahData = ContentData;
export type ProgramStrategisData = ContentData;
export type BupatiContentData = ContentData;

/**
 * Vision and Mission data structure
 */
export interface VisiMisiData {
  visi: ContentData;
  misi: ContentData;
}

/**
 * Financial transparency document interface
 */
export interface TransparansiKeuangan extends BaseEntity {
  nama: string;
  file: string;
  isi: string;
  fileUrl: string;
}

/**
 * Regent data payload interface
 */
export interface BupatiPayload {
  data: ContentData;
  bupati: Omit<Bupati, "createdByUser,updatedByUser">[];
}
