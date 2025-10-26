import AppLayout from "@/layouts/AppLayout.vue";
import BupatiPage from "@/pages/pemerintahan/bupati-kukar/IndexPage.vue";
import ProgramStrategisPage from "@/pages/pemerintahan/program-strategis/IndexPage.vue";
import StrategiPage from "@/pages/pemerintahan/strategi/IndexPage.vue";
import StrukturOrganisasiPage from "@/pages/pemerintahan/struktur-organisasi/IndexPage.vue";
import TransparansiKeuanganDetailPage from "@/pages/pemerintahan/transparansi-keuangan/DetailPage.vue";
import TransparansiKeuanganPage from "@/pages/pemerintahan/transparansi-keuangan/IndexPage.vue";
import TugasDanFungsiPage from "@/pages/pemerintahan/tugas-fungsi/IndexPage.vue";
import VisiMisiPage from "@/pages/pemerintahan/visi-misi/IndexPage.vue";

export default {
  path: "/pemerintahan",
  component: AppLayout,
  children: [
    {
      // Route kosong untuk menangani akses langsung ke /pemerintahan
      path: "",
      redirect: { name: "not-found" },
    },
    {
      path: "tugas-dan-fungsi",
      name: "pemerintahan.tugas-dan-fungsi",
      component: TugasDanFungsiPage,
      meta: {
        title: "Tugas dan Fungsi",
      },
    },
    {
      path: "struktur-organisasi",
      name: "pemerintahan.struktur-organisasi",
      component: StrukturOrganisasiPage,
      meta: {
        title: "Struktur Organisasi",
      },
    },
    {
      path: "visi-misi",
      name: "pemerintahan.visi-misi",
      component: VisiMisiPage,
      meta: {
        title: "Visi dan Misi",
      },
    },
    {
      path: "strategi",
      name: "pemerintahan.strategi",
      component: StrategiPage,
      meta: {
        title: "Strategi Daerah",
      },
    },
    {
      path: "program-strategis",
      name: "pemerintahan.program-strategis",
      component: ProgramStrategisPage,
      meta: {
        title: "Program Daerah",
      },
    },
    {
      path: "bupati",
      name: "pemerintahan.bupati",
      component: BupatiPage,
      meta: {
        title: "Bupati Daerah",
      },
    },
    {
      path: "transparansi-keuangan",
      name: "pemerintahan.transparansi-keuangan",
      component: TransparansiKeuanganPage,
      meta: {
        title: "Transparansi Keuangan",
      },
    },
    {
      path: "transparansi-keuangan/:id",
      name: "pemerintahan.transparansi-keuangan-detail",
      component: TransparansiKeuanganDetailPage,
      meta: {
        title: "Transparansi Keuangan Detail",
      },
    },
  ],
};
