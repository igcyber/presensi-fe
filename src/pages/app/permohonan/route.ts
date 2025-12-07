import PermohonanPage from "./IndexPage.vue";

export default [
  {
    path: "permohonan",
    name: "app.permohonan",
    component: PermohonanPage,
    meta: {
      requiresAuth: true,
      title: "Permohonan Tidak Hadir",
    },
  },
];
