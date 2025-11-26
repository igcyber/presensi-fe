import KiosDetailPage from "./DetailPage.vue";
import KiosPage from "./IndexPage.vue";

export default [
  {
    path: "kios",
    name: "app.kios",
    component: KiosPage,
    meta: {
      requiresAuth: true,
      title: "Kios",
    },
  },
  {
    path: "kios/:id",
    name: "app.kios.detail",
    component: KiosDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Kios",
    },
  },
];
