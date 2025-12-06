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
];
