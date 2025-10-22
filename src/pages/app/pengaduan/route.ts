import PengaduanDetailPage from "./DetailPage.vue";
import PengaduanPage from "./IndexPage.vue";

export default [
  {
    path: "pengaduan",
    name: "app.pengaduan",
    component: PengaduanPage,
    meta: {
      requiresAuth: true,
      title: "Pengaduan",
    },
  },
  {
    path: "pengaduan/:id",
    name: "app.pengaduan.detail",
    component: PengaduanDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Pengaduan",
    },
  },
];
