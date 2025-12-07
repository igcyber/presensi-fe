import TipePegawaiDetailPage from "./DetailPage.vue";
import TipePegawaiPage from "./IndexPage.vue";

export default [
  {
    path: "tipe-pegawai",
    name: "app.tipe-pegawai",
    component: TipePegawaiPage,
    meta: {
      requiresAuth: true,
      title: "Tipe Pegawai",
    },
  },
  {
    path: "tipe-pegawai/:id",
    name: "app.tipe-pegawai.detail",
    component: TipePegawaiDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Tipe Pegawai",
    },
  },
];
