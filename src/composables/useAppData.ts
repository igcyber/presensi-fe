import { ref } from "vue";

// Interfaces
interface ContactInfo {
  alamat: string;
  telepon: string;
  email: string;
}

interface FooterInfo {
  email: string;
  alamat: string;
  telepon: string;
  fax: string;
}

interface RelatedLink {
  id: number;
  nama: string;
  website: string;
}

export interface NavigationItem {
  title: string;
  path: string;
  children?: NavigationItem[];
  external?: boolean;
}

// Reactive state
const contactInfo = ref<ContactInfo>({
  alamat: "Jl. Wolter Monginsidi No.1 Tenggarong 75511 - Kutai Kartanegara - Kaltim",
  telepon: "Telp. (0541) 661180 Fax. (0541) 661690",
  email: "info@dprdkutaikartanegara.go.id",
});

const footerInfo = ref<FooterInfo>({
  email: "info@dprdkutaikartanegara.go.id",
  alamat: "Jl. Wolter Monginsidi No.1 Tenggarong 75511 - Kutai Kartanegara - Kaltim",
  telepon: "(0541) 661180",
  fax: "(0541) 661690",
});

const profileLinks = ref([
  { id: 1, nama: "Tentang Kami", website: "https://bapenda.kukarkab.go.id/" },
  { id: 2, nama: "Visi dan Misi", website: "https://disdikbud.kukarkab.go.id/" },
  { id: 3, nama: "Buku Tamu", website: "https://prokom.kukarkab.go.id/" },
]);

const relatedLinks = ref<RelatedLink[]>([
  { id: 1, nama: "Bapenda", website: "https://bapenda.kukarkab.go.id/" },
  { id: 2, nama: "Disdikbud", website: "https://disdikbud.kukarkab.go.id/" },
  { id: 3, nama: "Sekretariat Daerah", website: "https://prokom.kukarkab.go.id/" },
  { id: 4, nama: "Bappeda", website: "https://bappeda.kukarkab.go.id/" },
  { id: 5, nama: "Diskominfo", website: "https://diskominfo.kukarkab.go.id/" },
  { id: 6, nama: "Dinas Kearsipan dan Perpustakaan", website: "https://diarpus.kukarkab.go.id/" },
  { id: 7, nama: "DPMPTSP", website: "https://dpmptsp.kukarkab.go.id/" },
]);

const navigation = ref<NavigationItem[]>([
  {
    title: "BERANDA",
    path: "/",
  },
  {
    title: "SELAYANG PANDANG",
    path: "/selayang-pandang",
    children: [
      { title: "Sejarah Kukar", path: "/selayang-pandang/sejarah" },
      { title: "Kependudukan", path: "/selayang-pandang/kependudukan" },
      { title: "Potensi Daerah", path: "/selayang-pandang/potensi-daerah" },
      { title: "Prestasi dan Penghargaan", path: "/selayang-pandang/prestasi-dan-penghargaan" },
    ],
  },
  {
    title: "MEDIA",
    path: "/media",
    children: [
      { title: "Video", path: "/media/video" },
      { title: "Foto", path: "/media/foto" },
      { title: "Dokumen", path: "/media/dokumen" },
      { title: "Infografis", path: "/media/infografis" },
      { title: "E-Magazine", path: "/media/majalah" },
    ],
  },
  {
    title: "PEMERINTAHAN",
    path: "/pemerintahan",
    children: [
      { title: "Tugas dan Fungsi", path: "/pemerintahan/tugas-dan-fungsi" },
      { title: "Struktur Organisasi", path: "/pemerintahan/struktur-organisasi" },
      { title: "Visi Misi Kukar", path: "/pemerintahan/visi-misi" },
      { title: "Strategi Daerah", path: "/pemerintahan/strategi" },
      { title: "Program Strategis", path: "/pemerintahan/program-strategis" },
      { title: "Bupati Kukar Sepanjang Masa", path: "/pemerintahan/bupati" },
      { title: "Transparansi Keuangan", path: "/pemerintahan/transparansi-keuangan" },
    ],
  },
  {
    title: "BERITA",
    path: "/berita",
  },
  {
    title: "PPID",
    path: "/ppid",
    children: [
      { title: "Informasi Serta Merta", path: "/ppid/informasi-serta-merta" },
      { title: "Informasi Berkala", path: "/ppid/informasi-berkala" },
      { title: "Informasi Setiap Saat", path: "/ppid/informasi-setiap-saat" },
      { title: "Informasi Di Kecualikan", path: "/ppid/informasi-di-kecualikan" },
    ],
  },
  {
    title: "SURVEI KEPUASAN",
    path: "/survei",
  },
]);

