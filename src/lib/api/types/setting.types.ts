import type { BaseEntity } from "@/lib/api/core/apiResponse";

/**
 * Interface untuk status Face ID
 */
export interface FaceIdStatus {
  is_registered: boolean;
  registered_at: string | null;
}

/**
 * Interface untuk response update Face ID
 */
export interface UpdateFaceIdResponse {
  id: number;
  pegawaiId: number;
  descriptor: string;
  filename: string;
  // properti lain yang dikembalikan backend
}
