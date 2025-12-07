import RekapPage from "./IndexPage.vue";

export default [
  {
    path: "rekap",
    name: "app.rekap",
    component: RekapPage,
    meta: {
      requiresAuth: true,
      title: "Rekap Presensi",
    },
  },
];