const selayangPandangNavigation = ref<NavigationItem[]>([
  { title: "Sejarah Kukar", path: "/selayang-pandang/sejarah" },
  { title: "Kependudukan", path: "/selayang-pandang/kependudukan" },
  { title: "Potensi Daerah", path: "/selayang-pandang/potensi-daerah" },
  { title: "Prestasi dan Penghargaan", path: "/selayang-pandang/prestasi-dan-penghargaan" },
]);

const pemerintahanNavigation = ref<NavigationItem[]>([
  { title: "Tugas dan Fungsi", path: "/pemerintahan/tugas-dan-fungsi" },
  { title: "Struktur Organisasi", path: "/pemerintahan/struktur-organisasi" },
  { title: "Visi Misi Kukar", path: "/pemerintahan/visi-misi" },
  { title: "Strategi Daerah", path: "/pemerintahan/strategi" },
  { title: "Program Strategis", path: "/pemerintahan/program-strategis" },
  { title: "Bupati Kukar Sepanjang Masa", path: "/pemerintahan/bupati" },
  { title: "Transparansi Keuangan", path: "/pemerintahan/transparansi-keuangan" },
]);

const unitKerjaNavigation = ref<NavigationItem[]>([
  { title: "OPD", path: "/unit-kerja/opd" },
  { title: "Perusahaan Daerah", path: "/unit-kerja/perusahaan-daerah" },
]);

const isLoading = ref(false);
const error = ref<string | null>(null);

// Methods
const fetchContactInfo = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // TODO: Replace with actual API call
    // const response = await fetch('/api/contact-info')
    // const data = await response.json()
    // contactInfo.value = data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    error.value = "Gagal memuat informasi kontak";
    console.error("Error fetching contact info:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchFooterInfo = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // TODO: Replace with actual API call
    // const response = await fetch('/api/footer-info')
    // const data = await response.json()
    // footerInfo.value = data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    error.value = "Gagal memuat informasi footer";
    console.error("Error fetching footer info:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchRelatedLinks = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // TODO: Replace with actual API call
    // const response = await fetch('/api/related-links')
    // const data = await response.json()
    // relatedLinks.value = data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    error.value = "Gagal memuat link terkait";
    console.error("Error fetching related links:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchNavigation = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // TODO: Replace with actual API call
    // const response = await fetch('/api/navigation')
    // const data = await response.json()
    // navigation.value = data

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (err) {
    error.value = "Gagal memuat navigasi";
    console.error("Error fetching navigation:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchAllAppData = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    // Fetch all data in parallel
    await Promise.all([fetchContactInfo(), fetchFooterInfo(), fetchRelatedLinks(), fetchNavigation()]);
  } catch (err) {
    error.value = "Gagal memuat data aplikasi";
    console.error("Error fetching app data:", err);
  } finally {
    isLoading.value = false;
  }
};

// Return composable
export function useAppData() {
  return {
    // State
    contactInfo,
    footerInfo,
    profileLinks,
    relatedLinks,
    navigation,
    selayangPandangNavigation,
    pemerintahanNavigation,
    unitKerjaNavigation,
    isLoading,
    error,

    // Methods
    fetchContactInfo,
    fetchFooterInfo,
    fetchRelatedLinks,
    fetchNavigation,
    fetchAllAppData,
  };
}
