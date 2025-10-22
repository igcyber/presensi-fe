import AppLayout from "@/layouts/AppLayout.vue";
import PengaduanPage from "@/pages/pengaduan/IndexPage.vue";

export default [
  {
    path: "/pengaduan",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "pengaduan",
        component: PengaduanPage,
        meta: {
          title: "Pengaduan Masyarakat",
        },
      },
    ],
  },
];
