import AppLayout from "@/layouts/AppLayout.vue";
import OpdDetailPage from "@/pages/unit-kerja/opd/DetailPage.vue";
import OpdPage from "@/pages/unit-kerja/opd/IndexPage.vue";
import PerusahaanDaerahPage from "@/pages/unit-kerja/perusahaan-daerah/IndexPage.vue";

export default {
  path: "/unit-kerja",
  component: AppLayout,
  children: [
    {
      // Route kosong untuk menangani akses langsung ke /selayang-pandang
      path: "",
      redirect: { name: "not-found" },
    },
    {
      path: "opd",
      name: "unit-kerja.opd",
      component: OpdPage,
      meta: {
        title: "OPD",
      },
    },
    {
      path: "opd/:id/:slug?",
      name: "unit-kerja.opd.detail",
      component: OpdDetailPage,
      meta: {
        title: "Detail OPD",
      },
    },
    {
      path: "perusahaan-daerah",
      name: "unit-kerja.perusahaan-daerah",
      component: PerusahaanDaerahPage,
      meta: {
        title: "Perusahaan Daerah",
      },
    },
  ],
};
