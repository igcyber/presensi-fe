import AppLayout from "@/components/layout/AppLayout.vue";

import BupatiPage from "@/pages/pemerintahan/bupati/IndexPage.vue";
import ProgramStrategisPage from "@/pages/pemerintahan/program-strategis/IndexPage.vue";
import StrategiPage from "@/pages/pemerintahan/strategi/IndexPage.vue";
import StrukturOrganisasiPage from "@/pages/pemerintahan/struktur-organisasi/IndexPage.vue";
import TugasDanFungsiPage from "@/pages/pemerintahan/tugas-fungsi/IndexPage.vue";
import VisiMisiPage from "@/pages/pemerintahan/visi-misi/IndexPage.vue";

export default {
  path: "/pemerintahan",
  component: AppLayout,
  children: [
    {
      path: "tugas-dan-fungsi",
      name: "pemerintahan.tugas-dan-fungsi",
      component: TugasDanFungsiPage,
      meta: {
        title: "Tugas dan Fungsi",
        breadcrumb: "Tugas dan Fungsi",
      },
    },
    {
      path: "struktur-organisasi",
      name: "pemerintahan.struktur-organisasi",
      component: StrukturOrganisasiPage,
      meta: {
        title: "Struktur Organisasi",
        breadcrumb: "Struktur Organisasi",
      },
    },
    {
      path: "visi-misi",
      name: "pemerintahan.visi-misi",
      component: VisiMisiPage,
      meta: {
        title: "Visi dan Misi",
        breadcrumb: "Visi & Misi",
      },
    },
    {
      path: "strategi",
      name: "pemerintahan.strategi",
      component: StrategiPage,
      meta: {
        title: "Strategi",
        breadcrumb: "Strategi Daerah",
      },
    },
    {
      path: "program-strategis",
      name: "pemerintahan.program-strategis",
      component: ProgramStrategisPage,
      meta: {
        title: "Program Strategis",
        breadcrumb: "Program Daerah",
      },
    },
    {
      path: "bupati",
      name: "pemerintahan.bupati",
      component: BupatiPage,
      meta: {
        title: "Bupati",
        breadcrumb: "Bupati Daerah",
      },
    },
  ],
};
