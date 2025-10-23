// Types untuk pengaduan API

export interface CreatePengaduanRequest {
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  email: string;
  aduan: string;
  deskripsi: string;
}

export interface CreatePengaduanResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    nama: string;
    nik: string;
    alamat: string;
    noHp: string;
    email: string;
    aduan: string;
    deskripsi: string;
    status: string;
    createdAt: string;
  };
}

// Admin Types
export interface Pengaduan {
  id: number;
  nama: string;
  nik: string;
  alamat: string;
  noHp: string;
  email: string;
  aduan: string;
  deskripsi: string;
  kategoriAduan?: string;
  status: 'belum' | 'diterima';
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PengaduanListResponse {
  data: Pengaduan[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
}

export interface PengaduanDetailResponse extends Pengaduan {}

export interface PengaduanQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  status?: 'belum' | 'diterima';
  kategori?: string;
  tanggal_mulai?: string;
  tanggal_akhir?: string;
  order?: 'asc' | 'desc';
}

export interface UpdateStatusRequest {
  status: 'belum' | 'diterima';
  kategori_aduan?: string;
  keterangan?: string;
}

export interface UpdateKategoriRequest {
  kategori_aduan: string;
}

export interface KategoriPengaduan {
  kategori_aduan: string;
}
