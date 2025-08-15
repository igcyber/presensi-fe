export interface ContentData {
  id: number;
  nama: string;
  isi: string;
  slug: string;
  foto: string;
  createdAt: string;
  updatedAt: string;
}

export type PlayloadData<T> = {
  data: T;
};

export interface PageMeta {
  pagers: string[];
  position: string;
  pagetitle: string;
}

export type ApiResponse<T, M = PageMeta> = {
  status?: string;
  data: T & M;
};
