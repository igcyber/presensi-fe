import AppLayout from "@/layouts/AppLayout.vue";
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
    ],
  },
];
