/**
 * Dashboard views statistics interface
 * Represents view counts for different content types
 */
export interface DashboardViews {
  berita: number;
  dokumen: number;
  infografis: number;
  video: number;
  foto: number;
}

/**
 * Popular berita item interface
 * Represents popular news item in dashboard
 */
export interface PopularBerita {
  id: number;
  judul: string;
  isi: string;
  foto: string;
  keterangan: string | null;
  tagId: number;
  views: number;
  createdBy: number;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fotoUrl: string;
}

/**
 * Dashboard popular content interface
 * Represents popular content in dashboard
 */
export interface DashboardPopular {
  berita: PopularBerita[];
}

/**
 * Dashboard data interface
 * Represents complete dashboard data
 */
export interface DashboardData {
  views: DashboardViews;
  popular: DashboardPopular;
}

