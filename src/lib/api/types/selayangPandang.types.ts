import type { ContentData, PaginationMeta } from "@/lib/api/core/apiResponse";

import type { Prestasi } from "./prestasi.types";

/**
 * Content data type aliases for better semantic naming
 */
export type SejarahData = ContentData;
export type KependudukanData = ContentData;
export type PotensiDaerahData = ContentData;
export type PrestasiPenghargaanContentData = ContentData;

/**
 * Achievement/Award data payload interface
 */
export interface PrestasiPenghargaanDataPayload {
  data: ContentData;
  prestasis: Omit<Prestasi, "createdByUser" | "updatedByUser">[];
  meta?: PaginationMeta;
}
