import AuthLayout from "@/layouts/AuthLayout.vue";
import aplikasiTerkaitRoute from "@/pages/app/aplikasi-terkait/route";
import beritaRoute from "@/pages/app/berita/route";
import bukuTamuRoute from "@/pages/app/buku-tamu/route";
import bupatiRoute from "@/pages/app/bupati/route";
import dashboardDataRoute from "@/pages/app/dashboard-data/route";
import dashboardRoute from "@/pages/app/dashboard/route";
import dokumenKategoriRoute from "@/pages/app/dokumen-kategori/route";
import dokumenRoute from "@/pages/app/dokumen/route";
import fotoRoute from "@/pages/app/foto/route";
import infografisRoute from "@/pages/app/infografis/route";
import jabatanAnggotaRoute from "@/pages/app/jabatan-anggota/route";
import kontenRoute from "@/pages/app/konten/route";
import layananRoute from "@/pages/app/layanan/route";
import majalahRoute from "@/pages/app/majalah/route";
import menuRoute from "@/pages/app/menu/route";
import opdRoute from "@/pages/app/opd/route";
import pagesRoute from "@/pages/app/pages/route";
import pasarRoute from "@/pages/app/pasar/route";
import pedagangRoute from "@/pages/app/pedagang/route";
import pengaduanRoute from "@/pages/app/pengaduan/route";
import perusdaRoute from "@/pages/app/perusda/route";
import portalRoute from "@/pages/app/portal/route";
import ppidRoute from "@/pages/app/ppid/route";
import prestasiRoute from "@/pages/app/prestasi/route";
import profileRoute from "@/pages/app/profile/route";
import radioRoute from "@/pages/app/radio/route";
import rapatRoute from "@/pages/app/rapat/route";
import standarPelayananRoute from "@/pages/app/standar-pelayanan/route";
import statikRoute from "@/pages/app/statik/route";
import strukturRoute from "@/pages/app/struktur/route";
import surveiKepuasanRoute from "@/pages/app/survei-kepuasan/route";
import tagsRoute from "@/pages/app/tags/route";
import roleRoute from "@/pages/app/role/route";
import userRoute from "@/pages/app/user/route";
import videoRoute from "@/pages/app/video/route";

export default {
  path: "/app",
  component: AuthLayout,
  children: [
    {
      path: "",
      redirect: { name: "not-found" },
    },
    ...dashboardRoute,
    ...dashboardDataRoute,
    ...profileRoute,
    ...userRoute,
    ...roleRoute,
    ...pedagangRoute,
    ...pasarRoute,
    ...beritaRoute,
    ...videoRoute,
    ...majalahRoute,
    ...dokumenRoute,
    ...dokumenKategoriRoute,
    ...prestasiRoute,
    ...perusdaRoute,
    ...layananRoute,
    ...bupatiRoute,
    ...opdRoute,
    ...kontenRoute,
    ...statikRoute,
    ...infografisRoute,
    ...radioRoute,
    ...portalRoute,
    ...aplikasiTerkaitRoute,
    ...pengaduanRoute,
    ...surveiKepuasanRoute,
    ...ppidRoute,
    ...fotoRoute,
    ...rapatRoute,
    ...bukuTamuRoute,
    ...strukturRoute,
    ...menuRoute,
    ...jabatanAnggotaRoute,
    ...pagesRoute,
    ...tagsRoute,
    ...standarPelayananRoute,
  ],
};
