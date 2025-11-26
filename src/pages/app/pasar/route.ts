import PasarDetailPage from "./DetailPage.vue";
import PasarPage from "./IndexPage.vue";

export default [
  {
    path: "kios",
    name: "app.pasar",
    component: PasarPage,
    meta: {
      requiresAuth: true,
      title: "Pasar",
    },
  },
  {
    path: "kios/:id",
    name: "app.pasar.detail",
    component: PasarDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Pasar",
    },
  },
];
