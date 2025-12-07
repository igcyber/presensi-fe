import PegawaiDetailPage from "./DetailPage.vue";
import PegawaiPage from "./IndexPage.vue";

export default [
  {
    path: "pegawai",
    name: "app.pegawai",
    component: PegawaiPage,
    meta: {
      requiresAuth: true,
      title: "Pegawai",
    },
  },
  {
    path: "pegawai/:id",
    name: "app.pegawai.detail",
    component: PegawaiDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Pegawai",
    },
  },
];
