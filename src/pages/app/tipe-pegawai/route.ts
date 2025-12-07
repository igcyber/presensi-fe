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
];
