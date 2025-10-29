import AppLayout from "@/layouts/AppLayout.vue";
import PengaduanDetailPage from "@/pages/pengaduan-masyarakat/pengaduan-langsung/DetailPage.vue";
import PengaduanLangsungPage from "@/pages/pengaduan-masyarakat/pengaduan-langsung/IndexPage.vue";

export default [
  {
    path: "/pengaduan-masyarakat",
    component: AppLayout,
    children: [
      {
        path: "pengaduan-langsung",
        name: "pengaduan-masyarakat.pengaduan-langsung",
        component: PengaduanLangsungPage,
        meta: {
          title: "Pengaduan Langsung",
        },
      },
      {
        path: "pengaduan-langsung/:id",
        name: "pengaduan-masyarakat.pengaduan-langsung.detail",
        component: PengaduanDetailPage,
        meta: {
          title: "Detail Pengaduan",
        },
      },
    ],
  },
];
