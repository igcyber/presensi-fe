import PasarDetailPage from "./DetailPage.vue";
import PasarPage from "./IndexPage.vue";

export default [
  {
    path: "pasar",
    name: "app.pasar",
    component: PasarPage,
    meta: {
      requiresAuth: true,
      title: "Pasar",
    },
  },
  {
    path: "pasar/:id",
    name: "app.pasar.detail",
    component: PasarDetailPage,
    meta: {
      requiresAuth: true,
      title: "Detail Pasar",
    },
  },
];
